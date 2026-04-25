const apiFetch = async(url:URL, options = {}) => {
    const access = localStorage.getItem("access")

    const response = await fetch(url, {
        ...options,
        headers: {
             "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
            ...options.headers
        }
    })
    
    if (response.status === 401) {
        const newAccess = await refreshToken()

        if (newAccess) {
            return apiFetch(url, options) // retry
        }
    }

    return response

}

const refreshToken = async() => {
    const refresh = localStorage.getItem("refresh")

    if (!refresh) return null

    const response = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh })
    })

    if (!response.ok) {
        localStorage.clear()
        window.location.href = "/login"
        return null
    }

    const data = await response.json()
    localStorage.setItem("access", data.access)

    return data.access
}


export default apiFetch

