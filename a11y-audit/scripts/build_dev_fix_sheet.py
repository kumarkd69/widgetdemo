"""Build the single-sheet developer action list for the WCAG 2.2 AA audit.

Dev actions only: every row is something a developer does in this codebase.
Manual QA (keyboard walk, screen-reader pass, reflow testing) is deliberately
not here - it lives in MANUAL_TEST_PLAN.md.

No formulas by design: this is a checklist, not a model, and LibreOffice could
not complete a recalculation in the build environment, so a progress counter
would have shipped with no cached value and no way to verify it.
"""

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation

OUT = "/home/user/widgetdemo/a11y-audit/TOT_Dev_Fix_Sheet.xlsx"

FONT = "Arial"
MONO = "Consolas"
NAVY = "164291"
INK = "171717"
GREY = "525252"

HDR_FILL = PatternFill("solid", fgColor=NAVY)
BAND = PatternFill("solid", fgColor="FAFAFA")
thin = Side(style="thin", color="D4D4D4")
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)

HEADERS = ["#", "What to change", "Find / current", "Replace / new",
           "Where", "WCAG", "Effort", "Status", "Note"]

# what, find, replace, where, wcag, effort, note
ROWS = [
    ("Grey text",
     "#A3A3A3", "#767676",
     "Tailwind classes: text-[#A3A3A3], text-[#a3a3a3]",
     "1.4.3", "1 hr",
     "174 elements, 31 pages. Case-insensitive find and replace. 2.52:1 -> 4.54:1. Biggest win here, no visual risk."),

    ("Functional border",
     "#e5e5e5", "#737373",
     "--border-primary",
     "1.4.11", "30 min",
     "1.26:1 -> 4.74:1. Inputs and control boundaries only. Decorative dividers stay light."),

    ("Strong border",
     "#a3a3a3", "#737373",
     "--border-strong",
     "1.4.11", "10 min",
     "2.52:1 -> 4.74:1."),

    ("Button hover fill",
     "#4398d4", "#2a6fa8",
     "--action-primary-hover",
     "1.4.3", "10 min",
     "3.14:1 -> 5.33:1 against the white label. No label size on this site counts as WCAG large text, so all need 4.5:1."),

    ("Focus ring colour",
     "browser default black", "#2a6fa8",
     "--focus-ring",
     "1.4.11", "10 min",
     "2.22:1 -> 5.33:1. Applied by row 13."),

    ("Focus ring, destructive buttons",
     "#f49898", "#991b1b",
     "--focus-ring-destructive",
     "1.4.11", "10 min",
     "2.14:1 -> 8.31:1. Delete and cancel actions."),

    ("Disabled text",
     "#d4d4d4", "#525252",
     "--text-disabled",
     "1.4.3", "10 min",
     "1.48:1 -> 5.27:1."),

    ("Badge, blue",
     "#3b82f6", "#2563eb",
     "badge background, white label",
     "1.4.3", "15 min",
     "3.68:1 -> 5.17:1."),

    ("Badge, green",
     "#16a34a", "#15803d",
     "badge background, white label",
     "1.4.3", "15 min",
     "3.30:1 -> 5.02:1. Where green is an icon rather than text, leave it."),

    ("Badge, pink",
     "#ec4899", "#be185d",
     "badge background, white label",
     "1.4.3", "15 min",
     "3.53:1 -> 6.04:1."),

    ("Badge, red label",
     "#fce6e7", "#ffffff",
     "label colour on the red badge",
     "1.4.3", "5 min",
     "4.08:1 -> 4.87:1. The red background #e30910 is fine, leave it."),

    ("Input field colours",
     "no shared styles", "see Note",
     "form field styles",
     "1.4.11, 1.4.3", "30 min",
     "Border #737373 / focus ring #164291 2px outside / error border #c2070d / error text #9e1525 / placeholder #525252 / disabled #525252 on #fafafa. Field height 48px. Matches Input- Master in Figma."),

    ("Focus-visible ring",
     "no custom focus style", ":focus-visible { outline: 2px solid #2a6fa8; outline-offset: 2px; }",
     "global stylesheet",
     "1.4.11, 2.4.7", "1 hr",
     "outline-offset is required: without it the ring sits on the button at 1.77:1. Add .btn-destructive:focus-visible { outline-color: #991b1b; }"),

    ("Remove focus suppression",
     "outline: none / outline: 0 / focus:outline-none", "delete, or replace with the row 13 ring",
     "grep the whole codebase",
     "2.4.7", "30 min",
     "Only remove where nothing replaces it."),

    ("Skip to main content",
     "first Tab stop is the cookie banner", '<a href="#main" class="skip-link">Skip to main content</a>',
     "every page, first element in the DOM",
     "2.4.1", "1 hr",
     'Pair with <main id="main" tabindex="-1">. CSS: position:absolute; left:-9999px; z-index:9999; and .skip-link:focus { left:8px; top:8px; }. Must sit before the cookie banner.'),

    ("Landmark elements",
     "generic divs", '<header role="banner"> <nav aria-label="Main"> <main id="main"> <footer role="contentinfo">',
     "site shell",
     "1.3.1", "2 hrs",
     "Row 15 needs this to land anywhere."),

    ("Scrollers reachable by keyboard",
     ".overflow-x-auto with no tabindex", 'tabindex="0" role="region" aria-label="..."',
     "20 regions, 14 pages",
     "2.1.1", "2 hrs",
     "Label each region for its own content, do not reuse one string."),

    ("Route map text alternative",
     "pannable map only", "stop and route data as real text or a table",
     "route map pages",
     "1.1.1, 2.1.1", "varies",
     "If the stop data already exists as text on the page, this is done."),

    ("Heading levels",
     "<h3> with no <h2> above it", "<h2>",
     "4 headings, 2 pages",
     "1.3.1", "30 min",
     "Change the tag only, keep the classes."),

    ("Duplicate alt text",
     'alt="Kensington Palace" / alt="Tower of London"', 'alt=""',
     "attractions listing, 2 images",
     "1.1.1", "10 min",
     "The adjacent heading already names them."),

    ("Decorative illustrations",
     "alt text or missing attribute", 'alt=""',
     "12 illustrations",
     "1.1.1", "15 min",
     'The attribute must be PRESENT and empty. A missing alt makes screen readers announce the filename.'),

    ("Tap target hit areas",
     "icon buttons below minimum", ".icon-btn { min-width:44px; min-height:44px; display:grid; place-items:center; }",
     "~30 icon buttons and carousel arrows",
     "2.5.8", "4 hrs",
     "Grow the hit area, not the icon. No visual change."),

    ("Form error markup",
     "inspect before changing", '<label for> + aria-invalid="true" + aria-describedby + role="alert"',
     "all forms",
     "3.3.1, 4.1.2", "0-4 hrs",
     "May already be correct. Submit a form with invalid data and inspect first. Never signal an error by colour alone."),

    ("Run the contrast verifier",
     "~214 rows flagged but unproven", "node scripts/07_verify_backdrops.js",
     "a11y-audit/local-scan",
     "1.4.3", "30 min",
     "Fix only what comes back REAL_FAIL. Do not change hero heading colours without this: the scanner could not resolve background images and wrongly flagged white text on photos. For text on imagery add a scrim, do not change the text colour."),

    ("Add axe to CI",
     "no automated gate", "npx playwright test a11y.spec.ts",
     "CI, every PR",
     "n/a", "2 hrs",
     "npm i -D @axe-core/playwright, fail the build on any violation. Run against a preview deploy. Pipeline is in a11y-audit/local-scan/."),
]

