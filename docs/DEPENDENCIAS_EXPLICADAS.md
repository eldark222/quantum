# Dependências explicadas

## Fontes de verdade

As faixas declaradas estão em [package.json](../package.json) e as versões
efetivamente resolvidas estão em [package-lock.json](../package-lock.json).
Não existe `requirements.txt`, pois não há código Python ou execução Python no
projeto.

## Dependências de produção

| Pacote | Uso real |
| --- | --- |
| `react` | Componentes, hooks (`useState`, `useMemo`, `useEffect`, `useRef`, `useCallback`) e composição da SPA. |
| `react-dom` | `createRoot` em `src/main.tsx`. |
| `recharts` | `LineChart`, `AreaChart`, eixos, tooltip, grade e linhas de referência dos simuladores. |
| `katex` | Renderização TeX/MathML em `src/components/common/MathView.tsx`. |
| `lucide-react` | Ícones de navegação, controles, cartões e estados educacionais. |

### Por que são necessárias

React e React DOM fornecem o runtime da interface. Recharts evita que cada
simulador implemente escalas e SVG de gráficos do zero. KaTeX transforma as
equações científicas em apresentação tipográfica consistente. Lucide fornece
ícones vetoriais leves e tipados.

O Canvas 2D usado na dupla fenda é uma API do navegador, não uma dependência
npm. A esfera de Bloch também usa SVG/HTML diretamente.

## Dependências de desenvolvimento

| Pacote | Uso real |
| --- | --- |
| `vite` | Servidor de desenvolvimento e bundler de produção. |
| `@vitejs/plugin-react` | Integração React/JSX no Vite. |
| `tailwindcss` | Classes utilitárias e preflight CSS. |
| `@tailwindcss/vite` | Plugin Tailwind usado em `vite.config.ts`. |
| `typescript` | Tipagem, `tsc -b`, resolução bundler e verificação sem emissão. |
| `vitest` | Execução dos testes em `src/tests`. |
| `eslint` | Análise estática. |
| `@eslint/js` | Configurações base do ESLint. |
| `typescript-eslint` | Parser/regras TypeScript. |
| `eslint-plugin-react-hooks` | Regras para hooks React. |
| `eslint-plugin-react-refresh` | Verificação de padrões compatíveis com React Refresh. |
| `globals` | Globais de navegador para ESLint. |
| `@types/node` | Tipos usados na configuração do Vite. |
| `@types/react` | Tipos de React e JSX. |
| `@types/react-dom` | Tipos de APIs React DOM. |
| `@types/katex` | Tipos TypeScript para o pacote KaTeX. |

## Configuração relacionada

- `vite.config.ts` ativa React e Tailwind e deduplica `react`/`react-dom`.
- `tsconfig.app.json` inclui `src`, usa JSX transform, resolução bundler e
  `noUnusedLocals`/`noUnusedParameters`.
- `eslint.config.js` combina regras base, TypeScript, hooks e refresh.
- O CI usa `npm ci`, portanto o lockfile deve ser atualizado junto com qualquer
  alteração de manifesto.

## Política para alterações

1. Reutilize APIs nativas e dependências existentes antes de adicionar pacote.
2. Adicione somente uma dependência com necessidade demonstrável.
3. Atualize `package.json` e `package-lock.json` pelo npm, nunca manualmente.
4. Execute `npm audit`, lint, typecheck, testes e build após mudanças.
5. Verifique o tamanho do bundle: a linha de base registrou aproximadamente
   999,55 kB minificados no chunk JavaScript principal.
6. Não versionar `node_modules`, `dist` ou caches do tooling.

