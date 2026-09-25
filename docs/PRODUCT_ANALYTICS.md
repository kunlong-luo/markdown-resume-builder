# Privacy-friendly product analytics & feedback plan

> Status: **phase 1 implementation — Simple Analytics is enabled on the official GitHub Pages app with a minimal event allowlist**

Resume Craft is local-first. Product measurement should answer a small number of product questions without collecting resume content, job descriptions, contact details, share payloads, or persistent user identifiers.

## 1. Product questions

For the first validation cycle, measure only:

1. Do visitors start editing?
2. Do they reach a successful PDF export or browser print flow?
3. Which core tools are actually used: Import, ATS Check, Auto Fit, Profiles, Share?
4. Where should qualitative feedback be collected?
5. Which acquisition channels bring users who actually export a resume?

Do **not** optimize for detailed behavioral surveillance, session replay, heatmaps, keystrokes, or per-user profiles.

## 2. Privacy invariants

These are non-negotiable:

- Never send resume Markdown, rendered resume text, JD text, names, email addresses, phone numbers, profile names, filenames, or free-form user input.
- Never send share payloads, access codes, or any URL query/hash values.
- Analytics paths must use `location.pathname` only. Resume Craft share data can be carried in URL parameters, so the default `location.search` must not be sent.
- No cookies, advertising identifiers, cross-site identifiers, fingerprinting, or persistent analytics user IDs.
- No session replay or DOM/text capture.
- Event names must come from a fixed allowlist in source code; never construct analytics event names from user content.
- The application must continue to function normally if analytics is blocked, unavailable, or disabled.
- Privacy documentation must be updated before analytics is enabled in production.

## 3. Recommended phase-1 stack

### Anonymous product signals: Simple Analytics

Phase 1 uses Simple Analytics because it provides aggregate pageviews and explicit custom events without cookies, localStorage-based visitor IDs, IP storage, or browser fingerprinting.

Resume Craft adds stricter application-side rules on top:

- analytics events are hard-coded in `src/lib/analytics.ts`
- Do Not Track is respected
- automatic pageview collection is disabled so the app can normalize shared-resume visits to `/resume-craft/shared`
- URL query/hash values are never passed to analytics
- browser/device metrics that are not needed for product validation are disabled
- the first implementation sends only three events: `editing_started`, `pdf_export_success`, and `browser_print_started`

GitHub Discussions remains the qualitative feedback channel. A richer tool such as Umami can be reconsidered later only if aggregate evidence shows a genuine need for deeper funnels.

### Qualitative feedback: GitHub Discussions

Use repository Discussions for open-ended feedback, questions, ideas, and polls. Keep Issues for concrete bugs and scoped feature work.

Recommended feedback categories:

- **Feedback / 使用反馈** — what worked, what was confusing
- **Ideas / 功能建议** — product ideas
- **Q&A / 使用问题** — help and questions
- **Show and tell / 作品展示** — optional examples with users reminded to remove personal data

## 4. Minimal event contract

Pageviews are enough for visits. Track only these product events:

| Event | Meaning | Allowed data |
| --- | --- | --- |
| `editing_started` | User makes the first meaningful edit in a visit | none |
| `pdf_export_success` | Direct PDF generation finishes successfully | none |
| `browser_print_started` | Browser print / Save as PDF workflow is opened | none |

Additional events such as Import, ATS, Auto Fit, Profile, Share, PWA install, or Feedback should only be added after the first validation cycle demonstrates a concrete decision they would inform.

Do not track every click, every edit, editor focus, character counts, ATS score, resume length, job title, template text, or search terms.

## 5. Core funnel

Primary activation funnel:

```text
Visit
  ↓
editing_started
  ↓
pdf_export_success OR browser_print_started
```

Primary activation metric:

```text
Successful export rate =
unique visits with a successful export
÷
unique visits that started editing
```

Secondary signals:

- ATS adoption = `ats_check_completed / editing_started`
- Auto Fit adoption = `auto_fit_used / editing_started`
- Share adoption = `share_created / successful export`
- Feedback intent = `feedback_opened / successful export`

Phase 1 does not require cross-device identity or long-term individual retention tracking.

## 6. Feedback UX

Do not block the first export.

Recommended flow:

1. First successful export: no prompt.
2. Keep a permanent, low-friction **Feedback** link in README/Help.
3. After a user has already completed at least two exports, an optional non-blocking toast may say:
   - 中文：`有建议？欢迎告诉我们哪里最好用、哪里最难用。`
   - English: `Have feedback? Tell us what worked and what was confusing.`
4. Rate-limit this locally (for example, once every 30 days).
5. Clicking it opens GitHub Discussions; no resume data is attached automatically.

## 7. First 30-day validation dashboard

Review only a compact scorecard:

| Metric | Why it matters |
| --- | --- |
| Visits | acquisition baseline |
| `editing_started` | users understood the product enough to begin |
| `pdf_export_success` | strongest activation signal |
| `browser_print_started` | alternate export path usage |
| `ats_check_completed` | differentiation usage |
| `auto_fit_used` | A4 pain-point usage |
| `share_created` | sharing demand |
| `feedback_opened` | feedback intent |
| New Discussions / actionable Issues | qualitative learning |
| GitHub Stars | open-source interest, not product activation |

A useful first experiment target (not an industry benchmark) is to get enough traffic to evaluate roughly 100 real visits, then inspect the export funnel and read every piece of feedback before adding major features.

## 8. Implementation guardrails

When implementation starts:

- Add a tiny `src/lib/analytics.ts` wrapper so the app never calls a vendor API directly from feature components.
- Analytics must be disabled when the configured analytics site/code is absent.
- Hard-code an event allowlist.
- Normalize pageviews to pathname only.
- Add tests proving URLs like `?share=...`, query parameters, hashes, resume text, and JD text are never included in analytics payloads.
- Keep analytics failures silent and non-blocking.
- Update the in-app privacy section and README before deployment.
- Add an easy developer switch to disable analytics locally.

## 9. Decision after the validation cycle

Use the evidence to decide what comes next:

- Many exports, many questions → invest in documentation/VitePress.
- Strong ATS usage → deepen job-specific resume tailoring.
- Strong demand to capture JDs from job sites → evaluate a browser extension.
- Visits but weak editing/export conversion → fix onboarding before marketing harder.
- Healthy activation but low traffic → invest in distribution/marketing.
- Little repeat interest and little feedback → reconsider positioning before adding features.
