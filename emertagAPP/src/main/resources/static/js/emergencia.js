// ==============================================
// EmerTag - Página Pública de Emergência
// ==============================================

document.addEventListener("DOMContentLoaded", async () => {
    const token = new URLSearchParams(window.location.search).get("token");
    const container = document.getElementById("conteudo-emergencia");

    if (!token) {
        container.innerHTML = `<div class="card-erro"><h2>QR Code inválido</h2><p>Não foi possível identificar o perfil.</p></div>`;
        return;
    }

    try {
        const dados = await api.get(`/perfis/publico/${encodeURIComponent(token)}`);
        renderizar(container, dados);
    } catch (erro) {
        container.innerHTML = `<div class="card-erro"><h2>Informações indisponíveis</h2><p>${erro.message || "Não foi possível carregar os dados."}</p></div>`;
    }
});

const ICONES = {
    alergia: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#FEE2E2"/><path d="M20 11L28 25H12L20 11Z" stroke="#DC2626" stroke-width="2" stroke-linejoin="round" fill="none"/><line x1="20" y1="17" x2="20" y2="21" stroke="#DC2626" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="23.5" r="1.2" fill="#DC2626"/></svg>`,
    condicao: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#DBEAFE"/><path d="M20 27C20 27 12 22 12 17C12 14.5 14 13 16 13C17.5 13 18.7 13.8 20 15C21.3 13.8 22.5 13 24 13C26 13 28 14.5 28 17C28 22 20 27 20 27Z" stroke="#2563EB" stroke-width="2" stroke-linejoin="round" fill="none"/><line x1="24" y1="17" x2="24" y2="21" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="19" x2="26" y2="19" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/></svg>`,
    medicamento: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#DBEAFE"/><g transform="rotate(-45 20 20)"><rect x="13" y="16" width="14" height="8" rx="4" stroke="#2563EB" stroke-width="2" fill="none"/><line x1="20" y1="16" x2="20" y2="24" stroke="#2563EB" stroke-width="2"/></g></svg>`,
    biosseguranca: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#DBEAFE"/><path d="M20 11L13 14V20C13 24 16 27.5 20 29C24 27.5 27 24 27 20V14L20 11Z" stroke="#2563EB" stroke-width="2" stroke-linejoin="round" fill="none"/><line x1="20" y1="17" x2="20" y2="22" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="24.5" r="1.2" fill="#2563EB"/></svg>`,
    necessidade: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#FEF3C7"/><circle cx="16" cy="16" r="3" stroke="#D97706" stroke-width="1.8" fill="none"/><path d="M11 27C11 23.5 13.2 21.5 16 21.5C18.8 21.5 21 23.5 21 27" stroke="#D97706" stroke-width="1.8" stroke-linecap="round" fill="none"/><circle cx="24" cy="17" r="2.5" stroke="#D97706" stroke-width="1.8" fill="none"/><path d="M21 26C21 23.5 22.5 22 24 22C25.5 22 27 23.5 27 26" stroke="#D97706" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M27 12L28 14L30 14L28.5 15.5L29 17.5L27 16.5L25 17.5L25.5 15.5L24 14L26 14L27 12Z" fill="#D97706"/></svg>`,
    contato: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#DBEAFE"/><path d="M14 13C14 13 13 14.5 13 16C13 22 18 27 24 27C25.5 27 27 26 27 26L25.5 22.5L22 23L21 21.5C19.5 20.5 18.5 19.5 17.5 18L16 17L16.5 13.5L14 13Z" stroke="#2563EB" stroke-width="2" stroke-linejoin="round" fill="none"/></svg>`,
    usuario: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#E5E7EB"/><circle cx="20" cy="16" r="5" fill="#9CA3AF"/><path d="M10 32C10 26 14.5 22 20 22C25.5 22 30 26 30 32" fill="#9CA3AF"/></svg>`
};

