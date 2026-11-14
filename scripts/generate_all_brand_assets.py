import os
import subprocess
from PIL import Image, ImageDraw, ImageOps

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

brand_dir = os.path.abspath('assets/brand')
mobile_assets_dir = os.path.abspath('mobile/assets')
os.makedirs(brand_dir, exist_ok=True)
os.makedirs(mobile_assets_dir, exist_ok=True)

def render_svg_to_png(svg_str, out_png, width=1024, height=1024, bg='transparent'):
    html_path = out_png + '.temp.html'
    html_str = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ width: {width}px; height: {height}px; overflow: hidden; background: {bg}; display: flex; align-items: center; justify-content: center; }}
  svg {{ width: {width}px; height: {height}px; }}
</style>
</head>
<body>
{svg_str}
</body>
</html>'''
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_str)
    
    cmd = [
        edge_path,
        '--headless=new',
        '--disable-gpu',
        f'--window-size={width},{height}',
        '--default-background-color=00000000',
        f'--screenshot={os.path.abspath(out_png)}',
        f'file:///{os.path.abspath(html_path).replace(os.sep, "/")}'
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    if os.path.exists(html_path):
        os.remove(html_path)

# SVG Mark Definitions
def get_mark_svg(color="#2563EB"):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <g fill="{color}">
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

print("Generating 1024 Master SVGs and PNGs...")

# 1. Master Logo Mark (Blue)
svg_blue = get_mark_svg("#2563EB")
with open(os.path.join(brand_dir, 'logo-mark.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_blue)
render_svg_to_png(svg_blue, os.path.join(brand_dir, 'logo-mark-1024.png'), 1024, 1024)

# 2. Master Monochrome Dark (Ink #111827)
svg_dark = get_mark_svg("#111827")
with open(os.path.join(brand_dir, 'logo-monochrome-dark.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_dark)
render_svg_to_png(svg_dark, os.path.join(brand_dir, 'logo-monochrome-dark-1024.png'), 1024, 1024)

# 3. Master Monochrome Light (White #FFFFFF)
svg_white = get_mark_svg("#FFFFFF")
with open(os.path.join(brand_dir, 'logo-monochrome-light.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_white)
render_svg_to_png(svg_white, os.path.join(brand_dir, 'logo-monochrome-light-1024.png'), 1024, 1024)

# 4. Standard App Icon (icon.png: 1024x1024, #2563EB background with white symbol)
svg_app_icon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <rect width="1024" height="1024" fill="#2563EB"/>
  {svg_white[svg_white.find('<g '):svg_white.find('</svg>')]}
</svg>'''
render_svg_to_png(svg_app_icon, os.path.join(brand_dir, 'icon.png'), 1024, 1024)
render_svg_to_png(svg_app_icon, os.path.join(mobile_assets_dir, 'icon.png'), 1024, 1024)

# 5. Android Adaptive Icon: Background (1024x1024 solid #2563EB)
svg_android_bg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <rect width="1024" height="1024" fill="#2563EB"/>
</svg>'''
render_svg_to_png(svg_android_bg, os.path.join(brand_dir, 'android-icon-background.png'), 1024, 1024)
render_svg_to_png(svg_android_bg, os.path.join(mobile_assets_dir, 'android-icon-background.png'), 1024, 1024)

# 6. Android Adaptive Icon: Foreground (1024x1024 transparent with white symbol in safe zone)
render_svg_to_png(svg_white, os.path.join(brand_dir, 'android-icon-foreground.png'), 1024, 1024)
render_svg_to_png(svg_white, os.path.join(mobile_assets_dir, 'android-icon-foreground.png'), 1024, 1024)

# 7. Android Adaptive Icon: Monochrome (1024x1024 white silhouette for themed icons)
render_svg_to_png(svg_white, os.path.join(brand_dir, 'android-icon-monochrome.png'), 1024, 1024)
render_svg_to_png(svg_white, os.path.join(mobile_assets_dir, 'android-icon-monochrome.png'), 1024, 1024)

# 8. Splash Icon (1024x1024 transparent with blue symbol for Expo splash on #F5F5F7)
render_svg_to_png(svg_blue, os.path.join(brand_dir, 'splash-icon.png'), 1024, 1024)
render_svg_to_png(svg_blue, os.path.join(mobile_assets_dir, 'splash-icon.png'), 1024, 1024)

# 9. Favicon (48x48)
img_app_icon = Image.open(os.path.join(brand_dir, 'icon.png'))
img_fav = img_app_icon.resize((48, 48), Image.Resampling.LANCZOS)
img_fav.save(os.path.join(brand_dir, 'favicon.png'), 'PNG')
img_fav.save(os.path.join(mobile_assets_dir, 'favicon.png'), 'PNG')

# 10. Micro scale test: 24px and 48px on Light & Dark
img_blue_mark = Image.open(os.path.join(brand_dir, 'logo-mark-1024.png'))
img_dark_mark = Image.open(os.path.join(brand_dir, 'logo-monochrome-dark-1024.png'))
img_white_mark = Image.open(os.path.join(brand_dir, 'logo-monochrome-light-1024.png'))

# Save standalone 48 and 24
img_blue_mark.resize((48, 48), Image.Resampling.LANCZOS).save(os.path.join(brand_dir, 'logo-mark-48.png'))
img_blue_mark.resize((24, 24), Image.Resampling.LANCZOS).save(os.path.join(brand_dir, 'logo-mark-24.png'))
img_dark_mark.resize((24, 24), Image.Resampling.LANCZOS).save(os.path.join(brand_dir, 'logo-monochrome-dark-24.png'))
img_white_mark.resize((24, 24), Image.Resampling.LANCZOS).save(os.path.join(brand_dir, 'logo-monochrome-light-24.png'))

print("All master assets generated and copied to mobile/assets/ successfully!")
