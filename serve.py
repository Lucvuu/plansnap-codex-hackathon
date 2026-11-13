#!/usr/bin/env python3
"""
PlanSnap Local Server Launcher
Phục vụ ứng dụng PWA trên mạng nội bộ để thử nghiệm trực tiếp trên điện thoại thật qua Wi-Fi / Hotspot.
"""

import http.server
import socket
import socketserver
import os

PORT = 8080

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Does not actually establish connection, just gets outbound IP
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and Cache control
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

if __name__ == '__main__':
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    local_ip = get_local_ip()

    print("=" * 60)
    print("  ⚡ PLANSNAP MOBILE PWA - LOCAL DEV & DEMO SERVER ⚡")
    print("=" * 60)
    print(f"  [+] Trình duyệt máy tính: http://localhost:{PORT}/app/")
    print(f"  [+] Điện thoại thật:      http://{local_ip}:{PORT}/app/")
    print("-" * 60)
    print("  Hướng dẫn cài trên điện thoại thật:")
    print("  1. Kết nối điện thoại vào cùng Wi-Fi hoặc Hotspot của máy tính.")
    print(f"  2. Mở Safari (iOS) hoặc Chrome (Android) truy cập: http://{local_ip}:{PORT}/app/")
    print("  3. Bấm 'Chia sẻ' -> 'Thêm vào Màn hình chính' (Add to Home Screen).")
    print("  4. Mở app từ Icon màn hình chính để chạy chế độ Standalone toàn màn hình.")
    print("=" * 60)
    print("  Nhấn Ctrl+C để dừng server.\n")

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[+] Đã dừng server.")

