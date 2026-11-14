import os
import subprocess
from PIL import Image

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

brand_dir = os.path.abspath('assets/brand')
mobile_assets_dir = os.path.abspath('mobile/assets')

# Horizontal Wordmark HTML/SVG
wordmark_html = '''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1400px;
    height: 400px;
    background: transparent;
    display: flex;
    align-items: center;
    padding-left: 60px;
    font-family: 'Be Vietnam Pro', -apple-system, sans-serif;
  }
  .lockup {
    display: flex;
    align-items: center;
    gap: 48px;
  }
  .mark {
    width: 220px;
    height: 220px;
    flex-shrink: 0;
  }
  .text-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .wordmark {
    font-size: 110px;
    font-weight: 800;
    letter-spacing: -2.5px;
    line-height: 1.05;
    display: flex;
  }
  .wordmark .plan {
    color: #111827;
  }
  .wordmark .snap {
    color: #2563EB;
  }
  .tagline {
    font-size: 34px;
    font-weight: 500;
    color: #4B5563;
    letter-spacing: -0.5px;
    margin-top: 10px;
  }
</style>
</head>
<body>
  <div class="lockup">
    <svg class="mark" viewBox="0 0 1024 1024">
      <g fill="#2563EB">
        <path d="M 264 404 A 28 28 0 0 1 208 404 L 208 304 A 96 96 0 0 1 304 208 L 404 208 A 28 28 0 0 1 404 264 L 312 264 A 48 48 0 0 0 264 312 Z"/>
        <path d="M 620 208 A 28 28 0 0 1 620 264 L 712 264 A 48 48 0 0 1 760 312 L 760 404 A 28 28 0 0 1 816 404 L 816 304 A 96 96 0 0 0 720 208 Z"/>
        <path d="M 208 620 A 28 28 0 0 1 264 620 L 264 712 A 48 48 0 0 0 312 760 L 404 760 A 28 28 0 0 1 404 816 L 304 816 A 96 96 0 0 1 208 720 Z"/>
        <path d="M 816 620 A 28 28 0 0 1 760 620 L 760 712 A 48 48 0 0 1 712 760 L 620 760 A 28 28 0 0 1 620 816 L 720 816 A 96 96 0 0 0 816 720 Z"/>
        <path fill-rule="evenodd" d="
          M 388 324 L 636 324 A 56 56 0 0 1 692 380 L 692 644 A 56 56 0 0 1 636 700 L 388 700 A 56 56 0 0 1 332 644 L 332 380 A 56 56 0 0 1 388 324 Z
          M 332 424 L 692 424 L 692 456 L 332 456 Z
          M 444 512 L 580 512 A 20 20 0 0 1 600 532 L 600 620 A 20 20 0 0 1 580 640 L 444 640 A 20 20 0 0 1 424 620 L 424 532 A 20 20 0 0 1 444 512 Z
        "/>
      </g>
    </svg>
    <div class="text-col">
      <div class="wordmark"><span class="plan">Plan</span><span class="snap">Snap</span></div>
      <div class="tagline">Từ ảnh thông báo đến lịch làm việc.</div>
    </div>
  </div>
</body>
</html>'''

out_wm_html = os.path.join(brand_dir, 'logo-wordmark.html')
with open(out_wm_html, 'w', encoding='utf-8') as f:
    f.write(wordmark_html)

out_wm_png = os.path.join(brand_dir, 'logo-wordmark-1024.png')
cmd = [
    edge_path,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1400,400',
    '--default-background-color=00000000',
    f'--screenshot={out_wm_png}',
    f'file:///{out_wm_html.replace(os.sep, "/")}'
]
subprocess.run(cmd, check=True)
print('Wordmark rendered to PNG successfully! Size:', os.path.getsize(out_wm_png))
