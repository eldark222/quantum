# Catálogo de arquivos

## Aplicação

- `src/App.tsx`: composição, estado da aba e carregamento lazy.
- `src/main.tsx`: entrada React.
- `src/components/common/`: cartões, métricas, equações e controles genéricos.
- `src/components/layout/Header.tsx`: navegação e tipos de abas.

## Núcleo

- `src/core/math/`: algoritmos matemáticos puros e tipados.
- `src/core/physics/`: constantes, unidades e modelos físicos sem React.
- `src/tests/physics.test.ts`: testes dos núcleos matemático e físico.

## Features

- `src/features/mathematics/`: sistemas, matrizes, autovalores, cálculo
  diferencial e simulador espectral.
- `src/core/math/numericalDifferentiation.ts`: catálogo seguro e três métodos
  de diferenças finitas.
- `src/features/mathematics/CalculusSection.tsx`: controles, métricas e
  visualização da unidade de cálculo.
- `src/features/simulators/`: seis simuladores quânticos preservados.
- `src/features/education/`: aplicações, glossário e metodologia/fontes.

## Documentação

`docs/` contém auditorias, baseline, arquitetura, validação científica,
qualidade, manutenção, rastreabilidade, roadmap e inventários. Não há código
Python; portanto, `requirements.txt` não é necessário para a aplicação atual.