function renderizar(container, dados) {
    const nome = dados.nome || "Pessoa protegida";
    const idade = dados.idade;
    const tipoSanguineo = dados.tipoSanguineo;
    const fotoUrl = dados.fotoUrl;
    const alergias = dados.alergias || [];
    const condicoes = dados.condicoes || [];
    const medicamentos = dados.medicamentos || [];
    const necessidadesEspecificas = dados.necessidadesEspecificas || [];
    const biosseguranca = dados.biosseguranca;
    const contatos = dados.contatos || [];

    const fotoHtml = fotoUrl
        ? `<img src="${fotoUrl}" alt="${escapeHtml(nome)}" class="foto-perfil" id="foto-perfil-img" />`
        : `<div class="foto-perfil-placeholder">${ICONES.usuario}</div>`;

    const infoParts = [];
    if (idade) infoParts.push(`${idade} anos`);
    if (tipoSanguineo) infoParts.push(`Sangue ${tipoSanguineo}`);
    const infoSecundaria = infoParts.length
        ? `<div class="info-secundaria">${infoParts.map(p => `<span>${p}</span>`).join("")}</div>`
        : "";

    const cabecalhoHtml = `
        <header class="cabecalho-emergencia">
            <h1>Perfil de Emergência</h1>
            ${fotoHtml}
            <div class="nome-perfil">${escapeHtml(nome)}</div>
            ${infoSecundaria}
        </header>
    `;

    const cardsSaude = [];

    if (alergias.length) {
        cardsSaude.push(`<div class="card-info card-alergia"><div class="icone-card">${ICONES.alergia}</div><div class="conteudo-card"><div class="rotulo rotulo-alergia">ALERGIAS</div><div class="valor">${alergias.map(escapeHtml).join("<br>")}</div></div></div>`);
    }
    if (condicoes.length) {
        cardsSaude.push(`<div class="card-info"><div class="icone-card">${ICONES.condicao}</div><div class="conteudo-card"><div class="rotulo">Condições de Saúde</div><div class="valor">${condicoes.map(escapeHtml).join("<br>")}</div></div></div>`);
    }
    if (medicamentos.length) {
        cardsSaude.push(`<div class="card-info"><div class="icone-card">${ICONES.medicamento}</div><div class="conteudo-card"><div class="rotulo">Medicamentos</div><div class="valor">${medicamentos.map(escapeHtml).join("<br>")}</div></div></div>`);
    }
    if (biosseguranca) {
        cardsSaude.push(`<div class="card-info"><div class="icone-card">${ICONES.biosseguranca}</div><div class="conteudo-card"><div class="rotulo">Biossegurança</div><div class="valor">${escapeHtml(biosseguranca)}</div></div></div>`);
    }
    if (necessidadesEspecificas.length) {
        cardsSaude.push(`<div class="card-info card-necessidade"><div class="icone-card">${ICONES.necessidade}</div><div class="conteudo-card"><div class="rotulo rotulo-necessidade">Necessidades específicas</div><div class="valor">${necessidadesEspecificas.map(escapeHtml).join("<br>")}</div></div></div>`);
    }

    const secaoSaudeHtml = cardsSaude.length
        ? `<section class="secao-emergencia"><h2 class="titulo-secao">Informações Médicas</h2><div class="lista-cards">${cardsSaude.join("")}</div></section>`
        : "";

    let secaoContatosHtml = "";
    if (contatos.length) {
        const contatosCards = contatos.map(c => {
            const tel = (c.telefone || "").replace(/\D/g, "");
            return `<a href="tel:${tel}" class="card-contato"><div class="icone-card">${ICONES.contato}</div><div class="conteudo-card"><div class="rotulo">${escapeHtml(c.nome || "")}</div><div class="valor">${escapeHtml(c.relacao || "")} • ${escapeHtml(c.telefone || "")}</div></div></a>`;
        }).join("");
        secaoContatosHtml = `<section class="secao-emergencia"><h2 class="titulo-secao">Contatos de Emergência</h2><div class="lista-cards">${contatosCards}</div></section>`;
    }

    const rodapeHtml = `<footer class="rodape-emergencia"><strong>EmerTag</strong> — Informação certa. Mais cuidado. Sempre.<br>Esta página é apenas informativa e não substitui atendimento médico profissional.</footer>`;

    container.innerHTML = cabecalhoHtml + secaoSaudeHtml + secaoContatosHtml + rodapeHtml;

    const imgFoto = document.getElementById("foto-perfil-img");
    if (imgFoto) {
        imgFoto.addEventListener("error", function() {
            const placeholder = document.createElement("div");
            placeholder.className = "foto-perfil-placeholder";
            placeholder.innerHTML = ICONES.usuario;
            this.replaceWith(placeholder);
        });
    }
}

function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
