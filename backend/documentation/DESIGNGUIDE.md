# DESIGNGUIDE.md

> Visual design system for the tender matching platform

**Stack**: Pure CSS, no build tools, vanilla JavaScript

---

## 1. Design Principles

### 1.1 Core Values

1. **Mobile First** – Design for small screens, enhance for larger. SMEs check tenders on the go.
2. **Clarity** – Dense data, simple presentation. Users scan hundreds of tenders; reduce cognitive load.
3. **Trust** – Professional, reliable aesthetic. Public procurement is serious business.
4. **Efficiency** – Optimize for task completion. Every click should feel purposeful.
5. **Accessibility** – Inclusive by default. Works for everyone, everywhere.

### 1.2 Design Philosophy

The interface should feel like a well-organized research tool – calm, structured, and information-dense without being overwhelming. Think Bloomberg Terminal meets modern SaaS: functional density with visual breathing room.

**Mobile-first means:**
- Base styles target phones (< 640px)
- Progressive enhancement via `min-width` media queries
- Touch-friendly targets (44px minimum)
- Thumb-zone aware navigation
- Content prioritization over feature parity

---

## 2. Color System

### 2.1 Brand Colors

```
Primary
├── Navy 900      #0f172a    Text, headers, primary actions
├── Navy 700      #334155    Secondary text
├── Navy 500      #64748b    Muted text, icons
└── Navy 100      #f1f5f9    Backgrounds, hover states

Accent
├── Blue 600      #2563eb    Links, primary buttons, focus rings
├── Blue 500      #3b82f6    Hover states
└── Blue 100      #dbeafe    Selected states, highlights
```

### 2.2 Semantic Colors

```
Status
├── Open          #16a34a    (Green 600) Active tenders
├── Closing Soon  #ea580c    (Orange 600) < 7 days deadline
├── Closed        #6b7280    (Gray 500) Past deadline
├── Awarded       #2563eb    (Blue 600) Contract awarded
└── Cancelled     #dc2626    (Red 600) Withdrawn

Feedback
├── Success       #16a34a    Confirmations, saved states
├── Warning       #ea580c    Approaching deadlines, limits
├── Error         #dc2626    Validation errors, failures
└── Info          #2563eb    Tips, guidance
```

### 2.3 Background Hierarchy

```
Layer 0 (Base)    #ffffff    Page background
Layer 1           #f8fafc    Cards, panels
Layer 2           #f1f5f9    Nested elements, table rows (alt)
Layer 3           #e2e8f0    Dividers, borders
```

### 2.4 Dark Mode

```
Layer 0 (Base)    #0f172a    Page background
Layer 1           #1e293b    Cards, panels
Layer 2           #334155    Nested elements
Layer 3           #475569    Dividers, borders
Text Primary      #f8fafc
Text Secondary    #94a3b8
```

---

## 3. Typography

### 3.1 Font Stack

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", monospace;
```

Inter is chosen for its excellent legibility at small sizes and tabular number support – essential for financial data.

### 3.2 Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display | 36px | 600 | 1.2 | Hero headlines |
| H1 | 28px | 600 | 1.3 | Page titles |
| H2 | 22px | 600 | 1.35 | Section headers |
| H3 | 18px | 600 | 1.4 | Card titles, tender names |
| H4 | 16px | 600 | 1.4 | Subsection headers |
| Body | 15px | 400 | 1.6 | Default text |
| Body Small | 14px | 400 | 1.5 | Secondary info, metadata |
| Caption | 13px | 400 | 1.4 | Labels, timestamps |
| Micro | 11px | 500 | 1.3 | Badges, status indicators |

### 3.3 Text Colors

```
Primary       #0f172a / #f8fafc (dark)    Main content
Secondary     #475569 / #94a3b8 (dark)    Supporting text
Muted         #64748b / #64748b (dark)    Timestamps, metadata
Disabled      #94a3b8 / #475569 (dark)    Inactive states
Link          #2563eb / #60a5fa (dark)    Interactive text
```

### 3.4 Numerical Data

- Use tabular figures for aligned numbers: `font-variant-numeric: tabular-nums`
- Currency: Always show symbol and format with locale: `CHF 1'250'000`
- Dates: `DD.MM.YYYY` for Swiss/EU or relative ("3 days left")

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Base unit: 4px

```
space-1     4px      Tight gaps, inline elements
space-2     8px      Related elements
space-3     12px     Default gap
space-4     16px     Card padding (compact)
space-5     20px     Section gaps
space-6     24px     Card padding (default)
space-8     32px     Major section breaks
space-10    40px     Page margins
space-12    48px     Hero sections
```

### 4.2 Grid System

```
Container max-width: 1280px
Columns: 12
Gutter: 24px
Margin (desktop): 40px
Margin (mobile): 16px
```

### 4.3 Breakpoints (Mobile First)

Base styles apply to all screens. Use `min-width` queries to enhance for larger displays.

```css
/* Base: Mobile (< 640px) – no media query needed */