wb = Workbook()
ws = wb.active
ws.title = "Dev Actions"

ws["A1"] = "Developer actions — theoriginaltour.com"
ws["A1"].font = Font(name=FONT, size=16, bold=True, color=NAVY)
ws["A2"] = ("WCAG 2.2 Level AA. Every value is final — nothing is waiting on a designer. "
            "Work top to bottom; it is ordered by return. Rows 1–12 are colour values, 13–23 are markup and CSS.")
ws["A2"].font = Font(name=FONT, size=10, color=GREY)

ws["A4"] = "Tracking:"
ws["A4"].font = Font(name=FONT, size=10, bold=True)
ws["B4"] = "Set column H as you go. The header row is filterable."
ws["B4"].font = Font(name=FONT, size=10, color=NAVY)

HDR_ROW = 6
first_data_row = HDR_ROW + 1
last_data_row = first_data_row + len(ROWS) - 1

for c, h in enumerate(HEADERS, start=1):
    cell = ws.cell(row=HDR_ROW, column=c, value=h)
    cell.font = Font(name=FONT, size=10, bold=True, color="FFFFFF")
    cell.fill = HDR_FILL
    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cell.border = BOX
ws.row_dimensions[HDR_ROW].height = 26

for i, (what, find, repl, where, wcag, effort, note) in enumerate(ROWS):
    r = first_data_row + i
    for c, v in enumerate([i + 1, what, find, repl, where, wcag, effort, "Not started", note], start=1):
        cell = ws.cell(row=r, column=c, value=v)
        cell.font = Font(name=FONT, size=10, color=INK)
        cell.alignment = Alignment(vertical="top", wrap_text=True)
        cell.border = BOX
        if i % 2 == 1:
            cell.fill = BAND
    ws.cell(row=r, column=1).alignment = Alignment(horizontal="center", vertical="top")
    ws.cell(row=r, column=2).font = Font(name=FONT, size=10, bold=True, color=INK)
    for col in (3, 4):
        ws.cell(row=r, column=col).font = Font(name=MONO, size=9, color=INK)
    ws.cell(row=r, column=9).font = Font(name=FONT, size=9, color=GREY)
    ws.row_dimensions[r].height = 54

dv = DataValidation(type="list", formula1='"Not started,In progress,Blocked,Done,N/A"',
                    allow_blank=False, showErrorMessage=True)
dv.errorTitle = "Pick a status"
dv.error = "Choose one of the listed values."
ws.add_data_validation(dv)
dv.add(f"H{first_data_row}:H{last_data_row}")

for col, w in {"A": 4, "B": 30, "C": 26, "D": 34, "E": 28, "F": 14, "G": 10, "H": 12, "I": 62}.items():
    ws.column_dimensions[col].width = w

ws.freeze_panes = f"A{first_data_row}"
ws.auto_filter.ref = f"A{HDR_ROW}:I{last_data_row}"

wb.save(OUT)
print("written:", OUT, "| dev actions:", len(ROWS))
