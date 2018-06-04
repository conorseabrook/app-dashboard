import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  namespace = 'amb_';

  constructor(private http: HttpClient) {
  }

  // API POST: create asset
  createAsset() {
    const params = {
      'content': {
        'idData': {
          'createdBy': this.get('address'),
          'timestamp': new Date().getTime() / 1000,
          'sequenceNumber': 3
        }
      }
    };
    return this.http.post(environment.apiUrls.createAsset, params);
  }

  // API POST: create event
  createEvent(body, assetId: string) {
    const params = {
      body
    };
    return this.http.post(`${environment.apiUrls.createEvent}${assetId}/events`, params);
  }

  // localStorage wrapper
  set(key, value) {
    localStorage.setItem(`${this.namespace}${key}`, value);
  }

  put(key, value) {
    if (!this.get(key)) {
      localStorage.setItem(`${this.namespace}${key}`, value);
    } else {
      return false;
    }
  }

  get(key): string {
    return localStorage.getItem(`${this.namespace}${key}`);
  }

  delete(key) {
    localStorage.removeItem(`${this.namespace}${key}`);
  }

  clear() {
    localStorage.clear();
  }
}