# BrandLab — Free Brand Name Generator with Live Domain Availability Check

BrandLab is a free, browser-based **business name generator** and **brand name scoring tool**. It generates short, punchy, pronounceable startup names, scores any name you already have on explainable linguistic dimensions, and checks real-time `.com` domain availability — all without an account, a paywall, or a backend server.

**Live demo:** https://brandlab.pages.dev/

Part of the [JafriLabs](https://github.com/jafri101/jafrilabs) portfolio. Built by [Asad Jafri](https://www.linkedin.com/in/jafri101/).

---

## What BrandLab does

- **Generates brand names** using three techniques modeled on how real companies get named — invented/phonetic, compound (GitHub/Dropbox-style), and evocative real-word blends (Notion/Canva/Stripe-style)
- **Scores any name** across pronunciation, typing confidence, memorability, spelling-variant risk, dictionary/brand-name clash, rhythm, and visual balance — with a plain-language breakdown, not just a number
- **Checks live domain availability** the moment names are generated, using Verisign's public RDAP registry — real data, not a cached guess
- **Optional AI name generation** — describe your business in a sentence and get AI-generated candidates, filtered through the exact same quality and safety gates as everything else
- **Optional AI shortlist ranking** — ask AI to pick and justify its favorite from your available names
- **Compares names side by side**, up to 4 at once
- **Bulk-scores a CSV** of existing name candidates and exports a full report

## Why it's different from other AI name generators

Most "AI-powered" naming tools are a thin wrapper around an LLM prompt, with no explanation for why one name scores higher than another. BrandLab flips that: every score comes from a documented, deterministic formula — the same input always produces the same output, no black box, no per-generation API cost. AI is a genuinely optional layer on top, off by default, used only for creative generation and ranking — never for scoring.

## Name generation techniques

- **Invented** — built syllable by syllable through a phonetic engine, pronounceable by construction rather than filtered after the fact
- **Compound** — pairs of clean, evocative real words joined cleanly (the GitHub/Dropbox/Cloudflare pattern)
- **Evocative** — real words used directly, lightly reshaped, given a proven startup suffix, or fused through a shared-letter overlap blend (the Pinterest/Instagram portmanteau pattern) — because a phonetically clean invented word alone rarely carries real brand appeal

A Premium tier runs every candidate through a stricter multi-gate pipeline for less repetitive, more natural output.

## Scoring

Every generated or user-submitted name is scored across weighted, explainable dimensions — pronunciation, typing confidence, spelling-variant risk, memorability, length fit, dictionary/brand-name proximity, rhythm, visual balance, and overall brandability. Each report includes a plain-language breakdown, alternate spellings, phonetic "brand twins," and one-click manual-check links (Google, Product Hunt, GitHub, npm, WHOIS).

## Live domain availability

Domain checks run automatically against Verisign's public RDAP registry the moment a batch is generated.

## Optional AI features

Off by default — nothing below runs, and no key is stored, unless you turn AI Advisor on and paste your own Claude or Gemini key for the current browser session only:

- **AI concept generator** — describe your business in one line and get AI-generated name candidates back, run through the same gates (illegal letter clusters, dictionary/brand collision, etc.) as every deterministically-generated name
- **AI shortlist ranking** — send your current available shortlist to the AI in one call and get back a ranked top 3 with reasoning
- **Per-name slogan & positioning** — ask for a one-line slogan, likely industry, and positioning angle for any individual name

None of this ever touches or influences a deterministic score.

## Honesty by design

BrandLab is upfront about what each check actually is: dictionary/brand-clash checks use a curated reference list (a strong similarity signal, not legal clearance), "clarity tests" are phonetic simulations rather than real listener panels, and trademark similarity has no bundled legal database — paste your own reference list to check against. Domain availability is the one metric backed by fully live, real-time data.

## Modes

- **Generate** — batch-generate names, pre-scored, with optional AI generation and ranking
- **Score a name** — full report on any name you already have
- **Compare** — up to 4 names side by side
- **Bulk CSV** — analyze a list in bulk, export a full report

## Who this is for

Founders and indie hackers naming a startup, developers naming a side project or SaaS tool, and anyone who wants a **free alternative to paid brand name generator tools** that charge per search or gate results behind a subscription.

## FAQ

**Is BrandLab free?**
Yes, fully free, with no account or sign-up. The optional AI features use your own API key rather than a bundled paid service.

**Does it check if the domain is actually available?**
Yes — every generated name is checked live against Verisign's RDAP registry for `.com` availability, not a cached or estimated result.

**Is this an AI name generator?**
The core generator and every score are 100% deterministic, not AI. AI is available as an optional add-on for generating extra candidates from a business description and ranking a shortlist — off by default.

**Does BrandLab check trademarks?**
Not against a licensed legal database — that data is jurisdiction-specific and paid. It fuzzy-matches against a curated list of well-known brand and IP names, and you can paste in your own reference list to check against.

## Stack

Plain HTML, CSS, and vanilla JavaScript. One optional Cloudflare Pages Function for the AI Advisor proxy. No frameworks, no build step, no database.

## Run locally

Open `index.html` in a browser — no server needed for the core engine.

## License

All rights reserved — public for portfolio/demo viewing only. Not licensed for commercial use, redistribution, or derivative deployment without permission. See `LICENSE`.
