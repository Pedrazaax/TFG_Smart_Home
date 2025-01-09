import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse {
  vulnerabilities: Vulnerability[];
  resultsPerPage: number;
  startIndex: number;
  totalResults: number;
}

export interface Vulnerability {
  id: string;
  description: string;
  severity: string;
  published: string;
  lastModified: string;
  baseScore: number;
  vectorString: string;
  cwe: string[];
  references: { url: string }[];
  configurations: {
    operator: any;
    nodes: {
      operator: string;
      cpeMatch: {
        vulnerable: boolean;
        criteria: string;
        matchCriteriaId: string;
      }[];
    }[];
  }[];
  metrics: {
    cvssMetricV2?: {
      source: string;
      type: string;
      cvssData: {
        version: string;
        vectorString: string;
        accessVector: string;
        accessComplexity: string;
        authentication: string;
        confidentialityImpact: string;
        integrityImpact: string;
        availabilityImpact: string;
        baseScore: number;
      };
      baseSeverity: string;
      exploitabilityScore: number;
      impactScore: number;
    };
    cvssMetricV30?: {
      source: string;
      type: string;
      cvssData: {
        version: string;
        vectorString: string;
        attackVector: string;
        attackComplexity: string;
        privilegesRequired: string;
        userInteraction: string;
        scope: string;
        confidentialityImpact: string;
        integrityImpact: string;
        availabilityImpact: string;
        baseScore: number;
        baseSeverity: string;
      };
    };
    cvssMetricV31?: {
      source: string;
      type: string;
      cvssData: {
        version: string;
        vectorString: string;
        attackVector: string;
        attackComplexity: string;
        privilegesRequired: string;
        userInteraction: string;
        scope: string;
        confidentialityImpact: string;
        integrityImpact: string;
        availabilityImpact: string;
        baseScore: number;
        baseSeverity: string;
      };
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class NvdapiService {
  private vulnerabilitiesSubject = new BehaviorSubject<ApiResponse>({
    vulnerabilities: [],
    resultsPerPage: 0,
    startIndex: 0,
    totalResults: 0
  });
  vulnerabilities$ = this.vulnerabilitiesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  searchVulnerabilities(keyword: string) {
    const url = `/api/nvd/rest/json/cves/2.0?keywordSearch=${keyword}`;
    return this.http.get<ApiResponse>(url).pipe(
      map((response: ApiResponse) => {
        const apiResponse: ApiResponse = {
          vulnerabilities: response.vulnerabilities.map((v: any) => this.mapVulnerability(v)),
          resultsPerPage: response.resultsPerPage || 0,
          startIndex: response.startIndex || 0,
          totalResults: response.totalResults || 0
        };
        this.vulnerabilitiesSubject.next(apiResponse);
        this.saveToLocalStorage(apiResponse);
        return apiResponse;
      })
    );
  }

  filterByCategory(category: string) {
    const current = this.vulnerabilitiesSubject.getValue();
    const filteredVulnerabilities = current.vulnerabilities.filter(v => v.cwe.includes(category));
    this.vulnerabilitiesSubject.next({
      ...current,
      vulnerabilities: filteredVulnerabilities
    });
  }

  filterBySeverity(severity: string) {
    const current = this.vulnerabilitiesSubject.getValue();
    const filteredVulnerabilities = current.vulnerabilities.filter(v => v.severity === severity);
    this.vulnerabilitiesSubject.next({
      ...current,
      vulnerabilities: filteredVulnerabilities
    });
  }

  filterByName(name: string) {
    const current = this.vulnerabilitiesSubject.getValue();
    const filteredVulnerabilities = current.vulnerabilities.filter(v => 
      v.id.toLowerCase().includes(name.toLowerCase())
    );
    this.vulnerabilitiesSubject.next({
      ...current,
      vulnerabilities: filteredVulnerabilities
    });
  }

  resetFilters() {
    const stored = localStorage.getItem('vulnerabilities');
    if (stored) {
      const original = JSON.parse(stored);
      this.vulnerabilitiesSubject.next(original);
    }
  }

  private mapVulnerability(v: any): Vulnerability {
    return {
      id: v.cve.id,
      description: v.cve.descriptions[0].value,
      severity: v.cve.metrics?.cvssMetricV2?.[0]?.baseSeverity || 'N/A',
      published: v.cve.published,
      lastModified: v.cve.lastModified,
      baseScore: v.cve.metrics?.cvssMetricV2?.[0]?.cvssData.baseScore || 0,
      vectorString: v.cve.metrics?.cvssMetricV2?.[0]?.cvssData.vectorString || 'N/A',
      cwe: v.cve.weaknesses?.map((w: any) => w.description[0].value) || [],
      references: v.cve.references?.map((r: any) => ({ url: r.url })) || [],
      configurations: v.cve.configurations?.nodes || [],
      metrics: {
        cvssMetricV2: v.cve.metrics?.cvssMetricV2?.[0],
        cvssMetricV30: v.cve.metrics?.cvssMetricV30?.[0],
        cvssMetricV31: v.cve.metrics?.cvssMetricV31?.[0]
      }
    };
  }

  private saveToLocalStorage(apiResponse: ApiResponse) {
    localStorage.setItem('vulnerabilities', JSON.stringify(apiResponse));
  }

  private loadFromLocalStorage() {
    const stored = localStorage.getItem('vulnerabilities');
    if (stored) {
      this.vulnerabilitiesSubject.next(JSON.parse(stored));
    }
  }
}
