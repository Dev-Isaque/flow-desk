// userService.js
const API_URL = "http://localhost:8080";

export async function apiRequest(url, options = {}) {

    const rawToken = localStorage.getItem("token");

    const token = rawToken && rawToken !== "null" && rawToken !== "undefined"
        ? rawToken
        : null;

    const method = (options.method || "GET").toUpperCase();

    const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const fetchOptions = {
        ...options,
        method,
        headers,
        credentials: "include",
    };

    if (options.body != null && method !== "GET" && method !== "HEAD") {
        fetchOptions.body = options.body;
    } else {
        delete fetchOptions.body;
    }

    const response = await fetch(`${API_URL}${url}`, fetchOptions);

    if (options.responseType === "blob") {
        if (!response.ok) throw new Error("Erro na requisição");
        return response.blob();
    }

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
        const errorMessage = data?.mensagem || data?.message || "Erro na requisição";
        return { sucesso: false, mensagem: errorMessage };
    }

    return { sucesso: true, dados: data };
}

export async function updateUser(id, userData, photoFile) {
    const formData = new FormData();

    if (userData.name) {
        formData.append("name", userData.name);
    }

    if (userData.email) {
        formData.append("email", userData.email);
    }

    if (userData.currentPassword) {
        formData.append("currentPassword", userData.currentPassword);
    }

    if (userData.password) {
        formData.append("password", userData.password);
    }

    if (userData.password_confirm) {
        formData.append("password_confirm", userData.password_confirm);
    }

    if (photoFile) {
        formData.append("photoFile", photoFile);
    }

    console.log("Enviando update com dados:", Object.fromEntries(formData));

    return apiRequest(`/users/update/${id}`, {
        method: "PATCH",
        body: formData,
    });
}

export async function getMe() {
    return apiRequest("/users/me", {
        method: "GET",
    });
}