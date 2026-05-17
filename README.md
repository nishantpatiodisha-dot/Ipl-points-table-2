# IPL Points Table Predictor

Open `index.html` to use the local app, or open `IPL-Points-Predictor.html` if you want a single file that is easy to upload or send.

## Sharing

- Use **Copy link** inside the app after choosing results. The link stores picks in the URL, for example `?p=57.RCB_58.MI`.
- For a public link, upload the files to any static host such as GitHub Pages, Netlify, Vercel, or Cloudflare Pages.
- For quick file sharing, send `IPL-Points-Predictor.html`; the app works in a browser without extra files.

The prediction uses fixed current NRR because selecting only winner/loser does not determine future run-rate changes. Playoff chances are exact across every unpicked win/loss combination, assuming each unpicked match is 50/50.

Click any remaining match card to open a glass preview with generated win lean, head-to-head context, and previous meetings in that venue city. Historical notes are generated from Cricsheet IPL JSON data.

When online on Vercel, the site checks a fast same-site live endpoint every 30 seconds and falls back to the reader endpoint if needed. The single-file version still works when sent directly, using the reader fallback in the browser.

The layout is tuned for phones: a compact fixed ladder stays visible at the top, match cards keep touch-sized pick buttons, and the match preview opens as a mobile-friendly sheet.

Vercel Web Analytics is wired into the hosted page. Visitor counts and page views appear in the project's Analytics tab in Vercel after Web Analytics is enabled for the project.
