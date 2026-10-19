# Quantum Lab

O **Quantum Lab** é uma plataforma web educacional para explorar conceitos de
mecânica quântica por meio de simuladores interativos, visualizações,
equações e explicações contextualizadas.

O projeto foi criado para aproximar a teoria da prática: o estudante pode
alterar parâmetros físicos, observar como os resultados mudam e relacionar o
gráfico à equação e às hipóteses do modelo. Ele também serve como laboratório
virtual para aulas, demonstrações, revisão de conteúdos e experimentos
computacionais reproduzíveis.

## O que o projeto faz

Atualmente, a aplicação oferece:

- Simulação do poço de potencial infinito unidimensional.
- Visualização da função de onda, densidade de probabilidade, nós e energia.
- Experimento de dupla fenda com interferência, difração e detector de
  caminho.
- Exploração do princípio da incerteza nos espaços de posição e momento.
- Simulação de tunelamento quântico e transmissão através de barreiras.
- Visualização de estados de qubit e operações de portas quânticas.
- Exploração de correlações quânticas e da desigualdade de CHSH.
- Seções educacionais sobre aplicações da física quântica.
- Glossário de conceitos, grandezas, símbolos e equações.
- Conteúdo sobre metodologia, constantes físicas, fontes e limitações dos
  modelos.

Os cálculos científicos ficam separados da interface em `src/core/physics`.
Isso facilita a revisão das fórmulas, a reutilização dos modelos e a criação
de testes independentes da apresentação visual.

## Propósito

O propósito do Quantum Lab é tornar o estudo de física quântica mais
experimental, visual e verificável. Em vez de apenas apresentar uma fórmula,
a plataforma permite:

1. selecionar um modelo físico;
2. modificar seus parâmetros;
3. observar o resultado numérico e gráfico;
4. comparar o comportamento quântico com referências clássicas quando
   aplicável;
5. interpretar o resultado com base nas unidades, condições de contorno e
   hipóteses utilizadas.

O projeto também funciona como uma base de estudo em programação científica:
os simuladores usam TypeScript, modelos matemáticos explícitos, conversões de
unidades no SI, visualizações e testes automatizados.

## Fundamentos científicos

Entre as relações implementadas estão:

- Poço infinito.
- Densidade de probabilidade.
- Difração e interferência em dupla fenda.
- Relação de incerteza.
- Transmissão e reflexão em uma barreira de potencial.
- Correlações de estados emaranhados e teste de CHSH.

### Equações principais

Poço infinito:

$$
\psi_n(x)=\sqrt{\frac{2}{L}}\sin\left(\frac{n\pi x}{L}\right),
\qquad
E_n=\frac{n^2\pi^2\hbar^2}{2mL^2}
$$

Densidade de probabilidade:

$$
\rho(x)=|\psi(x)|^2
$$

Relação de incerteza:

$$
\Delta x\,\Delta p\geq\frac{\hbar}{2}
$$

As grandezas são calculadas com constantes físicas e conversões explícitas
entre unidades como joules, elétron-volts, metros, nanômetros e
quilogramas. Os modelos são educacionais: eles representam sistemas
idealizados e não substituem uma descrição experimental completa.

## Tecnologias

- React 19
- TypeScript
- Vite
- Recharts
- KaTeX
- Tailwind CSS
- Vitest
- ESLint

## Como executar localmente

Requisitos: Node.js e npm.

```bash
npm install
npm run dev
```

Depois, abra o endereço exibido pelo Vite no navegador.

## Scripts disponíveis

```bash
npm run dev      # inicia o servidor de desenvolvimento
npm run build    # executa o typecheck e gera o build de produção
npm run lint     # verifica a qualidade estática do código
npm test         # executa os testes automatizados
npm run preview  # serve o build de produção localmente
```

## Organização principal

```text
src/
├── components/          # componentes reutilizáveis da interface
├── core/physics/        # constantes, unidades e modelos científicos
├── features/education/  # aplicações, glossário e fontes
├── features/simulators/ # simuladores interativos
├── tests/               # testes dos modelos físicos
├── App.tsx              # navegação e composição principal
└── main.tsx             # ponto de entrada da aplicação
```

## Validação

O projeto possui testes automatizados para os modelos físicos principais.
Antes de publicar alterações, execute:

```bash
npm run lint
npm test
npm run build
```

Essas verificações ajudam a detectar regressões de tipagem, fórmulas,
componentes e integração do bundle.

## Licença

Este projeto é distribuído sob a [licença MIT](./LICENSE). Consulte o arquivo
de licença para as condições completas de uso, modificação e redistribuição.
