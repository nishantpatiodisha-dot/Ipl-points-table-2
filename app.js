const STORAGE_KEY = "ipl-2026-points-predictor";
const SHARE_PARAM = "p";
const LIVE_REFRESH_MS = 15 * 1000;
const SEASON_MATCHES_PER_TEAM = 14;
const LIVE_API_URL = "/api/live";
const matchIntel = window.MATCH_INTEL || {};

const initialTeams = [
  { code: "RCB", name: "Royal Challengers Bengaluru", played: 11, wins: 7, losses: 4, noResult: 0, points: 14, nrr: 1.103, startRank: 1, color: "#b0182d" },
  { code: "SRH", name: "Sunrisers Hyderabad", played: 11, wins: 7, losses: 4, noResult: 0, points: 14, nrr: 0.737, startRank: 2, color: "#f06423" },
  { code: "GT", name: "Gujarat Titans", played: 11, wins: 7, losses: 4, noResult: 0, points: 14, nrr: 0.228, startRank: 3, color: "#1c315e" },
  { code: "PBKS", name: "Punjab Kings", played: 11, wins: 6, losses: 4, noResult: 1, points: 13, nrr: 0.428, startRank: 4, color: "#d71920" },
  { code: "CSK", name: "Chennai Super Kings", played: 11, wins: 6, losses: 5, noResult: 0, points: 12, nrr: 0.185, startRank: 5, color: "#f4c430" },
  { code: "RR", name: "Rajasthan Royals", played: 11, wins: 6, losses: 5, noResult: 0, points: 12, nrr: 0.082, startRank: 6, color: "#c02d88" },
  { code: "DC", name: "Delhi Capitals", played: 12, wins: 5, losses: 7, noResult: 0, points: 10, nrr: -0.993, startRank: 7, color: "#256ec1" },
  { code: "KKR", name: "Kolkata Knight Riders", played: 10, wins: 4, losses: 5, noResult: 1, points: 9, nrr: -0.169, startRank: 8, color: "#4b2a83" },
  { code: "MI", name: "Mumbai Indians", played: 11, wins: 3, losses: 8, noResult: 0, points: 6, nrr: -0.585, startRank: 9, color: "#006cb7" },
  { code: "LSG", name: "Lucknow Super Giants", played: 11, wins: 3, losses: 8, noResult: 0, points: 6, nrr: -0.920, startRank: 10, color: "#1ba7a6" },
];

const teamLogos = {
  RCB: "https://cricketvectors.akamaized.net/Teams/K.png",
  SRH: "https://cricketvectors.akamaized.net/Teams/L.png",
  GT: "https://cricketvectors.akamaized.net/Teams/KB.png",
  PBKS: "https://cricketvectors.akamaized.net/Teams/I.png",
  CSK: "https://cricketvectors.akamaized.net/Teams/G.png",
  RR: "https://cricketvectors.akamaized.net/Teams/M.png",
  DC: "https://cricketvectors.akamaized.net/Teams/H.png",
  KKR: "https://cricketvectors.akamaized.net/Teams/J.png",
  MI: "https://cricketvectors.akamaized.net/Teams/F.png",
  LSG: "https://cricketvectors.akamaized.net/Teams/KC.png",
};

