import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "../api/auth";
import { tokenStorage } from "../api/storage";

type Utilisateur = {
  id: string;
  nom: string;
  email: string;
};

type AuthContextValue = {
  utilisateur: Utilisateur | null;
  isLoading: boolean; // vrai pendant la vérification initiale de session
  isAuthenticated: boolean;
  login: (email: string, motDePasse: string) => Promise<void>;
  register: (nom: string, email: string, motDePasse: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Au lancement de l'app : si un access token existe, on vérifie qu'il est
  // toujours valide en interrogeant /users/me (l'intercepteur axios gère
  // le refresh automatique si l'access token a expiré)
  useEffect(() => {
    async function bootstrap() {
      const accessToken = await tokenStorage.getAccessToken();
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await authApi.getMe();
        setUtilisateur(data);
      } catch {
        await tokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    }
    bootstrap();
  }, []);

  const loginMutation = useMutation({
    mutationFn: ({
      email,
      motDePasse,
    }: {
      email: string;
      motDePasse: string;
    }) => authApi.login(email, motDePasse),
    onSuccess: async () => {
      const data = await authApi.getMe();
      setUtilisateur(data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({
      nom,
      email,
      motDePasse,
    }: {
      nom: string;
      email: string;
      motDePasse: string;
    }) => authApi.register(nom, email, motDePasse),
    onSuccess: async () => {
      const data = await authApi.getMe();
      setUtilisateur(data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUtilisateur(null);
      queryClient.clear(); // vide le cache TanStack Query (données de l'ancien user)
    },
  });

  const value: AuthContextValue = {
    utilisateur,
    isLoading,
    isAuthenticated: !!utilisateur,
    login: async (email, motDePasse) => {
      await loginMutation.mutateAsync({ email, motDePasse });
    },
    register: async (nom, email, motDePasse) => {
      await registerMutation.mutateAsync({ nom, email, motDePasse });
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
}
