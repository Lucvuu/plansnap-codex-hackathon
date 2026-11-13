// PlanSnap Multi-modal Vision Agent Connector
// Hỗ trợ gọi trực tiếp Google Gemini API (gemini-2.5-flash) + Rasterize SVG Presets

const SYSTEM_PROMPT = `VAI TRÒ:
Bạn là Chuyên gia trích xuất kế hoạch học tập của ứng dụng PlanSnap.
Nhiệm vụ của bạn là đọc các hình ảnh được cung cấp (ảnh chụp màn hình Zalo, Messenger, giao diện LMS, ảnh chụp slide, bảng trắng hoặc chữ viết tay) và trích xuất tất cả các đầu việc học tập, bài tập, hạn chót cần thực hiện.

CÁC NGUYÊN TẮC BẮT BUỘC:
1. NGUYÊN TẮC BẰNG CHỨNG THỰC TẾ (CHỐNG BỊA VIỆC):
   - Mọi đầu việc (task) trích xuất ra BẮT BUỘC phải có đoạn văn bản trích dẫn nguyên văn từ ảnh trong trường "source_quote".
   - Nếu một hình ảnh không chứa bất kỳ hạn chót/bài tập nào, TUYỆT ĐỐI KHÔNG tự bịa ra công việc.

2. QUY TẮC ĐỊNH DẠNG NGÀY THÁNG VIỆT NAM:
   - Ở Việt Nam, định dạng ngày tháng viết tắt mặc định là Ngày/Tháng (dd/mm). Ví dụ: "3/4" là ngày 03 tháng 04.

3. XỬ LÝ HẠN CHÓT TƯƠNG ĐỐI & TEM THỜI GIAN TIN NHẮN:
   - Hãy tìm tem thời gian gửi tin nhắn (timestamp) xuất hiện trong ảnh chụp màn hình Zalo/Messenger (ví dụ: "Hôm qua lúc 14:20", "Thứ Năm 10:15").
   - Dùng tem thời gian đó làm mốc tham chiếu để suy luận các cụm từ tương đối như "thứ 6 tuần sau", "ngày mai".

4. PHÁT HIỆN SỰ MƠ HỒ (AMBIGUITY DETECTION):
   - Nếu hạn chót mơ hồ (ví dụ: "thứ 6 tuần sau"), hãy:
     + Đặt "needs_confirmation": true
     + Điền "question": Câu hỏi làm rõ ngắn gọn
     + Điền "options": 2 mốc thời gian ISO-8601 cụ thể để người dùng bấm chọn nhanh.
   - Nếu thời hạn rõ ràng:
     + Đặt "needs_confirmation": false
     + Điền "deadline_iso": chuỗi ISO-8601 chuẩn.

5. ƯỚC LƯỢNG THỜI GIAN THỰC HIỆN (estimated_minutes):
   - Quiz/Trắc nghiệm: 30-45p. Đọc tài liệu: 60p. Bài tập lớn/Tiểu luận: 120-240p.

ĐẦU RA:
Bắt buộc trả về đúng định dạng JSON Schema:
{
  "tasks": [
    {
      "id": "task_1",
      "title": "Tên việc ngắn gọn",
      "source_quote": "Câu trích nguyên văn từ ảnh",
      "source_image_index": 1,
      "deadline_raw": "Thời hạn gốc trong ảnh",
      "deadline_iso": "2026-11-20T17:00:00+07:00 hoặc null",
      "needs_confirmation": true_hoặc_false,
      "question": "Câu hỏi nếu cần xác nhận hoặc null",
      "options": ["ISO string 1", "ISO string 2"],
      "estimated_minutes": 120,
      "confidence": 0.9
    }
  ]
}`;

