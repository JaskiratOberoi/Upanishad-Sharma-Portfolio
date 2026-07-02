#!/usr/bin/env python3
"""Generate Upanishad Sharma's resume PDF in the portfolio site's editorial style."""

from fpdf import FPDF

import os
HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "..", "assets", "Upanishad-Sharma-Resume.pdf")

PAPER = (247, 244, 238)
PAPER_DEEP = (239, 234, 224)
INK = (25, 23, 20)
INK_SOFT = (85, 80, 74)
INK_FAINT = (138, 132, 123)
ACCENT = (200, 64, 31)
RULE = (215, 210, 200)

W, H = 215.9, 279.4  # US Letter in mm
M = 16               # margin

pdf = FPDF(unit="mm", format="Letter")
pdf.set_auto_page_break(False)
pdf.add_font("Fraunces", "", f"{FONTS}/fraunces-600.ttf")
pdf.add_font("Fraunces", "B", f"{FONTS}/fraunces-700.ttf")
pdf.add_font("Fraunces", "I", f"{FONTS}/fraunces-italic.ttf")
pdf.add_font("Inter", "", f"{FONTS}/inter-400.ttf")
pdf.add_font("Inter", "B", f"{FONTS}/inter-600.ttf")
pdf.add_font("Mono", "", f"{FONTS}/mono-500.ttf")

pdf.add_page()
pdf.set_fill_color(*PAPER)
pdf.rect(0, 0, W, H, "F")

y = M + 2

# ---------- Masthead ----------
pdf.set_xy(M, y)
pdf.set_font("Fraunces", "B", 27)
pdf.set_text_color(*INK)
pdf.cell(0, 10, "Upanishad Sharma")

# small "US" mark top right
pdf.set_xy(W - M - 20, y + 1)
pdf.set_font("Fraunces", "B", 15)
pdf.set_text_color(*INK)
pdf.cell(6, 7, "U")
pdf.set_text_color(*ACCENT)
pdf.cell(6, 7, "S")

y += 12
pdf.set_xy(M, y)
pdf.set_font("Mono", "", 8.2)
pdf.set_text_color(*ACCENT)
pdf.cell(0, 5, "T E C H N O L O G Y   &   G A M I N G   J O U R N A L I S T   ·   E D I T O R I A L   S T R A T E G I S T")

y += 7
pdf.set_xy(M, y)
pdf.set_font("Inter", "", 8.4)
pdf.set_text_color(*INK_SOFT)
contact = "+91 95600 34930      upanishadsharma97@gmail.com      linkedin.com/in/u-sharma-      beebom.com/author/upanishad5574"
pdf.cell(0, 5, contact)
# clickable links over the email / linkedin / archive segments
pdf.link(M + 38, y, 52, 5, "mailto:upanishadsharma97@gmail.com")
pdf.link(M + 95, y, 45, 5, "https://www.linkedin.com/in/u-sharma-")
pdf.link(M + 145, y, 52, 5, "https://beebom.com/author/upanishad5574/")

y += 8.5
pdf.set_draw_color(*INK)
pdf.set_line_width(0.7)
pdf.line(M, y, W - M, y)

# ---------- Summary ----------
y += 4.5
pdf.set_xy(M, y)
pdf.set_font("Inter", "", 9.2)
pdf.set_text_color(*INK_SOFT)
summary = (
    "Technology and gaming journalist with 5+ years and 950+ bylined stories across breaking news, product "
    "launches, reviews, and opinion. Reported on OpenAI's leadership crisis, Google's Gemini launch, and the "
    "GTA 6 leak as they broke. As Gaming Editor at Beebom, grew the section to 50M+ monthly views - the "
    "most-read on the site - and was one of the first writers growing its AI coverage. Combines hands-on reporting with data-driven "
    "editorial strategy, SEO, and team leadership. Currently freelancing while pursuing full-time editorial roles."
)
pdf.multi_cell(W - 2 * M, 4.4, summary)
y = pdf.get_y()

