# Analysis 1 Interactive Playground

![App Screenshot](https://github.com/AlexsdeG/Analysis1_Visualizers/blob/main/apps/convergence_function_sequence_series/Ana1_Konvergenz.png)

A high-precision, interactive educational web application designed for university-level Calculus/Analysis 1 students. This tool visualizes abstract mathematical concepts using the "Explorable Explanation" philosophy, making definitions like $\epsilon-N$ and Uniform Convergence intuitive and tangible.

## 🌟 Features

### 1. Sequences ($\epsilon-N$ Definition)
Visualize the formal definition of limits: $\forall \epsilon > 0, \exists N \in \mathbb{N}, \forall n > N : |a_n - a| < \epsilon$.
- **Interactive Controls**: Adjust $\epsilon$ (tube width) and $N$ (threshold) in real-time.
- **Visual Feedback**: Instantly see which points violate the condition (Red vs Green dots).
- **Calculations**: View specific distance calculations for critical points to verify the definition mathematically.

### 2. Series (Radius of Convergence)
Explore power series $\sum a_n z^n$ in the Complex Plane.
- **Complex Plane Visualization**: See the convergence circle and interactive test points.
- **Auto-Calculation**: Estimates the Radius of Convergence $R$ using the Ratio Test ($R = \lim |a_n / a_{n+1}|$).
- **Status Indicators**: Visual feedback for convergent (inside circle) vs divergent (outside) regions.

### 3. Function Sequences ($f_n \to f$)
Understand the difference between Pointwise and Uniform Convergence.
- **Dynamic Plotting**: Slider controls for $n$ to animate the sequence $f_n(x)$ towards the limit function.
- **Supremum Analysis**: Real-time calculation of the Supremum Norm $\sup |f_n(x) - f(x)|$ to visually prove or disprove uniform convergence.
- **Presets**: Includes classic counter-examples like $x^n$ on $[0,1]$.

## 🛠️ Tech Stack

- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI patterns (Radix Primitives)
- **Math Engine**:
  - [Mafs](https://mafs.dev/) for interactive 2D visualization (Canvas/SVG).
  - [Math.js](https://mathjs.org/) for symbolic parsing and evaluation.
  - [KaTeX](https://katex.org/) for high-quality LaTeX rendering.
- **Internationalization**: i18next (English & German supported).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/analysis-interactive.git
   cd analysis-interactive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## 📂 Project Structure

```text
src/
├── components/         # UI & Math atoms (Button, LatexDisplay, Visualizers)
├── hooks/              # Core logic (useMathEvaluation, useSequenceData)
├── lib/                # Utilities & math helpers
├── locales/            # i18n JSON files (en, de)
├── modules/            # Feature modules
│   ├── sequences/      # Module 1: Limits
│   ├── series/         # Module 2: Power Series
│   └── functions/      # Module 3: Function Sequences
└── App.tsx             # Main layout & Tab routing
```
