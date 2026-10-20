# Auditoria técnica inicial

Data: 20 de outubro de 2026

## Escopo e método

Esta auditoria foi realizada antes de iniciar a expansão científica. Foram
inspecionados o estado do Git, arquivos de configuração, manifesto e lockfile,
entrada React, estilos globais, componentes comuns, navegação, simuladores,
modelos em `src/core/physics`, testes, documentação, workflow de CI e presença
de código Python. `node_modules/` e `dist/` foram tratados como artefatos
gerados e não como código-fonte.

## Estado do Git

- Branch atual: `main`.
- Branch remota de produção: `origin/main`.
- Estado ao concluir a auditoria: sincronizado e sem alterações locais.
- Commit mais recente no início desta auditoria: `bc2993a`.
- `node_modules/` estava versionado indevidamente apesar de constar no
  `.gitignore`; a limpeza foi feita anteriormente com `git rm -r --cached`,
  preservando os arquivos locais.
- Não foram encontrados arquivos Python, credenciais ou arquivos `.env`
  rastreados na estrutura auditada.
- O workflow existente é `.github/workflows/ci.yml`.

## Estrutura encontrada

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── PocoPotencial.tsx
├── components/
│   ├── common/
│   └── layout/
├── core/physics/
├── features/
│   ├── education/
│   └── simulators/
└── tests/
```

Os modelos científicos estão separados da interface em `src/core/physics`.
`App.tsx` compõe a navegação e as features; componentes comuns concentram
controles, métricas, cards e equações; simuladores adaptam os modelos para
interação e visualização.

`src/PocoPotencial.tsx` é um componente legado não importado pelo fluxo atual.
Ele contém uma implementação antiga e duplicada do poço, além de texto com
problemas de codificação. A implementação oficial usada pela aplicação é
`src/core/physics/infiniteWell.ts` em conjunto com
`src/features/simulators/InfiniteWellSimulator.tsx`.

## Tecnologias efetivas

As fontes de verdade são `package.json` e `package-lock.json`.

- React 19 e React DOM: composição da SPA.
- TypeScript 5.x: tipagem e verificação sem emissão.
- Vite 6.x: servidor de desenvolvimento e build.
- Tailwind CSS 4: estilos utilitários.
- Recharts 3: gráficos dos simuladores.
- KaTeX 0.19: renderização de equações.
- lucide-react: ícones.
- Vitest 5: testes científicos.
- ESLint 9 e `typescript-eslint`: análise estática.

Não existe código Python ou dependência Python. `requirements.txt` não é
apropriado para este repositório; dependências JavaScript são declaradas no
manifesto npm.

## Scripts e baseline reproduzível

Os scripts disponíveis são `dev`, `build`, `lint`, `preview`, `test` e
`typecheck`. A linha de base foi executada com instalação limpa:

| Comando | Resultado | Evidência |
| --- | --- | --- |
| `npm ci` | Aprovado na segunda tentativa | Lockfile reproduziu a instalação; 248 pacotes adicionados. |
| `npm run lint` | Aprovado | ESLint terminou sem erros. |
| `npm run typecheck` | Aprovado | `tsc -b --pretty false` terminou sem erros. |
| `npm test` | Aprovado | 1 arquivo e 24 testes aprovados. |
| `npm run build` | Aprovado | Vite transformou 2.544 módulos e concluiu o bundle. |
| `npm audit` | Aprovado | 0 vulnerabilidades reportadas. |

A primeira execução de `npm ci` falhou com `EPERM` ao substituir o binário
nativo de `lightningcss`, que estava bloqueado por um processo local. O
processo foi liberado e a repetição passou. Isso foi classificado como falha
ambiental, não como falha do lockfile.

O build emitiu um aviso de performance: o chunk JavaScript principal tem
aproximadamente 999,55 kB minificados e 293,39 kB gzipados.

## Funcionalidades existentes

### Simuladores

1. Poço infinito 1D: função de onda, densidade, nós, energia, partícula e
   probabilidade analítica em intervalo.
2. Dupla fenda: interferência, difração, detector de qual fenda e impactos
   estatísticos em Canvas.
3. Incerteza: pacote Gaussiano de incerteza mínima nos espaços de posição e
   momento.
4. Tunelamento: transmissão/reflexão em barreira retangular e perfil
   estacionário com amplitudes complexas.
5. Superposição: estado de qubit, esfera de Bloch, portas H/X/Z e medições.
6. Emaranhamento: correlação do singleto e avaliação de CHSH.

### Educação

- Aplicações tecnológicas da física quântica.
- Glossário pesquisável com categorias e equações.
- Metodologia, constantes, fontes e limitações.

## Modelos e validações científicas

Os modelos existentes usam funções puras e validações de entrada. As
propriedades verificadas incluem:

- energia do poço com dependências `n²`, `L⁻²` e `m⁻¹`;
- condições de contorno e nós do poço;
- normalização aproximada e probabilidade analítica;
- conversões J/eV e nm/m;
- igualdade de Heisenberg para o pacote Gaussiano escolhido;
- padrão central e remoção da interferência na dupla fenda;
- conservação `T + R = 1` no tunelamento;
- estabilidade no limiar e em barreira espessa;
- norma do vetor de Bloch;
- violação ideal de CHSH e limite de Tsirelson.

As hipóteses e limitações estão detalhadas em
[`SCIENTIFIC_VALIDATION.md`](./SCIENTIFIC_VALIDATION.md).

## Problemas classificados

### P0 — Crítico

Nenhum P0 encontrado.

### P1 — Alto

Nenhum P1 encontrado. O build, lint, typecheck, testes e audit passaram.

### P2 — Médio

1. **Bundle inicial grande — performance.** O build ultrapassa 500 kB no chunk
   JavaScript principal. Consequência: maior custo de carregamento inicial,
   especialmente em conexões lentas. Evidência: aviso do Vite no build.
   Correção proposta: medir e introduzir code splitting/lazy loading por
   simulador, preservando a navegação atual.
2. **Cobertura de interface ausente — qualidade/acessibilidade.** Os testes
   cobrem o núcleo científico, mas não há testes automatizados de componentes,
   navegação, viewport, teclado ou leitor de tela. Consequência: regressões de
   UX podem passar pelo CI. Correção proposta: adicionar testes de integração
   quando houver uma infraestrutura adequada e cenários observáveis.
3. **Validação responsiva manual — UX.** Há classes responsivas, menu móvel e
   foco visível, mas não há suíte de viewport. Correção proposta: validar
   fluxos de menu, controles e gráficos em larguras representativas.

### P3 — Baixo

1. **Componente legado duplicado.** `src/PocoPotencial.tsx` não participa da
   aplicação e pode confundir manutenção. Correção proposta: remover ou
   converter em encaminhamento para a implementação oficial somente após
   confirmar que não há consumidores externos.
2. **Navegação sem URL profunda.** A aba ativa é estado local de `App`, então
   recarregar não preserva uma seção específica. Correção proposta: avaliar
   rotas ou estado de URL quando houver necessidade pedagógica demonstrada.
3. **Catálogo científico ainda restrito.** Matemática geral, física clássica,
   métodos numéricos e tópicos quânticos avançados ainda não têm módulos
   implementados. Isso é escopo futuro, não uma falha das features existentes.

## Segurança

`npm audit` reportou zero vulnerabilidades. Não foram encontrados segredos ou
credenciais no código auditado. `MathView` usa `dangerouslySetInnerHTML` para
inserir HTML produzido pelo KaTeX; atualmente as equações são constantes do
código. Entrada TeX de usuário não é uma capacidade suportada e exigiria
sanitização antes de ser introduzida.

## Decisão arquitetural recomendada

Não migrar imediatamente de `src/core/physics` para `src/physics` nem criar
uma segunda árvore paralela. A estrutura atual já estabelece uma fronteira
clara e possui imports funcionando, testes e documentação. Uma migração ampla
teria custo de imports e risco de regressão sem benefício mensurável imediato.

Para a expansão, recomenda-se:

1. manter `src/core/physics` como núcleo físico existente;
2. criar `src/core/math` somente quando houver um primeiro algoritmo matemático
   reutilizável real;
3. introduzir features por domínio em alterações isoladas;
4. extrair conteúdo compartilhado apenas quando houver reutilização concreta;
5. não duplicar equações em componentes visuais.

## Plano de correção e critérios de conclusão

### Prioridade imediata

- preservar a linha de base aprovada;
- manter `node_modules/` fora do índice;
- executar CI após cada mudança estrutural ou científica;
- documentar hipóteses e testes de cada novo modelo.

### Próximas melhorias

1. Medir e reduzir o bundle com code splitting por aba.
2. Resolver o componente legado com teste de proteção ou remoção segura.
3. Adicionar cobertura de integração e acessibilidade.
4. Criar o primeiro módulo matemático independente com funções puras e testes.
5. Expandir o catálogo científico de forma incremental.

### Critérios

Uma etapa será considerada concluída quando:

- `npm ci`, lint, typecheck, testes e build passarem;
- novas fórmulas tiverem testes de propriedades e casos-limite;
- unidades, hipóteses e limitações estiverem documentadas;
- nenhum import duplicado ou modelo concorrente for introduzido;
- o diff e o impacto de performance forem revisados;
- a documentação corresponder ao código realmente publicado.

