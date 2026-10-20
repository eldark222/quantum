# Funcionalidades implementadas

## Núcleos científicos

| Área | Implementação | Evidência |
| --- | --- | --- |
| Física | Poço infinito, dupla fenda, incerteza, tunelamento, superposição e CHSH | `src/core/physics/` e `src/tests/physics.test.ts` |
| Matemática | Sistema linear 2×2, matriz 2×2, autovalores e espectro simétrico 2×2 | `src/core/math/` e `src/features/mathematics/` |
| Unidades | Conversões J/eV e m/nm com validação | `src/core/physics/units.ts` |

## Interface e conteúdo

- Navegação por abas com `React.lazy` e `Suspense`.
- Simulador visual de decomposição espectral com SVG.
- Aplicações quânticas e aplicação de álgebra linear.
- Glossário filtrável com termos quânticos e matemáticos.
- Sobre, constantes CODATA 2022, limitações e referências acadêmicas.

## Limitações explícitas

Não existem ainda módulos completos de matemática básica, cálculo, física
clássica, relatividade, métodos numéricos avançados ou teoria quântica de
campos. Esses itens permanecem no [roadmap](../ROADMAP_COMPLETO.md).
