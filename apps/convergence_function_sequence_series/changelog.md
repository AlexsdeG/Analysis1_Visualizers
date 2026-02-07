# Changelog

## [0.0.6] - 2024-05-23
### Added
- **Polish & Localization (Phase 6)**:
  - Complete English and German translations for all modules.
  - `InfoTooltip`: A new UI component using `radix-ui/popover` to provide educational context for math terms.
  - Updated `SequenceView`, `SeriesView`, and `FunctionSeqView` to use localization keys and tooltips.
  - Dependency: Added `@radix-ui/react-popover` to imports.

## [0.0.5] - 2024-05-23
### Added
- **Functions Module (Phase 5)**:
  - `FunctionSeqView`: Interface for visualizing function sequences.
  - `useFunctionSequence`: Hook that safely compiles user formulas ($f_n(x)$) into executable functions for plotting.
  - Integration with `Mafs` to plot $f_n(x)$ (Blue) and limit $f(x)$ (Dashed Gray).
  - Localization for function module terms.
  - Unit tests for function evaluation hook.

## [0.0.4] - 2024-05-23
### Added
- **Series Module (Phase 4)**:
  - `SeriesView`: Interface for exploring power series convergence.
  - `ComplexPlane`: Visualization component using `mafs` to render the complex plane, convergence circle, and movable test point $z$.
  - `math-utils`: Implemented `calculateEstimatedRadius` using numerical Ratio Test.
  - Localization: Added series-specific terms.
  - Tests: Unit tests for radius calculation logic.

## [0.0.3] - 2024-05-23
### Added
- **Sequences Module (Phase 3)**:
  - `SequenceView`: Main component combining visualization and controls.
  - `Visualizer`: Interactive graph using `mafs` to show sequence points, epsilon tube, and N barrier.
  - `Controls`: Input fields for formula, limit guess, and sliders for $\epsilon$ and $N$.
  - `useSequenceData`: Hook implementing the definition logic ($\forall n > N: |a_n - a| < \epsilon$).
- **Dependencies**: Added `mafs` (Math visualization library) to import map.
- **Localization**: Added sequence-specific terms to English and German locales.
- **Tests**: Unit tests for sequence convergence logic.

## [0.0.2] - 2024-05-23
### Added
- **Core Math Engine**: Implemented `useMathEvaluation` hook for safe parsing and evaluation of user formulas using `mathjs`.
- **LaTeX Rendering**: Added `LatexDisplay` component wrapping `react-katex` for rendering mathematical equations.
- **Dependencies**: Added `mathjs`, `katex`, and `react-katex` to import map.
- **Tests**: Added unit tests for math evaluation logic and LaTeX component.

## [0.0.1] - 2024-05-23
### Added
- Initial project setup with React, Vite, and TypeScript.
- Integrated Tailwind CSS via CDN.
- Setup internationalization (i18n) with English and German locales.
- Created core UI components: `Button`, `Input`, `Card`, `Slider`, `Navbar`.
- Implemented application shell with tabbed navigation for Sequences, Series, and Functions modules.
- Added Knowledge Base and Implementation Plan documentation.