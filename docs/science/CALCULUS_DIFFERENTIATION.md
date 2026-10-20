# Derivação numérica

O módulo de cálculo diferencial usa um catálogo fechado de funções, sem
`eval`, `new Function` ou interpretação de expressões fornecidas pelo usuário.
Cada entrada define a função, sua derivada analítica de referência e seu domínio.

## Métodos

Para um ponto `x` e passo `h > 0`:

```text
progressiva: (f(x+h) - f(x)) / h
regressiva:  (f(x) - f(x-h)) / h
central:    (f(x+h) - f(x-h)) / (2h)
```

Para funções suficientemente suaves, os dois primeiros métodos têm erro de
truncamento de ordem `O(h)` e o central tem ordem `O(h²)`. Isso não significa
que um `h` arbitrariamente pequeno seja sempre melhor: o cancelamento
subtrativo e o arredondamento de ponto flutuante podem aumentar o erro.

## Catálogo e domínios

O catálogo em [`numericalDifferentiation.ts`](../../src/core/math/numericalDifferentiation.ts)
inclui `x²`, `x³-x`, `sin(x)`, `cos(x)`, `eˣ` e `ln(x)`. Trigonometria usa
radianos; `ln(x)` exige `x > 0`. Os pontos do stencil também são validados,
portanto um método regressivo próximo de zero pode ser rejeitado para `ln`.

## Visualização

[`CalculusSection.tsx`](../../src/features/mathematics/CalculusSection.tsx)
mostra a curva `f`, o valor no ponto, a derivada analítica e a linearização
local baseada na derivada numérica. A visualização também desenha a secante
definida pelos pontos do stencil realmente usados pelo método selecionado e
marca esses pontos no gráfico. A linearização é uma aproximação local e não
substitui a função original. A tabela compara os três métodos no mesmo ponto e
passo, exibindo aproximação, referência, erro absoluto e ordem de truncamento.
O gráfico adicional mostra o erro absoluto em função de vários valores de `h`
em escala logarítmica visual. O erro absoluto é
`|f'_num - f'_analítica|`; o erro relativo é omitido quando a referência é
zero ou numericamente insignificante.

## Extensão segura

Para adicionar uma função, inclua um identificador em `DifferentiableFunction` e
uma entrada em `DEFINITIONS` com `label`, equação, `evaluate`, `derivative`,
`domain` e descrição do domínio. Adicione testes analíticos, de domínio e dos
três métodos antes de expor a entrada na interface.
