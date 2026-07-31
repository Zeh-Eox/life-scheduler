import { apiClient } from "./client";
import { tokenStorage } from "./storage";

export async function login(email: string, motDePasse: string) {
  const { data } = await apiClient.post("/auth/login", { email, motDePasse });
  await tokenStorage.setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function register(nom: string, email: string, motDePasse: string) {
  const { data } = await apiClient.post("/auth/register", {
    nom,
    email,
    motDePasse,
  });
  await tokenStorage.setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function logout() {
  const refreshToken = await tokenStorage.getRefreshToken();
  try {
    await apiClient.post(
      "/auth/logout",
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } },
    );
  } finally {
    // On efface les tokens locaux même si l'appel serveur échoue
    await tokenStorage.clearTokens();
  }
}

export async function getMe() {
  const { data } = await apiClient.get("/user/me");
  return data;
}
