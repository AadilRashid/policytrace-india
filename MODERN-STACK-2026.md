# PolicyTrace India - 2026 Modern Stack

## Tech Stack (YC-Style 2026)

### Core
- **Framework**: Next.js 15 + React 18
- **Styling**: Tailwind CSS (utility-first)
- **Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **AI**: Azure OpenAI (GPT-4o)
- **Auth**: Supabase Auth

### Design Principles

#### 1. Clean Minimalism
- Limited color palette (primary blue, accent purple, neutral slate)
- Soft shadows instead of heavy effects
- Large readable typography
- Ample whitespace

#### 2. AI-First Interface
- Skeleton loaders during AI processing
- Shimmer effects for data loading
- Progressive text reveal
- Clear AI status indicators

#### 3. Micro-Interactions
- 200-300ms hover animations
- Card elevation on hover
- Smooth transitions (cubic-bezier)
- Gradient text highlights

#### 4. Accessibility
- WCAG AA compliant contrast
- Keyboard navigation
- Screen reader support
- Reduced motion support

## Component Library

### Cards
```jsx
<Card hover>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Skeleton Loaders
```jsx
<Skeleton className="h-4 w-3/4" />
<SkeletonCard />
```

### Shimmer Effect
```jsx
<ShimmerEffect isLoading={loading}>
  <Content />
</ShimmerEffect>
```

## Animation Timing
- Micro: 200ms (hover, focus)
- Standard: 300ms (cards, modals)
- Slow: 500ms (page transitions)

## Color System
- Primary: Blue 500 (#3B82F6)
- Secondary: Purple 500 (#A855F7)
- Accent: Cyan 400 (#22D3EE)
- Background: Slate 950 (#020617)
- Surface: Slate 900 (#0F172A)
- Border: Slate 800 (#1E293B)

## Typography
- Headings: font-bold, tracking-tight
- Body: font-normal, leading-relaxed
- Small: text-sm, text-slate-400

## Shadows
- Soft: 0 2px 8px rgba(0,0,0,0.12)
- Soft-lg: 0 4px 16px rgba(0,0,0,0.16)

## Best Practices
1. Use utility classes over custom CSS
2. Compose with cn() helper for conditional styles
3. Animate with Framer Motion for complex interactions
4. Use Radix UI for accessible primitives
5. Keep components small and focused
6. Progressive enhancement for AI features
