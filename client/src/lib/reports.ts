export interface Report {
  id: string;
  propertyId: string;
  propertyName: string;
  userName: string;
  category: "Safety" | "Scam" | "Inappropriate Content" | "Contact Issues" | "Other";
  description: string;
  createdAt: string;
  status: "New" | "Investigating" | "Resolved";
}

const STORAGE_KEY = "listing_reports";

export function submitReport(propertyId: string, propertyName: string, userName: string, category: Report["category"], description: string): Report {
  const report: Report = {
    id: `report_${Date.now()}`,
    propertyId,
    propertyName,
    userName,
    category,
    description,
    createdAt: new Date().toISOString(),
    status: "New",
  };

  const reports = localStorage.getItem(STORAGE_KEY);
  const allReports: Report[] = reports ? JSON.parse(reports) : [];
  allReports.push(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allReports));
  
  return report;
}

export function getReports(): Report[] {
  const reports = localStorage.getItem(STORAGE_KEY);
  return reports ? JSON.parse(reports) : [];
}

export function updateReportStatus(reportId: string, status: Report["status"]): void {
  const reports = localStorage.getItem(STORAGE_KEY);
  const allReports: Report[] = reports ? JSON.parse(reports) : [];
  const report = allReports.find(r => r.id === reportId);
  if (report) {
    report.status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allReports));
  }
}
