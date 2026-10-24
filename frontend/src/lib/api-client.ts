import {
  StudentData,
  CourseData,
  CourseClassData,
  RegistrationPeriodData,
  LecturerData,
} from "./mock-data";

// Base C# Backend URL (default: http://localhost:5000)
const CSHARP_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

export interface LoginResult {
  role: "student" | "lecturer";
  student?: StudentData;
  lecturer?: LecturerData;
  token?: string;
}

// Helper fetcher with smart fallback: Calls C# Backend first, falls back to Next.js API if C# backend is offline
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; updatedStudent?: T; message?: string; errorType?: string }> {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const apiPath = normalizedEndpoint.startsWith("/api") ? normalizedEndpoint : `/api${normalizedEndpoint}`;

  // 1. Try C# Backend first (http://localhost:5000/api/...)
  try {
    const csharpUrl = `${CSHARP_BASE_URL}${apiPath}`;

    const res = await fetch(csharpUrl, {
      ...options,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (res.ok) {
      const json = await res.json();
      return json;
    } else if (res.status !== 404) {
      const errorJson = await res.json().catch(() => null);
      if (errorJson && typeof errorJson === "object" && "success" in errorJson) {
        return errorJson;
      }
    }
  } catch {
    // C# backend is offline / not yet started -> fallback gracefully to internal Next.js API
  }

  // 2. Fallback to internal Next.js API (/api/...)
  try {
    const res = await fetch(apiPath, {
      ...options,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    const json = await res.json();
    return json;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { success: false, message: msg, errorType: "NETWORK_ERROR" };
  }
}

export const api = {
  // Authentication
  login: (username: string, password: string, role: "student" | "lecturer") =>
    apiFetch<LoginResult>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password, role }),
    }),

  // Student Profile
  getStudent: (code: string = "B21DCCN001") =>
    apiFetch<StudentData>(`/api/student?code=${encodeURIComponent(code)}`),

  // Courses
  getCourses: () =>
    apiFetch<CourseData[]>("/api/courses"),

  // Classes
  getClasses: (periodId: string = "2024-2025-HK1") =>
    apiFetch<CourseClassData[]>(`/api/classes?periodId=${encodeURIComponent(periodId)}`),

  // Registration Period
  getPeriod: () =>
    apiFetch<RegistrationPeriodData>("/api/periods"),

  // Registration Operations
  registerClass: (studentCode: string, classCode: string) =>
    apiFetch<StudentData>("/api/register", {
      method: "POST",
      body: JSON.stringify({ studentCode, classCode }),
    }),

  dropClass: (studentCode: string, classCode: string) =>
    apiFetch<StudentData>("/api/register", {
      method: "DELETE",
      body: JSON.stringify({ studentCode, classCode }),
    }),

  // Admin Config
  updatePeriodConfig: (minCredits: number, maxCredits: number, isActive: boolean) =>
    apiFetch<void>("/api/periods", {
      method: "POST",
      body: JSON.stringify({ minCredits, maxCredits, isActive }),
    }),

  // Seed Data
  seedData: () =>
    apiFetch<void>("/api/seed", {
      method: "POST",
    }),

  // Lecturers
  getLecturers: () =>
    apiFetch<LecturerData[]>("/api/lecturers"),

  getLecturerTeachingClasses: (code: string) =>
    apiFetch<CourseClassData[]>(`/api/lecturers/${encodeURIComponent(code)}/classes`),
};

export default api;
