/**
 * PlanSnap Core Application Controller (v2.2)
 * Handles Capture -> Vision Extraction -> Interactive Clarification -> Deterministic Scheduling -> IndexedDB Persistence
 */
(() => {
    'use strict';

    const DEFAULT_MODEL = 'gemini-3-flash-preview';
    const DEPRECATED_MODELS = new Set([
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-pro'
    ]);

    const scheduler = new window.PlanSnapScheduler();

    const DEFAULT_SLOTS = {
        'weekday-eve': true,
        'sat-morn': true,
        'sat-aft': true,
        'sun-morn': true,
        'sun-aft': true
    };

    function getEnabledSlotDefs() {
        const defs = [];
        if (state.slots['weekday-eve']) {
            for (let d = 1; d <= 5; d++) {
                defs.push({ day: d, start: '19:30', end: '22:30' });
            }
        }
        if (state.slots['sat-morn']) defs.push({ day: 6, start: '08:30', end: '11:30' });
        if (state.slots['sat-aft']) defs.push({ day: 6, start: '14:00', end: '17:00' });
        if (state.slots['sun-morn']) defs.push({ day: 0, start: '08:30', end: '11:30' });
        if (state.slots['sun-aft']) defs.push({ day: 0, start: '14:00', end: '17:00' });
        return defs;
    }

    function formatClarifyOptionLabel(opt) {
        if (opt && typeof opt === 'object' && opt.label) return opt.label;
        const iso = typeof opt === 'string' ? opt : opt?.deadline_iso;
        const d = new Date(iso);
        if (isNaN(d.getTime())) return String(opt || '');
        const dayNames = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        return `${dayNames[d.getDay()]}, ${dd}/${mm} · ${hh}:${mi}`;
    }

    const state = {
        images: [],
        tasks: [],
        schedule: [],
        apiKey: '',
        model: DEFAULT_MODEL,
        slots: { ...DEFAULT_SLOTS },
        selectedDayKey: 'all',
        activeTab: 'capture',
        isScanning: false,
        timerInterval: null
    };

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    const el = {
        headerConnPill: $('#header-conn-pill'),
        headerConnStatus: $('#header-conn-status'),

        dropzone: $('#dropzone'),
        btnPickGallery: $('#btn-pick-gallery'),
        btnCameraDirect: $('#btn-camera-direct'),
        fileInput: $('#file-input'),
        cameraInput: $('#camera-input'),
        previewGrid: $('#preview-grid'),
        btnScan: $('#btn-scan'),
        progressContainer: $('#progress-container'),
        progressText: $('#progress-text'),
        progressTimer: $('#progress-timer'),
        progressBar: $('#progress-bar'),
        apiMissingAlert: $('#api-missing-alert'),
        btnGotoSettings: $('#btn-goto-settings'),
        btnLoadPresetStudent: $('#btn-load-preset-student'),
        btnLoadPresetJudge: $('#btn-load-preset-judge'),

        taskSummaryText: $('#task-summary-text'),
        tasksProgressFill: $('#tasks-progress-fill'),
        btnAddManualTask: $('#btn-add-manual-task'),
        clarificationArea: $('#clarification-area'),
        tasksContainer: $('#tasks-container'),
        navTasksBadge: $('#nav-tasks-badge'),

        scheduleSummaryText: $('#schedule-summary-text'),
        btnExportIcs: $('#btn-export-ics'),
        weekStrip: $('#week-strip'),
        scheduleContainer: $('#schedule-container'),

        apiKeyInput: $('#api-key-input'),
        btnToggleKeyVis: $('#btn-toggle-key-vis'),
        modelSelect: $('#model-select'),
        btnTestKey: $('#btn-test-key'),
        btnSaveKey: $('#btn-save-key'),
        slotToggles: $$('.list-toggle[data-slot]'),
        btnClearDb: $('#btn-clear-db'),
        clearConfirmBox: $('#clear-confirm-box'),
        btnClearCancel: $('#btn-clear-cancel'),
        btnClearConfirm: $('#btn-clear-confirm'),

        taskModalBackdrop: $('#task-modal-backdrop'),
        modalTitle: $('#modal-title'),
        taskModalForm: $('#task-modal-form'),
        modalTaskId: $('#modal-task-id'),
        modalTaskTitle: $('#modal-task-title'),
        modalTaskDeadline: $('#modal-task-deadline'),
        modalTaskDuration: $('#modal-task-duration'),
        btnModalClose: $('#btn-modal-close'),
        btnModalCancel: $('#btn-modal-cancel'),

        navItems: $$('.nav-item[data-tab]'),
        tabPanes: $$('.tab-pane'),
        toast: $('#toast')
    };

    let toastTimer = null;
    function showToast(msg, type = 'info') {
        if (!el.toast) return;
        el.toast.textContent = msg;
        el.toast.className = `toast ${type} visible`;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            el.toast.classList.remove('visible');
        }, 3200);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatDayKey(dateObj) {
        const d = new Date(dateObj);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    function formatTimeHM(dateObj) {
        const d = new Date(dateObj);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    function formatDeadlineLabel(iso) {
        if (!iso) return { text: 'Chưa rõ hạn', urgent: false };
        const d = new Date(iso);
        if (isNaN(d.getTime())) return { text: 'Chưa rõ hạn', urgent: false };
        const now = new Date();
        const diffHours = (d - now) / 3600000;
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        const urgent = diffHours <= 24;
        if (diffHours < 0) return { text: `Quá hạn (${dd}/${mm} ${hh}:${mi})`, urgent: true };
        if (diffHours < 24) return { text: `Gấp · ${hh}:${mi} ${dd}/${mm}`, urgent: true };
        return { text: `${hh}:${mi} · ${dd}/${mm}`, urgent: false };
    }

    function toDatetimeLocalValue(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '';
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    }

    function switchTab(tabName) {
        const targetId = tabName.startsWith('tab-') ? tabName : `tab-${tabName}`;
        state.activeTab = targetId;
        el.navItems.forEach((btn) => {
            const active = btn.dataset.tab === targetId;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        el.tabPanes.forEach((pane) => {
            pane.classList.toggle('active', pane.id === targetId);
        });
    }

    function updateConnectionUI() {
        const hasKey = Boolean(state.apiKey && state.apiKey.trim());
        if (el.headerConnPill) {
            el.headerConnPill.className = `conn-pill ${hasKey ? 'live' : 'demo'}`;
        }
        if (el.headerConnStatus) {
            el.headerConnStatus.textContent = hasKey ? 'Gemini Live' : 'Demo';
        }
        if (el.apiMissingAlert) {
            el.apiMissingAlert.hidden = hasKey;
        }
    }

    function renderImagePreviews() {
        if (!el.previewGrid) return;
        const count = state.images.length;
        el.previewGrid.hidden = count === 0;
        el.previewGrid.innerHTML = '';

        state.images.forEach((img, idx) => {
            const item = document.createElement('div');
            item.className = 'preview-item';

            const sizeLabel = img.compressedSizeKb
                ? `${img.compressedSizeKb} KB`
                : 'Mẫu';

            item.innerHTML = `
                <img src="${img.dataUrl}" alt="${escapeHtml(img.fileName || img.name || 'Ảnh ' + (idx + 1))}">
                <span class="preview-size">${escapeHtml(sizeLabel)}</span>
                <button type="button" class="preview-remove" data-idx="${idx}" aria-label="Xóa ảnh">×</button>
            `;
            el.previewGrid.appendChild(item);
        });

        if (el.btnScan) {
            el.btnScan.disabled = count === 0 || state.isScanning;
            el.btnScan.textContent = count > 0
                ? `Trích xuất ${count} ảnh & Xếp lịch`
                : 'Trích xuất & Xếp lịch';
        }
    }

    async function handleFilesSelected(fileList) {
        const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
        if (!files.length) return;

        const remaining = 5 - state.images.length;
        if (remaining <= 0) {
            showToast('Tối đa 5 ảnh mỗi lần quét.', 'warning');
            return;
        }
        const toProcess = files.slice(0, remaining);

        try {
            const compressed = await Promise.all(
                toProcess.map((file) => window.ImageCompressor.compress(file))
            );
            state.images.push(...compressed);
            renderImagePreviews();
            if (files.length > remaining) {
                showToast(`Đã thêm ${toProcess.length} ảnh (tối đa 5 ảnh).`, 'warning');
            }
        } catch (err) {
            showToast(`Lỗi nén ảnh: ${err.message}`, 'error');
        }
    }

    async function loadPreset(presetType) {
        const samples = window.VisionAgent.getSampleImages();
        const chosen = presetType === 'judge'
            ? (samples.judgeHandwritten ? [samples.judgeHandwritten] : [])
            : (samples.studentPack || []);
        state.images = chosen.map((s) => ({ ...s, isPreset: true, presetType }));
        renderImagePreviews();
        switchTab('capture');
        showToast(
            presetType === 'judge'
                ? 'Đã nạp ảnh ghi chú viết tay mẫu.'
                : 'Đã nạp 3 ảnh mẫu Zalo / LMS / Slide.',
            'info'
        );
    }

    function startProgressTimer() {
        const start = performance.now();
        if (el.progressTimer) el.progressTimer.textContent = '0.0s';
        clearInterval(state.timerInterval);
        state.timerInterval = setInterval(() => {
            if (el.progressTimer) {
                const sec = ((performance.now() - start) / 1000).toFixed(1);
                el.progressTimer.textContent = `${sec}s`;
            }
        }, 100);
    }

    function stopProgressTimer() {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }

    async function runExtraction() {
        if (!state.images.length || state.isScanning) return;
        state.isScanning = true;
        renderImagePreviews();

        if (el.progressContainer) el.progressContainer.hidden = false;
        if (el.progressBar) el.progressBar.style.width = '24%';
        if (el.progressText) el.progressText.textContent = 'Đang gửi ảnh tới Gemini Vision...';
        startProgressTimer();

        try {
            setTimeout(() => {
                if (state.isScanning && el.progressBar) {
                    el.progressBar.style.width = '68%';
                    if (el.progressText) el.progressText.textContent = 'Đang đối chiếu câu trích & thời hạn...';
                }
            }, 450);

            const result = await window.VisionAgent.extractTasks(
                state.images,
                state.apiKey,
                state.model
            );

            const extracted = Array.isArray(result) ? result : (result.tasks || []);
            const elapsedMs = result.elapsedMs || 0;
            const modelUsed = result.modelUsed || state.model;

            if (el.progressBar) el.progressBar.style.width = '100%';
            if (el.progressText) el.progressText.textContent = 'Hoàn tất xếp lịch!';

            // Merge or replace: keep existing manual/completed if needed, or append new unique tasks
            const newTasks = extracted.map((t) => ({
                ...t,
                completed: Boolean(t.completed)
            }));
            state.tasks = newTasks;
            await recomputeAndPersist();

            const sec = (elapsedMs / 1000).toFixed(1);
            const hasKey = Boolean(state.apiKey && state.apiKey.trim());
            showToast(
                hasKey
                    ? `Đã trích xuất ${newTasks.length} đầu việc (${sec}s · ${modelUsed})`
                    : `Demo: ${newTasks.length} đầu việc được xếp lịch (${sec}s)`,
                'success'
            );

            setTimeout(() => {
                if (el.progressContainer) el.progressContainer.hidden = true;
                if (el.progressBar) el.progressBar.style.width = '0%';
                switchTab('tasks');
            }, 220);
        } catch (err) {
            showToast(`Lỗi AI: ${err.message}`, 'error');
            if (el.progressContainer) el.progressContainer.hidden = true;
        } finally {
            stopProgressTimer();
            state.isScanning = false;
            renderImagePreviews();
        }
    }

    async function recomputeAndPersist() {
        const activeTasks = state.tasks.filter((t) => !t.completed);
        state.schedule = scheduler.schedule(activeTasks, getEnabledSlotDefs(), new Date());
        await window.storage.saveTasks(state.tasks);
        await window.storage.saveSchedule(state.schedule);
        renderTasks();
        renderSchedule();
    }

    function renderTasks() {
        const total = state.tasks.length;
        const doneCount = state.tasks.filter((t) => t.completed).length;
        const pendingCount = total - doneCount;

        if (el.navTasksBadge) {
            el.navTasksBadge.hidden = pendingCount === 0;
            el.navTasksBadge.textContent = String(pendingCount);
        }

        if (el.taskSummaryText) {
            if (total === 0) {
                el.taskSummaryText.textContent = 'Chưa có đầu việc nào';
            } else {
                el.taskSummaryText.textContent = `${pendingCount} việc cần làm · ${doneCount}/${total} hoàn thành`;
            }
        }

        if (el.tasksProgressFill) {
            const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
            el.tasksProgressFill.style.width = `${pct}%`;
        }

        // Clarification cards for ambiguous deadlines
        if (el.clarificationArea) {
            const ambiguous = state.tasks.filter((t) => !t.completed && t.needs_confirmation);
            el.clarificationArea.innerHTML = '';
            ambiguous.forEach((task) => {
                const opts = task.options || task.clarification_options || [];
                const card = document.createElement('div');
                card.className = 'clarify-card';
                const chipsHtml = opts.map((opt, i) => `
                    <button type="button" class="clarify-chip" data-task-id="${escapeHtml(task.id)}" data-opt-idx="${i}">
                        ${escapeHtml(formatClarifyOptionLabel(opt))}
                    </button>
                `).join('');

                card.innerHTML = `
                    <div class="clarify-title">${escapeHtml(task.question || ('Cần xác nhận hạn: ' + task.title))}</div>
                    <div class="clarify-quote">“${escapeHtml(task.source_quote || '')}”</div>
                    <div class="clarify-chips">${chipsHtml}</div>
                `;
                el.clarificationArea.appendChild(card);
            });
        }

        if (!el.tasksContainer) return;
        if (total === 0) {
            el.tasksContainer.innerHTML = `
                <div class="empty-state">
                    Chưa có đầu việc nào. Hãy chụp hoặc nạp ảnh mẫu ở tab <strong>Quét ảnh</strong>.
                </div>
            `;
            return;
        }

        // Sort: incomplete first, then by deadline
        const sorted = [...state.tasks].sort((a, b) => {
            if (Boolean(a.completed) !== Boolean(b.completed)) {
                return a.completed ? 1 : -1;
            }
            const da = a.deadline_iso ? new Date(a.deadline_iso).getTime() : Infinity;
            const db = b.deadline_iso ? new Date(b.deadline_iso).getTime() : Infinity;
            return da - db;
        });

        el.tasksContainer.innerHTML = '';
        sorted.forEach((task) => {
            const row = document.createElement('div');
            row.className = `task-item${task.completed ? ' completed' : ''}`;
            const dl = formatDeadlineLabel(task.deadline_iso);

            row.innerHTML = `
                <button type="button" class="task-check-btn" data-id="${escapeHtml(task.id)}" aria-label="Đánh dấu hoàn thành">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
                <div class="task-body">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    <div class="task-meta">
                        <span class="deadline-chip${dl.urgent ? ' urgent' : ''}">${escapeHtml(dl.text)}</span>
                        <span class="duration-chip">${Number(task.estimated_minutes) || 60} phút</span>
                    </div>
                    ${task.source_quote ? `<div class="task-quote">“${escapeHtml(task.source_quote)}”</div>` : ''}
                </div>
                <div class="task-actions">
                    <button type="button" class="icon-btn btn-edit-task" data-id="${escapeHtml(task.id)}" aria-label="Sửa">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                    </button>
                    <button type="button" class="icon-btn danger btn-del-task" data-id="${escapeHtml(task.id)}" aria-label="Xóa">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                            <path d="M10 11v6M14 11v6"></path>
                        </svg>
                    </button>
                </div>
            `;
            el.tasksContainer.appendChild(row);
        });
    }

    function renderWeekStrip() {
        if (!el.weekStrip) return;
        const eventDayKeys = new Set(state.schedule.map((ev) => formatDayKey(ev.start)));
        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

        let html = `
            <button type="button" class="week-day-pill${state.selectedDayKey === 'all' ? ' active' : ''}" data-day-key="all">
                <span class="wd-name">Lịch</span>
                <span class="wd-num">Tất cả</span>
            </button>
        `;

        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
            const key = formatDayKey(d);
            const hasEvents = eventDayKeys.has(key);
            const isActive = state.selectedDayKey === key;
            const label = i === 0 ? 'Nay' : dayNames[d.getDay()];

            html += `
                <button type="button" class="week-day-pill${isActive ? ' active' : ''}${hasEvents ? ' has-events' : ''}" data-day-key="${key}">
                    <span class="wd-name">${label}</span>
                    <span class="wd-num">${d.getDate()}</span>
                    <span class="wd-dot"></span>
                </button>
            `;
        }

        el.weekStrip.innerHTML = html;
    }

    function renderSchedule() {
        renderWeekStrip();

        if (el.scheduleSummaryText) {
            if (!state.schedule.length) {
                el.scheduleSummaryText.textContent = 'Chưa có phiên làm việc nào';
            } else {
                const totalMins = state.schedule.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
                const hrs = (totalMins / 60).toFixed(1).replace(/\.0$/, '');
                el.scheduleSummaryText.textContent = `${state.schedule.length} phiên · Tổng ${hrs} giờ làm việc`;
            }
        }

        if (el.btnExportIcs) {
            el.btnExportIcs.disabled = state.schedule.length === 0;
        }

        if (!el.scheduleContainer) return;

        const filtered = state.selectedDayKey === 'all'
            ? state.schedule
            : state.schedule.filter((ev) => formatDayKey(ev.start) === state.selectedDayKey);

        if (!filtered.length) {
            el.scheduleContainer.innerHTML = `
                <div class="empty-state">
                    ${state.schedule.length === 0
                        ? 'Chưa có phiên học nào được xếp. Hãy trích xuất việc từ ảnh hoặc thêm thủ công.'
                        : 'Không có phiên làm việc nào trong ngày đã chọn.'}
                </div>
            `;
            return;
        }

        const groups = new Map();
        filtered.forEach((ev) => {
            const key = formatDayKey(ev.start);
            if (!groups.has(key)) {
                groups.set(key, { date: new Date(ev.start), items: [] });
            }
            groups.get(key).items.push(ev);
        });

        const dayFullNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const todayKey = formatDayKey(new Date());

        el.scheduleContainer.innerHTML = '';
        groups.forEach((group, key) => {
            const d = group.date;
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const prefix = key === todayKey ? 'Hôm nay · ' : '';

            const groupEl = document.createElement('div');
            groupEl.className = 'day-group';
            groupEl.innerHTML = `<div class="day-group-header">${prefix}${dayFullNames[d.getDay()]}, ${dd}/${mm}</div>`;

            group.items.forEach((ev) => {
                const startStr = formatTimeHM(ev.start);
                const endStr = formatTimeHM(ev.end);
                const partBadge = ev.totalSessions > 1
                    ? `<span class="agenda-badge">Phiên ${ev.sessionIndex}/${ev.totalSessions}</span>`
                    : '';
                const gcalUrl = window.ICalExporter.getGoogleCalendarLink(ev);

                const row = document.createElement('div');
                row.className = 'agenda-row';
                row.innerHTML = `
                    <div class="agenda-time-col">
                        <span class="agenda-start">${startStr}</span>
                        <span class="agenda-end">${endStr}</span>
                    </div>
                    <div class="agenda-card${ev.isUrgent || ev.isPastDeadline ? ' urgent' : ''}">
                        <div class="agenda-card-top">
                            <div class="agenda-title">${escapeHtml(ev.originalTitle || ev.title)}</div>
                            ${partBadge}
                        </div>
                        <div class="agenda-meta">
                            <span>${ev.durationMinutes} phút</span>
                            ${ev.isUrgent ? '<span class="urgent-tag">Ưu tiên gấp</span>' : ''}
                            <a class="agenda-gcal-link" href="${gcalUrl}" target="_blank" rel="noopener">Google Calendar ↗</a>
                        </div>
                    </div>
                `;
                groupEl.appendChild(row);
            });

            el.scheduleContainer.appendChild(groupEl);
        });
    }

    function openTaskModal(taskId = null) {
        if (!el.taskModalBackdrop) return;
        if (taskId) {
            const task = state.tasks.find((t) => t.id === taskId);
            if (!task) return;
            el.modalTitle.textContent = 'Chỉnh sửa đầu việc';
            el.modalTaskId.value = task.id;
            el.modalTaskTitle.value = task.title || '';
            el.modalTaskDeadline.value = toDatetimeLocalValue(task.deadline_iso);
            el.modalTaskDuration.value = task.estimated_minutes || 60;
        } else {
            el.modalTitle.textContent = 'Thêm đầu việc mới';
            el.modalTaskId.value = '';
            el.modalTaskTitle.value = '';
            const def = new Date(Date.now() + 48 * 3600000);
            def.setHours(23, 59, 0, 0);
            el.modalTaskDeadline.value = toDatetimeLocalValue(def.toISOString());
            el.modalTaskDuration.value = 60;
        }
        el.taskModalBackdrop.hidden = false;
        el.modalTaskTitle.focus();
    }

    function closeTaskModal() {
        if (el.taskModalBackdrop) el.taskModalBackdrop.hidden = true;
    }

    function renderSettings() {
        if (el.apiKeyInput) el.apiKeyInput.value = state.apiKey || '';
        if (el.modelSelect) el.modelSelect.value = state.model || DEFAULT_MODEL;
        el.slotToggles.forEach((btn) => {
            const key = btn.dataset.slot;
            if (key in state.slots) {
                btn.classList.toggle('active', Boolean(state.slots[key]));
            }
        });
    }

    async function loadPersistedState() {
        const [savedTasks, savedKey, savedModel, savedSlots] = await Promise.all([
            window.storage.getTasks(),
            window.storage.getSetting('gemini_api_key', ''),
            window.storage.getSetting('gemini_model', DEFAULT_MODEL),
            window.storage.getSetting('available_slots', DEFAULT_SLOTS)
        ]);

        state.tasks = Array.isArray(savedTasks) ? savedTasks : [];
        state.apiKey = savedKey || '';
        state.slots = { ...DEFAULT_SLOTS, ...(savedSlots || {}) };

        // Auto-migrate deprecated models to fast Gemini 3 Flash Preview
        if (!savedModel || DEPRECATED_MODELS.has(savedModel)) {
            state.model = DEFAULT_MODEL;
            await window.storage.saveSetting('gemini_model', DEFAULT_MODEL);
        } else {
            state.model = savedModel;
        }

        state.schedule = scheduler.schedule(
            state.tasks.filter((t) => !t.completed),
            getEnabledSlotDefs(),
            new Date()
        );

        updateConnectionUI();
        renderSettings();
        renderImagePreviews();
        renderTasks();
        renderSchedule();
    }

    function bindEvents() {
        // Bottom Nav
        el.navItems.forEach((btn) => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // Capture triggers
        el.btnPickGallery?.addEventListener('click', () => el.fileInput?.click());
        el.btnCameraDirect?.addEventListener('click', () => el.cameraInput?.click());
        el.dropzone?.addEventListener('click', (e) => {
            if (e.target === el.dropzone) el.fileInput?.click();
        });

        el.fileInput?.addEventListener('change', (e) => {
            handleFilesSelected(e.target.files);
            e.target.value = '';
        });
        el.cameraInput?.addEventListener('change', (e) => {
            handleFilesSelected(e.target.files);
            e.target.value = '';
        });

        // Drag & drop
        el.dropzone?.addEventListener('dragover', (e) => {
            e.preventDefault();
            el.dropzone.classList.add('dragover');
        });
        el.dropzone?.addEventListener('dragleave', () => {
            el.dropzone.classList.remove('dragover');
        });
        el.dropzone?.addEventListener('drop', (e) => {
            e.preventDefault();
            el.dropzone.classList.remove('dragover');
            handleFilesSelected(e.dataTransfer.files);
        });

        // Remove preview
        el.previewGrid?.addEventListener('click', (e) => {
            const btn = e.target.closest('.preview-remove');
            if (!btn) return;
            const idx = Number(btn.dataset.idx);
            state.images.splice(idx, 1);
            renderImagePreviews();
        });

        // Presets & Scan
        el.btnLoadPresetStudent?.addEventListener('click', () => loadPreset('student'));
        el.btnLoadPresetJudge?.addEventListener('click', () => loadPreset('judge'));
        el.btnScan?.addEventListener('click', runExtraction);
        el.btnGotoSettings?.addEventListener('click', () => switchTab('settings'));

        // Tasks interactions
        el.btnAddManualTask?.addEventListener('click', () => openTaskModal(null));

        el.clarificationArea?.addEventListener('click', async (e) => {
            const chip = e.target.closest('.clarify-chip');
            if (!chip) return;
            const taskId = chip.dataset.taskId;
            const optIdx = Number(chip.dataset.optIdx);
            const task = state.tasks.find((t) => t.id === taskId);
            const opts = task?.options || task?.clarification_options || [];
            const chosen = opts[optIdx];
            if (!task || !chosen) return;

            const chosenIso = typeof chosen === 'string' ? chosen : chosen.deadline_iso;
            task.deadline_iso = chosenIso;
            task.needs_confirmation = false;
            await recomputeAndPersist();
            showToast(`Đã chốt hạn: ${formatClarifyOptionLabel(chosen)}`, 'success');
        });

        el.tasksContainer?.addEventListener('click', async (e) => {
            const checkBtn = e.target.closest('.task-check-btn');
            if (checkBtn) {
                const task = state.tasks.find((t) => t.id === checkBtn.dataset.id);
                if (task) {
                    task.completed = !task.completed;
                    await recomputeAndPersist();
                }
                return;
            }

            const editBtn = e.target.closest('.btn-edit-task');
            if (editBtn) {
                openTaskModal(editBtn.dataset.id);
                return;
            }

            const delBtn = e.target.closest('.btn-del-task');
            if (delBtn) {
                state.tasks = state.tasks.filter((t) => t.id !== delBtn.dataset.id);
                await recomputeAndPersist();
                showToast('Đã xóa đầu việc.', 'info');
            }
        });

        // Modal form
        el.btnModalClose?.addEventListener('click', closeTaskModal);
        el.btnModalCancel?.addEventListener('click', closeTaskModal);
        el.taskModalBackdrop?.addEventListener('click', (e) => {
            if (e.target === el.taskModalBackdrop) closeTaskModal();
        });
        el.taskModalForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = el.modalTaskId.value.trim();
            const title = el.modalTaskTitle.value.trim();
            const dlVal = el.modalTaskDeadline.value;
            const duration = Math.max(15, Number(el.modalTaskDuration.value) || 60);
            const deadlineIso = dlVal ? new Date(dlVal).toISOString() : null;

            if (!title) return;

            if (id) {
                const existing = state.tasks.find((t) => t.id === id);
                if (existing) {
                    existing.title = title;
                    existing.deadline_iso = deadlineIso;
                    existing.estimated_minutes = duration;
                    existing.needs_confirmation = false;
                }
                showToast('Đã cập nhật đầu việc.', 'success');
            } else {
                state.tasks.push({
                    id: `manual-${Date.now()}`,
                    title,
                    deadline_iso: deadlineIso,
                    estimated_minutes: duration,
                    source_quote: 'Thêm thủ công',
                    needs_confirmation: false,
                    completed: false
                });
                showToast('Đã thêm đầu việc mới.', 'success');
            }

            closeTaskModal();
            await recomputeAndPersist();
        });

        // Schedule Week Strip & Export
        el.weekStrip?.addEventListener('click', (e) => {
            const pill = e.target.closest('.week-day-pill');
            if (!pill) return;
            state.selectedDayKey = pill.dataset.dayKey || 'all';
            renderSchedule();
        });

        el.btnExportIcs?.addEventListener('click', () => {
            if (!state.schedule.length) return;
            window.ICalExporter.downloadIcsFile(state.schedule);
            showToast('Đã xuất tệp lịch .ics!', 'success');
        });

        // Settings
        el.btnToggleKeyVis?.addEventListener('click', () => {
            if (!el.apiKeyInput) return;
            el.apiKeyInput.type = el.apiKeyInput.type === 'password' ? 'text' : 'password';
        });

        el.btnSaveKey?.addEventListener('click', async () => {
            const key = (el.apiKeyInput?.value || '').trim();
            const model = el.modelSelect?.value || DEFAULT_MODEL;
            state.apiKey = key;
            state.model = model;
            await window.storage.saveSetting('gemini_api_key', key);
            await window.storage.saveSetting('gemini_model', model);
            updateConnectionUI();
            showToast(key ? 'Đã lưu API Key và Model.' : 'Đã chuyển về chế độ Demo.', 'success');
        });

        el.btnTestKey?.addEventListener('click', async () => {
            const key = (el.apiKeyInput?.value || '').trim();
            const model = el.modelSelect?.value || DEFAULT_MODEL;
            if (!key) {
                showToast('Vui lòng nhập Gemini API Key trước.', 'warning');
                return;
            }
            el.btnTestKey.disabled = true;
            const origText = el.btnTestKey.textContent;
            el.btnTestKey.textContent = 'Đang thử...';
            try {
                const res = await window.VisionAgent.testApiKey(key, model);
                const sec = ((res.elapsedMs || 0) / 1000).toFixed(2);
                state.apiKey = key;
                state.model = res.model || model;
                if (el.modelSelect && res.model) el.modelSelect.value = res.model;
                await window.storage.saveSetting('gemini_api_key', state.apiKey);
                await window.storage.saveSetting('gemini_model', state.model);
                updateConnectionUI();
                showToast(`Kết nối thành công (${res.model} · ${sec}s)!`, 'success');
            } catch (err) {
                showToast(`Kết nối thất bại: ${err.message}`, 'error');
            } finally {
                el.btnTestKey.disabled = false;
                el.btnTestKey.textContent = origText;
            }
        });

        el.slotToggles.forEach((toggle) => {
            toggle.addEventListener('click', async () => {
                const slot = toggle.dataset.slot;
                state.slots[slot] = !state.slots[slot];
                toggle.classList.toggle('active', Boolean(state.slots[slot]));
                await window.storage.saveSetting('available_slots', state.slots);
                await recomputeAndPersist();
                showToast('Đã cập nhật lịch theo khung giờ mới.', 'info');
            });
        });

        el.btnClearDb?.addEventListener('click', () => {
            if (el.clearConfirmBox) el.clearConfirmBox.hidden = false;
        });
        el.btnClearCancel?.addEventListener('click', () => {
            if (el.clearConfirmBox) el.clearConfirmBox.hidden = true;
        });
        el.btnClearConfirm?.addEventListener('click', async () => {
            await window.storage.clearAll();
            state.images = [];
            state.tasks = [];
            state.schedule = [];
            state.apiKey = '';
            state.model = DEFAULT_MODEL;
            state.slots = { ...DEFAULT_SLOTS };
            state.selectedDayKey = 'all';
            if (el.clearConfirmBox) el.clearConfirmBox.hidden = true;
            updateConnectionUI();
            renderSettings();
            renderImagePreviews();
            renderTasks();
            renderSchedule();
            showToast('Đã xóa toàn bộ dữ liệu cục bộ.', 'info');
        });

        // Bridge for desktop simulator parent frame
        window.addEventListener('message', (event) => {
            const data = event.data;
            if (!data || typeof data !== 'object') return;
            if (data.action === 'load-preset') {
                loadPreset(data.preset || 'student');
            } else if (data.action === 'switch-tab' && data.tab) {
                switchTab(data.tab);
            } else if (data.action === 'export-ics') {
                if (state.schedule.length) {
                    window.ICalExporter.downloadIcsFile(state.schedule);
                    showToast('Đã xuất tệp lịch .ics!', 'success');
                } else {
                    switchTab('schedule');
                    showToast('Chưa có lịch để xuất .ics.', 'warning');
                }
            }
        });
    }

    async function init() {
        bindEvents();
        await loadPersistedState();

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').catch(() => {});
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