# ---------- Stats strip ----------
y += 3.5
strip_h = 15
pdf.set_fill_color(*PAPER_DEEP)
pdf.rect(M, y, W - 2 * M, strip_h, "F")
stats = [
    ("50M+", "monthly views led"),
    ("950+", "bylined stories"),
    ("600K", "views in 3 days, first AI piece"),
    ("6", "writers mentored & led"),
]
col_w = (W - 2 * M) / 4
for i, (num, label) in enumerate(stats):
    x = M + i * col_w
    if i > 0:
        pdf.set_draw_color(*RULE)
        pdf.set_line_width(0.25)
        pdf.line(x, y + 2.5, x, y + strip_h - 2.5)
    pdf.set_xy(x, y + 2.6)
    pdf.set_font("Fraunces", "B", 13.5)
    pdf.set_text_color(*INK)
    pdf.cell(col_w, 6, num, align="C")
    pdf.set_xy(x + 1, y + 9)
    pdf.set_font("Inter", "", 6.7)
    pdf.set_text_color(*INK_FAINT)
    pdf.cell(col_w - 2, 4, label, align="C")
y += strip_h


def section_heading(title, yy):
    pdf.set_xy(M, yy)
    pdf.set_font("Mono", "", 8.2)
    pdf.set_text_color(*ACCENT)
    pdf.cell(0, 5, title.upper())
    yy += 5.6
    pdf.set_draw_color(*RULE)
    pdf.set_line_width(0.3)
    pdf.line(M, yy, W - M, yy)
    return yy + 3


def role(yy, title, org, dates, bullets):
    pdf.set_xy(M, yy)
    pdf.set_font("Fraunces", "", 11.4)
    pdf.set_text_color(*INK)
    pdf.cell(pdf.get_string_width(title) + 2, 6, title)
    pdf.set_font("Inter", "B", 8.2)
    pdf.set_text_color(*ACCENT)
    pdf.cell(0, 5.6, f"·  {org}")
    pdf.set_xy(M, yy)
    pdf.set_font("Mono", "", 7.6)
    pdf.set_text_color(*INK_FAINT)
    pdf.cell(W - 2 * M, 6, dates, align="R")
    yy += 6.2
    pdf.set_font("Inter", "", 8.8)
    for b in bullets:
        pdf.set_xy(M + 1.5, yy)
        pdf.set_text_color(*ACCENT)
        pdf.cell(3.5, 4.3, "-")
        pdf.set_text_color(*INK_SOFT)
        pdf.set_xy(M + 5.5, yy)
        pdf.multi_cell(W - 2 * M - 6.5, 4.3, b)
        yy = pdf.get_y() + 0.4
    return yy + 1.6


# ---------- Experience ----------
y += 5.5
y = section_heading("Experience", y)

y = role(y, "Freelance Technology & Gaming Writer", "Tech Nerdiness, Remote", "Jul 2025 - Present", [
    "Write technology and gaming news, reviews, and explainers as an independent contributor, managing pitches and deadlines across multiple outlets.",
])

y = role(y, "Gaming Editor", "Beebom Media, Noida", "Jan 2024 - Jul 2025", [
    "Led the gaming category to 50M+ monthly views, making it the most-viewed section on the site; grew Fortnite coverage from 10K to 250K+ monthly views and launched NYT Connections coverage to 2M+ views from inception.",
    "Built and led a team of six writers while continuing to publish reviews, news, and features personally - including industry analysis tracing GTA 6's delay to Take-Two's earnings-call commentary and personal-voice opinion pieces on consumer gaming issues.",
    "Planned and edited coverage of major releases (Elden Ring Nightreign, Starfield, Doom: The Dark Ages) for accuracy and voice.",
])

y = role(y, "Operations & AI Strategist", "Beebom Media, Noida", "Mar 2023 - Dec 2023", [
    "One of the first writers on Beebom's AI coverage, playing a major role in growing it into a core editorial beat; reported on OpenAI's removal of Sam Altman and Google's Gemini launch as they broke - first major AI piece drew 600K views in 3 days.",
    "Led company-wide OKR implementation and partnered with leadership on long-term content and growth strategy.",
])

