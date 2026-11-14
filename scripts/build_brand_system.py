import os
import subprocess
from PIL import Image, ImageDraw

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

brand_dir = os.path.abspath('assets/brand')
mobile_assets_dir = os.path.abspath('mobile/assets')
os.makedirs(brand_dir, exist_ok=True)
os.makedirs(mobile_assets_dir, exist_ok=True)

def render_html_to_png(html_str, out_png_path, width=1024, height=1024):
    html_path = out_png_path.replace('.png', '.temp.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_str)
    
    cmd = [
        edge_path,
        '--headless=new',
        '--disable-gpu',
        f'--window-size={width},{height}',
        '--default-background-color=00000000',
        f'--screenshot={os.path.abspath(out_png_path)}',
        f'file:///{os.path.abspath(html_path).replace(os.sep, "/")}'
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    if os.path.exists(html_path):
        os.remove(html_path)

# ==========================================
# 1. DEFINE MATHEMATICAL SVGs FOR 3 OPTIONS
# ==========================================

# OPTION 1 (PRIMARY): Focus Frame & Calendar Day ("Khung chụp tối giản ôm ô ngày")
# Canvas: 1024x1024. Center: (512, 512).
# Viewfinder corners span from 260 to 764 (width 504px, radius to corner is ~252 * 1.414 = 356px max with stroke, fits inside 682px safe zone circle perfectly).
# Calendar pad: 376x376 centered, radius 52. Header gap: 28px. Central day cell: 120x96, radius 20.
svg_opt1_mark_blue = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <g fill="#2563EB">
    <!-- Viewfinder Corner Brackets (Snap) -->
    <!-- Top-Left -->
    <path d="M 264 404 A 28 28 0 0 1 208 404 L 208 304 A 96 96 0 0 1 304 208 L 404 208 A 28 28 0 0 1 404 264 L 312 264 A 48 48 0 0 0 264 312 Z"/>
    <!-- Top-Right -->
    <path d="M 620 208 A 28 28 0 0 1 620 264 L 712 264 A 48 48 0 0 1 760 312 L 760 404 A 28 28 0 0 1 816 404 L 816 304 A 96 96 0 0 0 720 208 Z"/>
    <!-- Bottom-Left -->
    <path d="M 208 620 A 28 28 0 0 1 264 620 L 264 712 A 48 48 0 0 0 312 760 L 404 760 A 28 28 0 0 1 404 816 L 304 816 A 96 96 0 0 1 208 720 Z"/>
    <!-- Bottom-Right -->
    <path d="M 816 620 A 28 28 0 0 1 760 620 L 760 712 A 48 48 0 0 1 712 760 L 620 760 A 28 28 0 0 1 620 816 L 720 816 A 96 96 0 0 0 816 720 Z"/>
    
    <!-- Calendar Pad Base (Plan) with Clean Negative Space Boolean Subtractions -->
    <path fill-rule="evenodd" d="
      M 388 324 L 636 324 A 56 56 0 0 1 692 380 L 692 644 A 56 56 0 0 1 636 700 L 388 700 A 56 56 0 0 1 332 644 L 332 380 A 56 56 0 0 1 388 324 Z
      M 332 424 L 692 424 L 692 456 L 332 456 Z
      M 444 512 L 580 512 A 20 20 0 0 1 600 532 L 600 620 A 20 20 0 0 1 580 640 L 444 640 A 20 20 0 0 1 424 620 L 424 532 A 20 20 0 0 1 444 512 Z
    "/>
  </g>
</svg>'''

svg_opt1_mark_white = svg_opt1_mark_blue.replace('#2563EB', '#FFFFFF')
svg_opt1_mark_dark = svg_opt1_mark_blue.replace('#2563EB', '#111827')

# OPTION 2: Converging Sheet & Timeline Slot ("Tờ ảnh thu gọn vào mục lịch")
svg_opt2_mark = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <g fill="#2563EB">
    <!-- Top photo notice with folded dog-ear -->
    <path fill-rule="evenodd" d="
      M 280 200 L 600 200 L 744 344 L 744 520 L 280 520 Z
      M 336 256 L 560 256 L 560 384 L 688 384 L 688 464 L 336 464 Z
      M 456 320 A 40 40 0 1 0 536 320 A 40 40 0 1 0 456 320 Z
    "/>
    <path d="M 600 200 L 600 344 L 744 344 Z" fill="#1D4ED8"/>
    <!-- Bottom Calendar Schedule Block -->
    <path fill-rule="evenodd" d="
      M 280 580 L 744 580 A 36 36 0 0 1 780 616 L 780 784 A 36 36 0 0 1 744 820 L 280 820 A 36 36 0 0 1 244 784 L 244 616 A 36 36 0 0 1 280 580 Z
      M 304 640 L 440 640 A 16 16 0 0 1 456 656 L 456 744 A 16 16 0 0 1 440 760 L 304 760 A 16 16 0 0 1 288 744 L 288 656 A 16 16 0 0 1 304 640 Z
      M 488 664 L 720 664 A 14 14 0 0 1 734 678 L 734 694 A 14 14 0 0 1 720 708 L 488 708 A 14 14 0 0 1 474 694 L 474 678 A 14 14 0 0 1 488 664 Z
      M 488 724 L 640 724 A 14 14 0 0 1 654 738 L 654 754 A 14 14 0 0 1 640 768 L 488 768 A 14 14 0 0 1 474 754 L 474 738 A 14 14 0 0 1 488 724 Z
    "/>
  </g>
</svg>'''

# OPTION 3: Shutter P & Time Marker ("Chữ P tạo bởi khung chụp và dấu mốc")
svg_opt3_mark = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <g fill="#2563EB">
    <!-- Camera Viewfinder / Shutter Stem forming P -->
    <path d="M 320 824 L 320 272 A 80 80 0 0 1 400 192 L 608 192 A 28 28 0 0 1 608 248 L 400 248 A 24 24 0 0 0 376 272 L 376 824 A 28 28 0 0 1 320 824 Z"/>
    <!-- Loop of P with Calendar Accent -->
    <path fill-rule="evenodd" d="
      M 376 220 L 592 220 C 720 220 784 300 784 400 C 784 500 720 580 592 580 L 376 580 Z
      M 432 276 L 584 276 C 680 276 728 330 728 400 C 728 470 680 524 584 524 L 432 524 Z
    "/>
    <!-- Pin dot in loop -->
    <circle cx="560" cy="400" r="48" fill="#2563EB"/>
    <!-- Bottom Right Focus Bracket -->
    <path d="M 720 736 A 28 28 0 0 1 720 680 L 784 680 A 24 24 0 0 0 808 656 L 808 592 A 28 28 0 0 1 864 592 L 864 656 A 80 80 0 0 1 784 736 Z"/>
  </g>
</svg>'''

# ==========================================
# 2. SAVE MASTER SVGs
# ==========================================

with open(os.path.join(brand_dir, 'logo-mark.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_opt1_mark_blue)
with open(os.path.join(brand_dir, 'logo-monochrome-dark.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_opt1_mark_dark)
with open(os.path.join(brand_dir, 'logo-monochrome-light.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_opt1_mark_white)
with open(os.path.join(brand_dir, 'symbol-opt1-focus-frame.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_opt1_mark_blue)
with open(os.path.join(brand_dir, 'symbol-opt2-converging-sheet.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_opt2_mark)
with open(os.path.join(brand_dir, 'symbol-opt3-shutter-p.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_opt3_mark)

print("Saved master SVG files in assets/brand/")
