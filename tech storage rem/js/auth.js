// tech storage rem/js/auth.js (FINAL E CORRIGIDO)
async function jsonReq(url, data) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
    });
    return res.json();
}

export async function me() {
    const res = await fetch('/api/me.php', { credentials: 'include' });
    return res.json();
}

export async function logout() {
    const res = await fetch('/api/auth_logout.php', { method: 'POST', credentials: 'include' });
    return res.json();
}

// Garante que o login é exportado
export async function login(email, senha) {
    return jsonReq("../api/auth_login.php", { email, password: senha });
}

// CORREÇÃO ESSENCIAL: Garante que o registro é exportado e usa o payload.
export async function register(payload) {
    return jsonReq("../api/auth_register.php", payload);
}