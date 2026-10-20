# Guia de manutenção e expansão

## 1. Preparar o ambiente

Requisitos: Node.js compatível com o CI (Node 22 no workflow) e npm.

```bash
npm ci
npm run dev
```

Para uma validação completa:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit
```

O projeto usa `main` para produção; pull requests devem passar pelo workflow
em `.github/workflows/ci.yml`.

## 2. Diagnosticar uma alteração

Classifique o problema antes de editar:

1. **Apresentação:** componentes em `features` ou `components`.
2. **Estado/interação:** hooks e callbacks no simulador.
3. **Modelo:** função pura em `core/physics`.
4. **Unidade/constante:** `units.ts` ou `constants.ts`.
5. **Build/configuração:** arquivos da raiz ou workflow.

Reproduza primeiro com parâmetros pequenos e conhecidos. Para uma fórmula,
escreva o caso limite ou valor de referência em um teste antes de alterar a
implementação.

## 3. Alterar um modelo científico

1. Leia o arquivo do modelo e todos os seus consumidores.
2. Declare unidades e domínio de cada parâmetro na interface.
3. Valide entradas não finitas, zero, sinal e limites físicos.
4. Mantenha conversões SI explícitas.
5. Preserve resultados analíticos separados de amostras arredondadas para
   gráficos.
6. Adicione testes de propriedades: escala, conservação, condições de
   contorno, limites e rejeição de entrada.
7. Atualize `docs/SCIENTIFIC_VALIDATION.md` e a explicação completa se a
   hipótese ou equação mudar.

Exemplo: uma alteração em `calculateEnergy` deve testar a dependência `n²`,
`L⁻²`, `m⁻¹`, o valor de referência do elétron em 1 nm e a rejeição de massa
não positiva. O simulador correspondente só deve formatar e exibir o resultado.

## 4. Criar um novo módulo científico

Use esta sequência:

```text
core/<domínio>/<modelo>.ts
        ↓
src/tests/<modelo>.test.ts ou physics.test.ts
        ↓
features/<assunto>/<Feature>.tsx
        ↓
Header/App e documentação
```

O núcleo deve ser independente de React. A feature deve manter estado de
controles, chamar o modelo com `useMemo` quando adequado e explicar hipóteses,
unidades e limitações. Componentes comuns devem permanecer genéricos.

Para matemática, a pasta `src/core/math` deve conter funções puras de
álgebra linear, métodos numéricos ou transformadas que não conheçam física nem
interface. Modelos físicos podem depender dessas funções, mas não o contrário.
O primeiro módulo segue essa regra em `src/core/math/linearSystem.ts`, com a
feature correspondente em `src/features/mathematics/LinearSystemSection.tsx`.

## 5. Conteúdo educacional

Conteúdo novo deve informar:

- definição formal e intuição;
- pré-requisitos e convenções;
- equações e unidades;
- exemplo verificável;
- limites de validade;
- aplicação;
- erros frequentes;
- referência confiável.

Não declare uma simulação ilustrativa como resultado experimental exato.
Equações renderizadas devem ser strings TeX usadas por `MathView`. Dados
reutilizados por muitas páginas podem migrar para `src/content`, mas não crie
uma camada vazia apenas por antecipação.

## 6. Testes

Priorize testes independentes da interface. Exemplos já existentes em
[physics.test.ts](../src/tests/physics.test.ts):

- conversão J/eV e nm/m;
- condições `psi(0)=psi(L)=0`;
- normalização aproximada;
- `T + R = 1`;
- norma do vetor de Bloch;
- limite de Tsirelson.

Ao adicionar aleatoriedade, como medições de qubit ou impactos da dupla fenda,
teste a distribuição esperada por meio de uma API injetável ou de propriedades
estatísticas com tolerância justificada. Não torne um teste flakey por exigir
uma sequência aleatória específica.

## 7. Interface, acessibilidade e performance

- Todo input deve ter `label`, `id`, unidade e estado desabilitado coerente.
- Preserve foco visível e `prefers-reduced-motion`.
- Use `aria-current`/`aria-expanded` quando o estado visual for interativo.
- Valide a navegação móvel e o overflow de gráficos em viewport estreito.
- Não faça cálculos caros em cada render; use `useMemo` apenas quando houver
  dependência clara.
- A navegação usa `React.lazy`/`import()` dinâmico por aba. Ao introduzir novos
  módulos, preserve esse padrão e meça o resultado no build, em vez de
  aumentar arbitrariamente `chunkSizeWarningLimit`.
- Canvas deve cancelar `requestAnimationFrame` no cleanup, como no simulador
  de dupla fenda.

## 8. Dependências e segurança

Antes de adicionar pacote, confira se React, Recharts, KaTeX, APIs do navegador
ou TypeScript já resolvem o problema. Rode `npm audit` e mantenha o lockfile.

`MathView` usa `dangerouslySetInnerHTML` porque KaTeX retorna HTML. Mantenha
equações sob controle do código e não aceite TeX arbitrário de usuário sem
sanitização e revisão de segurança.

## 9. Pull request e publicação

1. Trabalhe em branch descritiva.
2. Revise `git diff` e `git diff --check`.
3. Execute os comandos da seção 1.
4. Descreva fórmulas, unidades, hipóteses e testes.
5. Faça commit sem incluir `node_modules` ou `dist`.
6. Envie a branch e abra pull request.
7. Após merge em `main`, o GitHub Actions valida e a Vercel conectada ao
   repositório pode publicar o deploy de produção.

## 10. Dívida conhecida

- `PocoPotencial.tsx` é legado duplicado e não está no fluxo de `App`.
- Não há roteamento por URL nem testes de componentes.
- O catálogo atual é especializado em mecânica quântica.
- O bundle inicial requer code splitting.

Esses itens devem ser resolvidos incrementalmente, com testes de proteção e
sem manter uma segunda implementação das mesmas fórmulas.
