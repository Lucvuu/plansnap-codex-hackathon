"""
Generate PlanSnap Brand Identity Assets
Includes:
- Concept 1 (Primary): Minimalist Viewfinder embracing Calendar Date Block
- Concept 2: Photo sheet collapsing into calendar slot
- Concept 3: P-mark fused with viewfinder & date pin
- Master Icon, Wordmark, Lockup, Monochrome
- Android Adaptive Icon (Foreground, Background, Monochrome)
- Splash Icon, Favicon
- High-res PNGs (1024x1024, 512x512, 192x192, 48x48, 24x24)
"""
import os
import math
from PIL import Image, ImageDraw, ImageFont

BRAND_DIR = os.path.abspath("design/brand")
os.makedirs(BRAND_DIR, exist_ok=True)

# SVG Definitions
SVG_CONCEPT_1 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="psBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <linearGradient id="psSurface" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F8FAFC"/>
    </linearGradient>
    <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#1E3A8A" flood-opacity="0.18"/>
    </filter>
  </defs>

  <!-- Viewfinder Frame (Snap) -->
  <!-- Top-Left -->
  <path d="M 160 108 L 124 108 A 20 20 0 0 0 104 128 L 104 164" fill="none" stroke="#2563EB" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Top-Right -->
  <path d="M 352 108 L 388 108 A 20 20 0 0 1 408 128 L 408 164" fill="none" stroke="#2563EB" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Bottom-Left -->
  <path d="M 104 348 L 104 384 A 20 20 0 0 0 124 404 L 160 404" fill="none" stroke="#2563EB" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Bottom-Right -->
  <path d="M 408 348 L 408 384 A 20 20 0 0 1 388 404 L 352 404" fill="none" stroke="#2563EB" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Calendar Date Block (Plan) -->
  <g filter="url(#subtleShadow)">
    <!-- Binder Loops -->
    <rect x="196" y="146" width="18" height="34" rx="9" fill="#1D4ED8"/>
    <rect x="298" y="146" width="18" height="34" rx="9" fill="#1D4ED8"/>

    <!-- Calendar Body -->
    <rect x="150" y="166" width="212" height="188" rx="24" fill="url(#psSurface)" stroke="#E2E8F0" stroke-width="4"/>

    <!-- Calendar Header Stripe -->
    <path d="M 152 190 A 22 22 0 0 1 174 168 L 338 168 A 22 22 0 0 1 360 190 L 360 216 L 152 216 Z" fill="url(#psBlue)"/>

    <!-- Schedule Grid / Checkmark Marker -->
    <!-- Small schedule dots/bars -->
    <rect x="184" y="240" width="38" height="12" rx="6" fill="#93C5FD"/>
    <rect x="234" y="240" width="94" height="12" rx="6" fill="#E2E8F0"/>
    
    <!-- Scheduled Event Block (Confirmed - Green) -->
    <rect x="184" y="266" width="144" height="48" rx="12" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="2"/>
    <circle cx="208" cy="290" r="10" fill="#059669"/>
    <!-- Checkmark inside event -->
    <path d="M 203 290 L 207 294 L 214 286" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="228" y="284" width="82" height="12" rx="6" fill="#059669" fill-opacity="0.85"/>
  </g>
