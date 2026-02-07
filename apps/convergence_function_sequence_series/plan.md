# 📋 Implementation Plan: Analysis 1 Interactive Playground

## 📂 Target File & Folder Structure
Before starting, the agent should verify or create this structure.

```text
src/
├── __tests__/              # Global integration tests
├── components/
│   ├── ui/                 # Reusable UI (Button, Slider, Card, Input)
│   ├── math/               # Math atoms (MathInput, LatexDisplay)
│   └── layout/             # LayoutShell, Navbar, Footer
├── hooks/
│   ├── useMathEvaluation.ts # Core logic for parsing
│   └── useDimensions.ts     # Responsive helpers
├── lib/
│   ├── math-utils.ts       # Complex numbers, sequence helpers
│   ├── constants.ts        # Default configs
│   └── utils.ts            # Class merging (cn)
├── locales/
│   ├── de.json
│   └── en.json
├── modules/
│   ├── sequences/          # [Phase 3]
│   │   ├── components/
│   │   ├── hooks/
│   │   └── SequenceView.tsx
│   ├── series/             # [Phase 4]
│   │   └── SeriesView.tsx
│   └── functions/          # [Phase 5]
│       └── FunctionSeqView.tsx
└── styles/
    └── globals.css
```

---

## 🚀 Phase 1: Foundation & Infrastructure
**Goal:** Initialize the project, install dependencies, and set up the base layout shell.

### Step 1.1: Project Initialization & Dependencies
*   **Action:** Initialize Vite project and install packages defined in `knowledge.md`.
*   **Details:**
    *   Framework: `react`, `typescript`, `vite`.
    *   Styles: `tailwindcss`, `postcss`, `autoprefixer`, `clsx`, `tailwind-merge`.
    *   Math: `mafs`, `mathjs`, `complex.js`, `katex`, `react-katex`.
    *   Icons/UI: `lucide-react`, `@radix-ui/react-slider`, `@radix-ui/react-popover`, `@radix-ui/react-tabs`.
    *   Testing: `vitest`, `@testing-library/react`, `jsdom`.
*   **Verification:** Run `npm run dev` to ensure the empty app loads without errors.

### Step 1.2: Global Styles & Configuration
*   **Action:** Configure Tailwind and CSS variables.
*   **Files:** `tailwind.config.js`, `src/styles/globals.css`.
*   **Details:**
    *   Import `mafs/core.css` and `katex/dist/katex.min.css` in `globals.css`.
    *   Define CSS variables for colors: `--math-primary`, `--math-success`, `--math-danger` (as per knowledge base).
*   **Verification:** Check if Mafs styles are loaded by rendering a simple `<Mafs />` component.

### Step 1.3: Core UI Components (The Kit)
*   **Action:** Create base components using Tailwind.
*   **Files:**
    *   `src/components/ui/Button.tsx`
    *   `src/components/ui/Slider.tsx` (Wrapper around Radix Slider)
    *   `src/components/ui/Card.tsx`
    *   `src/components/ui/Input.tsx`
*   **Test:** Create `src/components/ui/__tests__/UI.test.tsx` to render components and check for accessibility attributes.

### Step 1.4: App Shell & Routing
*   **Action:** Create the main layout with navigation tabs.
*   **Files:** `src/App.tsx`, `src/components/layout/LayoutShell.tsx`.
*   **Details:**
    *   Implement a Tab system (Radix Tabs) to switch between "Sequences", "Series", and "Functions".
    *   Add a Header with Title and Language Toggle placeholder.
*   **Verification:** Clicking tabs should switch the view content (placeholders for now).

---

## 🧮 Phase 2: Core Math Engine
**Goal:** robust, error-safe mathematical evaluation logic.

### Step 2.1: Math Evaluation Hook (`useMathEvaluation`)
*   **Action:** Implement the central hook for parsing user input.
*   **File:** `src/hooks/useMathEvaluation.ts`
*   **Details:**
    *   Inputs: `formula` (string), `variable` (string e.g., 'n'), `range` (number[]).
    *   Logic: Use `mathjs.compile`.
    *   **Safety:** Wrap in `try/catch`. If `mathjs` throws, return `error: string` and empty data.
    *   **Sanitization:** Handle `Infinity`, `NaN` results gracefully (map to null or clamp).
*   **Test:** Create `src/hooks/__tests__/useMathEvaluation.test.ts`.
    *   Case 1: Valid input `n^2` -> returns `[1, 4, 9...]`.
    *   Case 2: Invalid syntax `n^^2` -> returns error.
    *   Case 3: Division by zero `1/0` -> handles `Infinity`.

### Step 2.2: LaTeX Display Component
*   **Action:** visual wrapper for KaTeX.
*   **File:** `src/components/math/LatexDisplay.tsx`
*   **Details:** Wrapper around `react-katex` `<InlineMath>` and `<BlockMath>`.
*   **Verification:** Render `\sum_{n=1}^\infty \frac{1}{n}` and visually verify it looks like a math textbook.

