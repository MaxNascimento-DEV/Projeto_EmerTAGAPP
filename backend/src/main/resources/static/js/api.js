const API_BASE_URL = "";

async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("emertag_token");
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const resposta = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    if (resposta.status === 401) {
        localStorage.removeItem("emertag_token");
        throw new Error("Sessão expirada.");
    }
    if (!resposta.ok) {
        // O GlobalExceptionHandler do backend devolve { "erro": "mensagem" }
        const erro = await resposta.json().catch(() => ({}));
        throw new Error(erro.erro || erro.mensagem || `Erro ${resposta.status}`);
    }
    if (resposta.status === 204) return null;
    return resposta.json();
}

const api = {
    get: (endpoint) => apiFetch(endpoint),
    post: (endpoint, body) => apiFetch(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: (endpoint, body) => apiFetch(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    delete: (endpoint) => apiFetch(endpoint, { method: "DELETE" }),
};

const sessao = {
    salvar(token, usuario) {
        localStorage.setItem("emertag_token", token);
        if (usuario) localStorage.setItem("emertag_usuario", JSON.stringify(usuario));
    },
    encerrar() {
        localStorage.removeItem("emertag_token");
        localStorage.removeItem("emertag_usuario");
    },
    usuario() {
        const u = localStorage.getItem("emertag_usuario");
        return u ? JSON.parse(u) : null;
    },
    logado() {
        return !!localStorage.getItem("emertag_token");
    }
};
