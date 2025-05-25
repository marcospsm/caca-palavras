// Lista de 10 palavras possíveis
const todasPalavras = ['CICLISTA', 'ESCOLA', 'ACADEMIA', 'MELANCIA', 'AMOR', 'JOGADOR', 'LIVRO', 'COMPUTADOR', 'FESTA', 'NATACAO'];

// Função para escolher 5 palavras aleatórias da lista de 10
function escolherPalavrasAleatorias() {
    const palavrasSelecionadas = [];
    const palavrasRestantes = [...todasPalavras]; // Copiar a lista para evitar alterações diretas

    // Escolher 5 palavras aleatórias
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * palavrasRestantes.length);
        palavrasSelecionadas.push(palavrasRestantes[randomIndex]);
        palavrasRestantes.splice(randomIndex, 1); // Remove a palavra escolhida para não repetir
    }

    return palavrasSelecionadas;
}

// Palavras a serem encontradas (escolhidas aleatoriamente)
const palavras = escolherPalavrasAleatorias();

const tamanhoTabuleiro = 10;
const tabuleiro = document.getElementById('tabuleiro');
const palavrasLista = document.getElementById('palavrasLista');
let tabuleiroArray = Array(tamanhoTabuleiro).fill().map(() => Array(tamanhoTabuleiro).fill(''));
let bloqueioDeSelecao = false; // Variável para bloquear a seleção

// Função para preencher a lista de palavras
function preencherListaDePalavras() {
    palavras.forEach(palavra => {
        const li = document.createElement('li');
        li.textContent = palavra;
        li.id = palavra; // Adiciona um ID à lista para identificar a palavra
        palavrasLista.appendChild(li);
    });
}

// Função para colocar palavras no tabuleiro
function colocarPalavraNoTabuleiro(palavra) {
    const orientacoes = ['horizontal', 'vertical'];
    const orientacao = orientacoes[Math.floor(Math.random() * orientacoes.length)];
    let posicaoValida = false;
    let linha, coluna;

    while (!posicaoValida) {
        if (orientacao === 'horizontal') {
            linha = Math.floor(Math.random() * tamanhoTabuleiro);
            coluna = Math.floor(Math.random() * (tamanhoTabuleiro - palavra.length));
        } else {
            linha = Math.floor(Math.random() * (tamanhoTabuleiro - palavra.length));
            coluna = Math.floor(Math.random() * tamanhoTabuleiro);
        }

        // Verificar se há espaço suficiente
        posicaoValida = true;
        for (let i = 0; i < palavra.length; i++) {
            if (orientacao === 'horizontal' && tabuleiroArray[linha][coluna + i] !== '') {
                posicaoValida = false;
            }
            if (orientacao === 'vertical' && tabuleiroArray[linha + i][coluna] !== '') {
                posicaoValida = false;
            }
        }
    }

    // Colocar a palavra no tabuleiro
    for (let i = 0; i < palavra.length; i++) {
        if (orientacao === 'horizontal') {
            tabuleiroArray[linha][coluna + i] = palavra[i];
        } else {
            tabuleiroArray[linha + i][coluna] = palavra[i];
        }
    }
}