const allFixtures = [
  { match: 54, date: "10 May", isoDate: "2026-05-10", time: "7:30 PM", venue: "Raipur", teamA: "MI", teamB: "RCB" },
  { match: 55, date: "11 May", isoDate: "2026-05-11", time: "7:30 PM", venue: "Dharamsala", teamA: "PBKS", teamB: "DC" },
  { match: 56, date: "12 May", isoDate: "2026-05-12", time: "7:30 PM", venue: "Ahmedabad", teamA: "GT", teamB: "SRH" },
  { match: 57, date: "13 May", isoDate: "2026-05-13", time: "7:30 PM", venue: "Raipur", teamA: "RCB", teamB: "KKR" },
  { match: 58, date: "14 May", isoDate: "2026-05-14", time: "7:30 PM", venue: "Dharamsala", teamA: "PBKS", teamB: "MI" },
  { match: 59, date: "15 May", isoDate: "2026-05-15", time: "7:30 PM", venue: "Lucknow", teamA: "LSG", teamB: "CSK" },
  { match: 60, date: "16 May", isoDate: "2026-05-16", time: "7:30 PM", venue: "Kolkata", teamA: "KKR", teamB: "GT" },
  { match: 61, date: "17 May", isoDate: "2026-05-17", time: "3:30 PM", venue: "Dharamsala", teamA: "PBKS", teamB: "RCB" },
  { match: 62, date: "17 May", isoDate: "2026-05-17", time: "7:30 PM", venue: "Delhi", teamA: "DC", teamB: "RR" },
  { match: 63, date: "18 May", isoDate: "2026-05-18", time: "7:30 PM", venue: "Chennai", teamA: "CSK", teamB: "SRH" },
  { match: 64, date: "19 May", isoDate: "2026-05-19", time: "7:30 PM", venue: "Jaipur", teamA: "RR", teamB: "LSG" },
  { match: 65, date: "20 May", isoDate: "2026-05-20", time: "7:30 PM", venue: "Kolkata", teamA: "KKR", teamB: "MI" },
  { match: 66, date: "21 May", isoDate: "2026-05-21", time: "7:30 PM", venue: "Ahmedabad", teamA: "CSK", teamB: "GT" },
  { match: 67, date: "22 May", isoDate: "2026-05-22", time: "7:30 PM", venue: "Hyderabad", teamA: "SRH", teamB: "RCB" },
  { match: 68, date: "23 May", isoDate: "2026-05-23", time: "7:30 PM", venue: "Lucknow", teamA: "LSG", teamB: "PBKS" },
  { match: 69, date: "24 May", isoDate: "2026-05-24", time: "3:30 PM", venue: "Mumbai", teamA: "MI", teamB: "RR" },
  { match: 70, date: "24 May", isoDate: "2026-05-24", time: "7:30 PM", venue: "Kolkata", teamA: "KKR", teamB: "DC" },
];

const teamCodeByName = Object.fromEntries(initialTeams.map((team) => [team.name.toLowerCase(), team.code]));
const canonicalTeamByCode = Object.fromEntries(initialTeams.map((team) => [team.code, team]));

let teams = cloneTeams(initialTeams);
let liveStatuses = {};
let lastLiveTableSignature = "";
let lastLiveStatusSignature = "";
let fixtures = buildActiveFixtures();
let picks = loadPicks();
prunePicksToActiveFixtures(false);

const standingsBody = document.querySelector("#standingsBody");
const mobileStandings = document.querySelector("#mobileStandings");
const fixtureList = document.querySelector("#fixtureList");
const remainingCount = document.querySelector("#remainingCount");
const pickedCount = document.querySelector("#pickedCount");
const topSeed = document.querySelector("#topSeed");
const liveMode = document.querySelector("#liveMode");
const liveStatus = document.querySelector("#liveStatus");
const legend = document.querySelector("#legend");
const resetPicks = document.querySelector("#resetPicks");
const refreshLive = document.querySelector("#refreshLive");
const copyScenario = document.querySelector("#copyScenario");
const copyShareLink = document.querySelector("#copyShareLink");
const matchModal = document.querySelector("#matchModal");
const modalContent = document.querySelector("#modalContent");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modalClose = document.querySelector("#modalClose");

renderLegend();
renderFixtures();
update();
syncUrlWithPicks();
refreshLiveData();
window.setInterval(() => refreshLiveData({ quiet: true }), LIVE_REFRESH_MS);

resetPicks.addEventListener("click", () => {
  picks = {};
  persistPicks();
  renderFixtures();
  update();
});

refreshLive.addEventListener("click", () => refreshLiveData());
modalBackdrop.addEventListener("click", closeMatchModal);
modalClose.addEventListener("click", closeMatchModal);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !matchModal.hidden) {
    closeMatchModal();
  }
});

copyShareLink.addEventListener("click", async () => {
  const shareUrl = buildShareUrl();

  try {
    await copyText(shareUrl);
    pulseButton(copyShareLink, "Link copied");
  } catch {
    pulseButton(copyShareLink, "Copy failed");
  }
});

copyScenario.addEventListener("click", async () => {
  const selected = fixtures
    .filter((fixture) => picks[fixture.match])
    .map((fixture) => {
      const pick = picks[fixture.match] === "NR" ? "No result" : `${picks[fixture.match]} win`;
      return `M${fixture.match}: ${fixture.teamA} vs ${fixture.teamB} - ${pick}`;
    });

  const chances = calculatePlayoffChances();
  const table = projectTable()
    .map((team, index) => {
      const chance = chances[team.code]?.label ?? "0%";
      return `${index + 1}. ${team.code} ${team.points} pts, ${chance} playoff chance (${team.wins}W, NRR ${formatNrr(team.nrr)})`;
    })
    .join("\n");

  const text = `IPL 2026 scenario\n${buildShareUrl()}\n\nPicks:\n${selected.length ? selected.join("\n") : "No picks yet"}\n\nProjected table:\n${table}`;

  try {
    await copyText(text);
    pulseButton(copyScenario, "Copied");
  } catch {
    pulseButton(copyScenario, "Copy failed");
  }
});

