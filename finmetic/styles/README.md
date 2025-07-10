# Modular CSS Architecture

This directory contains a highly modular CSS architecture migrated from the original `style.css` file. Each component has been separated into its own file for maximum maintainability, reusability, and efficiency.

## 📁 File Structure

```
styles/
├── main.css                    # Main entry point (imports all modules)
├── reset.css                   # CSS reset and base styles
├── README.md                   # This documentation
└── components/                 # Modular component files
    ├── auth.css               # Authentication forms and components
    ├── buttons.css            # All button variants and states
    ├── calculator.css         # Calculator layout and functionality
    ├── cards.css              # Card components (blog, tool, result)
    ├── charts.css             # Chart and scenario components
    ├── checkboxes.css         # Checkbox components and variants
    ├── footer.css             # Footer layout and styling
    ├── forms.css              # General form components
    ├── grids.css              # Grid layouts and containers
    ├── header.css             # Header and navigation
    ├── hero.css               # Hero section styling
    ├── inputs.css             # Input field components
    ├── legal.css              # Legal content and cookie tables
    ├── links.css              # Link and anchor styling
    ├── tables.css             # Table components and variants
    └── tooltips.css           # Tooltip and popover components
```

## 🎯 Usage

### Option 1: Use the Modular System
```html
<link rel="stylesheet" href="/styles/main.css">
```

### Option 2: Use Specific Components
```html
<link rel="stylesheet" href="/styles/components/buttons.css">
<link rel="stylesheet" href="/styles/components/cards.css">
```

## 📦 Component Categories

### Layout Components
- **header.css** - Navigation, brand, mobile menu
- **hero.css** - Hero sections and banners
- **grids.css** - Grid layouts and containers
- **footer.css** - Footer layout and links

### UI Components
- **buttons.css** - Mode, calculate, auth, social, tool buttons
- **inputs.css** - Input fields, labels, wrappers, states
- **checkboxes.css** - Custom checkboxes with variants
- **forms.css** - General form styling and options
- **cards.css** - Result, blog, tool card components
- **links.css** - Navigation, footer, brand, generic links
- **tables.css** - Scenarios, cookie, generic tables
- **tooltips.css** - Chart tooltips and generic tooltips

### Feature Components
- **calculator.css** - Calculator-specific layouts
- **charts.css** - Chart containers and scenarios
- **auth.css** - Authentication forms and social auth
- **legal.css** - Legal content and documentation

## 🔧 Component Examples

### Buttons
```html
<!-- Mode Button -->
<button class="mode-btn active">End Amount</button>

<!-- Calculate Button -->
<button class="calculate-btn">Calculate</button>

<!-- Auth Button -->
<button class="auth-btn">Sign In</button>

<!-- Social Button -->
<a href="#" class="social-btn">
    <span class="social-icon">📧</span>
    Continue with Google
</a>
```

### Cards
```html
<!-- Result Card -->
<div class="result-card result-card--primary">
    <h3 class="result-title">End Balance</h3>
    <p class="result-value">$500,000</p>
</div>

<!-- Tool Card -->
<div class="tool-card">
    <h3 class="tool-card__title">ROI Calculator</h3>
    <p class="tool-card__description">Calculate return on investment</p>
    <a href="#" class="tool-card__button">Try Now</a>
</div>
```

### Forms
```html
<!-- Input Group -->
<div class="input-group">
    <label class="input-label">Starting Amount</label>
    <div class="input-wrapper">
        <span class="input-prefix">$</span>
        <input type="number" class="input-field" placeholder="10000">
    </div>
    <div class="input-help">Enter your initial investment</div>
</div>

<!-- Checkbox -->
<label class="checkbox-label">
    <input type="checkbox">
    <span class="checkbox-custom"></span>
    Remember me
</label>
```

### Tables
```html
<!-- Scenarios Table -->
<table class="scenarios-table">
    <thead class="scenarios-header">
        <tr class="scenarios-row">
            <th class="scenarios-cell">Year</th>
            <th class="scenarios-cell">Amount</th>
        </tr>
    </thead>
    <tbody>
        <tr class="scenarios-row">
            <td class="scenarios-cell">1</td>
            <td class="scenarios-cell">$10,700</td>
        </tr>
    </tbody>
</table>
```

## 📱 Responsive Design

All components include responsive breakpoints:
- **768px and below** - Tablet styles
- **480px and below** - Mobile styles

Example:
```css
@media (max-width: 768px) {
    .calculator {
        grid-template-columns: 1fr;
    }
}
```

## 🎨 Design System

### Colors
- **Primary**: `#000` (Black)
- **Secondary**: `#666` (Gray)
- **Background**: `#fafafa` (Light Gray)
- **Border**: `#e5e5e5` (Light Gray)
- **Hover**: `#f8f9fa` (Very Light Gray)

### Typography
- **Font Family**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`
- **Line Height**: `1.6`
- **Font Weights**: `400` (normal), `500` (medium), `600` (semibold), `700` (bold)

### Spacing
- **Border Radius**: `6px` (standard), `8px` (cards)
- **Padding**: `8px`, `12px`, `16px`, `20px`, `24px`, `32px`
- **Gaps**: `8px`, `16px`, `24px`, `32px`, `48px`

### Transitions
- **Duration**: `0.2s` (standard), `0.3s` (complex)
- **Easing**: `ease`, `ease-in-out`, `ease-out`

## 🚀 Benefits

### Maximum Modularity
- Each component in its own file
- Easy to find and modify specific styles
- Reduced CSS conflicts

### Efficient Development
- Import only what you need
- Fast iteration and debugging
- Clear separation of concerns

### Maintainability
- Consistent naming conventions
- Well-documented components
- Easy to add new features

### Performance
- Smaller file sizes when using specific components
- Better caching strategies
- Optimized loading

## 🔄 Migration Notes

The original `style.css` (1,672 lines) has been broken down into:
- **Reset**: 24 lines
- **16 Component Files**: ~50-150 lines each
- **Total**: Highly organized and maintainable

All original functionality is preserved while gaining:
- Better organization
- Easier maintenance
- Component reusability
- Faster development

## 📝 Naming Conventions

### BEM Methodology
```css
.block__element--modifier
```

Examples:
- `.nav__link--active`
- `.result-card--primary`
- `.checkbox-label--large`

### Component States
- `--active` - Active state
- `--disabled` - Disabled state
- `--error` - Error state
- `--success` - Success state
- `--primary` - Primary variant
- `--secondary` - Secondary variant

### Responsive Prefixes
- `--mobile` - Mobile-specific styles
- `--tablet` - Tablet-specific styles
- `--desktop` - Desktop-specific styles 