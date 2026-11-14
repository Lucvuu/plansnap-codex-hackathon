// PlanSnap IndexedDB Storage Module - atomic, local-first persistence.
const DB_NAME = 'PlanSnapDB';
const DB_VERSION = 2;

class PlanSnapStorage {
  constructor() {
    this.db = null;
    this.ready = this.init();
  }

  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('tasks')) db.createObjectStore('tasks', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('schedule')) db.createObjectStore('schedule', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('images')) db.createObjectStore('images', { keyPath: 'id' });
      };
      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.db.onversionchange = () => this.db.close();
        resolve(this.db);
      };
      request.onerror = (event) => reject(event.target.error);
      request.onblocked = () => reject(new Error('PlanSnapDB đang được mở ở một phiên bản khác.'));
    });
  }

  async replaceStore(storeName, records) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite', { durability: 'strict' });
      const store = tx.objectStore(storeName);
      store.clear();
      records.forEach((record) => store.put(record));
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error(`Không thể ghi ${storeName}.`));
    });
  }

  saveTasks(tasks) { return this.replaceStore('tasks', tasks); }
  saveSchedule(schedule) { return this.replaceStore('schedule', schedule); }

  async getAll(storeName) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  getTasks() { return this.getAll('tasks'); }
  getSchedule() { return this.getAll('schedule'); }

  async saveSetting(key, value) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('settings', 'readwrite', { durability: 'strict' });
      tx.objectStore('settings').put({ key, value });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Không thể lưu cài đặt.'));
    });
  }

  async getSetting(key, defaultValue = null) {
    await this.ready;
    return new Promise((resolve) => {
      const tx = this.db.transaction('settings', 'readonly');
      const req = tx.objectStore('settings').get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : defaultValue);
      req.onerror = () => resolve(defaultValue);
    });
  }

  // One transaction makes tasks, schedule, images and navigation state all-or-nothing.
  async saveSnapshot(snapshot) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['tasks', 'schedule', 'images', 'settings'], 'readwrite', { durability: 'strict' });
      const tasksStore = tx.objectStore('tasks');
      const scheduleStore = tx.objectStore('schedule');
      const imagesStore = tx.objectStore('images');
      const settingsStore = tx.objectStore('settings');
      tasksStore.clear();
      scheduleStore.clear();
      imagesStore.clear();
      (snapshot.tasks || []).forEach((item) => tasksStore.put(item));
      (snapshot.schedule || []).forEach((item) => scheduleStore.put(item));
      (snapshot.images || []).forEach((item, index) => imagesStore.put({ ...item, id: item.id || `image-${index}` }));
      settingsStore.put({
        key: 'app_state',
        value: {
          activeTab: snapshot.activeTab || 'tab-capture',
          selectedDayKey: snapshot.selectedDayKey || 'all',
          availableSlots: snapshot.availableSlots || null,
          savedAt: new Date().toISOString()
        }
      });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Không thể commit trạng thái PlanSnap.'));
    });
  }

  async getSnapshot() {
    const [tasks, schedule, images, appState] = await Promise.all([
      this.getTasks(), this.getSchedule(), this.getAll('images'), this.getSetting('app_state', {})
    ]);
    return { tasks, schedule, images, appState: appState || {} };
  }

  async clearAll() {
    await this.ready;
    return new Promise((resolve, reject) => {
      const names = ['tasks', 'schedule', 'images', 'settings'];
      const tx = this.db.transaction(names, 'readwrite', { durability: 'strict' });
      names.forEach((name) => tx.objectStore(name).clear());
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Không thể xóa PlanSnapDB.'));
    });
  }
}

window.storage = new PlanSnapStorage();
