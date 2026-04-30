import { tokenStorage } from "../storage/tokenStorage";

export type RegisterPayload = {
    username : string,
    email : string,
    password1 : string,
    password2 : string,
}

export type LoginPayload = {
    email: string;
    password: string;
}

type AuthResult = | { success: true; data?: any }
  | { success: false; errors: string[] };

export async function registerUser(payload: RegisterPayload): Promise<AuthResult> {
    try {
        const response = await fetch("http://localhost:8000/accounts/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)

        })
        let data;

        try {
            data = await response.json();
        } catch {
            data = {}
        }

        if (!response.ok) {
            return {
                success : false,
                errors: normalizeErrors(data)
            }
        }

        return {success: true, data}

        
    }
    catch {
      return {
        success:false,
        errors:["Network error"]
      }
   }
    
}


export async function loginUser(payload : LoginPayload): Promise<AuthResult> {
    try {
        const response = await fetch("http://localhost:8000/accounts/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(payload)
        });

        let data;
        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (!response.ok) {
            return {
                success : false,
                errors: normalizeErrors(data)
            };
        }

        if (!data.access_token || !data.refresh_token) {
            return {
                success: false,
                errors: ["Invalid authentication response"]
            };
        }

        tokenStorage.setAccessToken(data.access_token)
        tokenStorage.setRefreshToken(data.refresh_token)

        return {
            success: true,
            data
        };
    } catch {
        return {
      success: false,
      errors: ["Network error"]
    };
    }
}

export function logoutUser() {
    tokenStorage.clearTokens();
    // window.location.href = "/login";
}

function normalizeErrors(data: any): string[] {
  if (Array.isArray(data)) {
    return data.map(String);
  }

  if (typeof data === "object" && data !== null) {
    return Object.entries(data).flatMap(([field, msgs]) => {
      if (Array.isArray(msgs)) {
        return msgs.map(m => `${field}: ${m}`);
      }

      return [`${field}: ${String(msgs)}`];
    });
  }
  return ["Authentication failed"];
}