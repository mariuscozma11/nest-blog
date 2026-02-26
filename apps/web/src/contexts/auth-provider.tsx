import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  authApi,
  getAccessToken,
  setAccessToken,
  clearTokens,
  type User,
} from "../services/api";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = getAccessToken();
      if (accessToken) {
        try {
          const user = await authApi.getProfile();
          setAuthState({
            isAuthenticated: true,
            user,
          });
        } catch {
          // Token invalid, clear it
          clearTokens();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(email, password);

      if (response.accessToken) {
        setAccessToken(response.accessToken);
        setAuthState({
          isAuthenticated: true,
          user: response.user,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  const isAdmin = authState.user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ authState, login, logout, isLoading, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
