import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface CompanyData {
  nit: string;
  empresa: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  ciudad?: string;
  departamento?: string;
  representanteLegal?: string;
}

interface CompanyContextType {
  company: CompanyData | null;
  isLoading: boolean;
  error: string | null;
  refreshCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const CONTABILIDAD_URL = import.meta.env.VITE_CONTABILIDAD_URL || "http://sactel.lan/apiCont";

// Fallback company data when backend is unavailable
const FALLBACK_COMPANY: CompanyData = {
  nit: "900.000.000-0",
  empresa: "Empresa Demo S.A.S",
  direccion: "Calle 100 #15-20, Bogotá",
  telefono: "601 234 5678",
  email: "info@empresademo.com",
  ciudad: "Bogotá",
  departamento: "Cundinamarca",
  representanteLegal: "Administrador Demo",
};

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${CONTABILIDAD_URL}/data`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setCompany(data);
      localStorage.setItem("company_data", JSON.stringify(data));
    } catch (err) {
      console.warn("Error fetching company data, using fallback:", err);
      // Try localStorage first
      const stored = localStorage.getItem("company_data");
      if (stored) {
        setCompany(JSON.parse(stored));
      } else {
        setCompany(FALLBACK_COMPANY);
      }
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCompany();
    } else {
      setCompany(null);
    }
  }, [isAuthenticated]);

  return (
    <CompanyContext.Provider value={{ company, isLoading, error, refreshCompany: fetchCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
