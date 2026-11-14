// PlanSnap Multi-modal Vision Agent Connector
// Tối ưu tốc độ (< 2s) với gemini-3-flash-preview + Auto-Fallback

function buildSystemPrompt(clientCurrentTime, timezone = 'Asia/Ho_Chi_Minh') {
  return `VAI TRÒ:
Bạn là Hệ thống AI Trích xuất Kế hoạch Học tập & Công việc độ chính xác cao của ứng dụng di động PlanSnap.
Nhiệm vụ của bạn là phân tích từ 1 đến 5 hình ảnh (ảnh chụp màn hình nhóm chat Zalo/Messenger, cổng đào tạo LMS Canvas/Moodle, slide bài giảng, bảng trắng hoặc giấy ghi chú viết tay trực tiếp) và bóc tách tất cả các đầu việc, bài tập, lịch họp hoặc hạn chót cần thực hiện.

THỜI GIAN THAM CHIẾU HIỆN TẠI CỦA THIẾT BỊ:
- Thời gian hiện tại (client_current_time): ${clientCurrentTime}
- Múi giờ (timezone): ${timezone} (Mặc định: Asia/Ho_Chi_Minh, UTC+7)

6 QUY TẮC BẮT BUỘC (TUÂN THỦ TUYỆT ĐỐI):

1. NGUYÊN TẮC BẰNG CHỨNG NGUYÊN VĂN (ZERO HALLUCINATION):
   - Mọi đầu việc (task) được trích xuất BẮT BUỘC phải có trường "source_quote" chứa câu/cụm từ trích dẫn nguyên văn nhìn thấy trong ảnh làm bằng chứng đối chiếu.
   - Ghi rõ chỉ số ảnh nguồn vào "source_image_index" (bắt đầu từ 1).
   - Nếu một bức ảnh là ảnh phong cảnh, ảnh cá nhân, meme hoặc không chứa bất kỳ nhiệm vụ/hạn chót nào, TUYỆT ĐỐI KHÔNG tự suy diễn hay bịa ra công việc. Nếu không có việc nào trong tất cả các ảnh, trả về "tasks": [].

2. QUY TẮC ĐỊNH DẠNG NGÀY THÁNG VIỆT NAM (DD/MM):
   - Mặc định mọi ngày tháng viết tắt trong tiếng Việt đều theo chuẩn Ngày/Tháng (dd/mm hoặc dd/mm/yyyy).
   - Ví dụ: "3/4" hoặc "03-04" BẮT BUỘC hiểu là ngày 03 tháng 04, tuyệt đối không hiểu ngược thành ngày 04 tháng 03.
   - Nếu không ghi giờ cụ thể mà chỉ ghi ngày (ví dụ: "Hạn nộp 20/11"), mặc định gán giờ kết thúc là 23:59:00+07:00 của ngày đó; nếu ghi "trước buổi sáng" hoặc "đầu giờ sáng", gán 08:00:00+07:00; nếu ghi "tối nay", gán 21:00:00+07:00.

3. GIẢI MÃ TEM THỜI GIAN TIN NHẮN (CHAT TIMESTAMP ANCHORING):
   - Trong ảnh chụp màn hình Zalo/Messenger, hãy ưu tiên tìm tem thời gian gửi tin nhắn hiển thị trên giao diện chat (ví dụ: "Hôm qua 16:45", "Thứ Năm, 12/11 lúc 10:15").
   - Sử dụng tem thời gian gửi tin nhắn đó làm mốc gốc (anchor_time) để tính toán các cụm từ chỉ thời gian tương đối trong nội dung tin nhắn như "ngày mai", "thứ 6 tuần này", "thứ 6 tuần sau", "3 ngày nữa".
   - Chỉ khi trong ảnh hoàn toàn không có tem thời gian gửi tin, mới dùng ${clientCurrentTime} làm mốc gốc.

4. XỬ LÝ CHỮ VIẾT TAY TRỰC TIẾP (HANDWRITING CHALLENGE MODE):
   - Khi gặp ảnh chụp giấy viết tay hoặc bảng trắng: tập trung nhận diện các từ khóa chỉ hành động (Nộp, Làm, Hoàn thành, Gửi, Báo cáo, Họp, Thi, Review, Chốt...) và các con số chỉ giờ/ngày tháng.
   - Nếu nét chữ viết tay có chỗ khó đọc hoặc tẩy xóa khiến độ tin cậy (confidence) nằm trong khoảng 0.5 - 0.74, vẫn trích xuất task nhưng BẮT BUỘC bật "needs_confirmation": true, đặt câu hỏi xác nhận ngắn gọn trong "question" và đưa ra 2-3 phương án ngày giờ hợp lý nhất trong "options".

5. PHÁT HIỆN & XỬ LÝ HẠN CHÓT MƠ HỒ (AMBIGUITY DETECTION):
   - Khi gặp các cụm từ thời gian đa nghĩa (ví dụ: "thứ 6 tuần sau" có thể hiểu là Thứ 6 của tuần kế tiếp gần nhất hoặc Thứ 6 của tuần kế tiếp nữa; hoặc "cuối tuần", "trước buổi học tới"):
     + Đặt "needs_confirmation": true.
     + Gán "deadline_iso" bằng mốc thời gian khả dĩ sớm nhất theo chuẩn ISO-8601 (YYYY-MM-DDTHH:mm:ss+07:00).
     + Điền "question": Câu hỏi tiếng Việt ngắn gọn dưới 12 từ (Ví dụ: "Thứ 6 tuần sau là ngày 20/11 hay 27/11?").
     + Điền "options": Mảng gồm 2-3 chuỗi ISO-8601 cụ thể tương ứng để người dùng chạm chọn 1 lần trên màn hình.
   - Khi hạn chót đã rõ ràng tuyệt đối:
     + Đặt "needs_confirmation": false, "question": null, "options": [].

6. ĐỊNH MỨC ƯỚC LƯỢNG THỜI GIAN LÀM VIỆC (estimated_minutes):
   - Nếu trong ảnh có ghi rõ thời lượng, lấy theo ảnh. Nếu không, tự động ước lượng theo phân loại học thuật:
     + Bài tập trắc nghiệm ngắn / Quiz / Điền form: 30 đến 45 phút.
     + Đọc tài liệu / Chuẩn bị bài giảng / Ôn tập ngắn: 60 phút.
     + Họp nhóm / Thảo luận bài tập: 60 đến 90 phút.
     + Bài tập lớn / Viết báo cáo / Tiểu luận / Coding project: 120 đến 240 phút.

ĐẦU RA BẮT BUỘC:
Chỉ trả về duy nhất một đối tượng JSON hợp lệ tuân thủ nghiêm ngặt schema ExtractionResult, không bao bọc bằng markdown codefence và không thêm bất kỳ văn bản giải thích nào ngoài JSON:
{"tasks":[{"id":"t1","title":"Tên ngắn gọn","source_quote":"Trích nguyên văn","source_image_index":1,"deadline_raw":"Hạn gốc","deadline_iso":"2026-11-20T17:00:00+07:00","needs_confirmation":false,"question":null,"options":[],"estimated_minutes":60,"confidence":0.95}]}`;
}

