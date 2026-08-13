---
name: AeroControl System
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#d7ffc5'
  on-secondary: '#053900'
  secondary-container: '#2ff801'
  on-secondary-container: '#0f6d00'
  tertiary: '#fff4e8'
  on-tertiary: '#412d00'
  tertiary-container: '#ffd386'
  on-tertiary-container: '#7d5800'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#79ff5b'
  secondary-fixed-dim: '#2ae500'
  on-secondary-fixed: '#022100'
  on-secondary-fixed-variant: '#095300'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#ffba20'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-desktop: 24px
  margin-mobile: 16px
  container-max: 1800px
---

## Brand & Style

This design system is engineered for high-stakes, data-intensive environments where clarity, precision, and rapid cognition are paramount. The brand personality is authoritative, technical, and hyper-modern, evoking the atmosphere of a cutting-edge aerospace command center.

The aesthetic leverages **Glassmorphism** and **High-Contrast** data visualization. By using semi-transparent layers and thin, luminous borders, the UI maintains a sense of depth without sacrificing the density required for air traffic management. The emotional response should be one of "calm control"—reducing cognitive load through organized visual hierarchies while providing instant visual cues for critical status changes.

## Colors

The palette is optimized for long-duration monitoring. The **Dark Mode** (default) utilizes deep midnight blues and "rich blacks" to minimize eye strain and allow accent colors to pop with maximum vibrance. **Light Mode** transitions to high-clarity whites and cool grays for high-glare environments.

- **Primary (Neon Cyan):** Reserved for active flight paths, primary trajectories, and "selected" states. It represents motion and focus.
- **Secondary (Terminal Green):** Indicates stable systems, successful handoffs, and "normal" status.
- **Tertiary (Safety Amber):** Used for warnings, proximity alerts, and weather advisories that require attention but not immediate intervention.
- **Alert (Emergency Red):** Exclusive to collision warnings and critical system failures.

## Typography

Typography in this design system emphasizes legibility and technical rigor. 

**Space Grotesk** is used for headlines to provide a futuristic, geometric edge. **Inter** handles the majority of the UI text for its exceptional clarity in dense layouts. **JetBrains Mono** is employed for all data-driven strings, coordinates, and flight numbers to ensure that similar characters (like '0' and 'O') are easily distinguishable at a glance. 

For mobile devices, reduce `display-lg` to 32px and `headline-md` to 20px to ensure data density remains manageable on smaller screens.

## Layout & Spacing

This design system utilizes a **Fluid Grid** with a strict 4px baseline to maintain technical alignment. 

- **Desktop:** 12-column grid with 16px gutters. Elements are often grouped into "command modules" (cards) that snap to the grid. 
- **Tablet:** 8-column grid. Sidebars should be collapsible to maximize the radar view.
- **Mobile:** 4-column grid. Data density is reduced, prioritizing high-level alerts and status summaries.

Information density is high; therefore, padding inside components should be kept tight (typically 8px to 12px) to allow more data to be visible on a single screen.

## Elevation & Depth

Hierarchy is established through **Backdrop Blurs** and **Luminous Outlines** rather than traditional drop shadows.

- **Level 0 (Base):** Deep neutral background.
- **Level 1 (Panels):** Semi-transparent surfaces (approx. 60% opacity) with a 20px backdrop blur and a 1px solid border at 10% opacity.
- **Level 2 (Modals/Popovers):** Higher opacity surfaces (approx. 85%) with a subtle inner glow using the primary cyan or secondary green color to indicate active focus.

The "glow" effect should be restricted to active or critical elements, creating a "HUD" (Heads-Up Display) effect where the most important information appears to float closest to the user.

## Shapes

The shape language is precise and disciplined. Use **Soft (0.25rem)** rounding for standard components like buttons and input fields to maintain a modern feel without appearing too "bubbly" or consumer-grade. Large containers and cards use **rounded-lg (0.5rem)** to subtly distinguish them from the data points they contain. 

Interactive elements like flight tags or status chips may use a clipped-corner aesthetic or pill shapes if they represent a discrete, moveable object on the radar.

## Components

- **Buttons:** Primary buttons should feature a solid neon cyan fill with black text. Ghost buttons use a 1px cyan border and a subtle cyan outer glow (4px blur) on hover.
- **Flight Data Cards:** These are the core components. They must use a glassmorphic background. Flight IDs should be in `data-mono` typography.
- **Status Indicators:** Small, circular "pips" that use the terminal green, safety amber, or emergency red. They should have a 2px outer glow of the same color to simulate an LED hardware light.
- **Inputs:** Dark backgrounds with 1px borders. On focus, the border transitions to neon cyan with a 2px inner glow.
- **Progress Bars / Vectors:** Use thin, 2px lines for flight paths. Active paths use a dashed line animation to indicate direction and speed.
- **Data Tables:** High-density, no vertical lines. Horizontal lines should be `border-subtle`. Header rows use `label-caps` typography for a professional, institutional look.