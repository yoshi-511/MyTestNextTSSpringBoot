export interface Item {
  id: number;
  name: string;
  description: string | null;
  completed: boolean;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface CsvExportResponse {
  filename: string;
  status: string;
  message: string;
}

export interface CsvStatusResponse {
  filename: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED" | "NOT_FOUND";
}
