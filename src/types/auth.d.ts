declare namespace Auth {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }

  interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
  }
} 