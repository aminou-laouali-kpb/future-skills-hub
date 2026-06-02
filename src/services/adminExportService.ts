export interface AdminLearnerRow {
  id: string;
  name: string;
  email?: string;
  progress: number;
  quizAvg: number;
  deliverables: string;
  mentoringSessions: number;
  certificateEligible: boolean;
  status: "on_track" | "at_risk" | "completed";
  alerts: string[];
}

function escapeCsv(value: string | number | boolean): string {
  const str = String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function buildCohortCsv(rows: AdminLearnerRow[]): string {
  const headers = [
    "id",
    "name",
    "email",
    "progress_percent",
    "quiz_avg",
    "deliverables",
    "mentoring_sessions",
    "certificate_eligible",
    "status",
    "alerts",
  ];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.id,
        r.name,
        r.email ?? "",
        r.progress,
        r.quizAvg,
        r.deliverables,
        r.mentoringSessions,
        r.certificateEligible ? "yes" : "no",
        r.status,
        r.alerts.join("; "),
      ]
        .map(escapeCsv)
        .join(",")
    ),
  ];
  return lines.join("\n");
}

export function downloadTextFile(filename: string, content: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function buildGoogleSheetsUrl(csvContent: string): string {
  const encoded = encodeURIComponent(csvContent.slice(0, 1800));
  return `https://docs.google.com/spreadsheets/create?usp=sharing#gid=0&csv=${encoded}`;
}
