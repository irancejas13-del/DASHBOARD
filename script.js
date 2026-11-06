// ============================================
// MARATONA TECH 2026
// DADOS REAIS DA PESQUISA
// Ordem: Sempre, Quase sempre, Raramente, Nunca
// ============================================

const menores = [
    [4, 6, 1, 0],
    [1, 10, 0, 0],
    [1, 6, 3, 1],
    [1, 6, 1, 3],
    [5, 2, 4, 0],
    [2, 3, 5, 1],
    [2, 7, 1, 1],
    [1, 6, 3, 1],
    [3, 4, 1, 3],
    [1, 3, 7, 0],
    [5, 1, 3, 2],
    [1, 4, 6, 0],
    [8, 1, 2, 0],
    [5, 3, 3, 0]
];

const maiores = [
    [3, 4, 2, 0],
    [1, 5, 3, 0],
    [1, 3, 2, 3],
    [0, 2, 2, 5],
    [2, 5, 2, 0],
    [0, 3, 3, 3],
    [2, 7, 0, 0],
    [2, 3, 2, 2],
    [3, 2, 3, 1],
    [1, 7, 0, 1],
    [1, 3, 4, 1],
    [2, 2, 1, 4],
    [7, 2, 0, 0],
    [1, 5, 3, 0]
];

// ============================================
// ENUNCIADOS DAS 14 PERGUNTAS
// A primeira pergunta da lista original foi retirada.
// ============================================

const perguntas = [
    "Você pede respostas diretamente à inteligência artificial sem tentar resolver as questões sozinho primeiro?",

    "Você copia respostas fornecidas pela inteligência artificial sem verificar se estão corretas?",

    "Você utiliza a inteligência artificial para compreender matérias ou conteúdos que considera difíceis?",

    "Você sente dificuldade para realizar atividades escolares quando não tem acesso à inteligência artificial?",

    "Você costuma pesquisar em outras fontes para confirmar as informações fornecidas pela inteligência artificial?",

    "Você acredita que utiliza menos seu próprio raciocínio quando recebe respostas prontas da inteligência artificial?",

    "Você consegue desenvolver suas próprias ideias sem depender de sugestões da inteligência artificial?",

    "Você utiliza a inteligência artificial para criar textos, histórias ou trabalhos que exigem criatividade?",

    "Você sente que sua criatividade diminui quando utiliza a inteligência artificial para realizar atividades?",

    "Você consegue identificar erros ou informações falsas nas respostas fornecidas pela inteligência artificial?",

    "Você utiliza a inteligência artificial para estudar e testar seus conhecimentos, em vez de apenas obter respostas?",

    "Você deixa de tentar resolver problemas sozinho porque sabe que pode pedir ajuda à inteligência artificial?",

    "Você acredita que o uso excessivo da inteligência artificial pode prejudicar sua capacidade de pensar criticamente?",

    "Você consegue aprender e memorizar um conteúdo mesmo quando utiliza a inteligência artificial como auxílio?"
];

const nomes = [
    "Sempre",
    "Quase sempre",
    "Raramente",
    "Nunca"
];

const cores = [
    "#38bdf8",
    "#a78bfa",
    "#fbbf24",
    "#fb7185"
];

const participantes = {
    menores: 11,
    maiores: 9
};

let graficoPizza;
let graficoBarras;
let graficosIndividuais = [];

// ============================================
// FUNÇÕES DE CÁLCULO
// ============================================

function obterDados(filtro) {
    return filtro === "menores" ? menores : maiores;
}

function somarRespostas(dados) {
    return nomes.map((_, indice) =>
        dados.reduce(
            (soma, pergunta) => soma + pergunta[indice],
            0
        )
    );
}

function somarTotal(valores) {
    return valores.reduce((soma, valor) => soma + valor, 0);
}

function formatarPercentual(valor, total) {
    if (!total) return "0,0%";

    return (valor / total * 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }) + "%";
}

// ============================================
// PLUGIN: RÓTULOS EXTERNOS DA PIZZA
// ============================================

