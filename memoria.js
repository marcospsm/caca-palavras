document.addEventListener('DOMContentLoaded', () => {
    const emojis = ['🍎', '🍌', '🍇', '🍒', '🍉', '🍋', '🍓', '🍍'];
    let pares = [...emojis, ...emojis]; // 2 de cada

    const tabuleiro = document.getElementById('tabuleiroMemoria');
    let carta1 = null;
    let carta2 = null;
    let bloqueado = false;

    function embaralhar(array) {
        return array.sort(() => 0.5 - Math.random());
    }

    function criarTabuleiro() {
        tabuleiro.innerHTML = '';
        carta1 = null;
        carta2 = null;
        bloqueado = false;
        pares = embaralhar([...emojis, ...emojis]);

        pares.forEach(emoji => {
            const carta = document.createElement('div');
            carta.classList.add('carta');
            carta.dataset.valor = emoji;
            carta.innerText = ''; // começa virada
            tabuleiro.appendChild(carta);

            carta.addEventListener('click', () => {
                if (bloqueado || carta.classList.contains('virada') || carta === carta1) return;

                carta.classList.add('virada');
                carta.innerText = emoji;

                if (!carta1) {
                    carta1 = carta;
                } else {
                    carta2 = carta;
                    bloqueado = true;

                    if (carta1.dataset.valor === carta2.dataset.valor) {
                        carta1 = null;
                        carta2 = null;
                        bloqueado = false;
                        verificarVitoria();
                    } else {
                        setTimeout(() => {
                            carta1.classList.remove('virada');
                            carta2.classList.remove('virada');
                            carta1.innerText = '';
                            carta2.innerText = '';
                            carta1 = null;
                            carta2 = null;
                            bloqueado = false;
                        }, 1000);
                    }
                }
            });
        });
    }

    function verificarVitoria() {
        const todasViradas = [...document.querySelectorAll('.carta')]
            .every(carta => carta.classList.contains('virada'));

        if (todasViradas) {
            setTimeout(() => {
                alert('Parabéns! Você venceu!');
                criarTabuleiro();
            }, 300);
        }
    }

    criarTabuleiro();
});
