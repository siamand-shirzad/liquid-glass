# Liquid Glass Components

A collection of beautiful liquid glass UI components built with React, Framer Motion, and SVG filters.

## Features

- **Liquid Navbar**: Apple-style expandable navigation with glassmorphism effect
- **Searchbox**: Interactive search input with refraction effect
- **Liquid Switch**: Toggle switch with realistic glass physics
- **Liquid Slider**: Range slider with glass thumb and refraction
- **Magnifying Glass**: Draggable lens with dynamic magnification
- **Navbar Control Panel**: Interactive controls for glass parameters

## Tech Stack

- **React 19** - UI framework
- **Framer Motion** - Animation library (used only in Liquid Navbar)
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **SVG Filters** - Glass distortion effects

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The development server will start at `http://localhost:5173/`

## Build

```bash
npm run build
```

## Component Overview

### Liquid Navbar
The flagship component featuring:
- Spring-based animations with Apple-like feel
- High stiffness (400) and optimized damping (25) for snappy motion
- Squircle bezel type for authentic Apple aesthetic
- Dynamic blur and shadow effects
- Expandable/collapsible navigation menu

### Other Components
All other components use native React state and CSS transitions for optimal performance without external animation libraries.

## Customization

Each component exposes parameters for:
- Refractive index
- Blur level
- Specular opacity and saturation
- Bezel width and type
- Glass thickness

Use the Navbar Control Panel to experiment with different values in real-time.

## License

MIT
