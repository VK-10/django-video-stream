import { tokenStorage } from "../storage/tokenStorage";

type FetchOptions = RequestInit & {
    _retry? : boolean;
}

const apiFetch = async(url:string, options: FetchOptions = {}): Promise<Response>  => {
    const access = tokenStorage.getAccessToken()

    const headers: HeadersInit = {
    ...(options.headers || {})
    };
     if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }
     if (access) {
        headers["Authorization"] = `Bearer ${access}`;
    }

    const response = await fetch(url, {
    ...options,
    headers
  });

  if (
    response.status === 401 &&
    !options._retry
  ) {
    const newAccess = await refreshToken();

    if (newAccess) {
      return apiFetch(url, {
        ...options,
        _retry: true
      });
    }
  }

  return response;
};

const refreshToken = async (): Promise<string | null> => {
  try {
    const refresh = tokenStorage.getRefreshToken();

    if (!refresh) return null;

    const response = await fetch(
      "http://localhost:8000/api/token/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh })
      }
    );

    if (!response.ok) {
      tokenStorage.clearTokens();
      window.location.href = "/login";
      return null;
    }

    const data = await response.json();

    tokenStorage.setAccessToken(data.access);

    return data.access;

  } catch {
    return null;
  }
};

export default apiFetch;