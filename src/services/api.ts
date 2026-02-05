const API_BASE_URL = "http://backend.lan/acconunt/data";
const AUTH_API_URL = "http://backend.lan/sactel";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  ocupacion: number;
  habitacionesDisponibles: number;
  ingresosDia: number;
  facturasPendientes: number;
}

export interface Habitacion {
  id: string;
  numero: string;
  tipo: string;
  estado: "disponible" | "ocupada" | "mantenimiento" | "limpieza";
  precio: number;
  huesped?: string;
}

export interface Factura {
  id: string;
  numero: string;
  fecha: string;
  cliente: string;
  concepto: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: "pagada" | "pendiente" | "anulada";
  dianAutorizada: boolean;
}

export interface Transaccion {
  id: string;
  fecha: string;
  tipo: "ingreso" | "egreso";
  categoria: string;
  descripcion: string;
  monto: number;
  metodoPago: string;
}

export type UserRole = "admin" | "contador" | "auxiliar" | "consultor";

export interface BackendUser {
  id: string;
  email: string;
  nombre: string;
  role: UserRole;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: BackendUser;
  token?: string;
  error?: string;
}

class ApiService {
  private async fetchData<T>(endpoint: string, baseUrl: string = API_BASE_URL, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("API Error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Error desconocido" 
      };
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.fetchData<LoginResponse>("/login", AUTH_API_URL, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getUsers(): Promise<ApiResponse<BackendUser[]>> {
    return this.fetchData<BackendUser[]>("/users", AUTH_API_URL);
  }

  async validateToken(token: string): Promise<ApiResponse<BackendUser>> {
    return this.fetchData<BackendUser>("/validate", AUTH_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.fetchData<DashboardStats>("/dashboard/stats");
  }

  async getHabitaciones(): Promise<ApiResponse<Habitacion[]>> {
    return this.fetchData<Habitacion[]>("/habitaciones");
  }

  async getFacturas(): Promise<ApiResponse<Factura[]>> {
    return this.fetchData<Factura[]>("/facturas");
  }

  async getTransacciones(): Promise<ApiResponse<Transaccion[]>> {
    return this.fetchData<Transaccion[]>("/transacciones");
  }

  async createFactura(factura: Partial<Factura>): Promise<ApiResponse<Factura>> {
    return this.fetchData<Factura>("/facturas", API_BASE_URL, {
      method: "POST",
      body: JSON.stringify(factura),
    });
  }

  async updateHabitacion(id: string, data: Partial<Habitacion>): Promise<ApiResponse<Habitacion>> {
    return this.fetchData<Habitacion>(`/habitaciones/${id}`, API_BASE_URL, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService();
