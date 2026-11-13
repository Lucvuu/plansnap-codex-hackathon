// PlanSnap Multi-modal Vision Agent Connector
// Tối ưu tốc độ (< 2s) với gemini-3-flash-preview + Auto-Fallback

const SYSTEM_PROMPT = `Bạn là bộ trích xuất lịch học tập PlanSnap. Đọc ảnh (Zalo, LMS, slide, viết tay) và trả về JSON.
Quy tắc:
1. Chỉ trích xuất việc có thật trong ảnh, kèm câu trích nguyên văn trong "source_quote". Không tự bịa.
2. Ngày tháng Việt Nam mặc định dd/mm (vd "3/4" = 03/04).
3. Dùng timestamp tin nhắn trong ảnh làm mốc suy luận ngày tương đối ("thứ 6 tuần sau", "ngày mai").
4. Nếu hạn chót mơ hồ: "needs_confirmation": true, điền "question" ngắn và "options" gồm 2 chuỗi ISO-8601 (+07:00). Nếu rõ: "needs_confirmation": false, điền "deadline_iso".
5. Ước lượng "estimated_minutes" (Quiz: 30-45, Đọc: 60, Bài lớn: 120-180).

JSON Schema:
{"tasks":[{"id":"t1","title":"Tên ngắn gọn","source_quote":"Trích nguyên văn","source_image_index":1,"deadline_raw":"Hạn gốc","deadline_iso":"2026-11-20T17:00:00+07:00","needs_confirmation":false,"question":null,"options":[],"estimated_minutes":60,"confidence":0.95}]}`;

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
    const parts = [
      { text: `${SYSTEM_PROMPT}\nHiện tại (+07:00): ${new Date().toISOString()}` }
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

    const parsed = JSON.parse(rawJsonText);
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
