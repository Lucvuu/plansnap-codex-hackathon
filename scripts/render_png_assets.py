import os
from PIL import Image, ImageDraw

BRAND_DIR = os.path.abspath("design/brand")
MOBILE_ASSETS = os.path.abspath("mobile/assets")
os.makedirs(BRAND_DIR, exist_ok=True)
os.makedirs(MOBILE_ASSETS, exist_ok=True)

# Colors
C_BLUE = (37, 99, 235, 255)      # #2563EB
C_DARK_BLUE = (29, 78, 216, 255) # #1D4ED8
C_LIGHT_BLUE = (191, 219, 254, 255) # #BFDBFE
C_SOFT_BLUE = (239, 246, 255, 255)  # #EFF6FF
C_GREEN = (5, 150, 105, 255)     # #059669
C_SOFT_GREEN = (167, 243, 208, 255) # #A7F3D0
C_WHITE = (255, 255, 255, 255)
C_DARK = (17, 24, 39, 255)       # #111827
C_MUTED = (75, 85, 99, 255)      # #4B5563
C_TRANSPARENT = (0, 0, 0, 0)

def draw_corner_bracket(draw, cx, cy, arm_len, r, thickness, color, quadrant):
    """
    quadrant: 1 (top-right), 2 (top-left), 3 (bottom-left), 4 (bottom-right)
    """
    half_th = thickness / 2
    # To draw smooth thick rounded bracket:
    # We can draw line segments with rounded caps
    if quadrant == 2: # Top-left
        # Horizontal arm: (cx, cy) to (cx + arm_len, cy)
        # Vertical arm: (cx, cy) to (cx, cy + arm_len)
        draw.line([(cx + r, cy), (cx + arm_len, cy)], fill=color, width=int(thickness))
        draw.line([(cx, cy + r), (cx, cy + arm_len)], fill=color, width=int(thickness))
        # Corner arc
        draw.arc([cx - half_th, cy - half_th, cx + 2*r - half_th, cy + 2*r - half_th], 180, 270, fill=color, width=int(thickness))
        # End cap circles
        draw.ellipse([cx + arm_len - half_th, cy - half_th, cx + arm_len + half_th, cy + half_th], fill=color)
        draw.ellipse([cx - half_th, cy + arm_len - half_th, cx + half_th, cy + arm_len + half_th], fill=color)
    elif quadrant == 1: # Top-right
        draw.line([(cx - arm_len, cy), (cx - r, cy)], fill=color, width=int(thickness))
        draw.line([(cx, cy + r), (cx, cy + arm_len)], fill=color, width=int(thickness))
        draw.arc([cx - 2*r + half_th, cy - half_th, cx + half_th, cy + 2*r - half_th], 270, 360, fill=color, width=int(thickness))
        draw.ellipse([cx - arm_len - half_th, cy - half_th, cx - arm_len + half_th, cy + half_th], fill=color)
        draw.ellipse([cx - half_th, cy + arm_len - half_th, cx + half_th, cy + arm_len + half_th], fill=color)
    elif quadrant == 3: # Bottom-left
        draw.line([(cx + r, cy), (cx + arm_len, cy)], fill=color, width=int(thickness))
        draw.line([(cx, cy - arm_len), (cx, cy - r)], fill=color, width=int(thickness))
        draw.arc([cx - half_th, cy - 2*r + half_th, cx + 2*r - half_th, cy + half_th], 90, 180, fill=color, width=int(thickness))
        draw.ellipse([cx + arm_len - half_th, cy - half_th, cx + arm_len + half_th, cy + half_th], fill=color)
        draw.ellipse([cx - half_th, cy - arm_len - half_th, cx + half_th, cy - arm_len + half_th], fill=color)
    elif quadrant == 4: # Bottom-right
        draw.line([(cx - arm_len, cy), (cx - r, cy)], fill=color, width=int(thickness))
        draw.line([(cx, cy - arm_len), (cx, cy - r)], fill=color, width=int(thickness))
        draw.arc([cx - 2*r + half_th, cy - 2*r + half_th, cx + half_th, cy + half_th], 0, 90, fill=color, width=int(thickness))
        draw.ellipse([cx - arm_len - half_th, cy - half_th, cx - arm_len + half_th, cy + half_th], fill=color)
        draw.ellipse([cx - half_th, cy - arm_len - half_th, cx + half_th, cy - arm_len + half_th], fill=color)