@media (min-width: 640px)  { /* sm: Large phones, landscape */ }
@media (min-width: 768px)  { /* md: Tablets */ }
@media (min-width: 1024px) { /* lg: Desktop */ }
@media (min-width: 1280px) { /* xl: Wide desktop */ }
```

| Token | Min-width | Target devices |
|-------|-----------|----------------|
| base | – | Phones (default) |
| sm | 640px | Large phones, landscape |
| md | 768px | Tablets |
| lg | 1024px | Laptops, desktop |
| xl | 1280px | Large monitors |

### 4.4 Content Width

```
Prose max-width: 680px     Long-form text (descriptions)
Form max-width: 480px      Input forms
Card min-width: 300px      Tender cards in grid
Sidebar width: 280px       Filters panel
```

---

## 5. Components

### 5.1 Buttons

**Variants**

| Variant | Usage | Background | Text |
|---------|-------|------------|------|
| Primary | Main actions | Blue 600 | White |
| Secondary | Alternative actions | Navy 100 | Navy 900 |
| Ghost | Tertiary actions | Transparent | Navy 700 |
| Danger | Destructive actions | Red 600 | White |

**Sizes**

| Size | Height | Padding | Font |
|------|--------|---------|------|
| Small | 32px | 12px | 13px |
| Medium | 40px | 16px | 14px |
| Large | 48px | 20px | 15px |

**States**

```
Default     Base colors
Hover       Darken 10% or show background
Active      Darken 15%
Focus       2px blue ring, offset 2px
Disabled    50% opacity, no pointer
Loading     Spinner replaces text
```

### 5.2 Cards

```
Background:       Layer 1 (#f8fafc)
Border:           1px solid Layer 3 (#e2e8f0)
Border radius:    8px
Padding:          24px
Shadow:           none (use border for definition)
Hover:            Border color Navy 300, subtle translate -1px Y
```

**Tender Card Anatomy**

```
┌─────────────────────────────────────────────┐
│  [CPV Badge] [Status Badge]        [Match%] │  <- Header: 13px, caps
│                                             │
│  Tender Title Goes Here                     │  <- H3: 18px, semibold
│  Contracting Authority Name                 │  <- Body Small: 14px, muted
│                                             │
│  CHF 500'000 – 1'200'000                    │  <- Body: 15px, tabular nums
│  Deadline: 15.02.2025 (12 days)             │  <- Body Small: 14px
│                                             │
│  [View Details]              [Save] [Share] │  <- Actions
└─────────────────────────────────────────────┘
```

### 5.3 Badges

```
Height:           22px
Padding:          4px 8px
Border radius:    4px
Font:             11px, 500 weight, uppercase
Letter spacing:   0.5px
```

**Status Badges**

| Status | Background | Text |
|--------|------------|------|
| Open | Green 100 | Green 700 |
| Closing Soon | Orange 100 | Orange 700 |
| Closed | Gray 100 | Gray 600 |
| Awarded | Blue 100 | Blue 700 |
| Cancelled | Red 100 | Red 700 |

### 5.4 Form Elements

**Text Input**

```
Height:           44px
Padding:          12px 14px
Border:           1px solid #d1d5db
Border radius:    6px
Font:             15px

Focus:            Border blue-500, ring 3px blue-100
Error:            Border red-500, ring 3px red-100
Disabled:         Background gray-50, text gray-400
```

**Select / Dropdown**

Same as text input, with chevron icon (16px) right-aligned.

**Checkbox / Radio**

```
Size:             18px
Border:           2px solid gray-300
Border radius:    4px (checkbox), 50% (radio)
Checked:          Blue-600 fill, white checkmark
```

### 5.5 Tables

```
Header row:       Background Layer 2, 13px caps, 600 weight
Body row:         44px height, 15px text
Alternating:      Layer 2 on even rows (optional)
Border:           1px bottom on rows
Hover:            Layer 2 background
Selected:         Blue-50 background, blue-500 left border
```

### 5.6 Navigation

**Top Bar**

```
Height:           64px
Background:       White / Navy 900 (dark)
Border:           1px bottom Layer 3
Logo:             Left aligned, 32px height
Nav items:        14px, 500 weight, 24px gap
Actions:          Right aligned
```

**Sidebar (Filters)**

```
Width:            280px (collapsible on mobile)
Background:       Layer 1
Sections:         24px gap, 16px padding
Section title:    13px caps, muted color
```

---

## 6. Iconography

### 6.1 Icon Set

Use [Lucide Icons](https://lucide.dev) – clean, consistent, MIT licensed.

### 6.2 Sizes

```
Small       16px    Inline with text, badges
Medium      20px    Buttons, list items
Large       24px    Standalone, navigation
XLarge      32px    Empty states, features
```

### 6.3 Common Icons

| Concept | Icon | Usage |
|---------|------|-------|
| Search | `search` | Search inputs |
| Filter | `sliders-horizontal` | Filter panel |
| Tender | `file-text` | Tender items |
| Company | `building-2` | Company profiles |
| Match | `sparkles` | Recommendation score |
| Deadline | `clock` | Time remaining |
| Location | `map-pin` | Regional filters |
| Save | `bookmark` | Save tender |
| Alert | `bell` | Notifications |
| External | `external-link` | Links to source |

### 6.4 Icon Colors

- Default: `currentColor` (inherits text color)
- Interactive: Blue 600 on hover
- Status: Match semantic colors

---

## 7. Data Visualization

### 7.1 Match Score

Display as circular progress or horizontal bar:

```
90-100%     Excellent    Green 600
70-89%      Good         Blue 600
50-69%      Fair         Orange 500
< 50%       Low          Gray 400
```

### 7.2 Charts

- Use simple bar/line charts for tender statistics
- Color palette: Blue 600, Blue 400, Blue 200, Gray 300
- Always include axis labels and legends
- Prefer horizontal bars for categorical comparisons

### 7.3 Empty States

```
┌─────────────────────────────────────────────┐
│                                             │
│              [Illustration]                 │  <- 120px, muted colors
│                                             │
│           No matching tenders               │  <- H3, Navy 900
│                                             │
│   Try adjusting your filters or adding      │  <- Body, muted
│   more CPV codes to your profile.           │
│                                             │
│            [Update Profile]                 │  <- Primary button
│                                             │
└─────────────────────────────────────────────┘
```

---

## 8. Motion & Animation

### 8.1 Timing

```
Instant       0ms       State changes (checkbox)
Fast          100ms     Hover effects, focus rings
Normal        200ms     Panel transitions, modals
Slow          300ms     Page transitions, large elements
```

### 8.2 Easing

```
ease-out      cubic-bezier(0, 0, 0.2, 1)      Entering elements
ease-in       cubic-bezier(0.4, 0, 1, 1)      Exiting elements
ease-in-out   cubic-bezier(0.4, 0, 0.2, 1)    Moving elements
```

### 8.3 Principles

- Prefer opacity and transform (GPU-accelerated)
- Respect `prefers-reduced-motion`
- No animation on critical actions (save, submit)
- Subtle is better than flashy

---

## 9. Accessibility

### 9.1 Color Contrast

| Element | Minimum Ratio |
|---------|---------------|
| Body text | 4.5:1 |
| Large text (18px+) | 3:1 |
| UI components | 3:1 |
| Focus indicators | 3:1 |

### 9.2 Focus States

All interactive elements must have visible focus:

```css
:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

### 9.3 Touch Targets

Minimum 44×44px for all interactive elements on touch devices.

### 9.4 Screen Readers

- Use semantic HTML (`<nav>`, `<main>`, `<article>`)
- Provide `aria-label` for icon-only buttons
- Announce dynamic content changes with `aria-live`
- Hide decorative elements with `aria-hidden`

---

## 10. Responsive Behavior (Mobile First)

### 10.1 Layout Progression

| Element | Mobile (base) | Tablet (md) | Desktop (lg) |
|---------|---------------|-------------|--------------|
| Navigation | Bottom bar | Bottom bar | Top bar |
| Filters | Full-screen modal | Side sheet | Sticky sidebar |
| Tender list | Single column | Single column | 2-3 column grid |
| Tender card | Compact stack | Compact stack | Full detail |
| Tables | Card layout | Card layout | Full table |
| Actions | FAB / bottom sheet | Inline | Inline |

### 10.2 Mobile Base Patterns

**Bottom Navigation**
Primary navigation lives in the thumb zone:

```
┌─────────────────────────────────────┐
│                                     │
│           Content Area              │
│                                     │
├─────────────────────────────────────┤
│  🏠      🔍      ⭐      👤        │  <- 56px height
│  Home   Search  Saved  Profile      │
└─────────────────────────────────────┘
```

**Filter Modal**
Full-screen takeover on mobile:

```
┌─────────────────────────────────────┐
│  ← Filters               [Reset]    │  <- Header with close
├─────────────────────────────────────┤
│                                     │
│  Status                             │
│  ○ All  ● Open  ○ Closing soon      │
│                                     │
│  Region                             │
│  [Select regions...]                │
│                                     │
│  Value range                        │
│  [Min] ———————————— [Max]           │
│                                     │
│  CPV Codes                          │
│  [Search or browse...]              │
│                                     │
├─────────────────────────────────────┤
│  [Show 24 results]                  │  <- Sticky footer
└─────────────────────────────────────┘
```

**Tender Card (Mobile)**
Optimized for vertical scanning:

```
┌─────────────────────────────────────┐
│  [OPEN]                    85%      │
│                                     │
│  School Building Renovation         │
│  Canton of Bern                     │
│                                     │
│  CHF 1.2M          ⏱ 5 days left    │
└─────────────────────────────────────┘
```

### 10.3 Touch Considerations

- **Tap targets**: Minimum 44×44px (iOS) / 48×48dp (Android)
- **Spacing**: 8px minimum between interactive elements
- **Gestures**:
  - Swipe right on tender card → Save
  - Swipe left on tender card → Dismiss
  - Pull down → Refresh list
  - Long press → Context menu
- **Feedback**: Use `:active` states for immediate touch response

### 10.4 Desktop Enhancements

Features added at `lg` breakpoint (1024px+):

- Persistent sidebar filters
- Multi-column tender grid
- Hover states and tooltips
- Keyboard shortcuts
- Table views for data comparison
- Side-by-side tender comparison

### 10.5 CSS Example (Mobile First)

```css
/* Base: Mobile */
.tender-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.tender-card {
  padding: var(--space-4);
}

.nav-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  justify-content: space-around;
  background: var(--color-bg-base);
  border-top: var(--border-width) solid var(--color-border);
}

.nav-top {
  display: none;
}

.filters-sidebar {
  display: none;
}

/* Tablet: md */
@media (min-width: 768px) {
  .tender-card {
    padding: var(--space-5);
  }
}

/* Desktop: lg */
@media (min-width: 1024px) {
  .tender-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
  
  .tender-card {
    padding: var(--space-6);
  }
  
  .nav-bottom {
    display: none;
  }
  
  .nav-top {
    display: flex;
  }
  
  .filters-sidebar {
    display: block;
    position: sticky;
    top: var(--header-height);
    width: var(--sidebar-width);
    height: calc(100vh - var(--header-height));
    overflow-y: auto;
  }
}

/* Wide: xl */
@media (min-width: 1280px) {
  .tender-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 11. Multilingual Design

### 11.1 Text Expansion

German and French text is typically 20-30% longer than English. Design for flexibility:

- Avoid fixed-width buttons (use padding)
- Allow 2-line wrapping on navigation
- Test with longest translations

### 11.2 Language Switcher

```
┌──────────────┐
│  DE ▼        │   <- Compact: code only
└──────────────┘

┌──────────────────────────────┐
│  🇩🇪  Deutsch               │   <- Expanded: flag + name
│  🇫🇷  Français              │
│  🇮🇹  Italiano              │
│  🇬🇧  English               │
└──────────────────────────────┘
```

### 11.3 Number & Date Formatting

| Locale | Number | Currency | Date |
|--------|--------|----------|------|
| de-CH | 1'234'567.89 | CHF 1'234.00 | 31.12.2025 |
| de-DE | 1.234.567,89 | 1.234,00 € | 31.12.2025 |
| fr-CH | 1 234 567,89 | CHF 1 234.00 | 31.12.2025 |
| en-GB | 1,234,567.89 | €1,234.00 | 31/12/2025 |

---

## 12. CSS Architecture

### 12.1 File Structure

The current prototype uses a simplified two-file structure optimized for rapid development:

```
css/
├── tokens.css    /* CSS custom properties (design tokens) */
└── styles.css    /* All component and utility styles */
```

This structure is appropriate for the current project size. As the codebase grows, consider migrating to a modular structure:

<details>
<summary>Future Modular Structure (Reference)</summary>

```
css/
├── base/
│   ├── reset.css           /* Minimal reset */
│   ├── tokens.css          /* CSS custom properties */
│   └── typography.css      /* Font faces, type scale */
├── components/
│   ├── buttons.css
│   ├── cards.css
│   ├── badges.css
│   ├── forms.css
│   ├── tables.css
│   └── navigation.css
├── layouts/
│   ├── grid.css
│   ├── sidebar.css
│   └── page.css
├── utilities/
│   └── helpers.css         /* Spacing, visibility, etc. */
└── main.css                /* Imports all partials */
```

</details>

### 12.2 Loading Order

```html
<head>
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/styles.css">
</head>
```

Design tokens must be loaded before styles to ensure CSS custom properties are available.

### 12.3 Design Tokens

```css
/* tokens.css */
:root {
  /* ========== Colors ========== */
  
  /* Background layers */
  --color-bg-base: #ffffff;
  --color-bg-raised: #f8fafc;
  --color-bg-muted: #f1f5f9;
  --color-bg-overlay: rgba(15, 23, 42, 0.6);

  /* Borders */
  --color-border: #e2e8f0;
  --color-border-strong: #cbd5e1;

  /* Text */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  --color-text-disabled: #94a3b8;
  --color-text-inverse: #ffffff;

  /* Brand */
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-accent-active: #1e40af;
  --color-accent-subtle: #dbeafe;
  --color-accent-border: rgba(37, 99, 235, 0.2);
  --color-accent-shadow: rgba(37, 99, 235, 0.1);

  /* Secondary accents */
  --color-accent-secondary: #8b5cf6;
  --color-accent-secondary-glow: rgba(139, 92, 246, 0.08);
  --color-accent-tertiary: #06b6d4;
  
  /* Status: Tenders */
  --color-status-open: #16a34a;
  --color-status-open-bg: #dcfce7;
  --color-status-closing: #ea580c;
  --color-status-closing-bg: #ffedd5;
  --color-status-closed: #6b7280;
  --color-status-closed-bg: #f3f4f6;
  --color-status-awarded: #2563eb;
  --color-status-awarded-bg: #dbeafe;
  --color-status-cancelled: #dc2626;
  --color-status-cancelled-bg: #fee2e2;
  
  /* Feedback */
  --color-success: #16a34a;
  --color-warning: #ea580c;
  --color-error: #dc2626;
  --color-error-hover: #b91c1c;
  --color-info: #2563eb;
  
  /* ========== Typography ========== */
  
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  
  --text-xs: 0.6875rem;     /* 11px */
  --text-sm: 0.8125rem;     /* 13px */
  --text-base: 0.9375rem;   /* 15px */
  --text-md: 1rem;          /* 16px */
  --text-lg: 1.125rem;      /* 18px */
  --text-xl: 1.375rem;      /* 22px */
  --text-2xl: 1.75rem;      /* 28px */
  --text-3xl: 2.25rem;      /* 36px */
  
  --leading-tight: 1.25;
  --leading-snug: 1.4;
  --leading-normal: 1.6;
  
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  
  /* ========== Spacing ========== */
  
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  
  /* ========== Layout ========== */
  
  --container-max: 1280px;
  --sidebar-width: 280px;
  --header-height: 64px;
  --content-max: 680px;
  
  /* ========== Borders ========== */
  
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-full: 9999px;
  
  --border-width: 1px;
  
  /* ========== Shadows ========== */
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
  
  /* ========== Transitions ========== */
  
  --duration-instant: 0ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* ========== Z-Index ========== */

  --z-base: 1;           /* Content above pseudo-elements */
  --z-raised: 10;        /* Floating cards, overlapping elements */
  --z-dropdown: 100;     /* Dropdown menus, popovers */
  --z-sticky: 200;       /* Sticky headers, sidebars */
  --z-modal-backdrop: 300; /* Modal overlay background */
  --z-modal: 400;        /* Modal dialogs */
  --z-toast: 500;        /* Toast notifications (topmost) */
}

/* ========== Dark Mode ========== */

[data-theme="dark"] {
  --color-bg-base: #0f172a;
  --color-bg-raised: #1e293b;
  --color-bg-muted: #334155;
  --color-bg-overlay: rgba(0, 0, 0, 0.6);
  
  --color-border: #334155;
  --color-border-strong: #475569;
  
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-muted: #94a3b8;
  --color-text-disabled: #64748b;
  
  --color-accent: #3b82f6;
  --color-accent-hover: #60a5fa;
  --color-accent-subtle: #1e3a5f;
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
}

/* ========== System Preference ========== */

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-base: #0f172a;
    --color-bg-raised: #1e293b;
    --color-bg-muted: #334155;
    --color-border: #334155;
    --color-text-primary: #f8fafc;
    --color-text-secondary: #cbd5e1;
    --color-text-muted: #94a3b8;
  }
}
```

### 12.4 Reset

```css
/* reset.css */
*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  background: none;
  border: none;
  cursor: pointer;
}

