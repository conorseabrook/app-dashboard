import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  namespace = 'amb_';
  storage = sessionStorage;

  constructor() {}

  // localStorage wrapper
  set(key, value) {
    this.storage.setItem(`${this.namespace}${key}`, JSON.stringify(value));
  }

  put(key, value) {
    if (!this.get(key)) {
      this.storage.setItem(`${this.namespace}${key}`, JSON.stringify(value));
    } else {
      return false;
    }
  }

  get(key): string {
    try {
      return JSON.parse(this.storage.getItem(`${this.namespace}${key}`));
    } catch (err) {
      return this.storage.getItem(`${this.namespace}${key}`);
    }
  }

  delete(key) {
    this.storage.removeItem(`${this.namespace}${key}`);
  }

  clear() {
    this.storage.clear();
  }
}
