// PlanSnap Main Application Controller - Clean Production Architecture
document.addEventListener('DOMContentLoaded', async () => {
  let compressedImages = [];
  let currentTasks = [];
  let scheduledEvents = [];
  let currentFilter = 'all';

  const SLOT_MAP = {
    'weekday-eve': [
      { day: 1, start: '19:30', end: '22:30' },
      { day: 2, start: '19:30', end: '22:30' },
      { day: 3, start: '19:30', end: '22:30' },
      { day: 4, start: '19:30', end: '22:30' },
      { day: 5, start: '19:30', end: '22:30' }
    ],
    'sat-morn': [{ day: 6, start: '08:30', end: '11:30' }],
    'sat-aft': [{ day: 6, start: '14:00', end: '17:00' }],
    'sun-morn': [{ day: 0, start: '08:30', end: '11:30' }],
    'sun-aft': [{ day: 0, start: '14:00', end: '17:00' }]
  };

  let enabledSlotKeys = ['weekday-eve', 'sat-morn', 'sat-aft', 'sun-morn', 'sun-aft'];

  // DOM Elements
  const tabPanes = document.querySelectorAll('.tab-pane');
  const navItems = document.querySelectorAll('.nav-item');
  const headerConnPill = document.getElementById('header-conn-pill');
  const headerConnStatus = document.getElementById('header-conn-status');

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const cameraInput = document.getElementById('camera-input');
  const btnCameraDirect = document.getElementById('btn-camera-direct');
  const previewGrid = document.getElementById('preview-grid');
  const btnScan = document.getElementById('btn-scan');
  const btnLoadPresetStudent = document.getElementById('btn-load-preset-student');
  const btnLoadPresetJudge = document.getElementById('btn-load-preset-judge');
  const progressContainer = document.getElementById('progress-container');
  const progressText = document.getElementById('progress-text');
  const progressBar = document.getElementById('progress-bar');
  const apiMissingAlert = document.getElementById('api-missing-alert');
  const btnGotoSettings = document.getElementById('btn-goto-settings');

  const tasksContainer = document.getElementById('tasks-container');
  const taskCountEl = document.getElementById('task-count');
  const clarificationArea = document.getElementById('clarification-area');
  const btnAddManualTask = document.getElementById('btn-add-manual-task');

  const scheduleContainer = document.getElementById('schedule-container');
  const btnExportIcs = document.getElementById('btn-export-ics');
  const dayPills = document.querySelectorAll('.day-pill');

  const apiKeyInput = document.getElementById('api-key-input');
  const modelSelect = document.getElementById('model-select');
  const btnTestKey = document.getElementById('btn-test-key');
  const btnSaveKey = document.getElementById('btn-save-key');
  const availToggles = document.querySelectorAll('.avail-toggle');
  const btnClearDb = document.getElementById('btn-clear-db');
  const clearConfirmBox = document.getElementById('clear-confirm-box');
  const btnClearCancel = document.getElementById('btn-clear-cancel');
  const btnClearConfirm = document.getElementById('btn-clear-confirm');

  const modalBackdrop = document.getElementById('task-modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalForm = document.getElementById('task-modal-form');
  const modalTaskId = document.getElementById('modal-task-id');
  const modalTaskTitle = document.getElementById('modal-task-title');
  const modalTaskDeadline = document.getElementById('modal-task-deadline');
  const modalTaskDuration = document.getElementById('modal-task-duration');
  const btnModalClose = document.getElementById('btn-modal-close');
  const btnModalCancel = document.getElementById('btn-modal-cancel');

  const toastEl = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer = null;

  function showToast(message) {
    toastMsg.innerText = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  function switchTab(tabId) {
    navItems.forEach(n => n.classList.toggle('active', n.dataset.tab === tabId));
    tabPanes.forEach(p => p.classList.toggle('active', p.id === tabId));
  }

  function updateConnectionStatus() {
    const hasKey = apiKeyInput.value.trim().length > 10;
    if (hasKey) {
      headerConnPill.classList.add('live');
      headerConnStatus.innerText = 'Gemini Live';
      apiMissingAlert.hidden = true;
    } else {
      headerConnPill.classList.remove('live');
      headerConnStatus.innerText = 'Chế độ mẫu';
    }
  }

  function getCustomSlots() {
    const slots = [];
    enabledSlotKeys.forEach(key => {
      if (SLOT_MAP[key]) slots.push(...SLOT_MAP[key]);
    });
    return slots;
  }

  function toDatetimeLocalValue(isoString) {
    const d = isoString ? new Date(isoString) : new Date(Date.now() + 24 * 3600 * 1000);
    if (isNaN(d.getTime())) return '';
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function formatDayHeader(dateObj) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const diffDays = Math.round((targetStart - todayStart) / 86400000);

    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
    if (diffDays === 0) return `Hôm nay · ${dateStr}`;
    if (diffDays === 1) return `Ngày mai · ${dateStr}`;
    return `${dayNames[dateObj.getDay()]} · ${dateStr}`;
  }

  // 1. Navigation
  navItems.forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });

  headerConnPill.addEventListener('click', () => switchTab('tab-settings'));
  btnGotoSettings.addEventListener('click', () => switchTab('tab-settings'));

  // 2. Restore State from IndexedDB
  async function loadPersistedState() {
    try {
      const [savedTasks, savedSchedule, savedApiKey, savedModel, savedSlots] = await Promise.all([
        window.storage.getTasks(),
        window.storage.getSchedule(),
        window.storage.getSetting('gemini_api_key', ''),
        window.storage.getSetting('gemini_model', 'gemini-3.8-flash'),
        window.storage.getSetting('available_slots', null)
      ]);

      if (savedApiKey) apiKeyInput.value = savedApiKey;
      const migratedModel = (!savedModel || savedModel === 'gemini-2.5-flash' || savedModel === 'gemini-2.0-flash')
        ? 'gemini-3.8-flash'
        : savedModel;
      modelSelect.value = migratedModel;
      if (Array.isArray(savedSlots)) enabledSlotKeys = savedSlots;

      availToggles.forEach(toggle => {
        toggle.classList.toggle('active', enabledSlotKeys.includes(toggle.dataset.slot));
      });

      updateConnectionStatus();

      if (savedTasks && savedTasks.length > 0) {
        currentTasks = savedTasks;
      }
      if (savedSchedule && savedSchedule.length > 0) {
        scheduledEvents = savedSchedule;
      }

      renderTasks();
      renderSchedule();
    } catch (err) {
      console.error('[Storage] Error restoring state:', err);
    }
  }

  await loadPersistedState();

  // 3. Image Selection, Drag & Drop, Camera Capture
  async function handleFilesSelected(files) {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).slice(0, 5);
    compressedImages = [];
    apiMissingAlert.hidden = true;
    showToast(`Đang nén ${validFiles.length} ảnh...`);

    try {
      for (const file of validFiles) {
        const result = await window.ImageCompressor.compress(file);
        compressedImages.push({ ...result, isPreset: false });
      }
      renderPreviewGrid(compressedImages);
      btnScan.disabled = false;
      btnScan.innerText = `Trích xuất ${compressedImages.length} ảnh & Xếp lịch`;
    } catch (err) {
      showToast('Không thể đọc ảnh: ' + err.message);
    }
  }

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    handleFilesSelected(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', (e) => {
    handleFilesSelected(e.target.files);
    fileInput.value = '';
  });

  btnCameraDirect.addEventListener('click', () => cameraInput.click());
  cameraInput.addEventListener('change', (e) => {
    handleFilesSelected(e.target.files);
    cameraInput.value = '';
  });

  function renderPreviewGrid(images) {
    previewGrid.innerHTML = '';
    images.forEach((img, idx) => {
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.innerHTML = `
        <img src="${img.dataUrl}" alt="${img.name || 'Ảnh'}">
        <button class="preview-remove" type="button" data-idx="${idx}" aria-label="Xóa ảnh">&times;</button>
      `;
      previewGrid.appendChild(div);
    });

    previewGrid.querySelectorAll('.preview-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx, 10);
        compressedImages.splice(idx, 1);
        renderPreviewGrid(compressedImages);
        btnScan.disabled = compressedImages.length === 0;
        btnScan.innerText = compressedImages.length > 0
          ? `Trích xuất ${compressedImages.length} ảnh & Xếp lịch`
          : 'Trích xuất việc & Xếp lịch';
      });
    });
  }

  // 4. Sample Presets
  btnLoadPresetStudent.addEventListener('click', () => {
    compressedImages = window.VisionAgent.getSampleImages().studentPack;
    apiMissingAlert.hidden = true;
    renderPreviewGrid(compressedImages);
    btnScan.disabled = false;
    btnScan.innerText = 'Trích xuất 3 ảnh mẫu & Xếp lịch';
    showToast('Đã nạp 3 ảnh mẫu Zalo / LMS / Slide');
  });

  btnLoadPresetJudge.addEventListener('click', () => {
    compressedImages = [window.VisionAgent.getSampleImages().judgeHandwritten];
    apiMissingAlert.hidden = true;
    renderPreviewGrid(compressedImages);
    btnScan.disabled = false;
    btnScan.innerText = 'Trích xuất ghi chú viết tay';
    showToast('Đã nạp ảnh ghi chú viết tay');
  });

  // 5. Run Vision Agent Extraction
  btnScan.addEventListener('click', async () => {
    if (compressedImages.length === 0) return;

    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value || 'gemini-3.8-flash';

    btnScan.disabled = true;
    apiMissingAlert.hidden = true;
    progressContainer.style.display = 'flex';
    progressBar.style.width = '25%';
    progressText.innerText = apiKey ? 'Đang gửi ảnh tới Gemini Vision API...' : 'Đang trích xuất ảnh mẫu...';

    try {
      const t1 = setTimeout(() => {
        progressBar.style.width = '65%';
        progressText.innerText = 'Đang đối chiếu câu trích và thời hạn...';
      }, 600);

      const extracted = await window.VisionAgent.extractTasks(compressedImages, apiKey, model);
      clearTimeout(t1);

      if (extracted.length === 0) {
        progressContainer.style.display = 'none';
        btnScan.disabled = false;
        showToast('Không phát hiện đầu việc hoặc hạn chót nào trong ảnh');
        return;
      }

      // Tránh trùng lặp nếu quét lại cùng một ảnh/preset
      const existingKeys = new Set(currentTasks.map(t => `${t.title}::${t.source_quote}`));
      const uniqueNew = extracted.filter(t => !existingKeys.has(`${t.title}::${t.source_quote}`));
      currentTasks = [...uniqueNew, ...currentTasks];
      await window.storage.saveTasks(currentTasks);

      progressBar.style.width = '100%';
      progressText.innerText = `Hoàn tất (${extracted.length} đầu việc)`;
      showToast(`Đã trích xuất ${extracted.length} đầu việc`);

      setTimeout(() => {
        progressContainer.style.display = 'none';
        btnScan.disabled = false;
        renderTasks();
        switchTab('tab-tasks');
      }, 350);
    } catch (err) {
      progressContainer.style.display = 'none';
      btnScan.disabled = false;
      if (err.code === 'NO_API_KEY') {
        apiMissingAlert.hidden = false;
        showToast('Vui lòng nhập Gemini API Key để đọc ảnh thật');
      } else {
        showToast('Lỗi AI: ' + err.message);
      }
    }
  });

  // 6. Render Tasks & Ambiguity Clarification
  function renderTasks() {
    tasksContainer.innerHTML = '';
    clarificationArea.innerHTML = '';
    const activeCount = currentTasks.filter(t => !t.completed).length;
    taskCountEl.innerText = activeCount;

    if (currentTasks.length === 0) {
      tasksContainer.innerHTML = `
        <div class="empty-state">
          Chưa có đầu việc nào.<br>
          Hãy quét ảnh ở tab "Quét ảnh" hoặc bấm "+ Thêm việc".
        </div>
      `;
      triggerAutoScheduling();
      return;
    }

    const ambiguousTask = currentTasks.find(t => t.needs_confirmation && !t.completed);

    if (ambiguousTask) {
      const clarifyCard = document.createElement('div');
      clarifyCard.className = 'clarify-card';
      clarifyCard.innerHTML = `
        <div class="clarify-badge">Cần xác nhận 1 chạm</div>
        <div class="clarify-question">${ambiguousTask.question || 'Hạn chót chưa rõ ràng, vui lòng chọn ngày:'}</div>
        <div class="clarify-options">
          ${(ambiguousTask.options || []).map(opt => {
            const d = new Date(opt);
            const dayName = d.getDay() === 0 ? 'CN' : `Thứ ${d.getDay() + 1}`;
            const label = `${dayName}, ${d.getDate()}/${d.getMonth() + 1} (${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')})`;
            return `<button class="btn-option" type="button" data-task-id="${ambiguousTask.id}" data-val="${opt}">${label}</button>`;
          }).join('')}
        </div>
      `;
      clarificationArea.appendChild(clarifyCard);

      clarifyCard.querySelectorAll('.btn-option').forEach(btn => {
        btn.addEventListener('click', async () => {
          const target = currentTasks.find(t => t.id === btn.dataset.taskId);
          if (target) {
            target.deadline_iso = btn.dataset.val;
            target.needs_confirmation = false;
            await window.storage.saveTasks(currentTasks);
            showToast('Đã xác nhận hạn chót');
            renderTasks();
          }
        });
      });
    }

    currentTasks.forEach((task, index) => {
      const item = document.createElement('div');
      item.className = `task-item ${task.completed ? 'completed' : ''}`;

      let deadlineDisplay = 'Chưa xác định';
      let badgeClass = 'badge-amber';

      if (task.deadline_iso) {
        const d = new Date(task.deadline_iso);
        deadlineDisplay = `${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')} · ${d.getDate()}/${d.getMonth() + 1}`;
        badgeClass = 'badge-green';
      }

      item.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Đánh dấu hoàn thành">
        <div class="task-body">
          <div class="task-header">
            <div class="task-title"></div>
            <span class="task-badge ${badgeClass}">${task.needs_confirmation ? 'Chờ xác nhận' : 'Rõ hạn'}</span>
          </div>
          <div class="task-quote"></div>
          <div class="task-footer">
            <span>Hạn: <strong>${deadlineDisplay}</strong> · ${task.estimated_minutes || 60}p</span>
            <div class="task-actions">
              <button class="btn-text-action btn-edit-task" type="button">Sửa</button>
              <button class="btn-text-action danger btn-del-task" type="button">Xóa</button>
            </div>
          </div>
        </div>
      `;

      item.querySelector('.task-title').innerText = task.title;
      item.querySelector('.task-quote').innerText = `"${task.source_quote || 'Nhập thủ công'}"`;

      item.querySelector('.task-checkbox').addEventListener('change', async (e) => {
        currentTasks[index].completed = e.target.checked;
        await window.storage.saveTasks(currentTasks);
        renderTasks();
      });

      item.querySelector('.btn-edit-task').addEventListener('click', () => openTaskModal(task));

      item.querySelector('.btn-del-task').addEventListener('click', async () => {
        currentTasks.splice(index, 1);
        await window.storage.saveTasks(currentTasks);
        showToast('Đã xóa đầu việc');
        renderTasks();
      });

      tasksContainer.appendChild(item);
    });

    triggerAutoScheduling();
  }

  // 7. Bottom-Sheet Modal for Add / Edit Task
  function openTaskModal(task = null) {
    if (task) {
      modalTitle.innerText = 'Chỉnh sửa đầu việc';
      modalTaskId.value = task.id;
      modalTaskTitle.value = task.title;
      modalTaskDeadline.value = toDatetimeLocalValue(task.deadline_iso);
      modalTaskDuration.value = String(task.estimated_minutes || 60);
    } else {
      modalTitle.innerText = 'Thêm đầu việc mới';
      modalTaskId.value = '';
      modalTaskTitle.value = '';
      const def = new Date();
      def.setDate(def.getDate() + 1);
      def.setHours(20, 0, 0, 0);
      modalTaskDeadline.value = toDatetimeLocalValue(def.toISOString());
      modalTaskDuration.value = '60';
    }
    modalBackdrop.hidden = false;
    modalTaskTitle.focus();
  }

  function closeTaskModal() {
    modalBackdrop.hidden = true;
  }

  btnAddManualTask.addEventListener('click', () => openTaskModal(null));
  btnModalClose.addEventListener('click', closeTaskModal);
  btnModalCancel.addEventListener('click', closeTaskModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeTaskModal();
  });

  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = modalTaskTitle.value.trim();
    const deadlineVal = modalTaskDeadline.value;
    const duration = parseInt(modalTaskDuration.value, 10) || 60;
    if (!title || !deadlineVal) return;

    const deadlineIso = new Date(deadlineVal).toISOString();
    const existingId = modalTaskId.value;

    if (existingId) {
      const target = currentTasks.find(t => t.id === existingId);
      if (target) {
        target.title = title;
        target.deadline_iso = deadlineIso;
        target.estimated_minutes = duration;
        target.needs_confirmation = false;
      }
      showToast('Đã cập nhật đầu việc');
    } else {
      currentTasks.unshift({
        id: 'task_manual_' + Date.now(),
        title,
        source_quote: 'Nhập thủ công',
        source_image_index: 0,
        deadline_raw: deadlineVal,
        deadline_iso: deadlineIso,
        needs_confirmation: false,
        question: null,
        options: [],
        estimated_minutes: duration,
        completed: false,
        confidence: 1.0
      });
      showToast('Đã thêm đầu việc mới');
    }

    await window.storage.saveTasks(currentTasks);
    closeTaskModal();
    renderTasks();
  });

  // 8. Deterministic Scheduling (Respects user's enabled availability slots)
  async function triggerAutoScheduling() {
    const scheduler = new window.PlanSnapScheduler();
    const activeTasks = currentTasks.filter(t => !t.completed);
    const customSlots = getCustomSlots();
    scheduledEvents = customSlots.length > 0 ? scheduler.schedule(activeTasks, customSlots) : [];
    await window.storage.saveSchedule(scheduledEvents);
    renderSchedule();
  }

  // 9. Render Schedule Grouped by Day
  function renderSchedule() {
    scheduleContainer.innerHTML = '';

    if (scheduledEvents.length === 0) {
      const noSlots = getCustomSlots().length === 0;
      scheduleContainer.innerHTML = `
        <div class="empty-state">
          ${noSlots
            ? 'Bạn đang tắt toàn bộ khung giờ rảnh trong Cài đặt.<br>Hãy bật ít nhất 1 khung giờ để xếp lịch.'
            : 'Chưa có phiên làm việc nào.<br>Hãy quét ảnh hoặc xác nhận các hạn chót mơ hồ ở tab Đầu việc.'}
        </div>
      `;
      return;
    }

    const now = new Date();
    const sortedEvents = [...scheduledEvents].sort((a, b) => new Date(a.start) - new Date(b.start));
    const filteredEvents = sortedEvents.filter(ev => {
      if (currentFilter === 'all') return true;
      const evDate = new Date(ev.start);
      if (currentFilter === 'today') {
        return evDate.getDate() === now.getDate() && evDate.getMonth() === now.getMonth() && evDate.getFullYear() === now.getFullYear();
      }
      if (currentFilter === 'upcoming') {
        return evDate >= now;
      }
      return true;
    });

    if (filteredEvents.length === 0) {
      scheduleContainer.innerHTML = `<div class="empty-state">Không có phiên làm việc nào trong khoảng thời gian này.</div>`;
      return;
    }

    let lastGroupKey = '';
    const pad = n => String(n).padStart(2, '0');

    filteredEvents.forEach(ev => {
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      const groupKey = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;

      if (groupKey !== lastGroupKey) {
        const groupHeader = document.createElement('div');
        groupHeader.className = 'day-group-header';
        groupHeader.innerText = formatDayHeader(start);
        scheduleContainer.appendChild(groupHeader);
        lastGroupKey = groupKey;
      }

      const timeRange = `${pad(start.getHours())}:${pad(start.getMinutes())} – ${pad(end.getHours())}:${pad(end.getMinutes())}`;
      const deadlineDate = ev.deadline_iso ? new Date(ev.deadline_iso) : null;
      const hoursBeforeDeadline = deadlineDate ? Math.round((deadlineDate - end) / 3600000) : null;
      let bufferLabel = '';
      if (hoursBeforeDeadline !== null) {
        if (ev.isPastDeadline || hoursBeforeDeadline < 0) {
          bufferLabel = 'Cảnh báo: Không đủ giờ rảnh trước hạn';
        } else if (hoursBeforeDeadline < 3) {
          bufferLabel = `Sát hạn (${hoursBeforeDeadline}h)`;
        } else {
          bufferLabel = `Còn ${hoursBeforeDeadline}h trước hạn`;
        }
      }

      const gcalUrl = window.ICalExporter.getGoogleCalendarLink(ev);

      const el = document.createElement('div');
      el.className = `timeline-item ${ev.isUrgent ? 'urgent' : ''}`;
      el.innerHTML = `
        <div class="timeline-content">
          <div class="timeline-time">${timeRange} · ${ev.durationMinutes} phút</div>
          <div class="timeline-title"></div>
          <div class="timeline-meta">
            <span>${bufferLabel}</span>
          </div>
        </div>
        <a href="${gcalUrl}" target="_blank" rel="noopener" class="gcal-link">Google Cal</a>
      `;
      el.querySelector('.timeline-title').innerText = ev.originalTitle || ev.title;
      scheduleContainer.appendChild(el);
    });
  }

  dayPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dayPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderSchedule();
    });
  });

  // 10. Export .ics
  btnExportIcs.addEventListener('click', () => {
    if (scheduledEvents.length === 0) {
      showToast('Chưa có lịch để xuất');
      return;
    }
    window.ICalExporter.downloadIcsFile(scheduledEvents);
    showToast('Đã tải tệp plansnap_lich_lam_viec.ics');
  });

  // 11. Settings: API Key, Test Connection, Availability Toggles, Clear DB
  btnSaveKey.addEventListener('click', async () => {
    await window.storage.saveSetting('gemini_api_key', apiKeyInput.value.trim());
    await window.storage.saveSetting('gemini_model', modelSelect.value);
    updateConnectionStatus();
    showToast('Đã lưu cài đặt vào IndexedDB');
  });

  btnTestKey.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      showToast('Vui lòng nhập API Key trước');
      return;
    }
    btnTestKey.disabled = true;
    btnTestKey.innerText = 'Đang kiểm tra...';
    try {
      const workingModel = await window.VisionAgent.testApiKey(key, modelSelect.value);
      if (workingModel) modelSelect.value = workingModel;
      await window.storage.saveSetting('gemini_api_key', key);
      await window.storage.saveSetting('gemini_model', modelSelect.value);
      updateConnectionStatus();
      showToast(`Kết nối thành công (${modelSelect.value})`);
    } catch (err) {
      showToast('Kết nối thất bại: ' + err.message);
    } finally {
      btnTestKey.disabled = false;
      btnTestKey.innerText = 'Kiểm tra kết nối';
    }
  });

  availToggles.forEach(toggle => {
    toggle.addEventListener('click', async () => {
      const slotKey = toggle.dataset.slot;
      toggle.classList.toggle('active');
      if (toggle.classList.contains('active')) {
        if (!enabledSlotKeys.includes(slotKey)) enabledSlotKeys.push(slotKey);
      } else {
        enabledSlotKeys = enabledSlotKeys.filter(k => k !== slotKey);
      }
      await window.storage.saveSetting('available_slots', enabledSlotKeys);
      await triggerAutoScheduling();
      showToast('Đã cập nhật khung giờ rảnh');
    });
  });

  btnClearDb.addEventListener('click', () => {
    clearConfirmBox.hidden = false;
  });

  btnClearCancel.addEventListener('click', () => {
    clearConfirmBox.hidden = true;
  });

  btnClearConfirm.addEventListener('click', async () => {
    await window.storage.clearAll();
    currentTasks = [];
    scheduledEvents = [];
    compressedImages = [];
    previewGrid.innerHTML = '';
    btnScan.disabled = true;
    btnScan.innerText = 'Trích xuất việc & Xếp lịch';
    clearConfirmBox.hidden = true;
    updateConnectionStatus();
    renderTasks();
    renderSchedule();
    showToast('Đã xóa toàn bộ dữ liệu cục bộ');
  });

  // 12. PostMessage bridge for Showcase Frame
  window.addEventListener('message', async (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;
    switch (data.type) {
      case 'TRIGGER_STUDENT_PRESET':
        switchTab('tab-capture');
        btnLoadPresetStudent.click();
        setTimeout(() => btnScan.click(), 300);
        break;
      case 'TRIGGER_JUDGE_PRESET':
        switchTab('tab-capture');
        btnLoadPresetJudge.click();
        setTimeout(() => btnScan.click(), 300);
        break;
      case 'SIMULATE_SWIPE_KILL':
        showToast('Đang đóng và mở lại ứng dụng...');
        setTimeout(() => window.location.reload(), 400);
        break;
      case 'SWITCH_TAB':
        switchTab(data.tab || 'tab-capture');
        break;
      case 'TRIGGER_EXPORT_ICS':
        switchTab('tab-schedule');
        setTimeout(() => btnExportIcs.click(), 250);
        break;
    }
  });

  // 13. Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