</svg>'''

SVG_CONCEPT_1_FLAT_APP = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Viewfinder Brackets -->
  <path d="M 164 104 L 124 104 A 20 20 0 0 0 104 124 L 104 164" fill="none" stroke="#2563EB" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 348 104 L 388 104 A 20 20 0 0 1 408 124 L 408 164" fill="none" stroke="#2563EB" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 104 348 L 104 388 A 20 20 0 0 0 124 408 L 164 408" fill="none" stroke="#2563EB" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 408 348 L 408 388 A 20 20 0 0 1 388 408 L 348 408" fill="none" stroke="#2563EB" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Calendar Body -->
  <rect x="156" y="160" width="200" height="192" rx="26" fill="#2563EB"/>
  
  <!-- Binder Rings -->
  <rect x="204" y="140" width="18" height="32" rx="9" fill="#1D4ED8"/>
  <rect x="290" y="140" width="18" height="32" rx="9" fill="#1D4ED8"/>

  <!-- Inner Calendar Grid cutout -->
  <rect x="174" y="212" width="164" height="122" rx="16" fill="#FFFFFF"/>

  <!-- Date Grid / Time slot elements -->
  <rect x="190" y="232" width="56" height="12" rx="6" fill="#BFDBFE"/>
  <rect x="254" y="232" width="66" height="12" rx="6" fill="#EFF6FF"/>
  
  <!-- Confirmed slot in Green -->
  <rect x="190" y="258" width="132" height="42" rx="10" fill="#059669"/>
  <!-- Checkmark -->
  <path d="M 212 278 L 220 286 L 236 270" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="248" y="274" width="60" height="10" rx="5" fill="#A7F3D0"/>
</svg>'''

# Concept 2: Photo card collapsing into calendar slot
SVG_CONCEPT_2 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Top: Photo sheet / Notice snapshot with mountain/sun glyph -->
  <rect x="136" y="96" width="240" height="160" rx="18" fill="#EFF6FF" stroke="#2563EB" stroke-width="18"/>
  <!-- Photo image symbol -->
  <circle cx="196" cy="150" r="18" fill="#3B82F6"/>
  <path d="M 160 216 L 220 168 L 270 204 L 310 178 L 352 216 Z" fill="#93C5FD"/>
  <!-- Downward transfer beam / arrow indicating capture-to-calendar -->
  <path d="M 256 268 L 256 296 M 244 284 L 256 296 L 268 284" fill="none" stroke="#2563EB" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Bottom: Calendar slot -->
  <rect x="136" y="316" width="240" height="100" rx="18" fill="#2563EB"/>
  <rect x="160" y="344" width="44" height="44" rx="10" fill="#FFFFFF"/>
  <path d="M 172 366 L 178 372 L 192 358" fill="none" stroke="#059669" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="220" y="348" width="130" height="14" rx="7" fill="#FFFFFF"/>
  <rect x="220" y="372" width="80" height="12" rx="6" fill="#93C5FD"/>
</svg>'''

# Concept 3: Letter P combined with Viewfinder bracket and Time Pin
SVG_CONCEPT_3 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Left vertical stem acting as calendar timeline with hour tick marks -->
  <rect x="128" y="104" width="36" height="304" rx="18" fill="#2563EB"/>
  <!-- Hour tick markers -->
  <circle cx="146" cy="170" r="6" fill="#FFFFFF"/>
  <circle cx="146" cy="256" r="6" fill="#FFFFFF"/>
  <circle cx="146" cy="342" r="6" fill="#FFFFFF"/>
  <!-- Upper loop of P forming camera viewfinder frame embracing date target -->
  <path d="M 164 104 L 320 104 A 78 78 0 0 1 320 260 L 164 260" fill="none" stroke="#2563EB" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Focus viewfinder corner inside the P loop -->
  <path d="M 280 152 L 310 152 A 12 12 0 0 1 322 164 L 322 194" fill="none" stroke="#60A5FA" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Center scheduled pin / dot -->
  <circle cx="240" cy="182" r="28" fill="#059669"/>
  <path d="M 230 182 L 237 189 L 251 175" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>'''

