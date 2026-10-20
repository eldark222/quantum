# Arquitetura do Quantum Lab

## Objetivo

O Quantum Lab é uma aplicação React/TypeScript para exploração educacional de
modelos de mecânica quântica. A arquitetura separa a interface, as experiências
de aprendizagem e os cálculos físicos para que novos módulos possam ser
adicionados sem duplicar equações ou substituir a aplicação existente.

## Mapa da estrutura atual

```text
src/
├── App.tsx                    # composição da aplicação e navegação de abas
├── main.tsx                   # ponto de entrada React
├── index.css                  # estilos globais e tema
├── components/
│   ├── common/                # MathView, cards, métricas e controles
│   └── layout/                # Header e navegação principal
├── core/
│   ├── math/                  # algoritmos matemáticos reutilizáveis
│   └── physics/               # constantes, unidades e modelos independentes
├── features/
│   ├── mathematics/           # experiências de matemática aplicada
│   ├── education/             # aplicações, glossário e metodologia
│   └── simulators/            # seis experiências interativas
├── tests/                     # testes dos modelos físicos
└── assets/                    # recursos estáticos usados pela interface
```

### Responsabilidades

- **Aplicação:** `App.tsx` compõe o layout, mantém a aba ativa e conecta a
  navegação às features. `main.tsx` inicializa o React.
- **Componentes:** `components/common` contém componentes reutilizáveis sem
  conhecimento de uma experiência específica. `components/layout` contém a
  navegação e o enquadramento visual.
- **Física:** `core/physics` não depende de React. Cada arquivo concentra um
  modelo ou grupo de conversões relacionado: poço infinito, dupla fenda,
  incerteza, tunelamento, superposição, emaranhamento, constantes e unidades.
- **Matemática:** `core/math` contém algoritmos puros reutilizáveis. O primeiro
  módulo é `linearSystem.ts`, que resolve e classifica sistemas lineares 2×2.
- **Features:** `features/simulators` adapta os modelos físicos para controles,
  gráficos e interpretação. `features/mathematics` apresenta conceitos
  matemáticos aplicados. `features/education` mantém o conteúdo conceitual e as
  referências apresentadas ao usuário.
- **Testes:** `tests` verifica propriedades matemáticas e físicas dos modelos.

## Decisões arquiteturais

### Manter os caminhos existentes

A estrutura atual já possui fronteiras úteis entre `components`, `core` e
`features`. Não foram feitas movimentações apenas para coincidir com uma árvore
idealizada: isso reduziria a clareza dos diffs e aumentaria o risco de imports
quebrados sem benefício funcional.

As pastas `charts`, `accessibility`, `math`, `content`, `classical-physics` e
`modern-physics` permanecem extensões futuras. Devem ser criadas quando houver
um módulo concreto que justifique a fronteira, não como diretórios vazios.

### Dependência em uma direção

O fluxo recomendado é:

```text
App/layout -> features -> components/common
features   -> core/math | core/physics
tests      -> core/math | core/physics
```

Os modelos em `core/physics` não devem importar componentes ou APIs do navegador.
Componentes genéricos não devem conter cálculos científicos específicos. Quando
um cálculo for usado por mais de uma feature, ele deve ser extraído para
`core/physics` em vez de duplicado na interface.

### Imports

Os imports relativos existentes foram preservados. O projeto ainda é pequeno e
os caminhos tornam explícita a separação entre camadas; aliases globais seriam
configuração adicional sem ganho proporcional nesta fase. Uma futura
introdução de aliases deve atualizar TypeScript, Vite, testes e documentação em
conjunto.

### Dados e conteúdo

Conteúdo educacional permanece junto às suas features enquanto é específico de
uma seção. Metadados compartilhados, exercícios e referências que passarem a
ser reutilizados por várias páginas podem ser extraídos para `src/content/`,
mantendo os componentes responsáveis apenas pela apresentação.

## Limites científicos

Os simuladores são modelos idealizados e devem declarar hipóteses, unidades e
limitações na própria experiência. A camada de interface não deve apresentar
uma aproximação numérica como solução analítica. Alterações em fórmulas devem
ser acompanhadas por testes de propriedades e pela documentação científica
correspondente.
