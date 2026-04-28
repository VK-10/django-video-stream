const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"

export const tokenStorage = {
    getAccessToken() : string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY)
    },
    setAccessToken(token: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, token)
    },
    removeAccessToken(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
    },
    setRefreshToken(token: string): void {
        localStorage.setItem(REFRESH_TOKEN_KEY, token)
    },
    removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasAccessToken(): boolean {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY)
  }
}