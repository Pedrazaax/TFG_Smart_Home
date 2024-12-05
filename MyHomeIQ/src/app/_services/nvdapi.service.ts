import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NvdapiService {
  constructor(private http: HttpClient) {}

  searchVulnerabilities(keyword: string) {
    const url = `/api/nvd/rest/json/cves/2.0?keywordSearch=${keyword}`;
    return this.http.get(url);
  }
}