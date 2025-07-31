export type TaskStatus = "Pending" | "InProgress" | "Done" | "Ongoing";

export type TaskCategory =
  | "Art and Craft"
  | "Nature"
  | "Family"
  | "Sport"
  | "Friends"
  | "Meditation"
  | "Collaborative Task"
  | "All Task";

export interface Task {
  _id?: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  endDate: Date;
  points: number;
  userId?: string; // for user association
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreatePayload {
  title: string;
  description: string;
  category: TaskCategory;
  status?: TaskStatus;
  endDate: Date;
  points?: number;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  category?: TaskCategory;
  status?: TaskStatus;
  endDate?: Date;
  points?: number;
}

export interface TaskQueryParams {
  searchTerm?: string;
  category?: TaskCategory;
  status?: TaskStatus;
  limit?: number;
  page?: number;
  sortBy?: string;
  fields?: string;
  userId?: string;
}