const rotulosPizza = {
    id: "rotulosPizza",

    afterDatasetsDraw(chart) {
        const dataset = chart.data.datasets[0];
        if (!dataset) return;

        const total = somarTotal(dataset.data);
        if (!total) return;

        const meta = chart.getDatasetMeta(0);
        const area = chart.chartArea;
        const ctx = chart.ctx;

        const esquerda = [];
        const direita = [];

        meta.data.forEach((arco, indice) => {
            const p = arco.getProps([
                "x", "y", "startAngle", "endAngle", "outerRadius"
            ], true);

            const angulo = (p.startAngle + p.endAngle) / 2;

            const item = {
                indice,
                x: p.x,
                y: p.y,
                raio: p.outerRadius,
                angulo,
                yFinal: p.y + Math.sin(angulo) * (p.outerRadius + 30)
            };

            if (Math.cos(angulo) >= 0) {
                direita.push(item);
            } else {
                esquerda.push(item);
            }
        });

        function desenharLado(lista, lado) {
            lista.sort((a, b) => a.yFinal - b.yFinal);

            const topo = area.top + 12;
            const base = area.bottom - 12;
            const distancia = 28;

            lista.forEach((item, i) => {
                item.yFinal = Math.max(
                    item.yFinal,
                    i === 0 ? topo : lista[i - 1].yFinal + distancia
                );
            });

            if (lista.length) {
                const excesso = lista[lista.length - 1].yFinal - base;

                if (excesso > 0) {
                    lista.forEach(item => item.yFinal -= excesso);
                }
            }

            lista.forEach(item => {
                const cor = cores[item.indice];
                const valor = dataset.data[item.indice];
                const percentual = formatarPercentual(valor, total);

                const x1 = item.x + Math.cos(item.angulo) * item.raio * 0.88;
                const y1 = item.y + Math.sin(item.angulo) * item.raio * 0.88;

                const x2 = item.x + Math.cos(item.angulo) * (item.raio + 12);
                const x3 = item.x + (lado === "direita" ? 1 : -1) *
                    (item.raio + 28);

                const x4 = x3 + (lado === "direita" ? 13 : -13);

                ctx.save();

                ctx.strokeStyle = cor;
                ctx.lineWidth = 1.7;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, item.yFinal);
                ctx.lineTo(x3, item.yFinal);
                ctx.lineTo(x4, item.yFinal);
                ctx.stroke();

                ctx.fillStyle = "#f1f5f9";
                ctx.font = "600 11px Inter, Arial";
                ctx.textAlign = lado === "direita" ? "left" : "right";
                ctx.textBaseline = "middle";

                const texto = `${nomes[item.indice]} ${percentual}`;

                ctx.fillText(
                    texto,
                    lado === "direita" ? x4 + 4 : x4 - 4,
                    item.yFinal
                );

                ctx.restore();
            });
        }

        desenharLado(esquerda, "esquerda");
        desenharLado(direita, "direita");
    }
};

// ============================================
// PLUGIN: QUANTIDADE E PORCENTAGEM NOS GRÁFICOS
// INDIVIDUAIS
// ============================================

const rotulosBarras = {
    id: "rotulosBarras",

    afterDatasetsDraw(chart) {
        const ctx = chart.ctx;
        const total = chart.data.datasets[0].data.reduce(
            (soma, valor) => soma + valor,
            0
        );

        const meta = chart.getDatasetMeta(0);

        ctx.save();
        ctx.font = "600 11px Inter, Arial";
        ctx.fillStyle = "#f1f5f9";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        meta.data.forEach((barra, indice) => {
            const valor = chart.data.datasets[0].data[indice];
            const posicao = barra.getProps(["x", "y"], true);

            const texto = `${valor} · ${formatarPercentual(valor, total)}`;

            ctx.fillText(texto, posicao.x + 7, posicao.y);
        });

        ctx.restore();
    }
};

// ============================================
// CRIAR GRÁFICO GERAL DE PIZZA
// ============================================

function criarGraficoPizza() {
    const ctx = document
        .getElementById("graficoPizza")
        .getContext("2d");

    graficoPizza = new Chart(ctx, {
        type: "pie",

        data: {
            labels: nomes,
            datasets: [{
                data: [66, 115, 67, 32],
                backgroundColor: cores,
                borderColor: "#111e30",
                borderWidth: 3,
                hoverOffset: 8
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            layout: {
                padding: {
                    top: 30,
                    bottom: 30,
                    left: 110,
                    right: 110
                }
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    callbacks: {
                        label(context) {
                            const total = somarTotal(
                                context.dataset.data
                            );

                            return `${context.label}: ${context.raw} respostas (${formatarPercentual(context.raw, total)})`;
                        }
                    }
                }
            }
        },

        plugins: [rotulosPizza]
    });
}

// ============================================
// CRIAR GRÁFICO GERAL DE BARRAS
// ============================================

function criarGraficoBarras() {
    const ctx = document
        .getElementById("graficoBarras")
        .getContext("2d");

    graficoBarras = new Chart(ctx, {
        type: "bar",

        data: {
            labels: nomes,

            datasets: [{
                label: "Quantidade de respostas",
                data: [66, 115, 67, 32],
                backgroundColor: cores,
                borderRadius: 7
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: "#cbd5e1"
                    },
                    grid: {
                        display: false
                    }
                },

                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#9aabc0",
                        precision: 0
                    },
                    grid: {
                        color: "#263950"
                    }
                }
            }
        }
    });
}

// ============================================
// CRIAR OS 14 GRÁFICOS INDIVIDUAIS
// ============================================