ul, ol {
  list-style: none;
  padding: 0;
}

table {
  border-collapse: collapse;
}
```

### 12.5 Typography Base

```css
/* typography.css */

/* Load Inter from Google Fonts or self-host */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--weight-normal);
  color: var(--color-text-primary);
  background-color: var(--color-bg-base);
}

h1, h2, h3, h4 {
  font-weight: var(--weight-semibold);
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
}

h1 { font-size: var(--text-2xl); }
h2 { font-size: var(--text-xl); }
h3 { font-size: var(--text-lg); }
h4 { font-size: var(--text-md); }

p {
  line-height: var(--leading-normal);
}

a {
  color: var(--color-accent);
  transition: color var(--duration-fast) var(--ease-out);
}

a:hover {
  color: var(--color-accent-hover);
}

a:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--color-bg-muted);
  padding: 0.125em 0.375em;
  border-radius: var(--radius-sm);
}

/* Tabular numbers for data */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
```

### 12.6 Component Examples

```css
/* buttons.css */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  height: 40px;
  padding: 0 var(--space-4);
  
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  line-height: 1;
  white-space: nowrap;
  
  border-radius: var(--radius-md);
  transition: 
    background-color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);
}

.btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Primary */
.btn-primary {
  background-color: var(--color-accent);
  color: var(--color-text-inverse);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
}