class VisionAgent {
  static async ensureRasterImage(img) {
    if (img.mimeType !== 'image/svg+xml' && !img.dataUrl?.startsWith('data:image/svg+xml')) {
      return { mimeType: img.mimeType || 'image/jpeg', base64Data: img.base64Data };
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
        const jpegUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve({ mimeType: 'image/jpeg', base64Data: jpegUrl.split(',')[1] });
      };
      image.onerror = () => reject(new Error('Không thể xử lý ảnh mẫu'));
      image.src = img.dataUrl;
    });
  }

  static getCandidateModels(preferredModel) {
    const deprecated = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    const clean = (!preferredModel || deprecated.includes(preferredModel))
      ? 'gemini-3-flash-preview'
      : preferredModel;
    return [...new Set([clean, 'gemini-3-flash-preview', 'gemini-3.5-flash', 'gemini-3.8-flash'])];
  }

  static async extractTasks(compressedImages, apiKey = null, model = 'gemini-3-flash-preview') {
    const hasKey = apiKey && apiKey.trim().length > 10;
    const isPresetPack = compressedImages.every(img => img.isPreset);

    if (hasKey) {
      return await VisionAgent.callGeminiApi(compressedImages, apiKey.trim(), model);
    }

    if (!isPresetPack) {
      const err = new Error('Chưa có Gemini API Key để phân tích ảnh thật.');
      err.code = 'NO_API_KEY';
      throw err;
    }

    if (compressedImages.length === 1 && compressedImages[0].presetType === 'judge') {
      const judgeTask = await VisionAgent.extractHandwrittenPrompt();
      return { tasks: [judgeTask], modelUsed: 'preset', elapsedMs: 350 };
    }

    const tasks = await VisionAgent.simulateExtraction();
    return { tasks, modelUsed: 'preset', elapsedMs: 400 };
  }

  static async testApiKey(apiKey, model = 'gemini-3-flash-preview') {
    const candidates = VisionAgent.getCandidateModels(model);
    let lastErr = null;
    for (const m of candidates) {
      const t0 = performance.now();
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'OK' }] }] })
      });
      if (response.ok) {
        return { model: m, elapsedMs: Math.round(performance.now() - t0) };
      }
      const errText = await response.text();
      lastErr = new Error(`HTTP ${response.status}: ${errText.slice(0, 100)}`);
      if (response.status !== 404 && response.status !== 503) throw lastErr;
    }
    throw lastErr;
  }

  static async callGeminiApi(compressedImages, apiKey, model = 'gemini-3-flash-preview') {
    const t0 = performance.now();
    const now = new Date();
    const tzOffsetMin = -now.getTimezoneOffset();
    const sign = tzOffsetMin >= 0 ? '+' : '-';
    const absMin = Math.abs(tzOffsetMin);
    const pad = (n) => String(n).padStart(2, '0');
    const clientCurrentTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}${sign}${pad(Math.floor(absMin / 60))}:${pad(absMin % 60)}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh';

    const parts = [
      { text: buildSystemPrompt(clientCurrentTime, timezone) }
    ];

    const rasterList = await Promise.all(compressedImages.map(img => VisionAgent.ensureRasterImage(img)));
    for (const raster of rasterList) {
      if (raster.base64Data && raster.base64Data.length > 50) {
        parts.push({ inline_data: { mime_type: raster.mimeType, data: raster.base64Data } });
      }
    }

    const candidates = VisionAgent.getCandidateModels(model);
    let data = null;
    let modelUsed = candidates[0];
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
        modelUsed = m;
        break;
      }

      const errText = await response.text();
      lastErr = new Error(`HTTP ${response.status}: ${errText.slice(0, 140)}`);
      if (response.status !== 404 && response.status !== 503) throw lastErr;
    }

    if (!data) throw lastErr || new Error('Không thể kết nối Gemini API.');

    const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJsonText) throw new Error('Gemini API không trả về dữ liệu hợp lệ.');

    const cleanJsonText = rawJsonText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanJsonText);
    const tasks = (parsed.tasks || []).map((t, i) => ({
      ...t,
      id: t.id || `task_live_${Date.now()}_${i}`
    }));

    return {
      tasks,
      modelUsed,
      elapsedMs: Math.round(performance.now() - t0)
    };
  }

  static async simulateExtraction() {
    await new Promise(r => setTimeout(r, 400));

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
        title: 'Nộp bản cuối tiểu luận Marketing',
        source_quote: 'Hạn nộp bản cuối tiểu luận trước 17h thứ 6 tuần sau nha cả nhóm',
        source_image_index: 1,
        deadline_raw: '17h thứ 6 tuần sau',
        deadline_iso: null,
        needs_confirmation: true,
        question: '“Thứ 6 tuần sau” trong tin nhắn Zalo là ngày nào?',
        options: [nextFri.toISOString(), nextNextFri.toISOString()],
        estimated_minutes: 180,
        confidence: 0.82
      },
      {
        id: 'task_lms_' + (Date.now() + 1),
        title: 'Hoàn thành Quiz 4 Kinh tế vi mô',
        source_quote: 'LMS Canvas: Quiz 4 closes Sunday at 23:59',
        source_image_index: 2,
        deadline_raw: 'Chủ Nhật 23:59',
        deadline_iso: thisSun.toISOString(),
        needs_confirmation: false,
        question: null,
        options: [],
        estimated_minutes: 45,
        confidence: 0.96
      },
      {
        id: 'task_slide_' + (Date.now() + 2),
        title: 'Nộp slide thuyết trình Case Study 2',
        source_quote: 'Các nhóm nộp slide trước giờ vào lớp (08h00 thứ 3 tuần tới)',
        source_image_index: 3,
        deadline_raw: 'Thứ Ba 08:00',
        deadline_iso: nextTue.toISOString(),
        needs_confirmation: false,
        question: null,
        options: [],
        estimated_minutes: 120,
        confidence: 0.88
      }
    ];
  }

  static async extractHandwrittenPrompt() {
    await new Promise(r => setTimeout(r, 350));
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
