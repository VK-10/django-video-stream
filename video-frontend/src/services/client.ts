import { tokenStorage } from "../storage/tokenStorage";


type FetchOptions = RequestInit & {
    _retry? : boolean;
}

const BASE_URL = "http://localhost:8000";

const apiFetch = async(url:string, options: FetchOptions = {}): Promise<Response>  => {
    const access_token = tokenStorage.getAccessToken()

    const headers: HeadersInit = {
    ...(options.headers || {})
    };
     if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }
     if (access_token) {
        headers["Authorization"] = `Bearer ${access_token}`;
    }

    const response = await fetch(BASE_URL+url, {
    ...options,
    headers
  });

  if (response.status === 401 && !options._retry) {
  const newAccess = await refreshToken();

  if (newAccess) {
    return apiFetch(url, {
      ...options,
      _retry: true,
      // pass the new token explicitly so retry uses it
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${newAccess}`,
      }
    });
  } else {
    tokenStorage.clearTokens();
    throw new Error("Session expired");
  }
}
  return response;
};

const refreshToken = async (): Promise<string | null> => {
  try {
    const refresh_token = tokenStorage.getRefreshToken();

    if (!refresh_token) return null;

    const response = await fetch(
      "http://localhost:8000/api/token/refresh/",
      {
        method: "POST",
        headers : {
        "Content-Type": "application/json",
      },
        body: JSON.stringify({ "refresh" : refresh_token })
      }
    );

    if (!response.ok) {
      tokenStorage.clearTokens();
      window.location.href = "/login";
      return null;
    }

    const data = await response.json();
    console.log("REFRESH RESPONSE:", data)

    const newToken = data.access_token ?? data.access; // handle both field names
    if (!newToken) return null;

    tokenStorage.setAccessToken(data.access_token);
    console.log("NEW ACCESS TOKEN after refreshment:", data.access_token);
    return data.access_token;

  } catch {
    return null;
  }
};

export default apiFetch;