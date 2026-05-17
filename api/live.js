// api/live.js  –  Vercel serverless function
// Fetches live IPL data from CricAPI (cricketdata.org) structured JSON API.
// Set the CRICAPI_KEY environment variable in Vercel project settings.

const CRICAPI_BASE = "https://api.cricapi.com/v1";
const TIMEOUT_MS = 10000;

// Map full team names → short codes used by our app
const TEAM_NAME_MAP = {
  "royal challengers bengaluru": "RCB",
  "royal challengers bangalore": "RCB",
  "sunrisers hyderabad": "SRH",
  "gujarat titans": "GT",
  "punjab kings": "PBKS",
  "chennai super kings": "CSK",
  "rajasthan royals": "RR",
  "delhi capitals": "DC",
  "kolkata knight riders": "KKR",
  "mumbai indians": "MI",
  "lucknow super giants": "LSG",
};

function teamCode(name) {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  // Direct lookup
  if (TEAM_NAME_MAP[lower]) return TEAM_NAME_MAP[lower];
  // Partial match
  for (const [key, code] of Object.entries(TEAM_NAME_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return code;
  }
  // Try abbreviation (e.g. "RCB" already)
  const upper = name.trim().toUpperCase();
  if (Object.values(TEAM_NAME_MAP).includes(upper)) return upper;
  return null;
}

async function fetchJSON(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "IPL-Points-Predictor/2.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

// Extract match number from the match name string
// e.g. "Team A vs Team B, 63rd Match" → 63
function extractMatchNumber(name) {
  if (!name) return null;
  const m = name.match(/(\d+)(?:st|nd|rd|th)\s+match/i);
  return m ? Number(m[1]) : null;
}

// Parse CricAPI match entries into our compact status format
function parseMatches(data) {
  const statuses = {};
  if (!Array.isArray(data)) return statuses;

  for (const match of data) {
    // Only care about IPL T20 matches
    if (match.matchType !== "t20") continue;
    const name = match.name || "";
    if (!/ipl|indian premier league/i.test(name) && !/ipl|indian premier league/i.test(match.series_id || "")) {
      // Check if teams are IPL teams
      const teams = match.teams || [];
      const hasIplTeam = teams.some((t) => teamCode(t));
      if (!hasIplTeam) continue;
    }

    const matchNo = extractMatchNumber(name);
    if (!matchNo) continue;

    const teams = match.teams || [];
    const teamA = teamCode(teams[0]) || teams[0];
    const teamB = teamCode(teams[1]) || teams[1];
    const statusText = match.status || "";

    // Determine match state
    const winnerMatch = statusText.match(/\b([A-Za-z ]+?)\s+won\b/i);
    let winner = null;
    if (winnerMatch) {
      winner = teamCode(winnerMatch[1]) || winnerMatch[1].toUpperCase();
    }
    const noResult = /no result|abandoned|no\s*result/i.test(statusText);
    const complete = Boolean(winner || noResult);
    const isLive = !complete && /live|need|trail|lead|innings|batting|bowling|opt to/i.test(statusText);

    // Build score summary
    let scoreLabel = statusText;
    if (match.score && match.score.length > 0) {
      const scoreParts = match.score.map(
        (s) => `${s.inning ? s.inning.replace(/\s*Inning.*$/i, "") : ""} ${s.r || 0}/${s.w || 0} (${s.o || 0} ov)`
      );
      if (scoreParts.length > 0 && isLive) {
        scoreLabel = scoreParts.join(" | ") + (statusText ? ` – ${statusText}` : "");
      }
    }

    statuses[matchNo] = {
      teamA,
      teamB,
      label: scoreLabel,
      complete,
      winner,
      noResult,
      isLive,
    };
  }

  return statuses;
}

module.exports = async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.setHeader("CDN-Cache-Control", "no-store");
  response.setHeader("Vercel-CDN-Cache-Control", "no-store");
  response.setHeader("Access-Control-Allow-Origin", "*");

  if (request.method === "HEAD") {
    response.status(200).end();
    return;
  }
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET, HEAD");
    response.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const apiKey = process.env.CRICAPI_KEY;
  if (!apiKey) {
    response.status(503).json({
      error: "missing_api_key",
      message: "Set CRICAPI_KEY in Vercel environment variables. Get a free key at https://cricketdata.org",
      fetchedAt: new Date().toISOString(),
    });
    return;
  }

  try {
    const url = `${CRICAPI_BASE}/currentMatches?apikey=${apiKey}&offset=0`;
    const json = await fetchJSON(url);

    if (json.status !== "success" || !json.data) {
      throw new Error(json.reason || json.message || "CricAPI returned non-success");
    }

    const matchStatuses = parseMatches(json.data);

    response.status(200).json({
      matchStatuses,
      source: "cricapi",
      creditsLeft: json.info?.creditsLeft ?? null,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    response.status(502).json({
      error: "live_fetch_failed",
      message: error instanceof Error ? error.message : "Unknown error",
      fetchedAt: new Date().toISOString(),
    });
  }
};