function renderLegend() {
  legend.innerHTML = "";
  initialTeams.forEach((team) => {
    legend.appendChild(createTeamPill(team.code));
  });
}

function renderFixtures() {
  fixtureList.innerHTML = "";

  if (fixtures.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "All league matches are already reflected in the table.";
    fixtureList.appendChild(empty);
    return;
  }

  fixtures.forEach((fixture) => {
    const teamA = teamByCode()[fixture.teamA];
    const teamB = teamByCode()[fixture.teamB];
    const card = document.createElement("article");
    card.className = `fixture-card${picks[fixture.match] ? " selected" : ""}`;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open ${fixture.teamA} versus ${fixture.teamB} preview`);
    card.style.setProperty("--team-a-color", teamA.color);
    card.style.setProperty("--team-b-color", teamB.color);

    const status = liveStatuses[fixture.match];
    const statusText = status?.label && !status.complete ? status.label : `${fixture.venue} | ${fixture.time} IST`;

    const top = document.createElement("div");
    top.className = "fixture-top";
    top.innerHTML = `
      <div>
        <div class="match-no">Match ${fixture.match}</div>
        <div class="venue">${statusText}</div>
      </div>
      <span class="date-chip">${status?.isLive ? "Live" : fixture.date}</span>
    `;

    const teamsRow = document.createElement("div");
    teamsRow.className = "teams-row";
    teamsRow.appendChild(createTeamPill(fixture.teamA));

    const vs = document.createElement("span");
    vs.className = "vs";
    vs.textContent = "VS";
    teamsRow.appendChild(vs);
    teamsRow.appendChild(createTeamPill(fixture.teamB));

    const resultButtons = document.createElement("div");
    resultButtons.className = "result-buttons";
    resultButtons.appendChild(createPickButton(fixture, fixture.teamA, `${fixture.teamA} win`));
    resultButtons.appendChild(createPickButton(fixture, fixture.teamB, `${fixture.teamB} win`));
    resultButtons.appendChild(createPickButton(fixture, "NR", "No result"));

    card.append(top, teamsRow, resultButtons);
    card.addEventListener("click", (event) => {
      if (event.target.closest(".pick-button")) {
        return;
      }
      openMatchModal(fixture);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      openMatchModal(fixture);
    });
    fixtureList.appendChild(card);
  });
}

function createPickButton(fixture, result, label) {
  const button = document.createElement("button");
  const isActive = picks[fixture.match] === result;
  button.type = "button";
  button.className = `pick-button${result === "NR" ? " no-result" : ""}${isActive ? " active" : ""}`;
  button.textContent = label;
  button.setAttribute("aria-pressed", String(isActive));

  button.addEventListener("click", () => {
    if (picks[fixture.match] === result) {
      delete picks[fixture.match];
    } else {
      picks[fixture.match] = result;
    }

    persistPicks();
    renderFixtures();
    update();
  });

  return button;
}

function openMatchModal(fixture) {
  const teamA = teamByCode()[fixture.teamA];
  const teamB = teamByCode()[fixture.teamB];
  const intel = matchIntel[String(fixture.match)] || {};
  const lean = calculateMatchLean(fixture, intel);
  const status = liveStatuses[fixture.match];

  matchModal.style.setProperty("--team-a-color", teamA.color);
  matchModal.style.setProperty("--team-b-color", teamB.color);
  modalContent.innerHTML = matchModalMarkup(fixture, teamA, teamB, intel, lean, status);
  matchModal.hidden = false;
  document.body.classList.add("modal-open");
  
  window.requestAnimationFrame(() => {
    matchModal.classList.add("is-open");
    const barTeamA = document.getElementById('barTeamA');
    const barTeamB = document.getElementById('barTeamB');
    if (barTeamA && barTeamB) {
      setTimeout(() => {
        barTeamA.style.width = lean.teamA + '%';
        barTeamB.style.width = lean.teamB + '%';
      }, 300);
    }
  });
  modalClose.focus();
}

function closeMatchModal() {
  const barTeamA = document.getElementById('barTeamA');
  const barTeamB = document.getElementById('barTeamB');
  if (barTeamA && barTeamB) {
    barTeamA.style.width = '0%';
    barTeamB.style.width = '0%';
  }

  matchModal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  window.setTimeout(() => {
    matchModal.hidden = true;
    modalContent.innerHTML = "";
  }, 400);
}

function matchModalMarkup(fixture, teamA, teamB, intel, lean, status) {
  const previousAtVenue = intel.previousAtVenue || [];
  const recentMeetings = intel.recentMeetings || [];
  const cityH2h = intel.cityH2h || emptyIntelRecord(teamA.code, teamB.code);
  const h2h = intel.h2h || emptyIntelRecord(teamA.code, teamB.code);
  const venueA = intel.venueRecords?.[teamA.code] || emptyVenueRecord();
  const venueB = intel.venueRecords?.[teamB.code] || emptyVenueRecord();
  const note = previousAtVenue.length
    ? `${previousAtVenue.length} recorded IPL meeting${previousAtVenue.length === 1 ? "" : "s"} between these teams in ${fixture.venue}.`
    : `No recorded IPL meeting between these teams in ${fixture.venue} in the historical dataset.`;
  const statusText = status?.label && !status.complete ? status.label : `${fixture.date}, ${fixture.time} IST`;

  return `
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>
    
    <div class="match-header">
        <h2>${teamA.code} <span class="vs-text">vs</span> ${teamB.code}</h2>
        <div class="venue-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${fixture.venue} | ${statusText}
        </div>
    </div>

    <div class="stats-grid">
        <!-- Head to Head Section -->
        <div class="stat-card">
            <div class="stat-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20v-8m0 0V4m0 8h8m-8 0H4"/></svg>
                Previous Battles
            </div>
            <div class="h2h-container">
                <span>${teamA.code} (${h2h.wins?.[teamA.code] ?? 0})</span>
                <span style="color:var(--muted);font-size:0.85rem;">${h2h.total ?? 0} Matches</span>
                <span>${teamB.code} (${h2h.wins?.[teamB.code] ?? 0})</span>
            </div>
            <div class="h2h-bar-wrapper">
                <div class="h2h-bar-1" style="width: ${h2h.total ? (h2h.wins?.[teamA.code] || 0) / h2h.total * 100 : 50}%"></div>
                <div class="h2h-bar-2" style="width: ${h2h.total ? (h2h.wins?.[teamB.code] || 0) / h2h.total * 100 : 50}%"></div>
            </div>
            <p class="fine-print" style="margin-top: 15px;">${formatNoResult(h2h.noResult)} ${h2h.total ? "across recorded IPL meetings." : "in recorded IPL meetings."}</p>
        </div>

        <!-- Win Probability Section -->
        <div class="stat-card">
            <div class="stat-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Likely Chances of Winning
            </div>
            <div class="prob-container">
                <div class="prob-team">
                    <span class="prob-name">${teamA.code}</span>
                    <div class="prob-track">
                        <div class="prob-fill" id="barTeamA" style="--team-bg: linear-gradient(90deg, color-mix(in srgb, ${teamA.color} 50%, black), ${teamA.color});"></div>
                    </div>
                    <span class="prob-value">${lean.teamA}%</span>
                </div>
                <div class="prob-team">
                    <span class="prob-name">${teamB.code}</span>
                    <div class="prob-track">
                        <div class="prob-fill" id="barTeamB" style="--team-bg: linear-gradient(90deg, color-mix(in srgb, ${teamB.color} 50%, black), ${teamB.color});"></div>
                    </div>
                    <span class="prob-value">${lean.teamB}%</span>
                </div>
            </div>
            <p class="fine-print" style="margin-top: 15px;">${lean.summary}</p>
        </div>
        
        <div class="stat-card">
            <div class="stat-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Previous battles in ${fixture.venue}
            </div>
            <p class="fine-print">${note}</p>
            ${meetingList(previousAtVenue, teamA, teamB)}
        </div>

        <div class="stat-card">
            <div class="stat-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                City record
            </div>
            <div class="venue-rows">
                ${venueRecordMarkup(teamA, venueA)}
                ${venueRecordMarkup(teamB, venueB)}
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                At this city
            </div>
            <div class="mini-score">
                <span>${teamA.code}<strong>${cityH2h.wins?.[teamA.code] ?? 0}</strong></span>
                <span>Meetings<strong>${cityH2h.total ?? 0}</strong></span>
                <span>${teamB.code}<strong>${cityH2h.wins?.[teamB.code] ?? 0}</strong></span>
            </div>
        </div>

        <div class="stat-card" style="grid-column: 1 / -1;">
            <div class="stat-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Recent rivalry
            </div>
            ${meetingList(recentMeetings, teamA, teamB)}
        </div>
    </div>
  `;
}

function calculateMatchLean(fixture, intel) {
  const table = teamByCode();
  const teamA = table[fixture.teamA];
  const teamB = table[fixture.teamB];
  const h2h = intel.h2h || emptyIntelRecord(teamA.code, teamB.code);
  const cityH2h = intel.cityH2h || emptyIntelRecord(teamA.code, teamB.code);
  const venueA = intel.venueRecords?.[teamA.code] || emptyVenueRecord();
  const venueB = intel.venueRecords?.[teamB.code] || emptyVenueRecord();

  const formDiff = teamStrength(teamA) - teamStrength(teamB);
  const h2hLean = recordLean(h2h, teamA.code, teamB.code);
  const cityLean = recordLean(cityH2h, teamA.code, teamB.code);
  const venueLean = winRate(venueA) - winRate(venueB);
  const raw = 0.5 + formDiff * 0.62 + (h2hLean - 0.5) * 0.18 + (cityLean - 0.5) * 0.12 + venueLean * 0.12;
  const teamAChance = Math.round(clamp(raw, 0.18, 0.82) * 100);
  const leader = teamAChance >= 50 ? teamA.code : teamB.code;
  const gap = Math.abs(teamAChance - (100 - teamAChance));
  const confidence = gap >= 24 ? "clear lean" : gap >= 12 ? "slight lean" : "near toss-up";

  return {
    teamA: teamAChance,
    teamB: 100 - teamAChance,
    summary: `${leader} is a ${confidence}, based on season form, NRR, overall H2H and ${fixture.venue} records.`,
  };
}

function teamStrength(team) {
  const winRateValue = team.played ? (team.wins + team.noResult * 0.5) / team.played : 0.5;
  const pointsRate = team.played ? team.points / (team.played * 2) : 0.5;
  const nrrScore = clamp(0.5 + team.nrr / 4, 0.18, 0.82);
  return winRateValue * 0.5 + pointsRate * 0.28 + nrrScore * 0.22;
}

function recordLean(record, teamA, teamB) {
  if (!record.total) {
    return 0.5;
  }

  const effectiveTotal = record.total - (record.noResult || 0);
  if (!effectiveTotal) {
    return 0.5;
  }

  return (record.wins?.[teamA] || 0) / effectiveTotal;
}

function winRate(record) {
  const effectiveTotal = record.matches - (record.noResult || 0);
  if (!effectiveTotal) {
    return 0.5;
  }

  return record.wins / effectiveTotal;
}

function meetingList(meetings, teamA, teamB) {
  if (!meetings?.length) {
    return `<p class="empty-mini">No prior entry found for this exact slice.</p>`;
  }

  return `
    <div class="meeting-list">
      ${meetings
        .map(
          (meeting) => `
            <article>
              <span>${formatDate(meeting.date)} | ${meeting.city}</span>
              <strong>${meeting.result}</strong>
              <small>${meeting.teams.join(" vs ")}${meeting.venue ? ` at ${meeting.venue}` : ""}</small>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function venueRecordMarkup(team, record) {
  return `
    <div class="venue-row">
      ${logoMarkup(team, "venue-logo")}
      <span>${team.code}</span>
      <strong>${record.wins}-${record.losses}</strong>
      <small>${record.matches} matches</small>
    </div>
  `;
}

function modalTeamMark(team) {
  return `
    <div class="modal-team" style="--team-color: ${team.color}">
      ${logoMarkup(team, "modal-logo")}
      <strong>${team.code}</strong>
    </div>
  `;
}

function createTeamPill(code) {
  const team = teamByCode()[code];
  const template = document.querySelector("#teamBadgeTemplate");
  const pill = template.content.firstElementChild.cloneNode(true);
  pill.style.setProperty("--team-color", team.color);
  const logo = pill.querySelector(".team-logo");
  logo.src = teamLogos[code];
  logo.alt = `${team.name} logo`;
  pill.querySelector(".team-abbr").textContent = code;
  pill.title = team.name;
  return pill;
}

function update() {
  const table = projectTable();
  const chances = calculatePlayoffChances();
  const picked = Object.keys(picks).length;

  remainingCount.textContent = String(fixtures.length - picked);
  pickedCount.textContent = String(picked);
  topSeed.textContent = table[0]?.code ?? "-";

  standingsBody.innerHTML = "";
  mobileStandings.innerHTML = "";
  table.forEach((team, index) => {
    const chance = chances[team.code] ?? { label: "0%", pct: 0 };
    const row = document.createElement("tr");
    if (index < 4) {
      row.classList.add("qualifier");
    }

    const movement = team.startRank - (index + 1);
    const movementClass = movement > 0 ? "up" : movement < 0 ? "down" : "same";
    const movementText = movement > 0 ? `+${movement}` : movement < 0 ? String(movement) : "-";

    row.innerHTML = `
      <td><span class="rank">${index + 1}</span><span class="movement ${movementClass}">${movementText}</span></td>
      <td>
        <div class="team-cell" style="--team-color: ${team.color}">
          ${logoMarkup(team, "team-mark")}
          <span class="team-name-full">${team.name}<span class="team-sub">${team.code}</span></span>
          <span class="compact-code">${team.code}</span>
        </div>
      </td>
      <td>${team.played}</td>
      <td>${team.wins}</td>
      <td>${team.losses}</td>
      <td>${team.noResult}</td>
      <td class="points">${team.points}</td>
      <td>${formatNrr(team.nrr)}</td>
      <td class="chance-cell">${chanceMarkup(chance)}</td>
    `;

    standingsBody.appendChild(row);
    mobileStandings.appendChild(createMobileTeamCard(team, index, movement, movementClass, movementText, chance));
  });
}

function createMobileTeamCard(team, index, movement, movementClass, movementText, chance) {
  const card = document.createElement("article");
  card.className = "mobile-team-card";
  if (index < 4) {
    card.classList.add("qualifier");
  }

  card.innerHTML = `
    <div class="mobile-team-top">
      <span class="rank">${index + 1}</span>
      <div class="team-cell" style="--team-color: ${team.color}">
        ${logoMarkup(team, "team-mark")}
        <span>${team.name}<span class="team-sub">${team.code} <span class="movement ${movementClass}">${movementText}</span></span></span>
      </div>
      <div class="mobile-points">
        <strong>${team.points}</strong>
        <span>Pts</span>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat-chip"><span>P</span><strong>${team.played}</strong></div>
      <div class="stat-chip"><span>W</span><strong>${team.wins}</strong></div>
      <div class="stat-chip"><span>L</span><strong>${team.losses}</strong></div>
      <div class="stat-chip"><span>NR</span><strong>${team.noResult}</strong></div>
      <div class="stat-chip"><span>NRR</span><strong>${formatNrr(team.nrr)}</strong></div>
      <div class="stat-chip"><span>Chance</span><strong>${chance.label}</strong></div>
      <div class="stat-chip"><span>Max</span><strong>${team.maxPoints}</strong></div>
    </div>
  `;

  return card;
}

function projectTable(scenarioPicks = picks, scenarioFixtures = fixtures) {
  const table = Object.fromEntries(
    teams.map((team) => [team.code, { ...team, maxPoints: team.points }]),
  );

  scenarioFixtures.forEach((fixture) => {
    const result = scenarioPicks[fixture.match];
    if (!result) {
      return;
    }

    const teamA = table[fixture.teamA];
    const teamB = table[fixture.teamB];
    teamA.played += 1;
    teamB.played += 1;

    if (result === "NR") {
      teamA.noResult += 1;
      teamB.noResult += 1;
      teamA.points += 1;
      teamB.points += 1;
      return;
    }

    const winner = table[result];
    const loser = result === fixture.teamA ? teamB : teamA;
    winner.wins += 1;
    winner.points += 2;
    loser.losses += 1;
  });

  Object.values(table).forEach((team) => {
    const openMatches = scenarioFixtures.filter(
      (fixture) => !scenarioPicks[fixture.match] && (fixture.teamA === team.code || fixture.teamB === team.code),
    ).length;
    team.maxPoints = team.points + openMatches * 2;
  });

  return sortTable(Object.values(table));
}

function calculatePlayoffChances() {
  const counts = Object.fromEntries(teams.map((team) => [team.code, 0]));
  const undecided = fixtures.filter((fixture) => !picks[fixture.match]);
  const total = 2 ** undecided.length || 1;

  for (let mask = 0; mask < total; mask += 1) {
    const scenarioPicks = { ...picks };

    undecided.forEach((fixture, bit) => {
      scenarioPicks[fixture.match] = mask & (1 << bit) ? fixture.teamB : fixture.teamA;
    });

    projectTable(scenarioPicks, fixtures)
      .slice(0, 4)
      .forEach((team) => {
        counts[team.code] += 1;
      });
  }

  return Object.fromEntries(
    teams.map((team) => {
      const pct = (counts[team.code] / total) * 100;
      return [team.code, { pct, label: formatChance(pct), count: counts[team.code], total }];
    }),
  );
}

function sortTable(table) {
  return table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.nrr !== a.nrr) return b.nrr - a.nrr;
    return a.name.localeCompare(b.name);
  });
}

async function refreshLiveData(options = {}) {
  if (!options.quiet) {
    setLiveStatus("Checking live data...", "API");
  }

  let payload;
  try {
    payload = await getLivePayload();
  } catch (err) {
    console.warn("Live update failed:", err);
    setLiveStatus("Live update failed; using built-in data", "Offline");
    return;
  }

  // payload.matchStatuses is the pre-parsed JSON from CricAPI
  const parsedStatuses = payload.matchStatuses || {};
  if (!Object.keys(parsedStatuses).length) {
    setLiveStatus(`No live matches at ${formatClock(new Date())}`, "API");
    return;
  }

  const signature = liveStatusSignature(parsedStatuses);
  if (signature === lastLiveStatusSignature) {
    setLiveStatus(`Checked at ${formatClock(new Date())}; no new score changes`, "API");
    return;
  }

  // Something changed
  liveStatuses = parsedStatuses;
  lastLiveStatusSignature = signature;
  applyFreshCompletedStatuses(liveStatuses);

  fixtures = buildActiveFixtures(liveStatuses);
  prunePicksToActiveFixtures(false);
  renderFixtures();
  update();

  setLiveStatus(`Live update at ${formatClock(new Date())}`, "API");
}

async function getLivePayload() {
  const cacheBust = `cb=${Date.now()}`;
  const response = await fetch(`${LIVE_API_URL}?${cacheBust}`, { cache: "no-store" });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `API returned ${response.status}`);
  }

  return response.json();
}

function liveStatusSignature(statuses) {
  return JSON.stringify(
    Object.entries(statuses)
      .sort(([matchA], [matchB]) => Number(matchA) - Number(matchB))
      .map(([match, status]) => [
        match,
        status.label,
        status.winner,
        Boolean(status.complete),
        Boolean(status.noResult),
        Boolean(status.isLive),
      ]),
  );
}

function buildActiveFixtures(statuses = liveStatuses) {
  const today = istDateKey(new Date());
  const remainingByTeam = Object.fromEntries(
    teams.map((team) => [team.code, Math.max(0, SEASON_MATCHES_PER_TEAM - team.played)]),
  );

  return allFixtures.filter((fixture) => {
    const status = statuses[fixture.match];

    if (status?.complete) {
      return false;
    }

    if (status && !status.isLive && /won|complete|stumps|abandoned|no result/i.test(status.label)) {
      return false;
    }

    if (fixture.isoDate < today) {
      return false;
    }

    return remainingByTeam[fixture.teamA] > 0 && remainingByTeam[fixture.teamB] > 0;
  });
}

function applyFreshCompletedStatuses(statuses) {
  const table = teamByCode();
  const expectedPlayed = Object.fromEntries(initialTeams.map((team) => [team.code, team.played]));

  allFixtures
    .filter((fixture) => fixture.match > 55)
    .forEach((fixture) => {
      const status = statuses[fixture.match];
      if (!status?.complete) {
        return;
      }

      const teamA = table[fixture.teamA];
      const teamB = table[fixture.teamB];
      const appearsReflected = teamA.played > expectedPlayed[fixture.teamA] && teamB.played > expectedPlayed[fixture.teamB];

      if (!appearsReflected && teamA.played === expectedPlayed[fixture.teamA] && teamB.played === expectedPlayed[fixture.teamB]) {
        teamA.played += 1;
        teamB.played += 1;

        if (status.noResult) {
          teamA.noResult += 1;
          teamB.noResult += 1;
          teamA.points += 1;
          teamB.points += 1;
        } else if (status.winner && table[status.winner]) {
          const winner = table[status.winner];
          const loser = status.winner === fixture.teamA ? teamB : teamA;
          winner.wins += 1;
          winner.points += 2;
          loser.losses += 1;
        }
      }

      expectedPlayed[fixture.teamA] += 1;
      expectedPlayed[fixture.teamB] += 1;
    });

  teams = sortTable(Object.values(table)).map((team, index) => ({ ...team, startRank: index + 1 }));
}

function prunePicksToActiveFixtures(shouldSync = true) {
  const activeMatches = new Set(fixtures.map((fixture) => String(fixture.match)));
  const nextPicks = Object.fromEntries(
    Object.entries(picks).filter(([match]) => activeMatches.has(String(match))),
  );
  picks = nextPicks;

  if (shouldSync) {
    persistPicks();
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(picks));
    syncUrlWithPicks();
  }
}

function loadPicks() {
  const sharedPicks = parseSharedPicks();
  if (Object.keys(sharedPicks).length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedPicks));
    return sharedPicks;
  }

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return Object.fromEntries(
      Object.entries(saved).filter(([match, result]) => {
        const fixture = allFixtures.find((item) => String(item.match) === String(match));
        return fixture && [fixture.teamA, fixture.teamB, "NR"].includes(result);
      }),
    );
  } catch {
    return {};
  }
}

function persistPicks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(picks));
  syncUrlWithPicks();
}

function buildShareUrl() {
  syncUrlWithPicks();
  return window.location.href;
}

function encodePicks() {
  return fixtures
    .filter((fixture) => picks[fixture.match])
    .map((fixture) => `${fixture.match}.${picks[fixture.match]}`)
    .join("_");
}

function parseSharedPicks() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(SHARE_PARAM);
  if (!value) {
    return {};
  }

  return Object.fromEntries(
    value
      .split("_")
      .map((item) => item.trim())
      .map((item) => item.match(/^(\d{2})\.([A-Z0-9]+)$/))
      .filter(Boolean)
      .map(([, match, result]) => [match, result])
      .filter(([match, result]) => {
        const fixture = allFixtures.find((item) => String(item.match) === String(match));
        return fixture && [fixture.teamA, fixture.teamB, "NR"].includes(result);
      }),
  );
}

function syncUrlWithPicks() {
  const encoded = encodePicks();
  const url = new URL(window.location.href);

  if (encoded) {
    url.searchParams.set(SHARE_PARAM, encoded);
  } else {
    url.searchParams.delete(SHARE_PARAM);
  }

  window.history.replaceState({}, "", url.toString());
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-999px";
  document.body.appendChild(textarea);
  textarea.select();

  const ok = document.execCommand("copy");
  textarea.remove();

  if (!ok) {
    throw new Error("Copy failed");
  }
}

function chanceMarkup(chance) {
  return `
    <span class="chance-meter" style="--chance: ${chance.pct}%">
      <span class="chance-value">${chance.label}</span>
      <span class="chance-track"><span class="chance-fill"></span></span>
    </span>
  `;
}

function logoMarkup(team, className) {
  return `
    <span class="logo-frame ${className}" style="--team-color: ${team.color}">
      <img class="team-logo" src="${teamLogos[team.code]}" alt="${team.name} logo" loading="lazy" />
    </span>
  `;
}

function emptyIntelRecord(teamA, teamB) {
  return { total: 0, wins: { [teamA]: 0, [teamB]: 0 }, noResult: 0 };
}

function emptyVenueRecord() {
  return { matches: 0, wins: 0, losses: 0, noResult: 0 };
}

function formatNoResult(value = 0) {
  if (!value) {
    return "No no-results";
  }
  return `${value} no-result${value === 1 ? "" : "s"}`;
}

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatChance(value) {
  if (value >= 99.95) return "100%";
  if (value <= 0.05) return "0%";
  if (value < 1) return "<1%";
  if (value < 10) return `${value.toFixed(1)}%`;
  return `${Math.round(value)}%`;
}

function formatNrr(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(3)}`;
}

function formatClock(date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function istDateKey(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function setLiveStatus(message, mode = liveMode.textContent || "On") {
  liveStatus.textContent = message;
  liveMode.textContent = mode;
}

function pulseButton(button, label) {
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1200);
}

function cloneTeams(source) {
  return source.map((team) => ({ ...team }));
}

function teamByCode() {
  return Object.fromEntries(teams.map((team) => [team.code, team]));
}