def render_master_icon(size=1024, bg_color=None, is_white_icon=False, is_monochrome=False):
    scale = 4 # 4x supersampling
    w = size * scale
    h = size * scale
    
    img = Image.new("RGBA", (w, h), bg_color if bg_color else C_TRANSPARENT)
    draw = ImageDraw.Draw(img)
    
    # Coordinates normalized on 1024 canvas
    s = w / 512.0
    
    # Choose colors
    if is_white_icon:
        stroke_color = C_WHITE
        cal_bg = C_WHITE
        header_color = C_DARK_BLUE
        grid1 = C_LIGHT_BLUE
        grid2 = (226, 232, 240, 255)
        event_bg = C_GREEN
        check_color = C_WHITE
        event_bar = C_SOFT_GREEN
    elif is_monochrome:
        stroke_color = C_DARK
        cal_bg = C_DARK
        header_color = C_DARK
        grid1 = (200, 200, 200, 255)
        grid2 = (240, 240, 240, 255)
        event_bg = C_DARK
        check_color = C_WHITE
        event_bar = C_WHITE
    else:
        stroke_color = C_BLUE
        cal_bg = C_BLUE
        header_color = C_DARK_BLUE
        grid1 = C_LIGHT_BLUE
        grid2 = C_SOFT_BLUE
        event_bg = C_GREEN
        check_color = C_WHITE
        event_bar = C_SOFT_GREEN
    
    th = 28 * s
    arm = 54 * s
    r = 20 * s
    
    # Four viewfinder brackets
    draw_corner_bracket(draw, 104*s, 104*s, arm, r, th, stroke_color, 2)
    draw_corner_bracket(draw, 408*s, 104*s, arm, r, th, stroke_color, 1)
    draw_corner_bracket(draw, 104*s, 408*s, arm, r, th, stroke_color, 3)
    draw_corner_bracket(draw, 408*s, 408*s, arm, r, th, stroke_color, 4)
    
    # Binder rings
    draw.rounded_rectangle([204*s, 140*s, 222*s, 172*s], radius=9*s, fill=header_color if not is_white_icon else C_WHITE)
    draw.rounded_rectangle([290*s, 140*s, 308*s, 172*s], radius=9*s, fill=header_color if not is_white_icon else C_WHITE)
    
    # Calendar Body Outer
    draw.rounded_rectangle([156*s, 160*s, 356*s, 352*s], radius=26*s, fill=cal_bg)
    
    # Inner Calendar Area
    draw.rounded_rectangle([174*s, 212*s, 338*s, 334*s], radius=16*s, fill=C_WHITE)
    
    # Header area bar if white icon
    if is_white_icon:
        draw.rounded_rectangle([156*s, 160*s, 356*s, 206*s], radius=14*s, fill=header_color)
    
    # Schedule lines
    draw.rounded_rectangle([190*s, 232*s, 246*s, 244*s], radius=6*s, fill=grid1)
    draw.rounded_rectangle([254*s, 232*s, 320*s, 244*s], radius=6*s, fill=grid2)
    
    # Scheduled Event Block
    draw.rounded_rectangle([190*s, 258*s, 322*s, 300*s], radius=10*s, fill=event_bg)
    
    # Checkmark inside scheduled event
    check_pts = [(212*s, 278*s), (220*s, 286*s), (236*s, 270*s)]
    draw.line(check_pts, fill=check_color, width=int(5*s), joint="curve")
    draw.rounded_rectangle([248*s, 274*s, 308*s, 284*s], radius=5*s, fill=event_bar)
    
    # Downsample
    img_final = img.resize((size, size), Image.Resampling.LANCZOS)
    return img_final

def render_adaptive_foreground(size=432):
    # Android adaptive icon is 432x432. Safe zone is center 288x288 (radius 144 from center 216, 216).
    scale = 4
    w = size * scale
    h = size * scale
    img = Image.new("RGBA", (w, h), C_TRANSPARENT)
    
    # Render white icon scaled to fit safe zone
    icon_sub = render_master_icon(size=int(268 * scale), bg_color=None, is_white_icon=True)
    # Center on canvas
    offset = (int((w - icon_sub.width)/2), int((h - icon_sub.height)/2))
    img.paste(icon_sub, offset, icon_sub)
    
    return img.resize((size, size), Image.Resampling.LANCZOS)

def render_adaptive_background(size=432):
    img = Image.new("RGBA", (size, size), C_BLUE)
    return img

def render_adaptive_monochrome(size=432):
    scale = 4
    w = size * scale
    h = size * scale
    img = Image.new("RGBA", (w, h), C_TRANSPARENT)
    icon_sub = render_master_icon(size=int(268 * scale), bg_color=None, is_monochrome=True)
    offset = (int((w - icon_sub.width)/2), int((h - icon_sub.height)/2))
    img.paste(icon_sub, offset, icon_sub)
    return img.resize((size, size), Image.Resampling.LANCZOS)

# Generate assets
print("Rendering Master PNG Icons...")
# 1024x1024
master_1024 = render_master_icon(1024)
master_1024.save(os.path.join(BRAND_DIR, "plansnap-icon-1024.png"), "PNG")
master_1024.save(os.path.join(MOBILE_ASSETS, "icon.png"), "PNG")

# 512x512
master_512 = render_master_icon(512)
master_512.save(os.path.join(BRAND_DIR, "plansnap-icon-512.png"), "PNG")
master_512.save(os.path.join(MOBILE_ASSETS, "splash-icon.png"), "PNG")

# 192, 48, 24
render_master_icon(192).save(os.path.join(BRAND_DIR, "plansnap-icon-192.png"), "PNG")
render_master_icon(192).save(os.path.join(MOBILE_ASSETS, "favicon.png"), "PNG")
render_master_icon(48).save(os.path.join(BRAND_DIR, "plansnap-icon-48.png"), "PNG")
render_master_icon(24).save(os.path.join(BRAND_DIR, "plansnap-icon-24.png"), "PNG")

# Adaptive Icons for Android
print("Rendering Android Adaptive Icons...")
fg = render_adaptive_foreground(432)
fg.save(os.path.join(BRAND_DIR, "android-icon-foreground.png"), "PNG")
fg.save(os.path.join(MOBILE_ASSETS, "android-icon-foreground.png"), "PNG")

bg = render_adaptive_background(432)
bg.save(os.path.join(BRAND_DIR, "android-icon-background.png"), "PNG")
bg.save(os.path.join(MOBILE_ASSETS, "android-icon-background.png"), "PNG")

mono = render_adaptive_monochrome(432)
mono.save(os.path.join(BRAND_DIR, "android-icon-monochrome.png"), "PNG")
mono.save(os.path.join(MOBILE_ASSETS, "android-icon-monochrome.png"), "PNG")

print("All PNG brand assets generated successfully.")
