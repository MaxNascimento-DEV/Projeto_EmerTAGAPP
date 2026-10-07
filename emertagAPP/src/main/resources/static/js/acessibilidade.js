const Acessibilidade = {
    TAMANHOS: { PEQUENO: "14px", MEDIO: "16px", GRANDE: "20px" },

    init() {
        this.aplicarPreferencias();
        this.criarBarra();
    },

    aplicarPreferencias() {
        const tamanho = localStorage.getItem("emertag_tamanho_texto") || "MEDIO";
        const contraste = localStorage.getItem("emertag_alto_contraste") === "true";
        document.documentElement.style.setProperty("--tamanho-base", this.TAMANHOS[tamanho]);
        document.body.classList.toggle("alto-contraste", contraste);
    },

    definirTamanho(tamanho) {
        if (!this.TAMANHOS[tamanho]) return;
        localStorage.setItem("emertag_tamanho_texto", tamanho);
        document.documentElement.style.setProperty("--tamanho-base", this.TAMANHOS[tamanho]);
    },

    alternarContraste() {
        const ativo = document.body.classList.toggle("alto-contraste");
        localStorage.setItem("emertag_alto_contraste", ativo);
    },

    criarBarra() {
        if (document.querySelector(".barra-acessibilidade")) return;
        const barra = document.createElement("div");
        barra.className = "barra-acessibilidade";
        barra.setAttribute("role", "toolbar");
        barra.setAttribute("aria-label", "Opcoes de acessibilidade");
        barra.innerHTML = `<button type="button" title="Diminuir texto" data-acao="menor">A-</button><button type="button" title="Aumentar texto" data-acao="maior">A+</button><button type="button" title="Alto contraste" data-acao="contraste">◐</button>`;
        document.body.appendChild(barra);

        barra.addEventListener("click", (e) => {
            const acao = e.target.dataset.acao;
            if (!acao) return;
            const atual = localStorage.getItem("emertag_tamanho_texto") || "MEDIO";
            const ordem = ["PEQUENO", "MEDIO", "GRANDE"];
            const idx = ordem.indexOf(atual);
            if (acao === "maior") this.definirTamanho(ordem[Math.min(idx + 1, 2)]);
            if (acao === "menor") this.definirTamanho(ordem[Math.max(idx - 1, 0)]);
            if (acao === "contraste") this.alternarContraste();
        });
    }
};

document.addEventListener("DOMContentLoaded", () => Acessibilidade.init());
