# Auditoria de linha de base

Data da execução: 20 de outubro de 2026.

## Resultado das verificações

| Comando | Resultado | Observação |
| --- | --- | --- |
| `npm ci` | Aprovado | Instalação limpa reproduzida pelo `package-lock.json`. A primeira tentativa encontrou `EPERM` porque o binário nativo do `lightningcss` estava bloqueado por processo local; após liberar o processo, a repetição concluiu. |
| `npm run lint` | Aprovado | ESLint concluiu sem erros. |
| `npm run typecheck` | Aprovado | `tsc -b --pretty false` concluiu sem erros. |
| `npm test` | Aprovado | 1 arquivo de teste e 24 testes aprovados. |
| `npm run build` | Aprovado | Build Vite concluído; o bundle JavaScript principal tem 999,55 kB minificados e 293,39 kB gzipados. |
| `npm audit` | Aprovado | 0 vulnerabilidades encontradas. |

## Estado do repositório

`node_modules/` é um diretório gerado e já está listado no `.gitignore`, mas
também estava versionado. A instalação limpa confirmou que `package.json` e
`package-lock.json` representam as dependências necessárias. O diretório foi
removido do índice Git com `git rm -r --cached node_modules`; os arquivos locais
foram preservados para uso durante o desenvolvimento.

Nenhum arquivo de código-fonte foi removido nesta limpeza.

## Classificação dos achados

### Erros preexistentes

- `node_modules/` versionado apesar de estar no `.gitignore`, gerando milhares
  de alterações artificiais após uma instalação limpa.
- O pacote `eslint` resolvido pela instalação informa que a versão encontrada
  está fora do suporte upstream; isso não impediu a execução do lint nesta
  linha de base.
- O build alerta que o bundle JavaScript principal ultrapassa 500 kB após
  minificação. Não é uma falha funcional, mas é um gargalo de carregamento
  inicial a ser tratado com divisão de código.

Após a etapa de code splitting por seção, o build passou a gerar um chunk
inicial de aproximadamente 245,05 kB minificados (75,66 kB gzip) e chunks
separados para os simuladores e seções educacionais. A linha de base acima é
mantida para comparação histórica.

### Alterações introduzidas nesta etapa

Nenhuma alteração foi feita em fórmulas, componentes ou dependências de
produção. A única limpeza é a remoção de `node_modules/` do índice Git, com os
arquivos locais preservados.

### Falhas ambientais

- A primeira execução de `npm ci` falhou com `EPERM` ao tentar substituir
  `lightningcss.win32-x64-msvc.node`, pois o arquivo estava bloqueado por um
  processo local. Depois que o servidor/processo foi liberado, `npm ci`
  concluiu normalmente.

### Vulnerabilidades

`npm audit` reportou zero vulnerabilidades.

### Cobertura insuficiente

Os testes existentes cobrem os modelos físicos principais em
`src/core/physics`, mas ainda não cobrem de forma abrangente componentes React,
acessibilidade, navegação, responsividade ou integração visual.

### Inconsistências científicas

Nenhuma nova inconsistência foi identificada pela linha de base. Os limites e
hipóteses dos modelos existentes permanecem documentados em
`SCIENTIFIC_VALIDATION.md`.

### Acessibilidade e responsividade

Há controles sem uma suíte automatizada de acessibilidade e sem testes de
viewport. A aplicação possui estilos de foco e menu móvel, mas esses
comportamentos ainda precisam de validação automatizada.

### Performance

A linha de base identificou um bundle inicial grande. A divisão por simulador
foi aplicada posteriormente em `App.tsx` e sua medição antes/depois está
registrada acima; novas features ainda devem preservar e reavaliar esse padrão.
