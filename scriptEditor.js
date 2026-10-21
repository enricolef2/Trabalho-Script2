document.addEventListener("DOMContentLoaded", () => {

    const listaGerada = document.getElementById("listaGerada");
    const resultadoMenu = document.getElementById("resultadoMenu");

    const textoNovoItem = document.getElementById("textoNovoItem");
    const btnAdicionar = document.getElementById("botaoAdicionar");
    const btnRemover = document.getElementById("botaoRemover");

    const inCorFundo = document.getElementById("corFundo");
    const inGap = document.getElementById("gapMenu");
    const inUrl = document.getElementById("urlImagem");
    const imgGerada = document.getElementById("imagemGerada");

    const inCorTexto = document.getElementById("corTexto");
    const inCorFundoItem = document.getElementById("corFundoItem");
    const inTamFonte = document.getElementById("tamanhoFonte");
    const inPeso = document.getElementById("pesoFonte");
    const inBordaLarg = document.getElementById("larguraBorda");
    const inBordaRaio = document.getElementById("raioBorda");

    
    function atualizarEstilos() {
       
        resultadoMenu.style.backgroundColor = inCorFundo.value;
        listaGerada.style.gap = inGap.value + "px";

        
        if (inUrl.value.trim() !== "") {
            imgGerada.src = inUrl.value;
            imgGerada.style.display = "block";
        } else {
            imgGerada.style.display = "none";
            imgGerada.src = ""; 
        }


        const itens = listaGerada.querySelectorAll("li");
        itens.forEach(li => {
            li.style.color = inCorTexto.value;
            li.style.backgroundColor = inCorFundoItem.value;
            li.style.fontSize = inTamFonte.value + "px";
            li.style.fontWeight = inPeso.checked ? "bold" : "normal";
            li.style.border = `${inBordaLarg.value}px solid ${inCorTexto.value}`;
            li.style.borderRadius = inBordaRaio.value + "px";
            li.style.padding = "8px 16px";
        });

        
        btnRemover.disabled = itens.length === 0;
    }

    btnAdicionar.addEventListener("click", () => {
        const texto = textoNovoItem.value.trim() || "Novo Item";
        const novoLi = document.createElement("li");
        novoLi.textContent = texto;
        listaGerada.appendChild(novoLi);

        textoNovoItem.value = ""; 
        atualizarEstilos();
    });

    btnRemover.addEventListener("click", () => {
        if (listaGerada.lastElementChild) {
            listaGerada.removeChild(listaGerada.lastElementChild);
            atualizarEstilos();
        }
    });

    textoNovoItem.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); 
            btnAdicionar.click();
        }
    });

    const inputs = [
        inCorFundo, inGap, inUrl, inCorTexto, inCorFundoItem,
        inTamFonte, inPeso, inBordaLarg, inBordaRaio
    ];

    inputs.forEach(input => {
        input.addEventListener("input", atualizarEstilos);
        input.addEventListener("change", atualizarEstilos);
    });

    atualizarEstilos();
});