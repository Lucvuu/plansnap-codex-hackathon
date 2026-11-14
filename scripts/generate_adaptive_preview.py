import os
from PIL import Image, ImageDraw, ImageOps

brand_dir = os.path.abspath('assets/brand')
fg = Image.open(os.path.join(brand_dir, 'android-icon-foreground.png')).convert('RGBA')
bg = Image.open(os.path.join(brand_dir, 'android-icon-background.png')).convert('RGBA')

# Composite full layered icon
composite = Image.alpha_composite(bg, fg)

# Create 3 masks:
# 1. Circle (Android Pixel standard, diameter 72% / 737px)
mask_circle = Image.new('L', (1024, 1024), 0)
draw_c = ImageDraw.Draw(mask_circle)
draw_c.ellipse((143, 143, 881, 881), fill=255)

# 2. Squircle (Samsung One UI standard, radius 220)
mask_squircle = Image.new('L', (1024, 1024), 0)
draw_sq = ImageDraw.Draw(mask_squircle)
draw_sq.rounded_rectangle((143, 143, 881, 881), radius=220, fill=255)

# 3. Rounded Rect (Xiaomi HyperOS / Stock, radius 160)
mask_rr = Image.new('L', (1024, 1024), 0)
draw_rr = ImageDraw.Draw(mask_rr)
draw_rr.rounded_rectangle((143, 143, 881, 881), radius=160, fill=255)

# Apply masks
def apply_mask(img, mask):
    res = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    res.paste(img, (0, 0), mask)
    return res

icon_circle = apply_mask(composite, mask_circle)
icon_squircle = apply_mask(composite, mask_squircle)
icon_rr = apply_mask(composite, mask_rr)

icon_circle.save(os.path.join(brand_dir, 'preview-adaptive-circle.png'))
icon_squircle.save(os.path.join(brand_dir, 'preview-adaptive-squircle.png'))
icon_rr.save(os.path.join(brand_dir, 'preview-adaptive-roundedrect.png'))

# Create comparison banner (1800 x 600)
banner = Image.new('RGBA', (1800, 600), (245, 245, 247, 255))
# Paste 3 icons sized 380x380
ic_c_small = icon_circle.crop((120, 120, 904, 904)).resize((360, 360), Image.Resampling.LANCZOS)
ic_sq_small = icon_squircle.crop((120, 120, 904, 904)).resize((360, 360), Image.Resampling.LANCZOS)
ic_rr_small = icon_rr.crop((120, 120, 904, 904)).resize((360, 360), Image.Resampling.LANCZOS)

banner.paste(ic_c_small, (140, 120), ic_c_small)
banner.paste(ic_sq_small, (720, 120), ic_sq_small)
banner.paste(ic_rr_small, (1300, 120), ic_rr_small)

banner.save(os.path.join(brand_dir, 'preview-adaptive-comparison.png'))
print('Adaptive icon mask previews created successfully!')