# Full Horizontal Wordmark Lockup SVG
SVG_WORDMARK_HORIZONTAL = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 200" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@600;700;800&amp;display=swap');
      .brand-title {
        font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-weight: 800;
        font-size: 86px;
        letter-spacing: -2px;
      }
      .brand-plan { fill: #111827; }
      .brand-snap { fill: #2563EB; }
      .brand-tagline {
        font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-weight: 500;
        font-size: 22px;
        fill: #4B5563;
        letter-spacing: 0.5px;
      }
    </style>
  </defs>

  <!-- Logo Icon scaled down to 140x140 at (20, 30) -->
  <g transform="translate(20, 24) scale(0.3)">
    <!-- Viewfinder Brackets -->
    <path d="M 164 104 L 124 104 A 20 20 0 0 0 104 124 L 104 164" fill="none" stroke="#2563EB" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 348 104 L 388 104 A 20 20 0 0 1 408 124 L 408 164" fill="none" stroke="#2563EB" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 104 348 L 104 388 A 20 20 0 0 0 124 408 L 164 408" fill="none" stroke="#2563EB" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 408 348 L 408 388 A 20 20 0 0 1 388 408 L 348 408" fill="none" stroke="#2563EB" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Calendar Body -->
    <rect x="156" y="160" width="200" height="192" rx="26" fill="#2563EB"/>
    <rect x="204" y="140" width="18" height="32" rx="9" fill="#1D4ED8"/>
    <rect x="290" y="140" width="18" height="32" rx="9" fill="#1D4ED8"/>
    <rect x="174" y="212" width="164" height="122" rx="16" fill="#FFFFFF"/>
    <rect x="190" y="232" width="56" height="12" rx="6" fill="#BFDBFE"/>
    <rect x="254" y="232" width="66" height="12" rx="6" fill="#EFF6FF"/>
    <rect x="190" y="258" width="132" height="42" rx="10" fill="#059669"/>
    <path d="M 212 278 L 220 286 L 236 270" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="248" y="274" width="60" height="10" rx="5" fill="#A7F3D0"/>
  </g>

  <!-- Typography -->
  <text x="186" y="112" class="brand-title">
    <tspan class="brand-plan">Plan</tspan><tspan class="brand-snap">Snap</tspan>
  </text>
  <text x="188" y="152" class="brand-tagline">Từ ảnh thông báo đến lịch làm việc có thể kiểm tra</text>
</svg>'''

# Monochrome Version (Black on White / White on Black)
SVG_MONOCHROME_BLACK = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Viewfinder Brackets -->
  <path d="M 164 104 L 124 104 A 20 20 0 0 0 104 124 L 104 164" fill="none" stroke="#111827" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 348 104 L 388 104 A 20 20 0 0 1 408 124 L 408 164" fill="none" stroke="#111827" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 104 348 L 104 388 A 20 20 0 0 0 124 408 L 164 408" fill="none" stroke="#111827" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 408 348 L 408 388 A 20 20 0 0 1 388 408 L 348 408" fill="none" stroke="#111827" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Calendar Body -->
  <rect x="156" y="160" width="200" height="192" rx="26" fill="#111827"/>
  <rect x="204" y="140" width="18" height="32" rx="9" fill="#111827"/>
  <rect x="290" y="140" width="18" height="32" rx="9" fill="#111827"/>
  <rect x="174" y="212" width="164" height="122" rx="16" fill="#FFFFFF"/>
  <rect x="190" y="232" width="130" height="12" rx="6" fill="#E5E7EB"/>
  <rect x="190" y="258" width="132" height="42" rx="10" fill="#111827"/>
  <path d="M 212 278 L 220 286 L 236 270" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="248" y="274" width="60" height="10" rx="5" fill="#FFFFFF"/>
</svg>'''

# Android Adaptive Icon Foreground (432x432 canvas with 288x288 safe area / 66dp radius circle in center)
SVG_ANDROID_FOREGROUND = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="100%" height="100%">
  <!-- Safe zone is centered at (216, 216) with radius 144 (diameter 288) -->
  <!-- White icon elements designed to sit on #2563EB background -->
  <g transform="translate(216, 216) scale(0.62) translate(-256, -256)">
    <!-- Viewfinder Brackets in Crisp White -->
    <path d="M 164 104 L 124 104 A 20 20 0 0 0 104 124 L 104 164" fill="none" stroke="#FFFFFF" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 348 104 L 388 104 A 20 20 0 0 1 408 124 L 408 164" fill="none" stroke="#FFFFFF" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 104 348 L 104 388 A 20 20 0 0 0 124 408 L 164 408" fill="none" stroke="#FFFFFF" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 408 348 L 408 388 A 20 20 0 0 1 388 408 L 348 408" fill="none" stroke="#FFFFFF" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Calendar Body in White Card -->
    <rect x="156" y="160" width="200" height="192" rx="26" fill="#FFFFFF"/>
    
    <!-- Binder Loops -->
    <rect x="204" y="136" width="18" height="34" rx="9" fill="#FFFFFF"/>
    <rect x="290" y="136" width="18" height="34" rx="9" fill="#FFFFFF"/>

    <!-- Calendar Header inside card -->
    <path d="M 156 186 A 26 26 0 0 1 182 160 L 330 160 A 26 26 0 0 1 356 186 L 356 206 L 156 206 Z" fill="#1D4ED8"/>

    <!-- Schedule Lines -->
    <rect x="182" y="226" width="60" height="12" rx="6" fill="#93C5FD"/>
    <rect x="250" y="226" width="78" height="12" rx="6" fill="#E2E8F0"/>
    
    <!-- Confirmed green badge in calendar -->
    <rect x="182" y="256" width="148" height="50" rx="12" fill="#059669"/>
    <path d="M 206 280 L 214 288 L 230 272" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="242" y="276" width="74" height="12" rx="6" fill="#A7F3D0"/>
  </g>
</svg>'''

SVG_ANDROID_BACKGROUND = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="100%" height="100%">
  <rect width="432" height="432" fill="#2563EB"/>
</svg>'''

SVG_ANDROID_MONOCHROME = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="100%" height="100%">
  <!-- Adaptive Monochrome for Android Themed Icons -->
  <g transform="translate(216, 216) scale(0.62) translate(-256, -256)">
    <path d="M 164 104 L 124 104 A 20 20 0 0 0 104 124 L 104 164" fill="none" stroke="#000000" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 348 104 L 388 104 A 20 20 0 0 1 408 124 L 408 164" fill="none" stroke="#000000" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 104 348 L 104 388 A 20 20 0 0 0 124 408 L 164 408" fill="none" stroke="#000000" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 408 348 L 408 388 A 20 20 0 0 1 388 408 L 348 408" fill="none" stroke="#000000" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>

    <rect x="156" y="160" width="200" height="192" rx="26" fill="#000000"/>
    <rect x="174" y="212" width="164" height="122" rx="16" fill="#FFFFFF"/>
    <rect x="190" y="232" width="130" height="12" rx="6" fill="#CCCCCC"/>
    <rect x="190" y="258" width="132" height="42" rx="10" fill="#000000"/>
    <path d="M 212 278 L 220 286 L 236 270" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>'''

# Save SVGs
files_to_save = {
    "concept-1-primary.svg": SVG_CONCEPT_1,
    "concept-1-flat.svg": SVG_CONCEPT_1_FLAT_APP,
    "concept-2-sheet.svg": SVG_CONCEPT_2,
    "concept-3-pmark.svg": SVG_CONCEPT_3,
    "plansnap-logo-mark.svg": SVG_CONCEPT_1_FLAT_APP,
    "plansnap-wordmark-horizontal.svg": SVG_WORDMARK_HORIZONTAL,
    "plansnap-monochrome.svg": SVG_MONOCHROME_BLACK,
    "android-icon-foreground.svg": SVG_ANDROID_FOREGROUND,
    "android-icon-background.svg": SVG_ANDROID_BACKGROUND,
    "android-icon-monochrome.svg": SVG_ANDROID_MONOCHROME,
}

for name, content in files_to_save.items():
    p = os.path.join(BRAND_DIR, name)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Saved SVG: {p}")

print("SVGs successfully written.")
