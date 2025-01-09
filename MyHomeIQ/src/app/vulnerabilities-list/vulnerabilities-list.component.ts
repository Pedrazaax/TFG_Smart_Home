import { Component } from '@angular/core';
import { NvdapiService, Vulnerability } from '../_services/nvdapi.service';

interface ApiResponse {
  vulnerabilities: Vulnerability[];
  resultsPerPage: number;
  startIndex: number;
  totalResults: number;
}

interface CvssMetric {
  version: string;
  baseScore: number;
  baseSeverity: string;
  vectorString: string;
}

interface AffectedConfiguration {
  nodes: {
    operator: string;
    cpeMatch: {
      vulnerable: boolean;
      criteria: string;
      matchCriteriaId: string;
    }[];
  }[];
}

@Component({
  selector: 'app-vulnerabilities-list',
  templateUrl: './vulnerabilities-list.component.html',
  styleUrls: ['./vulnerabilities-list.component.css']
})
export class VulnerabilitiesListComponent {
  vulnerabilities: Vulnerability[] = [];
  vulnerabilidadesFiltradas: Vulnerability[] = []; // Asegurar inicialización como array vacío
  etiquetaSeguridad: string = '';
  expandedVulnerability: string | null = null;
  apiResponse: ApiResponse = {
    vulnerabilities: [],
    resultsPerPage: 0,
    startIndex: 0,
    totalResults: 0
  };

  // Propiedades de paginación
  currentPage: number = 0;
  itemsPerPage: number = 5;
  paginatedVulnerabilities: Vulnerability[] = [];
  
  // Filtros
  categoryFilter = '';
  severityFilter = '';
  nameFilter = '';

  constructor(private nvdService: NvdapiService) {}

