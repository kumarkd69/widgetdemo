# Adoption guide (for product teams)

## In one line
Don't build auth screens. Ask the policy engine what to do, render the Taala components it names, report what happened.

## Integration steps
1. **Inventory:** list your auth moments (use the audit matrix rows).
2. **Map:** map each moment to a decision-matrix row; raise an RFC if none fits.
3. **Install:** Taala SDK (Android, iOS, Web) + design library in Figma.
4. **Call:** `POST /v1/auth/decide` before any money movement (see `handoff/api-contract.md`).
5. **Render:** open `AuthSheet(plan)`; don't reorder factors.
6. **Report:** `POST /v1/auth/result` with outcome; engine logs evidence.
7. **Flag:** ship behind `taala_<product>_<moment>` flag with kill switch.
8. **Review:** a11y + content + security checklist; Auth Council sign-off.

## Do / Don't
| Do | Don't |
|---|---|
| Use the explanation string the engine returns | Write your own "for security reasons" copy |
| Keep the whole flow in the Auth Sheet | Push users to a new screen for a fallback |
| Show OTP only when the plan says so | Default to OTP because it's easier |
| Log every attempt via `/result` | Retry factors silently |
| Use Trust Meter at every approval | Colour-code risk your own way |

## Migration checklist (per moment)
- [ ] Row in decision matrix
- [ ] Flag + kill switch
- [ ] Analytics events firing (`metrics.md`)
- [ ] 3 languages reviewed
- [ ] TalkBack/VoiceOver pass
- [ ] Fallback ends in a human route
- [ ] Support runbook updated
- [ ] Compliance evidence sample exported

## Support model
- Platform team owns SDK, components, engine contract. Office hours twice a week; #taala channel; on-call for engine.
- Product teams own their moments and flags.

## Versioning and deprecation
- SemVer for SDK and components. Breaking changes only in majors, with 2 quarters' notice.
- Deprecated components show a lint warning in code and a "Deprecated" badge in Figma for one quarter, then are removed.
- Engine API versioned by path (`/v1`); old versions supported 12 months.
