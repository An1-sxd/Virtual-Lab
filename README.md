# Virtual Lab Platform

The Virtual Lab Platform is an interactive web-based simulation environment designed for conducting virtual chemistry experiments. It features a modern, responsive interface and real-time visualization of reaction progress.

## Prototype Overview

The platform is built with React and Vite, utilizing a component-based architecture to simulate laboratory equipment and chemical reactions.

### Key Features
- **Virtual Burette System**: Interactive controls for titrating acid into base solutions.
- **Real-time Reaction Tracking**:
  - **Chemical Equations**: Dynamic display of balanced chemical equations based on selected reactants.
  - **Reaction Progress Table**: Live updates of initial, change, and equilibrium moles for acid and base species.
  - **Calculated Values**: Automatic calculation of moles ($n_a$, $n_b$), volumes ($V_a$, $V_b$, $V_T$), and equivalence points.
- **Dynamic pH Visualization**: Color-coded pH display that updates in real-time as the reaction proceeds, indicating Acidic, Basic, or Neutral states.
- **Interactive Graphs**: Visual representation of titration curves (pH vs. Volume).
- **Responsive Design**: Modern UI optimized for various screen sizes with dark mode support.

## Design System

The application uses a "Scientific Teal" theme, focusing on clarity, precision, and modern aesthetics.

### Color Palette

The design system is implemented using Tailwind CSS variables with HSL color values for dynamic theming (Light/Dark mode).

#### Primary Colors
| Name | Light Mode (Hex*) | Dark Mode (Hex*) | Usage |
|------|-------------------|------------------|-------|
| **Background** | `#F8F9FA` (Teal-tinted White) | `#0C1116` (Deep Navy) | Main app background |
| **Primary** | `#197676` (Deep Teal) | `#23C4C4` (Bright Teal) | Key actions, active states, brand color |
| **Secondary** | `#EBF8F8` (Light Cyan) | `#202D2D` (Dark Teal-Grey) | Secondary buttons, backgrounds |
| **Accent** | `#15C1C1` (Vibrant Cyan) | `#17E6E6` (Neon Cyan) | Highlights, focus rings, interactive elements |

#### Status Colors
| Name | Value | Usage |
|------|-------|-------|
| **Destructive/Acid** | `#DC2626` (Red) | Error states, Acid indicators |
| **Success/Base** | `#16A34A` (Green) | Success states, Base indicators |
| **Info/Reactant** | `#2563EB` (Blue) | Information, Blue reactants |

#### UI Colors
| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| **Card** | `#FFFFFF` | `#13181E` | Component backgrounds |
| **Border** | `#E2E8F0` | `#2D3748` | Dividers, inputs, card borders |
| **Muted** | `#F1F5F9` | `#1E293B` | Disabled states, secondary text backgrounds |

*> Hex codes are approximate conversions of the HSL values defined in `index.css`.*

### Typography
- **Headings**: `Space Grotesk` - Modern, geometric sans-serif for titles and data displays.
- **Body**: `Inter` - Clean, highly legible sans-serif for general text and controls.

## Tech Stack
- **Frontend**: React, Vite
- **Styling**: Tailwind CSS, CSS Variables, Lucide React (Icons)
- **State Management**: React Query (TanStack Query)
- **Data Visualization**: Recharts (Projected)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```