  ngOnInit() {
    // Intentar cargar desde localStorage primero
    const storedData = localStorage.getItem('vulnerabilities');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Validar estructura de datos
        if (parsedData && (Array.isArray(parsedData) || (parsedData.vulnerabilities && Array.isArray(parsedData.vulnerabilities)))) {
          const vulnerabilities = parsedData.vulnerabilities || parsedData;
          
          this.apiResponse = {
            vulnerabilities: vulnerabilities,
            resultsPerPage: parsedData.resultsPerPage || 0,
            startIndex: parsedData.startIndex || 0,
            totalResults: parsedData.totalResults || vulnerabilities.length
          };
          
          this.vulnerabilities = this.apiResponse.vulnerabilities;
          this.vulnerabilidadesFiltradas = this.vulnerabilities;
          this.actualizarEtiquetaSeguridad();
        } else {
          throw new Error('Invalid data structure in localStorage');
        }
      } catch (error) {
        console.error('Error parsing vulnerabilities from localStorage:', error);
        // Limpiar datos inválidos
        localStorage.removeItem('vulnerabilities');
        this.apiResponse = {
          vulnerabilities: [],
          resultsPerPage: 0,
          startIndex: 0,
          totalResults: 0
        };
        this.vulnerabilities = this.apiResponse.vulnerabilities;
        this.vulnerabilidadesFiltradas = this.vulnerabilities;
        this.actualizarEtiquetaSeguridad();
      }
    }

    // Luego actualizar con datos frescos de la API
    this.nvdService.vulnerabilities$.subscribe(apiResponse => {
      if (apiResponse) {
        this.apiResponse = {
          vulnerabilities: apiResponse.vulnerabilities || [],
          resultsPerPage: apiResponse.resultsPerPage || 0,
          startIndex: apiResponse.startIndex || 0,
          totalResults: apiResponse.totalResults || 0
        };
        this.vulnerabilities = this.apiResponse.vulnerabilities;
        this.vulnerabilidadesFiltradas = this.vulnerabilities;
        this.actualizarEtiquetaSeguridad();
        localStorage.setItem('vulnerabilities', JSON.stringify(this.apiResponse));
      }
    });
  }

  toggleDetails(id: string) {
    this.expandedVulnerability = this.expandedVulnerability === id ? null : id;
  }

  applyFilters() {
    let filtered = this.vulnerabilities || [];

    if (this.categoryFilter) {
      filtered = filtered.filter(v => v.cwe?.includes(this.categoryFilter));
    }

    if (this.severityFilter) {
      filtered = filtered.filter(v => v.severity === this.severityFilter);
    }

    if (this.nameFilter) {
      filtered = filtered.filter(v => 
        v.id?.toLowerCase().includes(this.nameFilter.toLowerCase())
      );
    }

    this.vulnerabilidadesFiltradas = Array.isArray(filtered) ? filtered : [];
    this.actualizarEtiquetaSeguridad();
  }

  clearFilters() {
    this.categoryFilter = '';
    this.severityFilter = '';
    this.nameFilter = '';
    this.vulnerabilidadesFiltradas = Array.isArray(this.vulnerabilities) ? this.vulnerabilities : [];
    this.actualizarEtiquetaSeguridad();
  }

  getSeverityColor(severity: string): string {
    switch(severity.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-400 text-gray-800';
      case 'low': return 'bg-green-400 text-gray-800';
      default: return 'bg-gray-400 text-gray-800';
    }
  }

  getCvssMetrics(vuln: Vulnerability): CvssMetric[] {
    const metrics: CvssMetric[] = [];
    
    if (vuln.metrics?.cvssMetricV2) {
      metrics.push({
        version: '2.0',
        baseScore: vuln.metrics.cvssMetricV2.cvssData.baseScore,
        baseSeverity: vuln.metrics.cvssMetricV2.baseSeverity,
        vectorString: vuln.metrics.cvssMetricV2.cvssData.vectorString
      });
    }

    if (vuln.metrics?.cvssMetricV30) {
      metrics.push({
        version: '3.0',
        baseScore: vuln.metrics.cvssMetricV30.cvssData.baseScore,
        baseSeverity: vuln.metrics.cvssMetricV30.cvssData.baseSeverity,
        vectorString: vuln.metrics.cvssMetricV30.cvssData.vectorString
      });
    }

    if (vuln.metrics?.cvssMetricV31) {
      metrics.push({
        version: '3.1',
        baseScore: vuln.metrics.cvssMetricV31.cvssData.baseScore,
        baseSeverity: vuln.metrics.cvssMetricV31.cvssData.baseSeverity,
        vectorString: vuln.metrics.cvssMetricV31.cvssData.vectorString
      });
    }

    return metrics;
  }

  getAffectedConfigurations(vuln: Vulnerability): AffectedConfiguration[] {
    if (!vuln.configurations) return [];
    
    return vuln.configurations.map(config => ({
      nodes: config.nodes.map(node => ({
        operator: node.operator,
        cpeMatch: node.cpeMatch.map(match => ({
          vulnerable: match.vulnerable,
          criteria: match.criteria,
          matchCriteriaId: match.matchCriteriaId
        }))
      }))
    }));
  }

  actualizarEtiquetaSeguridad() {
    const totalVulns = this.vulnerabilidadesFiltradas.length;
    const criticalCount = this.getVulnCountBySeverity('critical');
    const highCount = this.getVulnCountBySeverity('high');
    
    if (criticalCount > 0) {
      this.etiquetaSeguridad = 'Crítico';
    } else if (highCount > 0) {
      this.etiquetaSeguridad = 'Alto';
    } else if (totalVulns > 0) {
      this.etiquetaSeguridad = 'Moderado';
    } else {
      this.etiquetaSeguridad = 'Sin clasificar';
    }
  }

  getVulnCountBySeverity(severity: string): number {
    if (!this.vulnerabilities || !Array.isArray(this.vulnerabilities)) return 0;
    
    return this.vulnerabilities.filter(vuln => {
      if (!vuln) return false;
      const metrics = this.getCvssMetrics(vuln);
      return metrics?.some(metric => 
        metric?.baseSeverity?.toLowerCase() === severity.toLowerCase()
      );
    }).length;
  }
}
