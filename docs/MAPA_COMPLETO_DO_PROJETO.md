# Mapa completo do projeto

## Raiz

| Caminho | Função |
| --- | --- |
| `package.json` | Scripts, dependências e metadados do pacote Node. |
| `package-lock.json` | Resolução reproduzível das dependências npm. |
| `index.html` | Documento HTML inicial, metadados e `#root`. |
| `vite.config.ts` | Plugins React/Tailwind, deduplicação React e servidor local. |
| `tsconfig.json` | Referências para os projetos TypeScript da aplicação e do Vite. |
| `tsconfig.app.json` | Opções TypeScript do código React, incluindo `noUnusedLocals`. |
| `tsconfig.node.json` | Opções TypeScript para `vite.config.ts`. |
| `eslint.config.js` | ESLint 9, TypeScript, React Hooks e React Refresh. |
| `.gitignore` | Exclui dependências, build e arquivos locais. |
| `LICENSE` | Licença MIT do projeto. |
| `README.md` | Propósito, execução, equações e organização resumida. |

## Integração e documentação

- `.github/workflows/ci.yml`: pipeline em Node 22 com `npm ci`, lint,
  typecheck, testes e build.
- `docs/ARCHITECTURE.md`: fronteiras e dependências entre camadas.
- `docs/QUALITY.md`: processo de qualidade e critérios de revisão.
- `docs/SCIENTIFIC_VALIDATION.md`: hipóteses, fórmulas e validações científicas.
- `docs/BASELINE_AUDIT.md`: resultados da instalação limpa e da linha de base.
- `docs/EXPLICACAO_COMPLETA_DO_CODIGO.md`: visão detalhada de execução, modelos
  e responsabilidades.
- `docs/MAPA_COMPLETO_DO_PROJETO.md`: este inventário.
- `docs/DEPENDENCIAS_EXPLICADAS.md`: dependências diretas e usos.
- `docs/GUIA_DE_MANUTENCAO_E_EXPANSAO.md`: fluxo de alteração e expansão.

## Entrada e composição

| Caminho | Responsabilidade e relações |
| --- | --- |
| `src/main.tsx` | Inicializa React, importa `index.css` e renderiza `App`. |
| `src/App.tsx` | Estado da aba, composição das features, rodapé e links. |
| `src/index.css` | Tailwind, KaTeX, tema, foco e movimento reduzido. |
| `src/PocoPotencial.tsx` | Componente legado não usado por `App`; não é fonte oficial atual. |

## Componentes comuns

| Arquivo | API/responsabilidade |
| --- | --- |
| `src/components/layout/Header.tsx` | Define `TabId`, itens de navegação, menu desktop/móvel e seleção de aba. |
| `src/components/common/MathView.tsx` | Renderiza uma expressão TeX via KaTeX. |
| `src/components/common/MetricBadge.tsx` | Exibe métrica, unidade, símbolo, variante e subtítulo. |
| `src/components/common/ParameterControl.tsx` | Slider/number input com limites e callback numérico. |
| `src/components/common/ScientificCard.tsx` | Painel com teoria expansível e conteúdo da experiência. |

## Núcleo matemático e físico

| Arquivo | Símbolos principais | Consumidores |
| --- | --- | --- |
| `src/core/math/linearSystem.ts` | `solveLinearSystem2x2`, classificação e resíduos | `LinearSystemSection` e testes |
| `src/core/math/matrix2x2.ts` | determinante, traço, inversa e transformação de vetores | `MatrixSection` e testes |

| Arquivo | Símbolos principais | Consumidores |
| --- | --- | --- |
| `constants.ts` | Constantes SI, `ParticleOption`, `PARTICLE_PRESETS` | Poço, tunelamento, About |
| `units.ts` | Conversões e formatação | Todos os simuladores que exibem grandezas |
| `infiniteWell.ts` | Energia, onda, nós, probabilidade, simulação | `InfiniteWellSimulator` e testes |
| `doubleSlit.ts` | de Broglie, intensidade, envelope, curva | `DoubleSlitSimulator` e testes |
| `uncertainty.ts` | Densidades Gaussianas e produto mínimo | `UncertaintySimulator` e testes |
| `tunneling.ts` | Coeficientes, amplitudes complexas, perfil | `TunnelingSimulator` e testes |
| `superposition.ts` | Estado de qubit, Bloch, portas, medições | `SuperpositionSimulator` e testes |
| `entanglement.ts` | Correlação de singleto e CHSH | `EntanglementSimulator` e testes |

## Simuladores

| Arquivo | Estado local e visualização |
| --- | --- |
| `InfiniteWellSimulator.tsx` | Partícula, `n`, largura, intervalo, gráficos Recharts e níveis. |
| `DoubleSlitSimulator.tsx` | Geometria, detector, curva Recharts e impactos Canvas com `requestAnimationFrame`. |
| `UncertaintySimulator.tsx` | `sigma_x`, duas curvas de densidade e métricas. |
| `TunnelingSimulator.tsx` | Energia, barreira, largura, massa, perfil estacionário e transmissão. |
| `SuperpositionSimulator.tsx` | Ângulos de Bloch, portas, projeção SVG e medições aleatórias. |
| `EntanglementSimulator.tsx` | Ângulos, correlação, curva quântica/clássica e CHSH. |

## Educação

| Arquivo | Conteúdo |
| --- | --- |
| `ApplicationsSection.tsx` | Aplicações tecnológicas com mecanismo, impacto e equação. |
| `GlossarySection.tsx` | Termos, categorias, busca e equações. |
| `AboutSection.tsx` | Missão, stack, constantes e princípios de qualidade. |

## Testes

`src/tests/physics.test.ts` é atualmente a única suíte. Ela importa diretamente
`core/physics` e verifica propriedades científicas, rejeição de entradas
inválidas e valores de referência. Não há testes de componentes, navegador,
acessibilidade ou integração.

## Dependências e direção dos imports

```text
src/main.tsx -> App.tsx -> features -> components/common
                                      -> core/physics
src/tests/physics.test.ts -> core/physics
core/physics -/-> React, DOM, Recharts
```

`assets/`, `public/` e `dist/` contêm recursos estáticos ou artefatos de build;
`node_modules/` é gerado por npm e não deve ser versionado.