class VisionAgent {
  // Chuyển ảnh SVG preset sang JPEG base64 để Gemini API đọc được như ảnh thật
  static async ensureRasterImage(img) {
    if (img.mimeType !== 'image/svg+xml' && !img.dataUrl?.startsWith('data:image/svg+xml')) {
      return {
        mimeType: img.mimeType || 'image/jpeg',
        base64Data: img.base64Data
      };
    }

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width || 600;
        canvas.height = image.height || 400;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        const jpegUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve({
          mimeType: 'image/jpeg',
          base64Data: jpegUrl.split(',')[1]
        });
      };
      image.onerror = () => reject(new Error('Không thể chuyển đổi ảnh mẫu sang JPEG'));
      image.src = img.dataUrl;
    });
  }

  // Trích xuất task từ danh sách ảnh
  static async extractTasks(compressedImages, apiKey = null, model = 'gemini-3.8-flash') {
    const hasKey = apiKey && apiKey.trim().length > 10;
    const isPresetPack = compressedImages.every(img => img.isPreset);

    if (hasKey) {
      return await VisionAgent.callGeminiApi(compressedImages, apiKey.trim(), model);
    }

    // Nếu người dùng tải ảnh thật lên nhưng chưa nhập API Key -> báo rõ, không bịa kết quả giả
    if (!isPresetPack) {
      const err = new Error('Chưa cấu hình Gemini API Key. Vui lòng nhập API Key ở mục Cài đặt để AI phân tích ảnh thật của bạn, hoặc dùng ảnh mẫu ở màn hình chính.');
      err.code = 'NO_API_KEY';
      throw err;
    }

    // Nếu là ảnh mẫu Demo -> chạy mô phỏng theo đúng loại preset
    if (compressedImages.length === 1 && compressedImages[0].presetType === 'judge') {
      const judgeTask = await VisionAgent.extractHandwrittenPrompt(compressedImages[0]);
      return [judgeTask];
    }

    return await VisionAgent.simulateExtraction(compressedImages);
  }

  static getCandidateModels(preferredModel) {
    const clean = (preferredModel === 'gemini-2.5-flash' || preferredModel === 'gemini-2.0-flash' || !preferredModel)
      ? 'gemini-3.8-flash'
      : preferredModel;
    return [...new Set([clean, 'gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3-flash-preview'])];
  }

  // Kiểm tra nhanh API Key có hoạt động không
  static async testApiKey(apiKey, model = 'gemini-3.8-flash') {
    const candidates = VisionAgent.getCandidateModels(model);
    let lastErr = null;
    for (const m of candidates) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Trả lời đúng 1 từ: OK' }] }]
        })
      });
      if (response.ok) return m;
      const errText = await response.text();
      lastErr = new Error(`HTTP ${response.status}: ${errText.slice(0, 120)}`);
      if (response.status !== 404 && response.status !== 503) throw lastErr;
    }
    throw lastErr;
  }

  // Gọi trực tiếp Google Gemini API (tự chuyển model dự phòng nếu 404/503)
  static async callGeminiApi(compressedImages, apiKey, model = 'gemini-3.8-flash') {
    const parts = [
      { text: `${SYSTEM_PROMPT}\n\nThời gian hiện tại (múi giờ +07:00): ${new Date().toISOString()}` }
    ];

    for (const img of compressedImages) {
      const raster = await VisionAgent.ensureRasterImage(img);
      if (raster.base64Data && raster.base64Data.length > 50) {
        parts.push({
          inline_data: {
            mime_type: raster.mimeType,
            data: raster.base64Data
          }
        });
      }
    }

    const candidates = VisionAgent.getCandidateModels(model);
    let data = null;
    let lastErr = null;

    for (const m of candidates) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.0,
            response_mime_type: 'application/json'
          }
        })
      });

      if (response.ok) {
        data = await response.json();
        break;
      }

      const errText = await response.text();
      lastErr = new Error(`Gemini API HTTP ${response.status}: ${errText.slice(0, 180)}`);
      if (response.status !== 404 && response.status !== 503) {
        throw lastErr;
      }
    }

    if (!data) throw lastErr || new Error('Không thể kết nối Gemini API.');
    const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJsonText) {
      throw new Error('Gemini API không trả về dữ liệu hợp lệ.');
    }
    const parsed = JSON.parse(rawJsonText);
    return (parsed.tasks || []).map((t, i) => ({
      ...t,
      id: t.id || `task_live_${Date.now()}_${i}`
    }));
  }

  // Bộ bóc tách mẫu cho ảnh Demo Preset (khi chưa nhập API Key)
  static async simulateExtraction(compressedImages) {
    await new Promise(r => setTimeout(r, 1200));

    const now = new Date();
    const nextFri = new Date(now);
    nextFri.setDate(now.getDate() + ((5 + 7 - now.getDay()) % 7 || 7));
    nextFri.setHours(17, 0, 0, 0);

    const nextNextFri = new Date(nextFri);
    nextNextFri.setDate(nextFri.getDate() + 7);

    const thisSun = new Date(now);
    thisSun.setDate(now.getDate() + ((0 + 7 - now.getDay()) % 7 || 7));
    thisSun.setHours(23, 59, 0, 0);

    const nextTue = new Date(now);
    nextTue.setDate(now.getDate() + ((2 + 7 - now.getDay()) % 7 || 7));
    nextTue.setHours(8, 0, 0, 0);

    return [
      {
        id: 'task_zalo_' + Date.now(),
        title: 'Nộp bản cuối tiểu luận môn Marketing',
        source_quote: 'Hạn nộp bản cuối tiểu luận trước 17h thứ 6 tuần sau nha cả nhóm',
        source_image_index: 1,
        deadline_raw: '17h thứ 6 tuần sau',
        deadline_iso: null,
        needs_confirmation: true,
        question: 'Hạn chót "Thứ 6 tuần sau" trong tin nhắn Zalo tương ứng ngày nào?',
        options: [
          nextFri.toISOString(),
          nextNextFri.toISOString()
        ],
        estimated_minutes: 180,
        confidence: 0.82
      },
      {
        id: 'task_lms_' + (Date.now() + 1),
        title: 'Hoàn thành Quiz 4 môn Kinh tế vi mô',
        source_quote: 'LMS Canvas: Quiz 4 closes Sunday at 23:59',
        source_image_index: 2,
        deadline_raw: 'Chủ Nhật tuần này 23:59',
        deadline_iso: thisSun.toISOString(),
        needs_confirmation: false,
        question: null,
        options: [],
        estimated_minutes: 45,
        confidence: 0.96
      },
      {
        id: 'task_slide_' + (Date.now() + 2),
        title: 'Chuẩn bị bài thuyết trình Case Study số 2',
        source_quote: 'Slide đề cương: Các nhóm nộp slide thuyết trình trước giờ vào lớp (08h00 thứ 3 tuần tới)',
        source_image_index: 3,
        deadline_raw: 'Thứ Ba tuần tới 08:00',
        deadline_iso: nextTue.toISOString(),
        needs_confirmation: false,
        question: null,
        options: [],
        estimated_minutes: 120,
        confidence: 0.88
      }
    ];
  }

  // Thử thách chữ viết tay mẫu (khi dùng ảnh viết tay preset)
  static async extractHandwrittenPrompt(compressedImage) {
    await new Promise(r => setTimeout(r, 1100));
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);

    return {
      id: 'task_bgk_' + Date.now(),
      title: 'Nộp báo cáo tài chính dự án',
      source_quote: 'Ghi chú viết tay: "Nộp báo cáo tài chính trước 14h ngày mai"',
      source_image_index: 1,
      deadline_raw: '14h ngày mai',
      deadline_iso: tomorrow.toISOString(),
      needs_confirmation: false,
      question: null,
      options: [],
      estimated_minutes: 60,
      confidence: 0.94
    };
  }

  // Sinh ảnh mẫu đồ họa phục vụ thử nhanh
  static getSampleImages() {
    const zaloSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#e2e8f0"/>
      <rect width="600" height="60" fill="#0068ff"/>
      <text x="20" y="38" fill="white" font-family="sans-serif" font-size="18" font-weight="bold">Nhóm Zalo: Marketing K62 [84 thành viên]</text>
      <circle cx="45" cy="115" r="22" fill="#3b82f6"/>
      <text x="36" y="122" fill="white" font-family="sans-serif" font-size="18" font-weight="bold">L</text>
      <rect x="80" y="90" width="480" height="85" rx="12" fill="white"/>
      <text x="100" y="115" fill="#64748b" font-family="sans-serif" font-size="13">Lớp trưởng • Hôm qua 16:45</text>
      <text x="100" y="145" fill="#1e293b" font-family="sans-serif" font-size="16" font-weight="600">Hạn nộp bản cuối tiểu luận trước 17h thứ 6 tuần sau nha cả nhóm</text>
      <circle cx="45" cy="225" r="22" fill="#10b981"/>
      <text x="36" y="232" fill="white" font-family="sans-serif" font-size="18" font-weight="bold">A</text>
      <rect x="80" y="200" width="360" height="60" rx="12" fill="white"/>
      <text x="100" y="225" fill="#64748b" font-family="sans-serif" font-size="13">Hoàng Anh • Hôm qua 16:48</text>
      <text x="100" y="248" fill="#1e293b" font-family="sans-serif" font-size="15">Dạ vâng nhóm em đang làm rồi ạ!</text>
    </svg>`;

    const lmsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#f8fafc"/>
      <rect width="600" height="56" fill="#0f172a"/>
      <text x="20" y="35" fill="white" font-family="sans-serif" font-size="17" font-weight="bold">LMS Canvas • Kinh tế vi mô (ECO201)</text>
      <rect x="24" y="80" width="552" height="140" rx="12" fill="white" stroke="#cbd5e1" stroke-width="2"/>
      <text x="44" y="115" fill="#0f172a" font-family="sans-serif" font-size="20" font-weight="bold">Quiz 4: Market Equilibrium &amp; Elasticity</text>
      <text x="44" y="150" fill="#dc2626" font-family="sans-serif" font-size="16" font-weight="600">Due: Sunday at 23:59 • Time Limit: 45 Minutes</text>
      <text x="44" y="185" fill="#64748b" font-family="sans-serif" font-size="14">Points: 10 • Submitting a quiz online</text>
    </svg>`;

    const slideSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#1e293b"/>
      <rect x="24" y="24" width="552" height="352" rx="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <text x="48" y="80" fill="#38bdf8" font-family="sans-serif" font-size="22" font-weight="bold">BÀI TẬP NHÓM: CASE STUDY SỐ 2</text>
      <text x="48" y="135" fill="#f8fafc" font-family="sans-serif" font-size="17">- Phân tích chiến lược định giá sản phẩm mới</text>
      <text x="48" y="175" fill="#f8fafc" font-family="sans-serif" font-size="17">- Thời lượng trình bày: 15 phút/nhóm</text>
      <rect x="48" y="220" width="504" height="70" rx="8" fill="#1e3a8a"/>
      <text x="64" y="262" fill="#93c5fd" font-family="sans-serif" font-size="16" font-weight="bold">Hạn nộp slide: Trước giờ vào lớp (08h00 Thứ 3 tuần tới)</text>
    </svg>`;

    const judgeHandwritingSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#fefce8"/>
      <line x1="0" y1="80" x2="600" y2="80" stroke="#e2e8f0" stroke-width="2"/>
      <line x1="0" y1="140" x2="600" y2="140" stroke="#e2e8f0" stroke-width="2"/>
      <line x1="0" y1="200" x2="600" y2="200" stroke="#e2e8f0" stroke-width="2"/>
      <line x1="0" y1="260" x2="600" y2="260" stroke="#e2e8f0" stroke-width="2"/>
      <text x="50" y="130" fill="#1e293b" font-family="cursive, sans-serif" font-size="26" font-style="italic">Nộp báo cáo tài chính</text>
      <text x="50" y="190" fill="#1e293b" font-family="cursive, sans-serif" font-size="26" font-style="italic">trước 14h ngày mai</text>
      <text x="50" y="250" fill="#64748b" font-family="sans-serif" font-size="14">(Ghi chú viết tay trên giấy)</text>
    </svg>`;

    const toDataUrl = (svg) => 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));

    return {
      studentPack: [
        { dataUrl: toDataUrl(zaloSvg), mimeType: 'image/svg+xml', name: 'Zalo_Nhom_Marketing.png', isPreset: true, presetType: 'student' },
        { dataUrl: toDataUrl(lmsSvg), mimeType: 'image/svg+xml', name: 'LMS_Canvas_Quiz4.png', isPreset: true, presetType: 'student' },
        { dataUrl: toDataUrl(slideSvg), mimeType: 'image/svg+xml', name: 'Slide_CaseStudy2.png', isPreset: true, presetType: 'student' }
      ],
      judgeHandwritten: { dataUrl: toDataUrl(judgeHandwritingSvg), mimeType: 'image/svg+xml', name: 'Ghi_chu_viet_tay.png', isPreset: true, presetType: 'judge' }
    };
  }
}

window.VisionAgent = VisionAgent;
