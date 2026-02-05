import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, BackendUser, UserRole } from "@/services/api";

export type { UserRole } from "@/services/api";

export interface User {
  id: string;
  email: string;
  nombre: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback demo users - only used if backend is unavailable
const DEMO_USERS: (User & { password: string })[] = [
  { id: "1", email: "admin@empresa.com", password: "admin123", nombre: "Administrador", role: "admin" },
  { id: "2", email: "contador@empresa.com", password: "contador123", nombre: "Juan Contador", role: "contador" },
  { id: "3", email: "auxiliar@empresa.com", password: "auxiliar123", nombre: "María Auxiliar", role: "auxiliar" },
  { id: "4", email: "consultor@empresa.com", password: "consultor123", nombre: "Pedro Consultor", role: "consultor" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      const storedUser = localStorage.getItem("auth_user");
      const storedToken = localStorage.getItem("auth_token");
      
      if (storedUser && storedToken) {
        try {
          // Try to validate token with backend
          const response = await api.validateToken(storedToken);
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Fallback to stored user if backend is unavailable
            setUser(JSON.parse(storedUser));
          }
        } catch {
          // If validation fails, use stored user as fallback
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem("auth_user");
            localStorage.removeItem("auth_token");
          }
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try to authenticate with backend first
      const response = await api.login({ email, password });
      
      if (response.success && response.data?.success && response.data.user) {
        const { password: _, ...userWithoutPassword } = response.data.user;
        setUser(userWithoutPassword);
        localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword));
        if (response.data.token) {
          localStorage.setItem("auth_token", response.data.token);
        }
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.warn("Backend authentication failed, using fallback:", error);
    }

    // Fallback to demo users if backend is unavailable
    const foundUser = DEMO_USERS.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