y = role(y, "Researcher & Technology Writer", "Beebom Media, Noida", "May 2021 - Mar 2023", [
    "Wrote hands-on hardware reviews (Lenovo Legion 5i Pro, MSI Raider GE67 HX, GoPro Hero 11 Black) and covered early generative AI as it launched (GPT-4, Google Bard, Bing AI).",
    "Drove research and topic strategy for a YouTube vertical with 3M+ subscribers, directly informing scripting decisions.",
])

y = role(y, "Co-Founder & Entertainment Editor", "The Envoy Web", "Jan 2019 - May 2021", [
    "Co-founded an entertainment publication and grew it to 5M+ views, leading content strategy and editorial planning.",
])

# ---------- Education / Skills two-column ----------
y += 1
col2_x = M + (W - 2 * M) * 0.52 + 6
y_start = section_heading("Education", y)

pdf.set_xy(M, y_start)
pdf.set_font("Inter", "B", 8.8)
pdf.set_text_color(*INK)
pdf.cell(0, 4.6, "MA, Multimedia Journalism (Print & Online)")
pdf.set_xy(M, y_start + 4.6)
pdf.set_font("Inter", "", 8)
pdf.set_text_color(*INK_FAINT)
pdf.cell(0, 4.2, "University of Westminster, London - 2018-2019")

pdf.set_xy(M, y_start + 10.2)
pdf.set_font("Inter", "B", 8.8)
pdf.set_text_color(*INK)
pdf.cell(0, 4.6, "BA, Journalism & Mass Communication")
pdf.set_xy(M, y_start + 14.8)
pdf.set_font("Inter", "", 8)
pdf.set_text_color(*INK_FAINT)
pdf.cell(0, 4.2, "Amity University, Noida - 2015-2018")

pdf.set_xy(M, y_start + 21.5)
pdf.set_font("Mono", "", 7.4)
pdf.set_text_color(*INK_SOFT)
pdf.cell(0, 4.2, "LANGUAGES:  English · Hindi (proficient) · French (A2)")

# skills column (heading drawn manually so the rule spans only this column)
pdf.set_xy(col2_x, y_start - 8.6)
pdf.set_font("Mono", "", 8.2)
pdf.set_text_color(*ACCENT)
pdf.cell(0, 5, "SKILLS")
pdf.set_draw_color(*RULE)
pdf.set_line_width(0.3)
pdf.line(col2_x, y_start - 3, W - M, y_start - 3)

skills = [
    ("Writing & Reporting", "Breaking news, hardware & game reviews, features, explainers, opinion"),
    ("Editorial & Growth", "Content strategy, SEO, editing, OKR implementation, team management"),
    ("Tools", "WordPress, Semrush, Keyword Planner, Asana, Canva"),
]
sy = y_start
for label, val in skills:
    pdf.set_xy(col2_x, sy)
    pdf.set_font("Inter", "B", 8.4)
    pdf.set_text_color(*INK)
    pdf.cell(0, 4.4, label)
    pdf.set_xy(col2_x, sy + 4.2)
    pdf.set_font("Inter", "", 7.8)
    pdf.set_text_color(*INK_SOFT)
    pdf.multi_cell(W - M - col2_x, 3.8, val)
    sy = pdf.get_y() + 1.2

# ---------- Footer ----------
fy = H - 9
pdf.set_draw_color(*RULE)
pdf.set_line_width(0.3)
pdf.line(M, fy - 3, W - M, fy - 3)
pdf.set_xy(M, fy - 1)
pdf.set_font("Mono", "", 7)
pdf.set_text_color(*INK_FAINT)
pdf.cell(W - 2 * M, 4, "Full portfolio, clips & 950+ story archive  ->  beebom.com/author/upanishad5574", align="C")
pdf.link(M, fy - 1, W - 2 * M, 4, "https://beebom.com/author/upanishad5574/")

import os
os.makedirs(os.path.dirname(OUT), exist_ok=True)
pdf.output(OUT)
print("wrote", OUT)
