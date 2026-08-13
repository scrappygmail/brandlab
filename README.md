# BrandLab

A deterministic brand-name generation and evaluation engine. Generates pronounceable, brandable names and scores any name — generated or typed in — across multiple explainable, algorithmic dimensions. Runs entirely in the browser: no backend, no database, no AI required for any score.

**Live demo:** _add your Cloudflare Pages URL here after deploying_

## Philosophy

Most name generators either (a) spit out random letter combinations, or (b) wrap an LLM and call the output "AI-powered branding." BrandLab does neither. Every score is computed by a documented, deterministic formula you can point to and explain — the same input always produces the same output, with no black box.

AI is available as a **strictly optional, off-by-default** add-on for subjective creative opinions (slogans, positioning ideas) — and it **never influences any score**.

## What's real vs. what's scoped out (read this before selling it)

Being upfront about this matters more than it might seem, especially if you're planning to charge for this:

- **Dictionary/brand clash checking** uses a curated reference list of a few hundred common words, well-known startup/tech brand names, common cities, surnames, and first names — not a licensed dictionary, not a trademark database, and not exhaustive. It's a similarity signal, not legal clearance.
- **"Brand DNA" traits** (Softness, Trust, Energy, etc.) are a heuristic mapping from phonetic/orthographic features to abstract descriptors. They're internally consistent and explainable, but they are **not a validated psychological or marketing-science instrument**. Present them as a creative estimate, not as market research.
- **Clarity Tests** (Radio/Phone/Child/International) are simulated from phonetic-complexity formulas, not real audio, not a real listener panel. Present them the same way — useful signal, not a lab result.
- **Trademark similarity** has no bundled database (real trademark data is licensed/paid and jurisdiction-specific). Users can paste their own list under "My trademark list" to fuzzy-match against, session-only.
- **Search/social uniqueness** isn't scraped live — that needs paid APIs or a backend, and scraping search engines directly usually violates their terms of service. Instead, BrandLab gives one-click links to check Google, Product Hunt, GitHub, npm, Instagram, X/Twitter, and WHOIS manually, plus a manual result-count-to-uniqueness estimator you can use after checking Google yourself.
- **Domain availability** is real, live data — it queries Verisign's public RDAP endpoint directly (the modern successor to WHOIS), so this one you can stand behind fully.
- **AI Advisor** only runs if someone pastes their own API key for that browser session — see the AI Advisor section below for exactly what is and isn't safe about this.

If you plan to market this commercially, keep the language matching what's actually happening: "deterministic linguistic scoring" is accurate and still impressive; "scientifically validated brand psychology" would not be true and could bite you with a sophisticated customer (agencies and VCs will absolutely test this).

## How name generation works

- **Invented (single word):** a syllable-based phonetic engine builds words block by block across 9 syllable patterns (CV, CVC, CCV, CVCC, VC, CVV, CCVC, VCV, plus diphthongs) with dozens of allowed onset/coda clusters (`bl`, `tr`, `sh`, `str`, `nk`...). Because words are constructed syllable by syllable rather than from random letters, unpronounceable strings are structurally impossible.
- **Compound (two words joined):** pairs from a curated bank of 90+ short root words (e.g. `flow` + `base` → `Flowbase`).

## Fixes found through real testing (not just eyeballing)

A user-submitted export surfaced three real gaps, found by literally running every name through the engine and checking by hand rather than assuming the gates worked:

- **Embedded real words weren't caught.** "hangif" isn't edit-distance-close to "gif" as whole words, but it visibly contains "gif" — same problem with "supthe" (contains "the") and "criplaf" (contains "cripl", reads like "cripple"). Whole-word Levenshtein distance alone missed this class of issue entirely. Fixed with a dedicated substring-based check (`hasEmbeddedBadSubstring`) applied universally, not just in Premium mode.
- **`gw`/`dw` clusters were still allowed in Standard mode.** These were added to the general cluster list in an earlier pass aimed at "more phonetic variety," which was a mistake — they read badly regardless of mode. Removed from Standard mode's cluster set entirely, and the full ugly-pattern blacklist is now applied universally (`isValidWord` itself), not just as a Premium-only gate.
- **`ck` was incorrectly in the ugly-pattern blacklist.** This is a completely normal, brand-friendly digraph — Slack itself is built on it. Removed; a blacklist should block genuinely awkward patterns, not common ones that happen to look similar to less common ones.
- **Famous fictional/franchise terms weren't checked at all.** "jedi" cleared every existing gate because none of the reference lists (common words, tech brands, cities, surnames, first names) cover pop-culture IP. Added a short, explicitly non-exhaustive `FAMOUS_IP_TERMS` list and gate — this is a spot-check for the most obvious cases (Star Wars, Marvel, Pokémon, LOTR, etc.), not a real trademark/IP clearance search.

