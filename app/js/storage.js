// PlanSnap IndexedDB Storage Module - Zero Data Loss Persistence
const DB_NAME = 'PlanSnapDB';
const DB_VERSION = 1;

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
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('schedule')) {
          db.createObjectStore('schedule', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('[IndexedDB] Init error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async saveTasks(tasks) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('tasks', 'readwrite');
      const store = tx.objectStore('tasks');
      store.clear(); // Replace with latest tasks
      tasks.forEach(t => store.put(t));
      tx.oncomplete = () => resolve(true);
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async getTasks() {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('tasks', 'readonly');
      const store = tx.objectStore('tasks');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async saveSchedule(schedule) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('schedule', 'readwrite');
      const store = tx.objectStore('schedule');
      store.clear();
      schedule.forEach(item => store.put(item));
      tx.oncomplete = () => resolve(true);
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async getSchedule() {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('schedule', 'readonly');
      const store = tx.objectStore('schedule');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async saveSetting(key, value) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      store.put({ key, value });
      tx.oncomplete = () => resolve(true);
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async getSetting(key, defaultValue = null) {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : defaultValue);
      req.onerror = () => resolve(defaultValue);
    });
  }

  async clearAll() {
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['tasks', 'schedule', 'images'], 'readwrite');
      tx.objectStore('tasks').clear();
      tx.objectStore('schedule').clear();
      tx.objectStore('images').clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = (e) => reject(e.target.error);
    });
  }
}

// Global instance
window.storage = new PlanSnapStorage();