function criarGraficosIndividuais() {
    const container = document.getElementById("graficosPerguntas");

    container.innerHTML = "";
    graficosIndividuais = [];

    perguntas.forEach((pergunta, indice) => {
        const cartao = document.createElement("article");

        cartao.className = "cartao-pergunta";

        const numero = String(indice + 1).padStart(2, "0");
        const idCanvas = `perguntaGrafico${indice}`;

        cartao.innerHTML = `
            <span class="numero-pergunta">PERGUNTA ${numero}</span>

            <h3>${pergunta}</h3>

            <div class="info-pergunta">
                Distribuição das quatro alternativas
            </div>

            <div class="grafico-individual">
                <canvas id="${idCanvas}"></canvas>
            </div>
        `;

        container.appendChild(cartao);

        const ctx = document
            .getElementById(idCanvas)
            .getContext("2d");

        const grafico = new Chart(ctx, {
            type: "bar",

            data: {
                labels: nomes,

                datasets: [{
                    label: "Respostas",
                    data: [0, 0, 0, 0],
                    backgroundColor: cores,
                    borderRadius: 5,
                    barThickness: 23
                }]
            },

            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,

                layout: {
                    padding: {
                        right: 78
                    }
                },

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: {
                        callbacks: {
                            label(context) {
                                const valores = context.dataset.data;
                                const total = somarTotal(valores);

                                return `${context.raw} respostas · ${formatarPercentual(context.raw, total)}`;
                            }
                        }
                    }
                },

                scales: {
                    x: {
                        beginAtZero: true,
                        max: 15,

                        ticks: {
                            color: "#9aabc0",
                            stepSize: 1,
                            precision: 0
                        },

                        grid: {
                            color: "#263950"
                        }
                    },

                    y: {
                        ticks: {
                            color: "#dce6f2",
                            font: {
                                size: 11
                            }
                        },

                        grid: {
                            display: false
                        }
                    }
                }
            },

            plugins: [rotulosBarras]
        });

        graficosIndividuais.push(grafico);
    });
}

// ============================================
// LEGENDA DA PIZZA
// ============================================

function atualizarLegenda() {
    const legenda = document.getElementById("legendaPizza");

    legenda.innerHTML = nomes.map((nome, indice) => `
        <div class="item-legenda">
            <span
                class="cor-legenda"
                style="background:${cores[indice]}"
            ></span>
            ${nome}
        </div>
    `).join("");
}

// ============================================
// ATUALIZAR TODO O DASHBOARD
// ============================================

function atualizarDashboard() {
    const filtro = document.getElementById("filtro").value;

    const dados = obterDados(filtro);
    const totalParticipantes = participantes[filtro];

    const totais = somarRespostas(dados);
    const totalGeral = somarTotal(totais);

    const indiceMaior = totais.indexOf(Math.max(...totais));

    // INDICADORES
    document.getElementById("totalParticipantes").textContent =
        totalParticipantes;

    document.getElementById("totalRespostas").textContent =
        totalGeral;

    document.getElementById("respostaMaisFrequente").textContent =
        nomes[indiceMaior];

    document.getElementById("percentualPredominante").textContent =
        formatarPercentual(totais[indiceMaior], totalGeral);

    // PIZZA
    graficoPizza.data.datasets[0].data = totais;
    graficoPizza.update();

    document.getElementById("totalPizza").textContent =
        `Total de ${totalGeral} respostas. Percentuais calculados sobre o grupo selecionado.`;

    // BARRAS GERAIS
    graficoBarras.data.datasets[0].data = totais;
    graficoBarras.update();

    // 14 GRÁFICOS INDIVIDUAIS
    graficosIndividuais.forEach((grafico, indice) => {
        grafico.data.datasets[0].data = dados[indice];
        grafico.update();
    });

    // TABELA
    const corpoTabela = document.getElementById("corpoTabela");

    corpoTabela.innerHTML = "";

    dados.forEach((respostas, indice) => {
        const totalPergunta = somarTotal(respostas);

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>Pergunta ${String(indice + 1).padStart(2, "0")}</td>
            <td>${respostas[0]}</td>
            <td>${respostas[1]}</td>
            <td>${respostas[2]}</td>
            <td>${respostas[3]}</td>
            <td>${totalPergunta}</td>
        `;

        corpoTabela.appendChild(linha);
    });

    // RESUMO
    document.getElementById("textoResumo").textContent =
        `Foram analisadas ${totalGeral} respostas de ${totalParticipantes} participantes. ` +
        `A alternativa mais frequente foi "${nomes[indiceMaior]}", ` +
        `representando ${formatarPercentual(totais[indiceMaior], totalGeral)} ` +
        `das respostas desse grupo. Os gráficos individuais permitem observar ` +
        `como os participantes responderam a cada uma das 14 perguntas. ` +
        `Os resultados representam opiniões e comportamentos declarados pelos entrevistados, ` +
        `não comprovando isoladamente relações de causa e efeito.`;
}

// ============================================
// INICIALIZAÇÃO
// ============================================

criarGraficoPizza();
criarGraficoBarras();
criarGraficosIndividuais();
atualizarLegenda();
atualizarDashboard();

document
    .getElementById("filtro")
    .addEventListener("change", atualizarDashboard);