import { createContext, useContext, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  farmName?: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock user data for now
  const user: User = {
    name: "John Farmer",
    email: "john@example.com",
    farmName: "Green Valley Farm"
  };

  const logout = () => {
    // Mock logout function
    console.log("Logging out...");
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
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
