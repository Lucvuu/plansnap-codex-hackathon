# UI v2.0 — handoff (branch `feat/ui-v2`)

Goal: finish the v2.0 redesign from branch `origin/frontend-v2.0` in the current Expo app (`mobile/`).
That branch's `mobile/` is an **old snapshot** (forked before most of `dev`'s features) — don't copy its code. Use its design files as the spec:

- Interactive prototype: `git show origin/frontend-v2.0:docs/PlanSnap-Figma-Prototype.html` (CSS tokens ~L1–612, 4 phone screens + settings sheet ~L660–970, rationale table ~L976–1008).
- Brand guide: `origin/frontend-v2.0:docs/brand/PlanSnap-Brand-Guidelines.md`; assets in `origin/frontend-v2.0:assets/brand/` (`logo-mark.svg`, icon PNGs).

**Keep every existing feature working** (free-time-window editor, fixed events, "+ Thêm lịch", handwriting camera challenge, .ics export, Google Calendar links, sample presets, tab restore). Restyle/re-layout to v2; never drop behaviour to match the mock.

## v2 principles (from the prototype)
1. **Smart Review (1 chạm)** replaces N repeated amber "Ngày A hay ngày B?" cards: one screen, best option preselected, one "Đồng ý tất cả" button, change per item by tapping a pill.
2. **No "AI slop"**: no benchmark seconds, model ids, file sizes, sparkles/robots/"AI" badges. Calm shimmer while reading.
3. **3-zone nav**: Lịch · raised centre camera (Snap) · Đầu việc. Settings = gear in screen headers → sheet.
4. **Tonal palette**: navy/brand blue on slate, 1px slate card borders, emerald = done, coral = urgent. Status is never colour-only.

## Done (foundation — shared contract)
- `src/theme.ts` — v2 tokens: slate surfaces, brand scale (`blue`, `blueHover`, `blueNavy`, `brand500/400/100`, `blueSoft`), emerald `green*`, coral `red*`, `amber*`; `fonts.extrabold`; `radii`, `layout`, `type` presets; `brandShadow()`.
- `src/components/ui.tsx` — `Screen` (scroll body + top safe-area inset; tabs no longer have a navigator header), `ScreenHeader`, `IconButton`, `SettingsButton`, `TagPill`, restyled `Button` (+ `secondary`) and `Card`. `ScreenHeading` = deprecated alias.
- `src/components/Icon.tsx` — added clock, alert-circle, arrow-up-right, play-circle, info, list, shield.
- `src/components/TabBar.tsx` + `src/app/(tabs)/_layout.tsx` — custom 3-zone bar (schedule · index/Snap · tasks); Settings removed from tabs.
- `src/app/_layout.tsx` — root Stack registers `review` (push) and `settings` (modal); loads Be Vietnam Pro 800.
- `src/app/settings.tsx` — moved out of `(tabs)` (content not yet restyled). `src/components/AppHeader.tsx` deleted.
- `src/app/review.tsx` — **placeholder** screen.
- `src/lib/storage.ts` — `/settings` is no longer a restorable tab; `/settings` and `/review` aren't saved as last tab.
- `src/state/AppStore.tsx` — `reviewCount`; `runExtraction()` now resolves to `{ added, needsReview } | null`; batch `resolveClarifications(choices)`; scan toast no longer shows seconds/model id.

Typecheck, lint and the 27 unit tests pass. **Not yet run on web/device.**

## Remaining work (planned as independent units — disjoint files)
| Unit | Files | Notes |
|---|---|---|
| Lịch | `src/app/(tabs)/schedule.tsx` | `Screen` + `ScreenHeader` ("Lịch tuần", date + session count; right: + Thêm lịch, Xuất .ics, `SettingsButton`). Date-chip strip (Tất cả ∞ / Nay / weekdays, dot = has sessions, active chip brand fill + glow). Session cards: 4px left accent (coral when urgent), clock + time range · minutes, `TagPill`, footer with deadline + "Google Calendar ↗". Keep add-sheet, manual `TaskSheet`, .ics export, fixed events. |
| Snap | `src/app/(tabs)/index.tsx` | "Quét thông báo": dashed brand upload card (library + camera), 72pt thumbnails with ✕, primary "Trích xuất & Tự động xếp lịch", shimmer card while reading (no seconds/KB). Keep presets, handwriting challenge (FR-5.2), demo notice. On success: `needsReview > 0` → `router.push('/review')`, else `router.navigate('/schedule')`. |
| Smart Review | `src/app/review.tsx` | "Kiểm tra hạn chót": banner + "✓ Đồng ý tất cả & Xếp vào lịch" → `resolveClarifications`, then go to `/schedule`. Per item: title, source quote, toggle-pill group, "Khuyên dùng" on the preselected option. Preselect the **earliest still-future** option (safest for a deadline — the model gives no recommendation; the old v2 snapshot used the last option). Items with no options → "Chọn ngày giờ" opens the task editor. Empty state when nothing to review. |
| Đầu việc | `src/app/(tabs)/tasks.tsx`, `src/components/TaskSheet.tsx`, `DeadlineField*.tsx` | Header "Đầu việc" (N cần làm · M đã xong; right: + and gear). Replace inline amber clarify cards with a banner "N hạn chót cần kiểm tra →" → `/review`. Rows: checkbox, title, deadline line coloured coral (urgent) / amber (soon) / muted, done = faded + strikethrough. Tap row = edit; move delete into `TaskSheet`. Keep `TaskSheet` props backward compatible (Lịch uses it). |
| Settings | `src/app/settings.tsx`, `FreeSlotList.tsx`, `SlotSheet.tsx`, `BottomSheet.tsx`, `TimeField*.tsx`, `Toast.tsx` | Sheet look: handle, "Cài đặt & Giờ rảnh", ✕ → `router.back()`, safe-area. Sections: Khung giờ rảnh, Gemini status (built-in key — no key input on this branch), Dữ liệu cục bộ. Restyle `BottomSheet` to v2 (28pt top radius, handle, slate overlay) without changing its API. May switch `settings` presentation to `formSheet` in `_layout.tsx` after checking SDK 58 docs. |
| Brand | `mobile/assets/*.png`, `app.json` (icon/splash/adaptiveIcon/favicon), new `src/components/LogoMark.tsx` | Apply new logo mark (viewfinder corners + calendar pad). The branch's adaptive icon **clips the corner brackets** in circular masks (see `assets/brand/preview-adaptive-comparison.png`) — regenerate the foreground so the whole mark fits the 66% safe circle. Splash background → `#f8fafc` to match the app canvas. |

## Rules for whoever continues
- Use theme tokens; no new hard-coded hex unless no token fits.
- **No new native dependencies** (APK receives JS-only fixes via EAS Update — see `10_Huong_dan_Build_APK_EAS.md`). Gradients via `react-native-svg`, animation via RN `Animated`.
- Every pressable: `role` + `accessibilityLabel`, ≥36pt target. Must work on Android, iOS and web.
- Verify from `mobile/`: `npm run typecheck`, `npx expo lint`, `npm test`; quick visual check with `npx expo start --web`.