.btn-primary:active:not(:disabled) {
  background-color: var(--color-accent-active);
}

/* Secondary */
.btn-secondary {
  background-color: var(--color-bg-muted);
  color: var(--color-text-primary);
  border: var(--border-width) solid var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-border);
}

/* Ghost */
.btn-ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
}

.btn-ghost:hover:not(:disabled) {
  background-color: var(--color-bg-muted);
  color: var(--color-text-primary);
}

/* Sizes */
.btn-sm {
  height: 32px;
  padding: 0 var(--space-3);
  font-size: var(--text-xs);
}

.btn-lg {
  height: 48px;
  padding: 0 var(--space-5);
  font-size: var(--text-base);
}
```

```css
/* cards.css */

.card {
  background-color: var(--color-bg-raised);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.card-interactive {
  cursor: pointer;
  transition: 
    border-color var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

.card-interactive:hover {
  border-color: var(--color-border-strong);
  transform: translateY(-1px);
}

.card-interactive:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
}

.card-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

.card-content {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: var(--border-width) solid var(--color-border);
}
```

```css
/* badges.css */

.badge {
  display: inline-flex;
  align-items: center;
  
  height: 22px;
  padding: 0 var(--space-2);
  
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  border-radius: var(--radius-sm);
}

.badge-open {
  background-color: var(--color-status-open-bg);
  color: var(--color-status-open);
}

.badge-closing {
  background-color: var(--color-status-closing-bg);
  color: var(--color-status-closing);
}

.badge-closed {
  background-color: var(--color-status-closed-bg);
  color: var(--color-status-closed);
}

.badge-awarded {
  background-color: var(--color-status-awarded-bg);
  color: var(--color-status-awarded);
}

.badge-cancelled {
  background-color: var(--color-status-cancelled-bg);
  color: var(--color-status-cancelled);
}
```

```css
/* forms.css */

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
}

