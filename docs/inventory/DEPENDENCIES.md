# Inventário de dependências

Versões abaixo foram observadas na instalação local via `npm list --depth=0`;
as faixas declaradas permanecem em `package.json` e a resolução reproduzível
fica no `package-lock.json`.

| Dependência | Versão observada | Uso |
| --- | --- | --- |
| React / React DOM | 19.3.1 | Interface |
| TypeScript | 5.9.3 | Tipagem e build |
| Vite | 6.4.4 | Dev server e bundle |
| Tailwind CSS | 4.3.3 | Estilos |
| Recharts | 3.10.1 | Gráficos dos simuladores |
| KaTeX | 0.19.0 | Equações |
| lucide-react | 1.59.0 | Ícones |
| Vitest | 5.0.5 | Testes |
| ESLint | 9.39.5 | Lint |

## Política

Não há dependências Python ou `requirements.txt`. Novas dependências devem ser
justificadas, adicionadas pelo npm e acompanhadas de atualização do lockfile,
testes e revisão de impacto no bundle. O baseline anterior registrou `npm audit`
sem vulnerabilidades; uma alteração de dependências exige nova auditoria.
