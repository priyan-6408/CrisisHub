import axios from "axios";

export type BackendIncident = {
  incident_id: string;
  title: string;
  incident_type: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  people_affected: number;
  severity: string;
  priority_score: number;
  status: string;
  verified: boolean;
  confidence: number;
};

export type IncidentListResponse = {
  incidents: BackendIncident[];
  total: number;
};

export type Recommendation = {
  incident_id: string;
  recommended_unit: string;
  recommendation: string;
  priority_score: number;
  resources: string[];
  reasons: string[];
};

export type SafetyReview = {
  status: string;
  safe_to_execute: boolean;
  issues: string[];
};

export type IncidentRecommendationResponse = {
  incident: BackendIncident;
  recommendation: Recommendation;
  safety_review: SafetyReview;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getIncidents(): Promise<IncidentListResponse> {
  const response = await api.get<IncidentListResponse>("/incidents/");
  return response.data;
}

export async function getIncident(
  incidentId: string,
): Promise<BackendIncident> {
  const response = await api.get<BackendIncident>(
    `/incidents/${encodeURIComponent(incidentId)}`,
  );
  return response.data;
}

export async function getIncidentRecommendation(
  incidentId: string,
): Promise<IncidentRecommendationResponse> {
  const response = await api.get<IncidentRecommendationResponse>(
    `/incidents/${encodeURIComponent(incidentId)}/recommendation`,
  );
  return response.data;
}