# Shopr Brand Palette

## Primary Brand Color

**Base Color:** `#ac590b` - Warm, rich brown that conveys trust, reliability, and approachability.

## Complete Color System

### Primary Colors

- **Primary (500):** `#ac590b` - Main brand color
- **Primary Light (400):** `#d17a2b` - Hover states, highlights
- **Primary Dark (600):** `#8b4709` - Pressed states, emphasis
- **Primary 50:** `#fdf6f0` - Very light backgrounds
- **Primary 100:** `#f9e6d3` - Light backgrounds
- **Primary 200:** `#f2cda6` - Borders, dividers
- **Primary 300:** `#e8b379` - Medium tints
- **Primary 700:** `#6b3607` - Dark shades
- **Primary 800:** `#4d2705` - Very dark shades
- **Primary 900:** `#2f1803` - Darkest shades

### Complementary Colors

- **Secondary:** `#0b7cac` - Complementary blue for variety
- **Secondary Light:** `#2b9dd1` - Light blue accents
- **Secondary Dark:** `#09588b` - Dark blue emphasis

### Accent Colors

- **Accent:** `#ac7c0b` - Warm golden accent
- **Accent Light:** `#d19d2b` - Light golden highlights
- **Accent Dark:** `#8b6309` - Dark golden emphasis

### Neutral Colors

- **Neutral 50:** `#fafafa` - Lightest backgrounds
- **Neutral 100:** `#f5f5f5` - Light backgrounds
- **Neutral 200:** `#e5e5e5` - Borders
- **Neutral 300:** `#d4d4d4` - Subtle borders
- **Neutral 400:** `#a3a3a3` - Placeholder text
- **Neutral 500:** `#737373` - Secondary text
- **Neutral 600:** `#525252` - Primary text (light mode)
- **Neutral 700:** `#404040` - Strong text
- **Neutral 800:** `#262626` - Very strong text
- **Neutral 900:** `#171717` - Strongest text

### Status Colors

- **Success:** `#16a34a` - Success states, confirmations
- **Success Light:** `#22c55e` - Light success accents
- **Warning:** `#eab308` - Warning states, cautions
- **Warning Light:** `#facc15` - Light warning accents
- **Error:** `#dc2626` - Error states, deletions
- **Error Light:** `#ef4444` - Light error accents
- **Info:** `#0b7cac` - Information states (matches secondary)
- **Info Light:** `#2b9dd1` - Light info accents

## Usage Guidelines

### Primary Usage

- Use `#ac590b` for primary buttons, links, and key interactive elements
- Use `#d17a2b` for hover states on primary elements
- Use `#8b4709` for pressed/active states

### Secondary Usage

- Use `#0b7cac` sparingly for variety and contrast
- Good for secondary buttons, badges, and informational elements

### Accent Usage

- Use `#ac7c0b` for highlights, call-to-action elements
- Good for special features, premium content indicators

### Background Usage

- Use `#fdf6f0` (Primary 50) for subtle background tints
- Use `#f9e6d3` (Primary 100) for slightly stronger backgrounds
- Use white for cards and main content areas

### Text Usage

- Use neutral colors for text hierarchy
- Primary brand color can be used for links and emphasis
- Ensure sufficient contrast ratios for accessibility

## CSS Custom Properties

All colors are available as CSS custom properties:

```css
var(--brand-primary)
var(--brand-secondary)
var(--brand-accent)
var(--brand-neutral-50) through var(--brand-neutral-900)
var(--brand-success)
var(--brand-warning)
var(--brand-error)
var(--brand-info)
```

## Utility Classes

Available Tailwind-style utility classes:

- `.text-brand-primary`, `.text-brand-secondary`, `.text-brand-accent`
- `.bg-brand-primary`, `.bg-brand-secondary`, `.bg-brand-accent`
- `.bg-brand-light` (Primary 50 background)
- `.border-brand-primary`, `.border-brand-secondary`
- `.bg-gradient-brand` (Primary to Secondary gradient)
- `.bg-gradient-warm` (Primary to Accent gradient)
- `.text-gradient-brand` (Primary to Secondary text gradient)

## Color Psychology

### Primary Brown (#ac590b)

- **Trust & Reliability:** Brown conveys stability and dependability
- **Warmth & Approachability:** Creates a friendly, welcoming feeling
- **Earth & Nature:** Connects to natural, organic qualities
- **Sophistication:** Rich brown suggests premium quality

### Complementary Blue (#0b7cac)

- **Trust & Professionalism:** Blue reinforces reliability
- **Technology & Innovation:** Modern, tech-forward feeling
- **Calm & Stability:** Balances the warmth of brown

### Accent Gold (#ac7c0b)

- **Premium & Quality:** Gold suggests value and excellence
- **Warmth & Energy:** Adds vibrancy without overwhelming
- **Success & Achievement:** Positive, uplifting feeling

This palette creates a cohesive, professional, and trustworthy brand identity perfect for a shopping/wishlist application.
