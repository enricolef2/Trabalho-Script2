const estiloProva = `
  <style>
    .prova {
      max-width: 800px;
      margin: 0 auto;
      background-color: var(--background-white);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      overflow: hidden;
    }

    h2 {
      margin: 0;
      padding: 1.5rem;
      background-color: var(--primary-color);
      color: var(--text-light);
    }

    .instrucoes {
      margin: 0;
      padding: 1rem 1.5rem 0 1.5rem;
    }

    form,
    #resultado {
      padding: 1.5rem;
    }

    fieldset {
      border: 0;
      border-bottom: 1px solid #ccc;
      margin: 0 0 1.5rem 0;
      padding: 0 0 1.5rem 0;
    }

    legend {
      font-weight: bold;
      padding: 0;
      margin-bottom: 0.75rem;
    }

    .alternativa {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      margin-bottom: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    .alternativa:hover {
      background-color: #eaf3fa;
    }

    .alternativa input {
      width: 1.2rem;
      height: 1.2rem;
      margin: 0;
    }

    .alternativa label {
      flex: 1;
      padding: 0.5rem 0;
      cursor: pointer;
    }

    #aviso {
      color: #c0392b;
      font-weight: bold;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      background-color: var(--primary-color);
      color: white;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
    }

    button:hover {
      background-color: #34495e;
    }

    .nota {
      margin-bottom: 1.5rem;
      padding: 1rem;
      border-radius: var(--border-radius);
      color: white;
      text-align: center;
    }

    .nota h3 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .nota p {
      margin: 0;
    }

    .boa {
      background-color: #1e8449;
    }

    .ruim {
      background-color: #c0392b;
    }

    .revisao {
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      border: 1px solid #ccc;
      border-left-width: 6px;
      border-radius: 6px;
    }

    .revisao p {
      margin: 0.25rem 0;
    }

    .certa {
      border-left-color: #1e8449;
    }

    .errada {
      border-left-color: #c0392b;
    }

    @media (max-width: 600px) {
      button {
        width: 100%;
      }
    }
  </style>`;

class ProvaOnline extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.prova = null;
  }

  connectedCallback() {
    this.carregarProva();
  }

  async carregarProva() {
    try {
      const resposta = await fetch("js/questoes.json");
      this.prova = await resposta.json();
      this.mostrarProva();
    } catch (erro) {
      this.shadowRoot.innerHTML = estiloProva + `
        <div class="prova">
          <h2>Prova on-line</h2>
          <p class="instrucoes" role="alert">Não foi possível carregar as questões da prova.</p>
        </div>`;
    }
  }

  mostrarProva() {
    let questoesHtml = "";

    for (let i = 0; i < this.prova.questoes.length; i++) {
      const questao = this.prova.questoes[i];
      let alternativasHtml = "";

      for (let j = 0; j < questao.alternativas.length; j++) {
        alternativasHtml += `
          <div class="alternativa">
            <input type="radio" id="q${i}a${j}" name="questao${i}" value="${j}">
            <label for="q${i}a${j}">${questao.alternativas[j]}</label>
          </div>`;
      }

      questoesHtml += `
        <fieldset>
          <legend>${i + 1}. ${questao.enunciado}</legend>
          ${alternativasHtml}
        </fieldset>`;
    }

    this.shadowRoot.innerHTML = estiloProva + `
      <div class="prova">
        <h2><slot name="titulo">Prova on-line</slot></h2>
        <p class="instrucoes"><slot name="instrucoes">Marque uma alternativa em cada questão.</slot></p>
        <form id="formProva">
          ${questoesHtml}
          <p id="aviso" role="alert"></p>
          <button type="button" id="botaoCorrigir">Corrigir prova</button>
        </form>
        <div id="resultado" hidden></div>
      </div>`;

    this.shadowRoot.getElementById("formProva").addEventListener("submit", (evento) => {
      evento.preventDefault();
    });

    this.shadowRoot.getElementById("botaoCorrigir").addEventListener("click", () => {
      this.corrigirProva();
    });
  }

  corrigirProva() {
    const raiz = this.shadowRoot;
    const respostas = [];
    const faltando = [];

    for (let i = 0; i < this.prova.questoes.length; i++) {
      const marcada = raiz.querySelector(`input[name="questao${i}"]:checked`);
      if (marcada == null) {
        faltando.push(i + 1);
      } else {
        respostas[i] = Number(marcada.value);
      }
    }

    const aviso = raiz.getElementById("aviso");
    if (faltando.length > 0) {
      aviso.textContent = "Responda todas as questões antes de corrigir. Faltam: " + faltando.join(", ") + ".";
      return;
    }
    aviso.textContent = "";

    let acertos = 0;
    let revisaoHtml = "";

    for (let i = 0; i < this.prova.questoes.length; i++) {
      const questao = this.prova.questoes[i];
      let classe = "errada";
      if (respostas[i] == questao.correta) {
        acertos++;
        classe = "certa";
      }

      revisaoHtml += `
        <div class="revisao ${classe}">
          <p><b>${i + 1}. ${questao.enunciado}</b></p>
          <p>Sua resposta: ${questao.alternativas[respostas[i]]}</p>
          <p>Resposta correta: ${questao.alternativas[questao.correta]}</p>
        </div>`;
    }

    const nota = (acertos / this.prova.questoes.length) * 10;
    let classeNota = "ruim";
    if (nota >= 6) {
      classeNota = "boa";
    }

    const resultado = raiz.getElementById("resultado");
    resultado.innerHTML = `
      <div class="nota ${classeNota}">
        <h3>Nota: ${nota.toFixed(1).replace(".", ",")}</h3>
        <p>Você acertou ${acertos} de ${this.prova.questoes.length} questões.</p>
      </div>
      ${revisaoHtml}
      <button type="button" id="botaoRefazer">Responder novamente</button>`;

    raiz.getElementById("formProva").hidden = true;
    resultado.hidden = false;
    this.scrollIntoView();

    raiz.getElementById("botaoRefazer").addEventListener("click", () => {
      this.mostrarProva();
      this.scrollIntoView();
    });
  }
}

customElements.define("prova-online", ProvaOnline);
