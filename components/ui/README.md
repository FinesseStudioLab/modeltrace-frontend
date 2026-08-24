# UI Primitives

This directory contains the foundational UI components for the ModelTrace dashboard.

## Guidelines

- **Variants**: Components use typed variants instead of free-form class names. Always use the predefined variants (e.g., `<Badge variant="success">`).
- **Theming**: All primitives are built to support both light and dark themes automatically via `globals.css` CSS custom properties. No extra theme props are needed.
- **Composition**: Primitives are designed to compose easily. Use them together to build complex views. For example, a `<Stat>` inside a `<Card>`.
- **Accessibility**: Controls are accessible by default with visible focus rings. If a component lacks an accessible label inherently, ensure it is provided via `aria-label` or wrapping context.
- **No Inline Styles**: Do not use inline `style={{ ... }}` on page components. If spacing or layout is needed, use the utility classes in `globals.css` (e.g., `mt-16`, `mb-16`, `flex-between`, `grid-cols-auto`) or add new ones.

## Components

- **Card**: A foundational container for metrics, forms, and charts. Supports an `interactive` prop.
- **Badge**: A small label to signify status or categories. Variants: `default`, `success`, `warning`, `danger`, `neutral`.
- **Button**: Interactive elements. Supports polymorphic rendering via the `as` prop (e.g., `as={Link}`). Variants: `primary`, `secondary`, `ghost`. Sizes: `sm`, `md`, `lg`.
- **Table**: Composable tabular data elements (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`).
- **Stat**: Key-value pair for displaying metrics.
- **EmptyState**: A placeholder for missing or scaffolded content.
- **Skeleton**: A loading placeholder with a pulsing animation.
