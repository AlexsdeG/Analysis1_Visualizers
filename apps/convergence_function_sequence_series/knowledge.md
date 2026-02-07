# 🧠 Knowledge Base: Analysis 1 Visualizer

## 1. Project Identity & Goal
*   **Name:** `analysis-interactive-playground`
*   **Description:** A high-precision, interactive educational web application for university-level Calculus/Analysis 1. It visualizes abstract concepts (Convergence, Series, Function Sequences) using the "Explorable Explanation" philosophy.
*   **Tech Stack:** React (Vite), TypeScript, Tailwind CSS.
*   **Primary Language:** TypeScript (Strict Mode).
*   **Localization:** German (Primary), English (Secondary).

---

## 2. Technology Stack & NPM Arsenal

### Core Dependencies
| Package | Version (approx) | Purpose | Justification |
| :--- | :--- | :--- | :--- |
| `react` | ^18.3 | UI Framework | Standard, ecosystem support. |
| `vite` | Latest | Build Tool | Fast HMR, optimized for modern frontend. |
| `typescript` | ^5.0 | Type Safety | Crucial for math interfaces and prop drilling. |

### Visualization & Math Engine
| Package | Purpose | Critical Implementation Note |
| :--- | :--- | :--- |
| **`mafs`** | **The Graphics Core.** Interactive 2D math plotting. | **MUST USE.** Do not use Recharts or Chart.js. Mafs handles coordinate systems, movable points, and vector math natively. |
| **`mathjs`** | Symbolic parsing & evaluation. | Use `compile()` and `evaluate()`. **NEVER** use Javascript `eval()`. |
| `katex` | Rendering LaTeX equations. | Used via `react-katex`. Must import CSS file. |
| `complex.js` | Complex number arithmetic. | Essential for Module 2 (Radius of Convergence). |

### UI & Styling (Shadcn/UI compatible)
| Package | Purpose |
| :--- | :--- |
| `tailwindcss` | Utility-first CSS. |
| `clsx`, `tailwind-merge` | Conditional class merging. |
| `lucide-react` | Icons (Math symbols, UI controls). |
| `framer-motion` | Smooth transitions (entering/leaving states). |
| `@radix-ui/react-slider` | Accessible Sliders (High precision). |
| `@radix-ui/react-popover` | For mathematical definition tooltips. |

### Internationalization
| Package | Purpose |
| :--- | :--- |
| `i18next` | Core logic. |
| `react-i18next` | React hooks (`useTranslation`). |

---

## 3. Architecture & File Structure

The project follows a **Feature-Based Module** architecture.

```text
src/
├── assets/                 # Static fonts, images
├── components/
│   ├── ui/                 # Generic atoms (Button, Slider, Card) - shadcn style
│   ├── math/               # Math-specific atoms (EquationDisplay, MathInput)
│   └── layout/             # Navbar, Footer, Container
├── hooks/
│   ├── useMathEvaluation.ts # Central logic for parsing user strings safely
│   └── useDimensions.ts     # Responsive canvas sizing
├── lib/
│   ├── math-utils.ts       # Helpers for complex numbers, sequences
│   └── constants.ts        # Default values (default Epsilon, default N)
├── locales/
│   ├── de.json             # German translations
│   └── en.json             # English translations
├── modules/                # THE CORE FEATURES
│   ├── sequences/          # Module 1: Epsilon-N
│   │   ├── components/     # Visualizer, Controls, InfoBox
│   │   └── SequenceView.tsx
│   ├── series/             # Module 2: Convergence Radius
│   │   └── SeriesView.tsx
│   └── functions/          # Module 3: Function Sequences
│       └── FunctionSeqView.tsx
├── styles/
│   └── globals.css         # Tailwind directives + Mafs CSS + Katex CSS
└── App.tsx                 # Routing/Tab switching
```

---

## 4. Feature Specifications (The Physics of the App)

### 🔴 Module 1: Sequences & Limits ($\epsilon-N$)
*   **Mathematical Goal:** Visualize $\forall \epsilon > 0 \exists N \in \mathbb{N} \forall n > N: |a_n - a| < \epsilon$.
*   **Visual Elements:**
    *   X-Axis: $n$ (Discrete, Integer).
    *   Y-Axis: $a_n$ (Real).
    *   **The Tube:** A shaded region $(a-\epsilon, a+\epsilon)$.
    *   **The Barrier:** A vertical line at $x=N$ (User draggable or slider).
*   **Logic:**
    *   Points with $n > N$ AND outside the tube = **RED** (Violation).
    *   Points inside the tube = **GREEN**.
    *   Points $n \le N$ = **GRAY** (Irrelevant for the limit).
*   **Input:** User provides string formula for $a_n$ (e.g., `(1 + 1/n)^n`).

