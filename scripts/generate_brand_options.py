import os
import subprocess

out_dir = os.path.abspath('assets/brand')
os.makedirs(out_dir, exist_ok=True)

# OPTION 1: "Khung chụp tối giản ôm ô ngày" (Focus Frame & Day Grid - Priority Direction)
# Pure, robust flat geometry: 4 viewfinder corner brackets framing a clean calendar day card.
# The calendar card has a distinctive header divider (negative space) and a central scheduled date cell.
opt1_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <!-- Viewfinder Frame (Snap) -->
  <g fill="none" stroke="currentColor" stroke-width="72" stroke-linecap="round" stroke-linejoin="round">
    <!-- Top-Left -->
    <path d="M 320 192 L 208 192 A 16 16 0 0 0 192 208 L 192 320"/>
    <!-- Top-Right -->
    <path d="M 704 192 L 816 192 A 16 16 0 0 1 832 208 L 832 320"/>
    <!-- Bottom-Left -->
    <path d="M 192 704 L 192 816 A 16 16 0 0 0 208 832 L 320 832"/>
    <!-- Bottom-Right -->
    <path d="M 832 704 L 832 816 A 16 16 0 0 1 816 832 L 704 832"/>
  </g>
  
  <!-- Calendar Pad Base (Plan) -->
  <rect x="296" y="296" width="432" height="432" rx="64" fill="currentColor"/>
  
  <!-- Negative Space: Header Divider Gap -->
  <rect x="296" y="416" width="432" height="32" fill="#F5F5F7" class="neg-space"/>
  
  <!-- Negative Space: Central Target Date Block / Active Day Window -->
  <rect x="424" y="504" width="176" height="136" rx="28" fill="#F5F5F7" class="neg-space"/>
</svg>'''

# OPTION 2: "Tờ ảnh thu gọn vào mục lịch" (Photo Sheet to Timeline Slot)
# An image frame (45-degree folded corner / landscape photo ratio) descending into a structured calendar time-slot block.
opt2_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <!-- Top Photo Card (Source Notification Photo) -->
  <path d="M 240 220 L 640 220 L 784 364 L 784 520 L 240 520 Z" fill="none" stroke="currentColor" stroke-width="64" stroke-linejoin="round" stroke-linecap="round"/>
  <!-- Folded Dog-ear Corner of Photo -->
  <path d="M 640 220 L 640 364 L 784 364" fill="none" stroke="currentColor" stroke-width="64" stroke-linejoin="round" stroke-linecap="round"/>
  <!-- Focus / Capture indicator inside photo -->
  <circle cx="440" cy="370" r="48" fill="currentColor"/>
  
  <!-- Bottom Calendar Slot (Structured Work Block) -->
  <rect x="240" y="600" width="544" height="204" rx="44" fill="currentColor"/>
  <!-- Time slot accent (negative space) -->
  <rect x="300" y="664" width="160" height="76" rx="20" fill="#F5F5F7" class="neg-space"/>
  <rect x="500" y="682" width="220" height="40" rx="20" fill="#F5F5F7" class="neg-space"/>
</svg>'''

# OPTION 3: "Chữ P tạo bởi khung chụp và mốc thời gian" (Letter P formed by Framing Bracket & Time Pin)
# Upper-left bracket forms the stem and top shoulder of 'P', coupled with a time pin/dot completing the loop.
opt3_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <!-- Vertical Stem & Top Framing Shoulder -->
  <path d="M 320 832 L 320 256 A 64 64 0 0 1 384 192 L 600 192" fill="none" stroke="currentColor" stroke-width="84" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Loop of P with Calendar Focus Pin -->
  <path d="M 600 192 C 730 192 780 280 780 380 C 780 480 730 568 600 568 L 320 568" fill="none" stroke="currentColor" stroke-width="84" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Clock / Pin marker inside the P loop -->
  <circle cx="560" cy="380" r="56" fill="currentColor"/>
  <!-- Bottom focus bracket marker -->
  <path d="M 720 720 L 800 720 A 16 16 0 0 1 816 736 L 816 816" fill="none" stroke="currentColor" stroke-width="64" stroke-linecap="round" stroke-linejoin="round"/>
</svg>'''

with open(os.path.join(out_dir, 'symbol_opt1.svg'), 'w', encoding='utf-8') as f:
    f.write(opt1_svg)
with open(os.path.join(out_dir, 'symbol_opt2.svg'), 'w', encoding='utf-8') as f:
    f.write(opt2_svg)
with open(os.path.join(out_dir, 'symbol_opt3.svg'), 'w', encoding='utf-8') as f:
    f.write(opt3_svg)

print('3 Symbol SVG files created.')
