export interface Alert {
  id: number;
  country: string;
  city: string;
  visaType: "Tourist" | "Business" | "Student";
  status: "Active" | "Booked" | "Expired";
  createdAt: string;
}

export interface CreateAlertData {
  country: string;
  city: string;
  visaType: "Tourist" | "Business" | "Student";
  status: "Active" | "Booked" | "Expired";
}

export interface UpdateAlertData {
  country?: string;
  city?: string;
  visaType?: "Tourist" | "Business" | "Student";
  status?: "Active" | "Booked" | "Expired";
}

export interface PaginatedResponse {
  data: Alert[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class AlertService {
  async getAlerts(params?: {
    country?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse> {
    const queryParams = new URLSearchParams();

    if (params?.country) queryParams.append("country", params.country);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/alerts?${queryParams}`);

    if (!response.ok) {
      throw new Error("Failed to fetch alerts");
    }

    return response.json();
  }

  async createAlert(data: CreateAlertData): Promise<Alert> {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create alert");
    }

    const result = await response.json();
    return result.data;
  }

  async updateAlert(id: number, data: UpdateAlertData): Promise<Alert> {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update alert");
    }

    const result = await response.json();
    return result.data;
  }

  async deleteAlert(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete alert");
    }
  }
}

export const alertService = new AlertService();