### 🔵 Module 2: Power Series & Radius ($R$)
*   **Mathematical Goal:** Visualize Cauchy-Hadamard $R = 1 / \limsup \sqrt[n]{|a_n|}$ or Quotient Rule.
*   **Visual Elements:**
    *   2D Cartesian Plane (Complex Plane: Re(z), Im(z)).
    *   **Convergence Circle:** Centered at 0 (or $z_0$) with radius $R$.
    *   **Movable Point:** A point $z$ the user can drag.
*   **Logic:**
    *   Compute $R$ based on input $a_n$.
    *   If $|z| < R$: Display "Convergent" (Green).
    *   If $|z| > R$: Display "Divergent" (Red).
    *   Animation: Show terms adding up vectorially? (Optional advanced feature).

### 🟣 Module 3: Functions Sequences ($f_n \to f$)
*   **Mathematical Goal:** Pointwise vs. Uniform Convergence.
*   **Visual Elements:**
    *   Function Plot: $y = f_n(x)$.
    *   Slider: Controls $n$ (1 to 100).
    *   Ghost Plot: The limit function $f(x)$ (static dashed line).
*   **Key Insight:** For $x^n$ on $[0,1]$, show how the "spike" gets thinner but the point at $1$ stays at $1$, while everything else drops to $0$.

---

## 5. Implementation Details & Snippets

### A. Math Evaluation Hook (`useMathEvaluation.ts`)
**CRITICAL:** Handle parsing errors gracefully. Do not crash the app on invalid syntax.

```typescript
import { useState, useMemo } from 'react';
import { compile } from 'mathjs';

export const useMathEvaluation = (formula: string, variable: string, range: number[]) => {
  return useMemo(() => {
    try {
      const code = compile(formula);
      const results = range.map(val => ({
        input: val,
        output: code.evaluate({ [variable]: val })
      }));
      return { data: results, error: null };
    } catch (err) {
      return { data: [], error: "Invalid syntax" };
    }
  }, [formula, variable, range]);
};
```

### B. Mafs Configuration (Boilerplate)
**ATTENTION:** `Mafs` requires explicit height/width or a container setup.

```tsx
import { Mafs, Coordinates } from "mafs";

// inside a component
<div className="h-[500px] w-full border rounded-md overflow-hidden bg-white">
  <Mafs zoom={true} pan={true} viewBox={{ x: [0, 20], y: [-2, 2] }}>
    <Coordinates.Cartesian subdivisions={2} />
    {/* Children components go here */}
  </Mafs>
</div>
```

### C. Color System (Tailwind + CSS Variables)
Define these in `globals.css` to match standard math textbooks.
*   `--math-primary`: #2563eb (Blue - Function lines)
*   `--math-success`: #16a34a (Green - Convergent/Inside Epsilon)
*   `--math-danger`: #dc2626 (Red - Divergent/Outside Epsilon)
*   `--math-neutral`: #94a3b8 (Grey - Inactive points)

---

## 6. ⚠️ Critical Attention Points (The "Don't Break It" List)

1.  **CSS Import Missing:**
    *   **Risk:** Graphs look broken, equations don't render.
    *   **Fix:** Ensure `import "mafs/core.css";` and `import "katex/dist/katex.min.css";` are in `App.tsx` or `main.tsx`.

2.  **Performance with `mathjs`:**
    *   **Risk:** Re-evaluating the formula on every pixel drag.
    *   **Fix:** Use `useMemo` heavily. Debounce the text input for formulas (500ms delay) so it doesn't try to parse while typing.

3.  **The "Infinity" Problem:**
    *   **Risk:** User inputs `1/x` and plots at $x=0$. Or sequence $n^2$.
    *   **Fix:** Clamp Y-values for visualization. If $y > 100$, return `null` or clamp to 100. Catch `Infinity` and `NaN` results from `mathjs`.

4.  **Touch/Mobile:**
    *   **Risk:** Sliders and Mafs draggable points conflicting with page scroll.
    *   **Fix:** `Mafs` handles this well, but ensure enough padding around draggable elements.

5.  **Strict Mode Double Render:**
    *   **Risk:** Animations running twice in dev mode.
    *   **Fix:** Be aware of this. It's a React feature, not a bug.

6.  **Complex Numbers in JS:**
    *   **Risk:** `Math.sqrt(-1)` returns `NaN`.
    *   **Fix:** Must use `mathjs` or `complex.js` for ANY root finding or Module 2 logic.

---

## 7. Configuration (.env)
This is a frontend-only app, but for good measure:

```env
VITE_APP_TITLE="Analysis 1 Interactive"
VITE_DEFAULT_LANG="de"
# No API Keys needed for this architecture
```

---

## 8. UX Copywriting Standards (German)
*   **Tone:** Academic yet encouraging ("Du" form).
*   **Math Notation:** Use LaTeX. $x_n$, not x_n.
*   **Colors:**
    *   Instructional text: `text-slate-600`
    *   Warnings: `text-amber-600`
    *   Errors: `text-red-600`