---

## 🔴 Phase 3: Module 1 - Sequences ($\epsilon-N$)
**Goal:** Visualize the formal definition of convergence.

### Step 3.1: Sequence Data Logic
*   **Action:** Create specific logic for generating sequence points.
*   **File:** `src/modules/sequences/hooks/useSequenceData.ts`
*   **Details:**
    *   Generate array of objects `{ n: number, val: number }` for $n=1$ to $50$.
    *   Compute boolean `isConvergent` based on current $\epsilon$ and $N$.
*   **Test:** Unit test checking if points outside $(a-\epsilon, a+\epsilon)$ are flagged correctly.

### Step 3.2: Interactive Controls
*   **Action:** Build the control panel.
*   **File:** `src/modules/sequences/components/Controls.tsx`
*   **Details:**
    *   Inputs: Formula (string), Limit Guess ($a$), Epsilon (Slider), N (Slider).
    *   Feedback: Show a status badge (Green if definition holds, Red if not).

### Step 3.3: The Visualizer (Mafs Integration)
*   **Action:** Implement the graph.
*   **File:** `src/modules/sequences/components/Visualizer.tsx`
*   **Details:**
    *   Use `<Mafs>`, `<Coordinates.Cartesian>`.
    *   Render `<Polygon>` for the Epsilon tube (transparent green/red).
    *   Render `<Point>` for sequence members. Color logic: `n <= N` (Gray), `n > N` & inside (Green), `n > N` & outside (Red).
    *   Render draggable Line for $N$.

### Step 3.4: Assembly & Testing
*   **Action:** Assemble into `SequenceView.tsx`.
*   **File:** `src/modules/sequences/SequenceView.tsx`
*   **Test:** `src/modules/sequences/__tests__/SequenceView.test.tsx`.
    *   Integration test: Render view, change slider $N$, verify that the "Status Badge" text updates.

---

## 🔵 Phase 4: Module 2 - Series & Radius
**Goal:** Visualize Radius of Convergence in the Complex Plane.

### Step 4.1: Complex Math Utilities
*   **Action:** Helper functions for series.
*   **File:** `src/lib/math-utils.ts`
*   **Details:**
    *   `calculateRadius(formula)`: Attempt to compute $R$ using `mathjs` derivative/limit approximation or numeric heuristics (Ratio test). *Note: Symbolic limits are hard in JS, we might use numerical approximation for the visualizer.*
    *   Fallback: Allow user to manually set $R$ if auto-calc fails, or parse simple polynomial coefficients.

### Step 4.2: Series Visualizer (Complex Plane)
*   **Action:** Create the 2D plane visualizer.
*   **File:** `src/modules/series/components/ComplexPlane.tsx`
*   **Details:**
    *   Mafs `<Coordinates.Cartesian>` (Label axes Re and Im).
    *   Render Circle with radius $R$.
    *   `<MovablePoint>` for $z$.
    *   Display distance $|z|$ dynamically.

### Step 4.3: Integration
*   **Action:** Assemble `SeriesView.tsx`.
*   **Details:** Input for $a_n$. Display calculated $R$. Visual feedback: If point is inside circle -> "Convergent", else "Divergent".

---

## 🟣 Phase 5: Module 3 - Functions
**Goal:** Visualize pointwise vs. uniform convergence.

### Step 5.1: Function Data Hook
*   **Action:** Generate function plots.
*   **File:** `src/modules/functions/hooks/useFunctionSequence.ts`
*   **Details:**
    *   Input: $f_n(x)$ string (e.g., `x^n`), range $[0, 1]$.
    *   Output: A JS function `(x) => y` that can be passed to Mafs `<Plot.OfX>`.

### Step 5.2: The Function Plotter
*   **Action:** Create the viewer.
*   **File:** `src/modules/functions/FunctionSeqView.tsx`
*   **Details:**
    *   Slider for $n$ ($1 \to 100$).
    *   Plot $f_n(x)$ (Solid Blue).
    *   Plot Limit Candidate $f(x)$ (Dashed Gray - user defines or hardcoded for examples).
    *   Tooltip explaining "Uniform" vs "Pointwise" based on the gap.

---

## 🌍 Phase 6: Polish & Localization
**Goal:** Make it ready for students.

### Step 6.1: Internationalization (i18n)
*   **Action:** Set up translations.
*   **Files:** `src/locales/de.json`, `src/locales/en.json`, `src/i18n.ts`.
*   **Details:**
    *   Extract all hardcoded strings.
    *   Create keys like `sequences.epsilon_label`, `common.reset`.

### Step 6.2: Educational Tooltips
*   **Action:** Add educational context.
*   **Details:**
    *   Add "Info" icons next to math terms.
    *   On hover/click, show a `<Popover>` with the formal definition from the "Cheat Sheet.md".

### Step 6.3: Final E2E Check
*   **Action:** Manual walkthrough and final test run.
*   **Test:** Run `npm run test` (All unit tests). Build `npm run build` to ensure no TS errors.
