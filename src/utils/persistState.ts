export class PersistedStore<Data = any> {
  _key: string;

  constructor(key: string) {
    this._key = key;
  }

  saveInLocalStorage(data: Data) {
    try {
      const serializedState = JSON.stringify(data);
      return localStorage.setItem(this._key, serializedState);
    } catch {
      // ignore write errors
    }
  }

  loadFromLocalStorage(): Data | undefined {
    try {
      const serializedState = localStorage.getItem(this._key);
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  }

  clearLocalStorage(): void {
    try {
      const serializedState = localStorage.removeItem(this._key);
    } catch (err) {
      return undefined;
    }
  }
}
