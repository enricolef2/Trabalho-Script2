class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <h1>Portfólio de Interação Web</h1>
        <p>Bem-vindo ao repositório dos meus trabalhos da disciplina.</p>
      </header>`;
  }
}

class SiteNav extends HTMLElement {
  connectedCallback() {
    const paginaAtual = this.getAttribute("data-ativo");

    const links = [
      { href: "index.html", texto: "Apresentação" },
      { href: "editorCor.html", texto: "Trabalho 1 (Editor de Menus)" },
      { href: "prova.html", texto: "Trabalho 2 (Prova On-line)" },
      { href: "#", texto: "Trabalho 3" },
    ];

    let itens = "";
    for (let i = 0; i < links.length; i++) {
      let classe = "";
      if (links[i].href == paginaAtual) {
        classe = "active";
      }
      itens += `<li><a href="${links[i].href}" class="${classe}">${links[i].texto}</a></li>`;
    }

    this.innerHTML = `
      <nav class="site-nav">
        <ul>${itens}</ul>
      </nav>`;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <p>Desenvolvido para a disciplina de Interação Web - TADS</p>
      </footer>`;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-nav", SiteNav);
customElements.define("site-footer", SiteFooter);
