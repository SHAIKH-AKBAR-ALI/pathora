// Types matching backend Pydantic schemas

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: "free" | "paid" | "admin";
}

export interface RoadmapPhase {
  phase_number: number;
  title: string;
  description: string;
  topics: string[];
  estimated_days: number;
}

export interface RoadmapContent {
  title: string;
  total_estimated_days: number;
  phases: RoadmapPhase[];
}

export interface Roadmap {
  id: string;
  user_id: string;
  topic: string;
  difficulty: string;
  goal: string;
  content: RoadmapContent;
  rating: number | null;
  created_at: string;
}

export interface ProgressData {
  id: string;
  user_id: string;
  roadmap_id: string;
  completed_topics: string[];
  streak: number;
  last_activity: string | null;
  created_at: string;
}

export interface ProgressResult {
  progress: ProgressData;
  completion_percentage: number;
}

export interface StreakData {
  streak: number;
  last_activity: string | null;
}

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete";

export interface Subscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  plan: "free" | "pro";
  current_period_end: string | null;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: string | null;
}