## Desirability vs. pronounceability — a different problem, a different engine

Everything above (Invented, Compound) optimizes for how a name *sounds* — clean phonetics, no illegal clusters, no confusion. None of that guarantees a name is *desirable*. Canva, Figma, Notion, Ramp, Miro, and Vercel all share something pure phonetics can never produce: semantic resonance. Notion and Ramp are literal real words. Canva/Figma/Miro are real words lightly reshaped (canvas, figure, mirror) so the association survives the edit. A phonetically flawless but meaningless invented string will never clear that bar, no matter how clean it sounds — verified directly by applying the "would I pick this over Canva" test to the Invented engine's own output (it fails, honestly, because it carries zero semantic resonance by construction).

**New: the Evocative engine**, a genuinely different generation mechanism, not a variant of the phoneme-based one. It starts from a curated bank of real, positive-connotation English words relevant to building or using software (creation, growth, clarity, speed, insight, strength, connection, excellence — canvas, ramp, spark, vision, swift, anchor, link, excel, and more), then applies one of three transformations:

- **Used directly** (~32% of the time) — the real word as-is, if it's 4-7 letters (this is what Notion and Ramp actually are).
- **Truncated + softened** (~53%) — a recognizable fragment of the root plus a clean vowel/short ending (this is the Canva-from-canvas, Figma-from-figure pattern).
- **Blended with a second root** (~15%, deliberately the smallest share — manual review found this path produces the weakest, most arbitrary-feeling results and it's kept rare rather than removed, since it occasionally produces a genuinely nice unexpected combination).

Being close to an ordinary word is the *point* of this engine (unlike Invented mode, where it's disqualifying) — only exact collision with a known brand or fictional IP term is blocked, everything else is exactly the intended behavior.

Available as its own style tab ("Evocative — real word, lightly reshaped"), alongside Invented and Compound, and included in the "All styles" rotation.

## Premium Naming Engine V5 (curated palette — built from taste, not a model)

V1-V4 each tried to be progressively "smarter": syllable gluing, curated word fragments, independent weighted slots, then a hand-authored phonotactic transition model. Every version technically passed its own rules and still didn't sound right — because none of them were ever actually anchored to "does this sound like a name a person with taste would pick." They were anchored to whatever rules had been written, and every new rule just shifted where the ugliness leaked out.

**V5 inverts the process.** Instead of deriving cleanness from a rule system, it starts from a small, hand-picked set of example names manually judged to sound clean, punchy, and easy to say, and builds the generator from the *building blocks those examples are made of* — not the examples themselves.

- **Every syllable is exactly one onset + one vowel.** No "bridge" concept at all, which means the entire bug class that produced `dobpo`/`bivga`/`vuhpa` (two arbitrary consonants meeting mid-word) is now structurally impossible, not just filtered — a consonant can only ever be followed by a vowel by construction.
- **Three small "mood" palettes** (crisp/tech, soft/premium, playful/consumer) replace the previous 13 elaborate family profiles or transition-probability tables — each palette is a short, deliberately curated list of onsets that already sound good together, not a large rule system.
- **The same vowel is never reused within one word** — a direct, literal rule rather than an emergent property of a statistical model.
- **An optional single soft landing consonant** (n, r, l, s, x, t) may close the word — never a cluster, never two in a row.
- **Length is now directly controllable** — building blocks are small and predictable (2-3 characters per syllable, +1 for an optional landing), so a strict min/max length request is respected by construction and retry, not approximated. (This also fixed a real bug found during review: Compound mode was silently overriding the user's max-length setting to 14 regardless of what they'd set, which is why a 4-6 request was returning 11-letter names — removed entirely, Compound now respects the actual setting, which correctly means it yields few or no results at very short max lengths, rather than ignoring the request.)
- **A follow-up review pass found real 3-letter-word collisions slipping through** the soft-landing endings (`fuwet`→wet, `meban`→ban, `mofit`→fit) that the existing embedded-word blocklist didn't cover, plus a couple of real dictionary words (`basis`, `sable`) that weren't in the reference list — both expanded directly in response.

Same safety net underneath as before (illegal-cluster whitelist, embedded-bad-word check, dictionary/brand/city/surname/first-name/IP proximity, medicine-suffix pattern, visual balance, composite score floor, consonant-skeleton near-duplicate detection) — V5 only replaces the *candidate generation* mechanism, not the gates that check its output.

Premium Compound mode (curated real-word pairs, GitHub/Dropbox-style) is a separate, unaffected generator — only its length-override bug was fixed here.

## Fixes found through real testing (not just eyeballing)

A user-submitted export surfaced three real gaps, found by literally running every name through the engine and checking by hand rather than assuming the gates worked:

- **Embedded real words weren't caught.** "hangif" isn't edit-distance-close to "gif" as whole words, but it visibly contains "gif" — same problem with "supthe" (contains "the") and "criplaf" (contains "cripl", reads like "cripple"). Whole-word Levenshtein distance alone missed this class of issue entirely. Fixed with a dedicated substring-based check (`hasEmbeddedBadSubstring`) applied universally, not just in Premium mode.
- **`gw`/`dw` clusters were still allowed in Standard mode.** These were added to the general cluster list in an earlier pass aimed at "more phonetic variety," which was a mistake — they read badly regardless of mode. Removed from Standard mode's cluster set entirely, and the full ugly-pattern blacklist is now applied universally (`isValidWord` itself), not just as a Premium-only gate.
- **`ck` was incorrectly in the ugly-pattern blacklist.** This is a completely normal, brand-friendly digraph — Slack itself is built on it. Removed; a blacklist should block genuinely awkward patterns, not common ones that happen to look similar to less common ones.
- **Famous fictional/franchise terms weren't checked at all.** "jedi" cleared every existing gate because none of the reference lists (common words, tech brands, cities, surnames, first names) cover pop-culture IP. Added a short, explicitly non-exhaustive `FAMOUS_IP_TERMS` list and gate — this is a spot-check for the most obvious cases (Star Wars, Marvel, Pokémon, LOTR, etc.), not a real trademark/IP clearance search.

## Premium Naming Engine V4 (phonotactic transition model — a real rebuild, not another patch)

V1 glued syllables. V2 used curated word fragments. V3 built a phoneme chain (onset→vowel→bridge→ending) but picked each slot **independently** from static weight tables. After several rounds of real user-submitted batches, the actual disease became clear: independent-slot sampling has no memory of what it just picked, so no amount of patching (ending caps, suffix caps, onset caps, blacklists) can create the sequential, context-dependent sound transitions that make real words feel natural — patches can only suppress one symptom at a time, and a new one (repeated ending family, monotone rhythm, letter skew) kept appearing every round.

**V4 replaces the generation mechanism itself.** A name is built syllable by syllable where every choice is weighted by what came immediately before — a hand-authored order-1 phonotactic transition model (not scraped/trained data — documented sound-sequence tendencies: labial consonants pair more naturally with back/round vowels, alveolars are the most versatile/neutral, etc.), not independent sampling.

- **Consonant classes** (labial: b/p/m/f/v, alveolar: t/d/n/s/z/l/r, velar: k/g/h/j/c, rare: q/x/w/y) with a vowel-affinity table per class, and a coda-affinity table per vowel — every next letter is chosen conditioned on the current one.
- **Variety is structural, not patched on**: picking the next syllable's onset applies a penalty when it shares the same consonant class as the previous syllable's ending sound — this is what directly breaks the "Pokémon rhythm" (perfectly alternating CV-CV-CV) at the source instead of scoring it down after the fact.
- **Batch diversity is one unified mechanism**, not five bolted-on caps: every specific transition (e.g. "alveolar→t", "t→a") has its own usage tracked and smoothly discounted as it's reused. (An earlier version of this hard-excluded a transition once its cap was hit — which backfired badly: once every *good* transition for a given context was zeroed out, whatever was left — including genuinely rare/low-quality letters like q/x/w — became the only remaining option, so rare letters got *over*-represented. Fixed with a smooth floor instead of a hard zero, verified empirically: q/x/w dropped back to near-absent rather than appearing in ~11% of names.)
- **The old separate "ending word-bank" is gone entirely** — the final syllable is built through the exact same transition model, just with a bias toward soft, open, or softly-closed landings (matching the real preference for -a/-o/-n/-s/-r/-l endings), so there's one generative system, not two that can drift apart from each other.
- **Score collapse and letter/suffix skew** (both confirmed via real exported batches: 299/300 names scoring 95+, and a handful of onset letters dominating despite equal sampling weight) — fixed with a genuinely new scoring dimension (rhythm asymmetry: does the word break its own pattern, or is it perfectly monotonous) weighted meaningfully into the score, plus a recalibration curve so 100 is rare by construction. Verified: a 500-name batch scores in an 86-94 range with zero 100s and the most common 2-letter ending occurring in under 2.5% of the batch.

**Premium Compound mode** (curated real-word pairs, GitHub/Dropbox-style) is unaffected by any of this — it was never part of the problem, and stays as a separate, legitimately different generator.

## Fixes found through real testing (not just eyeballing)

A user-submitted export surfaced three real gaps, found by literally running every name through the engine and checking by hand rather than assuming the gates worked:

- **Embedded real words weren't caught.** "hangif" isn't edit-distance-close to "gif" as whole words, but it visibly contains "gif" — same problem with "supthe" (contains "the") and "criplaf" (contains "cripl", reads like "cripple"). Whole-word Levenshtein distance alone missed this class of issue entirely. Fixed with a dedicated substring-based check (`hasEmbeddedBadSubstring`) applied universally, not just in Premium mode.
- **`gw`/`dw` clusters were still allowed in Standard mode.** These were added to the general cluster list in an earlier pass aimed at "more phonetic variety," which was a mistake — they read badly regardless of mode. Removed from Standard mode's cluster set entirely, and the full ugly-pattern blacklist is now applied universally (`isValidWord` itself), not just as a Premium-only gate.
- **`ck` was incorrectly in the ugly-pattern blacklist.** This is a completely normal, brand-friendly digraph — Slack itself is built on it. Removed; a blacklist should block genuinely awkward patterns, not common ones that happen to look similar to less common ones.
- **Famous fictional/franchise terms weren't checked at all.** "jedi" cleared every existing gate because none of the reference lists (common words, tech brands, cities, surnames, first names) cover pop-culture IP. Added a short, explicitly non-exhaustive `FAMOUS_IP_TERMS` list and gate — this is a spot-check for the most obvious cases (Star Wars, Marvel, Pokémon, LOTR, etc.), not a real trademark/IP clearance search.

## Premium Naming Engine V3 (agency-grade mode)

**V1** glued CV syllables. **V2** combined curated root fragments with endings — better, but several fragments turned out to be real dictionary words themselves (`storm`, `studio`, `orbit`), an unwinnable whack-a-mole since any fragment meaningful enough to feel like a real root is also likely to just *be* a real word sometimes.

**V3 removes fragments entirely.** Names are built as a phoneme chain — **Onset consonant → Core vowel → Bridge → Ending** — from weighted letter/ending tables, not curated word lists. A real dictionary word can now only appear by pure chance, and the dictionary-clash gate catches it when it does.

**What changed, point by point, based on a detailed technical review after 6 batches:**

- **Banned entirely:** the onset clusters `spl`, `scr`, `spr`, `str`, `tw`, `sw`, `sm`, `sn` (rare in real startup names). **Low-weight (~3% combined):** `gl`, `sl`, `fl`, `cl`, `gr`, `dr`. **High-weight:** single consonants `v l m n r t p b d c`, which dominate premium tech-brand naming far more than clusters do.
- **Weighted ending distribution** matching the reviewed percentages closely (`-a`:20%, `-o`:18%, `-io`/`-ia`:9% each, `-on`:8%, `-er`:8%, `-or`:7%, `-el`:6%, `-en`:5%, `-ix`:3%, `-ex`/`-us`:2%, `-ly`:1%), plus a modest set of richer 3-letter endings (`-ifa`, `-ona`, `-eva`...) to hit the explicit "Lorifa/Verona" texture target — not equal-probability, genuinely weighted.
- **Weighted letter frequency**, not random: rare letters get their own explicit low weights (`q`≈0.2%, `x`≈2%, `z`≈4%, `w`≈1% of onset picks) instead of appearing by uniform chance.
- **13 rotating families are weight *profiles*, not word banks** — e.g. the Spanish profile biases onset/vowel/ending selection toward `s/m/l/r` onsets and `-a/-o` endings *without ever using the literal words* "sol" or "luna." This is the direct fix for V2's dictionary-word-fragment problem, applied structurally instead of via more list-curation.
- **Hard vowel-ratio gate: 40–55%** (consonant ratio is just the complement, so this one constraint covers both).
- **Length distribution targets 5:35% / 6:40% / 7:20% / 8:5%.** Longer names are structurally harder to build while still passing every other gate — measured raw acceptance rates during testing were ~46%/51%/18%/5% for 5/6/7/8 letters respectively — so the *raw sampling weights* are calibrated (target ÷ measured acceptance rate) to make the **output** approximate the target distribution, not the raw sampling. This is verified empirically in testing, not assumed; length 8 remains intentionally rare, matching the review's own "allow 8 only if exceptional, almost never" framing (it requires a composite score ≥88, an 6-point-higher bar than the standard 82 floor).
- **Real duplicate-family detection, two mechanisms:** (1) combined Levenshtein + bigram + trigram similarity, reject if >70% similar to any name already accepted in the batch; (2) a **consonant-skeleton check** — `Lorava`/`Levora`/`Lureva`/`Lerova` all reduce to the same sorted consonant set `{l,r,v}` and read as "the same name" despite scoring *low* on similarity #1 (~0.25, well under the 0.70 threshold, confirmed during testing) because the letters are simply reordered. Both checks run; either one alone would have missed this exact case.
- **Batch memory:** a 3-letter prefix can appear at most twice per batch; an ending's share of the batch is capped at ~1.5× its target weight-share. Both are enforced *during* generation (prevention), not checked-then-maybe-regenerate-everything (which would be far more expensive).
- **Reject-cheap-before-expensive ordering:** ugly-pattern/reduplication/rare-letter/vowel-ratio/length/syllable-count checks (all cheap regex or counting) all run before the dictionary-clash scan or the composite score (both expensive), so a candidate that's obviously wrong never reaches the costly checks.
- **More ugly patterns added directly from review:** `qq`,`xx`,`yy`,`zz`,`jj`,`vvv`,`kkk`, plus a literal blocklist for the specific "cartoon" examples flagged (`spupu`, `gugru`, `twodwo`, `lala`, `meme`, `gugu`, `dodo`, `gaga`, `pupu`).

**Performance, found and fixed during testing, not assumed:** the first working version of this took 47+ seconds for a 1000-name Premium batch. Profiling found two real bottlenecks — weight tables were being rebuilt via `Object.entries().map()` on every single letter pick instead of cached, and the dictionary-clash check was running full Levenshtein against ~800 reference words with no early pruning. Fixed with (1) per-family weight-table caching and (2) a length-difference pre-filter (Levenshtein distance can never be smaller than the length difference between two strings, so words whose length differs by more than the gate's threshold are skipped without computing Levenshtein at all). Net result: 1000-name batch dropped from 47s to ~22s; the default 100-name batch takes ~2 seconds.

**Important honesty note, unchanged from V1/V2:** none of this trains on or copies Canva/Figma/Notion/Stripe/etc.'s actual names — the weight profiles encode documented linguistic patterns (real onset-cluster frequency in English brand names, the real bouba/kiki effect, real Abercrombie trademark-strength theory), not a lookup of real companies' letters. The reference company list elsewhere in this README is pattern inspiration only, never literal input data.

## Fixes from real user-submitted batches (read this — it's the honest version)

Two rounds of real exported batches surfaced problems no amount of internal testing had caught, because they required actually reading the output the way a human naming client would, not just checking pass/fail gates.

**Round 1 — unpronounceable output.** A 20-name export showed things like `dobpo`, `bivga`, `pagjo`, `vuhpa`, `qehvo` — real garbage. Root cause: the bridge-construction step had a fallback path that concatenated two independently-picked single consonants with **no legality check** (`b`+`p`="bp", `v`+`g`="vg"). The ugly-pattern list was a blacklist covering ~15 known-bad patterns, but English has roughly 400 possible 2-consonant pairs — a blacklist can only ever cover what someone thought to list, and this one covered a small fraction of what needed blocking. Fixed by switching to a **whitelist**: `hasIllegalConsonantCluster()` now rejects any consonant pair not explicitly on a list of real, legal English clusters, and the arbitrary-concatenation path was removed from bridge construction entirely — bridges are now always either a whitelisted cluster or vowel-broken, never two bare consonants glued together.

**Round 2 — real names, but scoring had collapsed and lacked variety.** A 300-name batch showed no illegal clusters, but: 299/300 names scored 95+ (no differentiation at all), a handful of onset letters (`b`,`d`,`p`,`t`,`f`,`g`) dominated while `l`,`m`,`n`,`r`,`v` were rare despite having equal sampling weight, and many names had the exact monotonous "Pokémon rhythm" (`bopafo` = perfectly alternating C-V-C-V-C-V) that reads as generated rather than coined.

- **Score collapse, root cause:** the deterministic gates already filter hard on pronunciation, visual balance, dictionary distance, etc. — so by construction, everything that *survives* the gates is already uniformly good on those dimensions. Scoring the same dimensions again post-gate had nothing left to differentiate. Fixed by adding a genuinely new dimension the gates don't already guarantee — **rhythm asymmetry** (does the word break its own syllable pattern, like a real cluster or closed syllable, or is it perfectly monotonous alternation) — weighted meaningfully (18-20%) into both the Overall and Premium Composite scores, plus a recalibration curve so a **100 is now rare by construction**, not routine.
- **Onset-letter skew:** most likely caused by `l`/`m`/`n`/`r`/`v`-starting invented words coincidentally landing closer to real English words (love, name, rock, van...) and getting filtered by the dictionary-clash gate at a higher rate than `b`/`d`/`p`/`t`-starting ones, even though initial sampling weight was equal. Rather than trying to perfectly model that differential rejection, a direct **batch-level onset-letter cap** (~8% of a batch max per starting letter) now enforces the fix regardless of the underlying cause — verified empirically to bring the worst offenders down from 36+ occurrences to the cap.

**New: Premium Compound mode**, addressing the explicit ask for elite two-word combinations, not just single invented words. Real premium tech brands sometimes fuse two genuine words cleanly (GitHub = git+hub, Dropbox = drop+box, Salesforce = sales+force, Cloudflare = cloud+flare). A curated bank of ~70 clean, evocative real words is combined pairwise, with the same join-point pronunciation validation (no illegal cluster allowed at the seam either) and the same brand/IP safety gates. Available via the existing Invented/Compound/Both style tabs, which now work in Premium mode too (previously Premium ignored them and always used the single-word engine).

## Complete rebuild: Proven-Technique Naming Engine

After several rounds of fixes to the fragment/blend-based Evocative engine kept surfacing new problems at scale, the actual lesson was structural, not another bug: **any engine that starts from invented material and tries to filter it into feeling legitimate is fighting itself.** Real premium names — Slack, Notion, Ramp, Spotify, Tumblr, Flickr, Uber — are built from a small number of proven, repeatable techniques, and every one of them starts from an actual real word.

The Evocative engine was rebuilt from scratch around exactly four such techniques, each one producing output that traces back to a word a person would actually recognize:

1. **Real word, used directly** (the Slack/Notion/Ramp pattern) — a curated bank of ~140 real English words, short and clean.
2. **Vowel-drop** (the Tumblr/Flickr/Scribd pattern) — a hand-verified set of real words (wonder, cluster, sprinter...) where dropping the vowel before the final consonant still reads cleanly. Verified by hand rather than computed blindly, since a blind vowel-drop can just as easily produce a mess as a gem.
3. **Real foreign word, direct** (the Uber pattern) — ~30 real Latin/Italian/Spanish/Japanese words with a double-checked meaning, not an invented "foreign-sounding" string.
4. **Light suffix on a real root** (the Spotify/Shopify pattern) — a small, proven suffix set (`-ify`, `-ly`, `-io`, `-ster`), not the large invented-ending list from earlier versions.

No blending, no arbitrary phoneme chains, no independently-sampled letters anywhere in this engine.

**Batch diversity is now a hard rule, not a soft weight**: an ending (last 2 letters) may appear at most twice in one batch, checked as a direct count against what's already been accepted — the earlier statistically-weighted caps still allowed "-ive/-ise/-ent" to visually dominate an entire batch while technically staying under their allotted share, which is exactly what a human scanning the list actually notices.

Yield is honestly lower than the phoneme-based engines (roughly 60-90 unique names per request before the curated word banks are exhausted) — this is expected and correct given the small, deliberately curated source material, not a bug to be padded around. The UI already reports "X of Y requested" for exactly this reason.

## Evocative engine fixes (found via a large real-batch export)

A 300-name export surfaced two real problems that small test batches (60 names) never triggered:

- **The blend transformation dominated output at scale and it shouldn't have.** It was weighted at only 15%, but with a small ~40-word root bank, the "direct use" and "truncate+soften" paths ran out of fresh combinations quickly, forcing generation to fall back on blend — which combines a root fragment with an arbitrary tail sliced from a second real word, producing awkward results (`motinch`, `opentte`, `cleahor`, `scaltte`) no amount of down-weighting could fix, because the mechanism itself was unreliable. Removed entirely; the root bank was expanded from ~40 to 75 words and the ending list from 9 to 15, giving over a thousand direct-use/truncate-soften combinations — enough headroom that even a 500-1000 name batch never needs to fall back on a broken path.
- **A 300-name request took over 160 seconds.** Profiling found the Evocative and Compound generators were using the slow, full-scan `closestMatch()` for their brand/IP safety check instead of the length-pruned `hasCloseMatch()` already built for this exact purpose elsewhere in the code. Fixed, plus added stall detection to the batch loop (stop early once ~4000 consecutive attempts produce nothing new, rather than grinding through the full attempt budget when a curated root bank's combinatorial ceiling has genuinely been reached) — a 300-name Evocative request now takes about 7 seconds instead of 168.
- **Fragment+ending combinations occasionally reconstruct an unrelated real word by coincidence** (`stud`+`ent`="student", `moti`+`ive`="motive", `soli`+`e`="sole", `luci`+`ent`="lucent" — also a real former company name). Since Evocative mode deliberately skips the general dictionary-clash check (resembling a real word is the point of this engine), a small dedicated exact-match exclusion list was added for exactly this failure mode rather than the general check.

## Scoring modules (all deterministic)

| Module | What it measures | Weight in Overall |
|---|---|---|
| Pronunciation | Consonant/vowel cluster limits, syllable count, alternation rhythm, rare-letter penalty | 18% |
| Typing confidence | Ambiguous grapheme patterns (`ph`/`f`, `c`/`k`, double letters, etc.) | 12% |
| Spelling-variant risk | Count of plausible alternate spellings generated by substitution rules | 12% |
| Memorability | Length, syllable count, catchy repetition, first/second-half symmetry | 10% |
| Length | Distance from the 5–7 letter sweet spot | 8% |
| Dictionary/brand clash | Levenshtein distance to nearest common word and nearest known brand | 15% |
| Rhythm | Vowel/consonant alternation ratio | 5% |
| Visual balance | Ratio of ascenders/descenders to neutral letters | 5% |
| Brandability pattern | Length and ending-letter fit against known startup naming patterns | 5% |
| (remaining) | Soft blend of the above for stability | 10% |

String-similarity primitives implemented from scratch: **Levenshtein distance**, **Jaro-Winkler similarity**, **Soundex** (a simplified phonetic key — a full Double Metaphone implementation was out of scope, and this is noted rather than overclaimed), plus **bigram-based N-gram overlap and cosine similarity** used alongside edit distance when explaining a dictionary/brand clash.

**Brand Twins** are close phonetic neighbors generated via single-letter substitution, filtered to only pronounceable results — useful for spotting names that are one typo away from something else.

**Clarity Tests** (Radio / Phone / Child readability / International pronunciation) are deterministic heuristic simulations based on consonant clustering, rare letters, and syllable count — they are **not real acoustic or human-panel tests**, and are labeled as simulated heuristics in the UI.

**Reference-list checks** also flag if a name is unusually close to a common city, surname, or first name (curated lists, not exhaustive), alongside the common-word and known-brand checks used for the Dictionary/brand clash score.

**Custom trademark check**: paste your own list of names (top bar → "My trademark list") and every report will also fuzzy-match against it for that session. No trademark database is bundled — see the note above on why.

**Search uniqueness**: inside a name's full report, paste a Google result count you looked up yourself and get a rough log-scale uniqueness estimate. No scraping is performed.

**Strengths / weaknesses / recommendation**: a small rule-based summary (e.g. "may be hard to pronounce", "close to an existing brand") generated from the scores above, plus a one-line recommendation (proceed / review / regenerate).

**Export**: CSV export in Generate and Bulk modes, plus a dependency-free "Export PDF" (uses the browser's native print-to-PDF) from any name's full report.

**Keyboard shortcuts**: `/` focuses the search box in Generate mode, `Enter` submits in Score-a-name mode, `Esc` closes the report modal.

## Domain availability checking

Domain checks happen automatically in the background as soon as you generate a batch — no button to click. Each check calls Verisign's public RDAP endpoint (the modern successor to WHOIS) directly from the browser. If a check can't be confirmed (network hiccup, etc.) it's marked for manual verification rather than silently disappearing — open that name's "Full report" for a one-click manual WHOIS link.

## Modes

- **Generate** — batch-generate names (100/500/1000 at a time, "load more" for additional unique batches), each pre-scored.
- **Score a name** — paste any existing name for a full report.
- **Compare** — up to 4 names side by side across every metric.
- **Bulk CSV** — paste or upload a list, analyze all of them, sort, export a full CSV report.

Every name's "Full report" includes the score breakdown, Brand DNA fingerprint, alternate spellings, brand twins, dictionary/brand clash warnings, and one-click manual-check links (Google, Product Hunt, GitHub, npm, Instagram, WHOIS).

## AI Advisor (optional, off by default, session-only)

Toggling this on reveals a provider selector (Anthropic Claude or Google Gemini Flash) and a field to paste your own API key for that provider. That key is held in a single JavaScript variable for the current browser tab only — never written to localStorage/sessionStorage, never sent anywhere except directly to the selected provider's API from the browser. It's wiped immediately when you turn the toggle off, switch providers, or close/refresh the tab. Nothing about this is persisted between sessions, and it never touches or influences any deterministic score.

**Where to actually use it:** the toggle panel itself only holds the key. The actual "ask for a slogan/positioning" action lives inside each name's **Full report → AI opinion section** — it won't do anything from the top panel alone. This is easy to miss on first use.

**Anthropic and Gemini use completely different APIs** (different endpoint, different auth header, different request/response shape), so a key from one provider will not work if the other is selected — BrandLab handles both correctly once you pick the matching provider for your key. Google AI Studio issues Gemini keys (starting with `AIza...`) for free with a daily quota, which is why it's included as a first-class option here rather than an afterthought.

This bring-your-own-key approach is the quick way to try it yourself. It is **not** the right setup for a public multi-user product — if a real visitor pastes a key into a page you deployed, it lives in *their* browser tab, which is fine for personal/single-user use, but you should not embed your own key as a constant in the shipped code (anyone's dev tools would reveal it).

For a real production setup where you want *your* key to power AI suggestions for all visitors, use the included `functions/api/ai-advisor.js` — a Cloudflare Pages Function (plain JavaScript, still 100% free-tier compatible) that keeps the key server-side as an encrypted environment variable instead. See the comment block at the top of that file for the 5-minute setup. The two approaches are independent; you can use either, both, or neither.

## Stack

Plain HTML, CSS, and vanilla JavaScript for the main app. One optional Cloudflare Pages Function (JavaScript) for the AI proxy. No frameworks, no build step, no database.

## Run locally

Open `index.html` in a browser. No server needed for the deterministic engine.

## Deploy (free)

1. Push this repo to GitHub, or keep it local.
2. Go to [Cloudflare Pages](https://pages.cloudflare.com).
3. "Create a project" → "Upload assets" (or connect the GitHub repo for auto-deploys on push — this also picks up the `functions/` folder automatically).
4. Deploy. Your site is live on a free `*.pages.dev` subdomain.
5. (Optional) Set up `ANTHROPIC_API_KEY` as described above if you want the AI Advisor to actually respond.

## License

All rights reserved — public for portfolio/demo viewing only. Not licensed for commercial use, redistribution, or derivative deployment without permission. See `LICENSE`.
