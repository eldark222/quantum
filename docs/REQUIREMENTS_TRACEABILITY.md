# Rastreabilidade de requisitos

Estados usados: **implementado e testado**, **parcial**, **pendente** e
**bloqueado**. A ausência de um simulador ou teste impede o estado concluído.

| ID | Requisito | Área | Arquivos/evidência | Estado | Testes | Pendências |
| --- | --- | --- | --- | --- | --- | --- |
| MATH-001 | Sistemas lineares 2×2 | Matemática | `src/core/math/linearSystem.ts`, `LinearSystemSection.tsx` | Implementado e testado | `physics.test.ts` | Exercícios e eliminação gaussiana |
| MATH-002 | Matrizes e transformação de vetores | Matemática | `matrix2x2.ts`, `MatrixSection.tsx` | Implementado e testado | `physics.test.ts` | Dimensões gerais |
| MATH-003 | Autovalores e autovetores 2×2 | Matemática | `eigen2x2.ts`, `EigenvalueSection.tsx` | Implementado e testado | `physics.test.ts` | Diagonalização geral |
| MATH-004 | Teorema espectral real 2×2 | Matemática | `spectral2x2.ts`, `SpectralSimulatorSection.tsx` | Implementado e testado | `physics.test.ts` | Projeções e dimensões maiores |
| MATH-005 | Catálogo básico, cálculo e métodos numéricos | Matemática | Roadmap | Pendente | — | Criar modelos e testes por unidade |
| MATH-006 | Derivação numérica de funções elementares | Matemática | `numericalDifferentiation.ts`, `CalculusSection.tsx` | Implementado e testado | `physics.test.ts` | Integração, limites e derivadas multivariáveis |
| MATH-DIFF-001 | Três métodos de diferenças finitas | Matemática | `numericalDerivative` | Implementado e testado | `physics.test.ts` | Convergência automatizada em vários passos |
| MATH-DIFF-002 | Catálogo seguro com domínios | Matemática | `DEFINITIONS` | Implementado e testado | `physics.test.ts` | Mais funções no futuro |
| MATH-DIFF-003 | Comparação analítica, secante e erro em função de `h` | Matemática/UI | `CalculusSection.tsx` | Implementado; integração validada | Build/typecheck/test/build | Testes de componente e acessibilidade visual ainda pendentes |
| PHYS-001 | Poço infinito 1D | Física quântica | `core/physics/infiniteWell.ts` | Implementado e testado | `physics.test.ts` | Testes de UI |
| PHYS-002 | Dupla fenda | Física quântica | `doubleSlit.ts` | Implementado e testado | `physics.test.ts` | Validação visual automatizada |
| PHYS-003 | Incerteza | Física quântica | `uncertainty.ts` | Implementado e testado | `physics.test.ts` | Pacotes com momento médio |
| PHYS-004 | Tunelamento | Física quântica | `tunneling.ts` | Implementado e testado | `physics.test.ts` | Espalhamento mais geral |
| QM-001 | Qubits e Bloch | Informação quântica | `superposition.ts` | Implementado e testado | `physics.test.ts` | Matrizes de densidade |
| QM-002 | Emaranhamento e CHSH | Informação quântica | `entanglement.ts` | Implementado e testado | `physics.test.ts` | Ruído e sistemas abertos |
| EDU-001 | Aplicações educacionais | Conteúdo | `ApplicationsSection.tsx` | Parcial | Build/lint | Expandir áreas clássica e moderna |
| EDU-002 | Glossário e fontes | Conteúdo | `GlossarySection.tsx`, `AboutSection.tsx` | Parcial | Build/lint | Cobertura completa do catálogo |
| ARCH-001 | Separação core/features/components | Arquitetura | `ARCHITECTURE.md` | Implementado e testado | Typecheck/build | Continuar migração somente quando justificada |
| PERF-001 | Carregamento sob demanda | Performance | `App.tsx`, chunks Vite | Implementado e medido | Build | Lighthouse e profiling |
| TEST-001 | Lint, typecheck, testes e build | Qualidade | `QUALITY.md`, CI | Implementado e testado | CI/local | Testes de UI e acessibilidade |
| SEC-001 | Dependências sem vulnerabilidades no baseline | Segurança | `BASELINE_AUDIT.md` | Implementado no baseline | `npm audit` | Reauditar quando dependências mudarem |
| DOC-001 | Inventário persistente e continuidade | Documentação | `docs/` e este arquivo | Implementado | Revisão documental | Atualizar em cada etapa |
| GIT-001 | Publicação estável no GitHub | Operação | commits e `origin/main` | Implementado | Verificação Git | Manter após cada etapa |
