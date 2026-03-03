const API_URL = "http://localhost:8080";

export async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("token");

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

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        return { sucesso: false, mensagem: data?.mensagem || data?.message || "Erro na requisição" };
    }

    return { sucesso: true, dados: data };
}
