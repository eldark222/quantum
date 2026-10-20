# Validação científica dos simuladores

Esta auditoria foi executada sobre os modelos em `src/core/physics` e sobre os
dados que alimentam os simuladores. Os resultados abaixo distinguem soluções
analíticas de amostragens numéricas usadas apenas para visualização.

## Constantes e unidades

- `h = 6.62607015e-34 J s`, `c` e `e` usam os valores exatos do SI quando a
  definição atual os torna exatos.
- `hbar` é calculada como `h / (2 pi)`; não é tratada como uma constante SI
  independente.
- Massas de elétron, próton, nêutron e múon são valores recomendados pelo
  CODATA 2022 e não são marcadas como exatas.
- Conversões `J <-> eV`, `m <-> nm` usam a carga elementar exata e agora
  rejeitam valores não finitos.
- Fonte primária: [NIST CODATA 2022](https://physics.nist.gov/cuu/Constants/).

## Poço infinito unidimensional

### Modelo

Para `0 < x < L`, com `V = 0`, e paredes infinitas nas extremidades:

`psi_n(x) = sqrt(2/L) sin(n pi x/L)`

`E_n = n^2 pi^2 hbar^2 / (2 m L^2)`.

As funções são normalizadas em metros ou nanômetros de forma consistente
quando a função e a densidade são integradas na mesma unidade. A probabilidade
em um intervalo usa a primitiva analítica de `|psi|^2`; os pontos do gráfico
são uma amostragem arredondada e não substituem a solução analítica.

### Auditoria e testes

- Dependências `n^2`, `L^-2` e `m^-1`.
- Valor analítico `E_1 = 0.376030 eV` para elétron em `L = 1 nm`.
- Condições de contorno, nós internos, normalização numérica e probabilidades
  em subintervalos.
- `Delta x = L sqrt(1/12 - 1/(2 n^2 pi^2))` e
  `Delta p = n pi hbar/L` no resultado estatístico.
- Entradas não finitas e número de pontos inválido agora produzem erro explícito.

## Dupla fenda

### Modelo

O modelo usa a expressão de Fraunhofer para duas fendas retangulares:

`I(theta) / I0 = sinc^2(pi a sin(theta)/lambda) cos^2(pi d sin(theta)/lambda)`.

O ângulo é obtido da geometria finita da tela,
`sin(theta) = y / sqrt(y^2 + D^2)`. A aproximação de Fraunhofer exige que a
distância seja grande em relação às dimensões das fendas; o simulador não
modela propagação Fresnel nem a resolução finita do detector.

Sem detector, o termo de interferência é preservado. Com detector ideal de qual
fenda, o modelo remove a coerência e apresenta o envelope incoerente normalizado.
Isso representa decoerência idealizada, não um modelo microscópico do aparelho.

### Auditoria e testes

- Máximo central normalizado.
- Remoção do termo cruzado no modo com detector.
- Comprimento de onda de de Broglie com `p = sqrt(2 m E)`.
- Entradas inválidas são rejeitadas.

## Incerteza

O estado é um pacote Gaussiano puro centrado em `x = 0`, sem momento médio:

`|psi(x)|^2 = exp(-x^2/(2 sigma_x^2)) / (sqrt(2 pi) sigma_x)`.

Para esse estado mínimo, `sigma_p = hbar/(2 sigma_x)` e
`sigma_x sigma_p = hbar/2`. Portanto, a igualdade exibida é válida para o
estado escolhido, não uma afirmação de que todo estado satura a desigualdade.
As curvas truncadas em `+-4 sigma` são amostragens visuais e não integrais
analíticas completas. A conversão de `J s/m` para `eV s/nm` usa `e` exato.

## Tunelamento em barreira retangular

### Modelo

Para incidência estacionária de amplitude 1 sobre `V(x)=V0` em `0 <= x <= a`,
as soluções são combinadas por continuidade de `psi` e `psi'`.

Para `E < V0`:

`T = [1 + V0^2 sinh^2(kappa a)/(4 E (V0-E))]^-1`.

Para `E > V0`, substitui-se `sinh(k' a)` por `sin(k' a)` e
`V0-E` por `E-V0`. No limiar, a solução linear interna é usada. Como os
números de onda externos são iguais, `R = 1 - T`.

### Correções

- O limiar passou de uma tolerância absoluta em joules para uma tolerância
  relativa, evitando classificar energias fisicamente distintas como `E=V0`.
- A transmissão abaixo da barreira calcula `sinh` em escala logarítmica para
  evitar overflow em barreiras espessas.
- O perfil visual deixou de ser uma forma qualitativa com fatores arbitrários:
  agora resolve as quatro amplitudes complexas das regiões e mostra
  `Re(psi)` e `|psi|^2` da solução estacionária. Ele não representa um pacote
  temporal.
- Parâmetros inválidos e contagens de pontos inválidas produzem erros.

### Testes

- `T + R = 1` abaixo e acima da barreira.
- Regime de limiar somente para `|E-V0|/max(E,V0) <= 1e-12`.
- Finiteza da transmissão e do perfil para barreira espessa.

## Qubit e superposição

O estado puro usa
`|psi> = cos(theta/2)|0> + exp(i phi) sin(theta/2)|1>`, com
`P0=cos^2(theta/2)`, `P1=sin^2(theta/2)` e coordenadas de Bloch
`(sin(theta)cos(phi), sin(theta)sin(phi), cos(theta))`.

Hadamard, Pauli-X e Pauli-Z são implementadas como transformações na esfera de
Bloch. O arredondamento interno foi removido para não degradar a norma após
operações sucessivas; a apresentação pode arredondar separadamente. Testes
verificam norma e domínio angular.

## Emaranhamento e CHSH

O modelo usa o estado singleto ideal, com observáveis de spin ao longo de eixos
coplanares:

`E(a,b) = -cos(theta_a-theta_b)`.

Com `a=0`, `a'=90`, `b=45`, `b'=135` graus e a convenção
`S = |E(a,b)-E(a,b')+E(a',b)+E(a',b')|`, obtém-se `2 sqrt(2)`, acima do limite
clássico 2 e abaixo do limite de Tsirelson. Isso pressupõe medições ideais,
detecção perfeita e ausência de ruído ou loopholes experimentais. Testes
verificam anticorrelação para eixos coincidentes, o valor de Tsirelson e
rejeição de ângulos não finitos.

## Verificações executadas

Nesta fase foram executados `npm test`, `npm run lint`, `npm run typecheck` e,
após as correções finais, `npm run build`. O resultado final e qualquer aviso
de empacotamento são reportados no relatório da fase; nenhuma validação
experimental é alegada.
