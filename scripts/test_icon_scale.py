import os
import subprocess
from PIL import Image

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

def render_svg_to_png(svg_content, out_png_path, size=1024):
    html_path = out_png_path.replace('.png', '.html')
    html_content = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ width: {size}px; height: {size}px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }}
  svg {{ width: {size}px; height: {size}px; }}
</style>
</head>
<body>
{svg_content}
</body>
</html>'''
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    cmd = [
        edge_path,
        '--headless=new',
        '--disable-gpu',
        f'--window-size={size},{size}',
        '--default-background-color=00000000',
        f'--screenshot={os.path.abspath(out_png_path)}',
        f'file:///{os.path.abspath(html_path).replace(os.sep, "/")}'
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    if os.path.exists(html_path):
        os.remove(html_path)

# Test variation A: Pure compound path with cutout
svg_v1 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <g fill="#2563EB">
    <!-- Viewfinder Corners (Snap) -->
    <!-- Top-Left -->
    <path d="M 296 424 A 28 28 0 0 1 240 424 L 240 324 A 84 84 0 0 1 324 240 L 424 240 A 28 28 0 0 1 424 296 L 332 296 A 36 36 0 0 0 296 332 Z"/>
    <!-- Top-Right -->
    <path d="M 600 240 A 28 28 0 0 1 600 296 L 692 296 A 36 36 0 0 0 728 332 L 728 424 A 28 28 0 0 1 784 424 L 784 324 A 84 84 0 0 0 700 240 Z"/>
    <!-- Bottom-Left -->
    <path d="M 240 600 A 28 28 0 0 1 296 600 L 296 692 A 36 36 0 0 0 332 728 L 424 728 A 28 28 0 0 1 424 784 L 324 784 A 84 84 0 0 1 240 700 Z"/>
    <!-- Bottom-Right -->
    <path d="M 784 600 A 28 28 0 0 1 728 600 L 728 692 A 36 36 0 0 1 692 728 L 600 728 A 28 28 0 0 1 600 784 L 700 784 A 84 84 0 0 0 784 700 Z"/>
    
    <!-- Calendar Card Base (Plan) with Negative Space Cutouts -->
    <path fill-rule="evenodd" d="
      M 400 348 L 624 348 A 52 52 0 0 1 676 400 L 676 624 A 52 52 0 0 1 624 676 L 400 676 A 52 52 0 0 1 348 624 L 348 400 A 52 52 0 0 1 400 348 Z
      M 376 440 L 648 440 L 648 468 L 376 468 Z
      M 456 516 L 568 516 A 16 16 0 0 1 584 532 L 584 612 A 16 16 0 0 1 568 628 L 456 628 A 16 16 0 0 1 440 612 L 440 532 A 16 16 0 0 1 456 516 Z
    "/>
  </g>
</svg>'''

os.makedirs('assets/brand/test', exist_ok=True)
render_svg_to_png(svg_v1, 'assets/brand/test/v1_1024.png', 1024)

# Resize to 48 and 24 to test micro-scale readability
img1024 = Image.open('assets/brand/test/v1_1024.png')
img48 = img1024.resize((48, 48), Image.Resampling.LANCZOS)
img48.save('assets/brand/test/v1_48.png')
img24 = img1024.resize((24, 24), Image.Resampling.LANCZOS)
img24.save('assets/brand/test/v1_24.png')

print('Rendered v1 at 1024, 48, 24. Sizes:', os.path.getsize('assets/brand/test/v1_1024.png'), os.path.getsize('assets/brand/test/v1_48.png'), os.path.getsize('assets/brand/test/v1_24.png'))
