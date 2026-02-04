import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "contador" | "auxiliar" | "consultor";

export interface User {
  id: string;
  email: string;
  nombre: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing - in production this would come from the database
const DEMO_USERS: (User & { password: string })[] = [
  { id: "1", email: "admin@empresa.com", password: "admin123", nombre: "Administrador", role: "admin" },
  { id: "2", email: "contador@empresa.com", password: "contador123", nombre: "Juan Contador", role: "contador" },
  { id: "3", email: "auxiliar@empresa.com", password: "auxiliar123", nombre: "María Auxiliar", role: "auxiliar" },
  { id: "4", email: "consultor@empresa.com", password: "consultor123", nombre: "Pedro Consultor", role: "consultor" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = DEMO_USERS.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasRole }}>
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