.form-input {
  height: 44px;
  padding: 0 var(--space-3);
  
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background-color: var(--color-bg-base);
  
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  
  transition: 
    border-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

.form-input:hover {
  border-color: var(--color-border-strong);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
}

.form-input:disabled {
  background-color: var(--color-bg-muted);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.form-input-error {
  border-color: var(--color-error);
}

.form-input-error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

.form-hint {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.form-error {
  font-size: var(--text-sm);
  color: var(--color-error);
}

/* Textarea */
.form-textarea {
  min-height: 120px;
  padding: var(--space-3);
  resize: vertical;
}

/* Select */
.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-3) center;
  padding-right: var(--space-10);
}
```

### 12.7 Layout Classes

```css
/* grid.css – Mobile First */

.container {
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--space-10);
  }
}

/* Grid: Single column base, expand upward */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .grid {
    gap: var(--space-6);
  }
  
  .grid-md-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-lg-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .grid-lg-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Flex utilities */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

.items-center {
  align-items: center;
}

.items-start {
  align-items: flex-start;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }

/* Page layout with sidebar (desktop only) */
.layout-sidebar {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .layout-sidebar {
    flex-direction: row;
    gap: var(--space-8);
  }
  
  .layout-sidebar-aside {
    flex-shrink: 0;
    width: var(--sidebar-width);
  }
  
  .layout-sidebar-main {
    flex: 1;
    min-width: 0;
  }
}
```

### 12.8 Utility Classes

```css
/* helpers.css – Mobile First */

