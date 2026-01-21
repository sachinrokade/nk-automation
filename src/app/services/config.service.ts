import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutomationConfig } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(private http: HttpClient) {}

  loadConfig(): Observable<AutomationConfig> {
    return this.http.get<AutomationConfig>('/assets/config/app-config.json');
  }
}