// Função para gerar o tabuleiro com palavras
function gerarTabuleiro() {
    // Colocar todas as palavras no tabuleiro
    palavras.forEach(palavra => {
        colocarPalavraNoTabuleiro(palavra);
    });

    // Preencher as células vazias com letras aleatórias
    for (let i = 0; i < tamanhoTabuleiro; i++) {
        for (let j = 0; j < tamanhoTabuleiro; j++) {
            if (tabuleiroArray[i][j] === '') {
                tabuleiroArray[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    // Exibir o tabuleiro no HTML
    for (let i = 0; i < tamanhoTabuleiro; i++) {
        for (let j = 0; j < tamanhoTabuleiro; j++) {
            const celula = document.createElement('div');
            celula.textContent = tabuleiroArray[i][j];
            celula.classList.add('celula');
            celula.dataset.linha = i;
            celula.dataset.coluna = j;
            celula.addEventListener('click', selecionarCelula);
            tabuleiro.appendChild(celula);
        }
    }
}

// Função para verificar se as células selecionadas estão adjacentes
function saoCelulasAdjacentes(celula1, celula2) {
    return (celula1.linha === celula2.linha && Math.abs(celula1.coluna - celula2.coluna) === 1) || 
           (celula1.coluna === celula2.coluna && Math.abs(celula1.linha - celula2.linha) === 1);
}

// Função para selecionar células
let palavrasEncontradas = 0;
let celulasSelecionadas = [];
const maxPalavraSize = Math.max(...palavras.map(p => p.length)); // Tamanho da maior palavra

function selecionarCelula(event) {
    if (bloqueioDeSelecao) return; // Bloqueia a seleção durante a animação de piscar

    const celula = event.target;
    const linha = parseInt(celula.dataset.linha);
    const coluna = parseInt(celula.dataset.coluna);
    
    // Se já foi selecionada, desmarque
    if (celula.classList.contains('selecionada')) {
        celula.classList.remove('selecionada');
        celulasSelecionadas = celulasSelecionadas.filter(cel => cel.linha !== linha || cel.coluna !== coluna);
        return;
    }

    // Verifica se a célula selecionada é adjacente à última célula selecionada
    if (celulasSelecionadas.length > 0 && !saoCelulasAdjacentes(celulasSelecionadas[celulasSelecionadas.length - 1], { linha, coluna })) {
        return;
    }

    celula.classList.add('selecionada');
    celulasSelecionadas.push({ linha, coluna });

    // Verifica se a quantidade de letras selecionadas ultrapassou o limite
    if (celulasSelecionadas.length > maxPalavraSize) {
        bloqueioDeSelecao = true;
        celulasSelecionadas.forEach(cel => {
            const celulaElemento = tabuleiro.children[cel.linha * tamanhoTabuleiro + cel.coluna];
            if (celulaElemento) {
                celulaElemento.classList.add('erro');
            }
        });

        setTimeout(() => {
            celulasSelecionadas.forEach(cel => {
                const celulaElemento = tabuleiro.children[cel.linha * tamanhoTabuleiro + cel.coluna];
                if (celulaElemento) {
                    celulaElemento.classList.remove('erro');
                    celulaElemento.classList.remove('selecionada');
                }
            });
            celulasSelecionadas = [];
            bloqueioDeSelecao = false;
        }, 1000); // Duração do efeito de piscar
    }

    // Verifica se a seleção corresponde a uma palavra
    palavras.forEach(palavra => {
        if (celulasSelecionadas.length === palavra.length) {
            let palavraCorreta = true;
            for (let i = 0; i < palavra.length; i++) {
                const pos = celulasSelecionadas[i];
                if (tabuleiroArray[pos.linha][pos.coluna] !== palavra[i]) {
                    palavraCorreta = false;
                    break;
                }
            }

            if (palavraCorreta) {
                bloqueioDeSelecao = true;
                celulasSelecionadas.forEach(cel => {
                    const celulaElemento = tabuleiro.children[cel.linha * tamanhoTabuleiro + cel.coluna];
                    if (celulaElemento) {
                        celulaElemento.classList.add('piscar-verde');
                    }
                });

                setTimeout(() => {
                    celulasSelecionadas.forEach(cel => {
                        const celulaElemento = tabuleiro.children[cel.linha * tamanhoTabuleiro + cel.coluna];
                        if (celulaElemento) {
                            celulaElemento.classList.remove('piscar-verde');
                            celulaElemento.classList.add('encontrada');
                        }
                    });
                    palavrasEncontradas++;

                    const palavraLi = document.getElementById(palavra);
                    if (palavraLi) {
                        palavraLi.classList.add('riscada');
                    }

                    celulasSelecionadas = [];
                    bloqueioDeSelecao = false;

                    if (palavrasEncontradas === palavras.length) {
                        alert('Parabéns! Você encontrou todas as palavras!');
                        location.reload();
                    }
                }, 1000);
            }
        }
    });
}

// Inicializa o jogo
preencherListaDePalavras();
gerarTabuleiro();