/* Spacing */
.mt-2 { margin-top: var(--space-2); }
.mt-4 { margin-top: var(--space-4); }
.mt-6 { margin-top: var(--space-6); }
.mb-2 { margin-bottom: var(--space-2); }
.mb-4 { margin-bottom: var(--space-4); }
.mb-6 { margin-bottom: var(--space-6); }

/* Text */
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }

.text-muted { color: var(--color-text-muted); }
.text-secondary { color: var(--color-text-secondary); }

.font-medium { font-weight: var(--weight-medium); }
.font-semibold { font-weight: var(--weight-semibold); }

.text-center { text-align: center; }
.text-right { text-align: right; }

/* Visibility – Mobile First */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.hidden { display: none; }

/* Show only on specific breakpoints */
.show-md { display: none; }
.show-lg { display: none; }

@media (min-width: 768px) {
  .show-md { display: block; }
  .hide-md { display: none; }
}

@media (min-width: 1024px) {
  .show-lg { display: block; }
  .hide-lg { display: none; }
}

/* Touch-friendly spacing on mobile */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Safe area insets for notched devices */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.safe-top {
  padding-top: env(safe-area-inset-top, 0);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## 13. Asset Specifications

### 13.1 Logo

```
Formats:        SVG (primary), PNG (fallback)
Minimum size:   24px height
Clear space:    Equal to logo height on all sides
Variations:     Full (logo + wordmark), Icon only
Dark mode:      Inverted or white version
```

### 13.2 Favicon

```
favicon.ico     16×16, 32×32 (multi-size ICO)
favicon.svg     Scalable, supports dark mode
apple-touch     180×180 PNG
og-image        1200×630 PNG (social sharing)
```

### 13.3 Illustrations

- Style: Flat, geometric, limited palette (brand colors + 2 accent)
- Use for: Empty states, onboarding, error pages
- Avoid: Photographic images, complex gradients

---

## References

- [Inter Typeface](https://rsms.me/inter/)
- [Lucide Icons](https://lucide.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Swiss Style Typography](https://en.wikipedia.org/wiki/International_Typographic_Style)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

*Last updated: January 2025*
