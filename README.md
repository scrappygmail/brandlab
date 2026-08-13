# BrandLab

A deterministic brand-name generation and scoring engine. Generates pronounceable, brandable names — or scores any name you already have — across a set of explainable, algorithmic dimensions. Runs entirely in the browser: no backend, no database, and no AI required for any score.

**Live demo:** https://brandlab.pages.dev/

Part of the [JafriLabs](https://github.com/jafri101/jafrilabs) portfolio. Built by [Asad Jafri](https://www.linkedin.com/in/jafri101/).

---

## Why it's different

Most naming tools either output random letter combinations, or wrap an LLM and call it "AI-powered branding." BrandLab does neither. Every score comes from a documented, deterministic formula — the same input always produces the same output, with no black box. AI is available as a strictly optional, off-by-default add-on for creative suggestions (slogans, positioning ideas), and it never influences a score.

## Name generation

Three distinct techniques, each modeled on how real premium brand names actually get made:

- **Invented** — built syllable by syllable through a phonetic engine, so the output is pronounceable by construction rather than filtered after the fact.
- **Compound** — pairs of clean, evocative real words joined cleanly (the GitHub/Dropbox/Cloudflare pattern).
- **Evocative** — real words used directly, lightly reshaped, or given a proven suffix (the Notion/Ramp/Canva/Spotify pattern) — because a phonetically clean invented word alone rarely carries real brand appeal.

A Premium tier refines the underlying generation model further for more natural, less repetitive output.

## Scoring

Every generated or user-submitted name is scored across weighted, explainable dimensions — pronunciation, typing confidence, spelling-variant risk, memorability, length fit, dictionary/brand-name proximity, rhythm, visual balance, and overall brandability. Each report includes a plain-language breakdown, alternate spellings, phonetic "brand twins," and one-click manual-check links (Google, Product Hunt, GitHub, npm, WHOIS).

## Live domain availability

Domain checks run automatically against Verisign's public RDAP registry the moment a batch is generated — real, live availability data, not a cached guess.

## Honesty by design

BrandLab is upfront about what each check actually is: dictionary/brand-clash checks use a curated reference list (a strong similarity signal, not legal clearance), "clarity tests" are phonetic simulations rather than real listener panels, and trademark similarity has no bundled legal database — users can paste their own reference list to check against. Domain availability is the one metric backed by fully live, real-time data.

## Optional AI Advisor

Off by default. When enabled, it takes a user-supplied API key (Claude or Gemini) for creative suggestions only — slogans and positioning ideas — and never touches any score. The key lives in memory for the current session only.

## Modes

- **Generate** — batch-generate names, pre-scored
- **Score a name** — full report on any name you already have
- **Compare** — up to 4 names side by side
- **Bulk CSV** — analyze a list in bulk, export a full report

## Stack

Plain HTML, CSS, and vanilla JavaScript. One optional Cloudflare Pages Function for the AI Advisor proxy. No frameworks, no build step, no database.

## Run locally

Open `index.html` in a browser — no server needed for the core engine.

## License

All rights reserved — public for portfolio/demo viewing only. Not licensed for commercial use, redistribution, or derivative deployment without permission. See `LICENSE`.
