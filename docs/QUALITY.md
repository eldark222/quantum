# Processo de qualidade

## Verificações locais

As verificações reproduzíveis são mantidas nos scripts do `package.json`:

| Comando | Responsabilidade |
| --- | --- |
| `npm run lint` | ESLint para TypeScript e React |
| `npm run typecheck` | verificação TypeScript incremental sem emissão |
| `npm test` | testes Vitest em modo não interativo |
| `npm run build` | typecheck de projeto e build de produção Vite |

O `package-lock.json` é a fonte de resolução reproduzível das dependências.
Mudanças em dependências devem ser feitas pelo gerenciador de pacotes e
revisadas junto com o lockfile. Não se deve usar `npm audit fix --force` como
substituto para investigar uma vulnerabilidade.

## Testes

Os testes científicos ficam em `src/tests` e devem priorizar propriedades
verificáveis: conservação de probabilidade, condições de contorno, relações de
escala, conversões de unidade e limites físicos. Novas features devem adicionar
testes do modelo independente da interface sempre que houver cálculo novo.

Testes de interface e integração podem ser adicionados quando um fluxo de
navegação ou interação tiver comportamento relevante que não seja coberto pelo
modelo matemático. O teste não deve apenas confirmar que um componente renderiza;
deve verificar um resultado observável.

## Tipagem e lint

O TypeScript usa `noUnusedLocals`, `noUnusedParameters` e outras proteções
explícitas contra código inconsistente nas configurações atuais. A opção
`strict` não é presumida nesta documentação; ela deve ser habilitada
intencionalmente em uma fase própria, após avaliar os diagnósticos existentes.
`npm run typecheck` é independente do build para permitir diagnóstico rápido.
Regras de ESLint não devem ser desativadas para ocultar erros; exceções precisam
ser locais, justificadas e revisadas.

## Integração contínua

`.github/workflows/ci.yml` executa, em pull requests e em pushes para `main`:

1. checkout do repositório;
2. Node.js 22, compatível com as dependências e com o ambiente de build;
3. `npm ci`, usando o cache nativo de npm do `setup-node`;
4. lint;
5. typecheck;
6. testes;
7. build.

O workflow usa apenas a permissão `contents: read` e um job único para evitar
pipelines duplicados. O build ocorre depois das verificações rápidas para que
falhas de estilo, tipos ou testes sejam identificadas antes da etapa de
empacotamento.

## Critérios de revisão

Antes de aceitar uma mudança:

- confirmar que os imports apontam para a camada correta;
- verificar tipos, unidades, domínios e estabilidade numérica dos cálculos;
- preservar os seis simuladores e o conteúdo educacional existente;
- executar lint, typecheck, testes e build afetados;
- inspecionar o diff e o lockfile;
- registrar limitações ou validações científicas pendentes.
