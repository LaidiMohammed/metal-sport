# Kimo's Gym - Component Architecture

## Overview
Kimo's Gym is a React-based fitness application with 3D visualization, authentication, and interactive machine guides. All components are built with React 19, Framer Motion animations, and styled with CSS-in-JSX.

---

## Project Structure

```
components/
├── 3d/                          # 3D Components
│   ├── Canvas3D.tsx            # Main Three.js canvas wrapper
│   ├── Mascot3D.tsx            # 3D mascot character
│   └── Machine3D.tsx           # Individual machine 3D models
│
├── auth/                        # Authentication Components
│   ├── ProtectedRoute.tsx      # Route protection wrapper
│   └── LoginForm.tsx           # (existing) Login form overlay
│
├── sections/                    # Page sections
│   ├── Hero3D.tsx              # Hero section with 3D mascot
│   ├── MachineGrid.tsx         # Interactive machine selection grid
│   └── MachineGuide.tsx        # Detailed machine instructions
│
├── profile/                     # User profile components
│   ├── ProfileDashboard.tsx    # Main profile display
│   ├── QRCodeGenerator.tsx     # (built-in) QR code generation
│   └── SubscriptionCards.tsx   # Membership plan cards
│
├── layout/                      # Layout components
│   ├── Navbar.tsx              # (existing) Fixed navigation bar
│   └── Footer.tsx              # (existing) Footer
│
└── ui/                          # shadcn/ui components (existing)
    ├── button.tsx
    ├── card.tsx
    └── ... (other shadcn components)

app/
├── page.tsx                     # Landing/home page
├── auth/page.tsx               # (existing) Authentication page
├── dashboard/page.tsx          # Protected dashboard with Hero + MachineGrid
├── profile/page.tsx            # User profile page
├── settings/page.tsx           # Account settings
├── privacy/page.tsx            # Privacy policy
├── exercises/page.tsx          # Exercise explorer
├── workouts/page.tsx           # Workout plans
├── shop/page.tsx               # Equipment shop
├── membership/page.tsx         # Membership plans
├── coach/page.tsx              # AI coaching chat
└── checkout/page.tsx           # Payment checkout

lib/
├── store.ts                     # Zustand auth & user state management
├── api/
│   ├── groq.ts                 # Groq AI API integration
│   └── chargily.ts             # Payment gateway integration
└── constants.ts                # Brand colors, gym info

public/
├── models/                      # 3D models
│   ├── mascot.glb              # Mascot 3D model
│   ├── machines/
│   │   ├── treadmill.glb
│   │   ├── dumbbell.glb
│   │   └── bench.glb
│   └── avatar/
│       └── default-avatar.glb
└── ... (other assets)
```

---

## Component Details

### 1. **Canvas3D.tsx** - Three.js Wrapper
**Purpose**: Reusable 3D rendering canvas wrapper  
**Props**:
- `children`: 3D models to render
- `showControls`: Enable/disable orbit controls
- `cameraPosition`: Camera placement [x, y, z]
- `autoRotate`: Auto-rotate on load

**JSX Example**:
```jsx
<Canvas3D cameraPosition={[0, 2, 5]} autoRotate={true}>
  <Mascot3D />
</Canvas3D>
```

**CSS**: Uses React Three Fiber's internal styling + inline CSS for container

---

### 2. **Mascot3D.tsx** - 3D Character Model
**Purpose**: Animated 3D mascot character  
**Features**:
- Rotating animation using `useFrame`
- GSAP ScrollTrigger support for scroll-based animations
- Glow effect with PointLight
- Shadow casting

**Rendering**: Creates a red (#DC2626) rotating box with lighting effects

---

### 3. **Machine3D.tsx** - Machine Models
**Purpose**: Generic 3D machine model with different geometries  
**Props**:
- `machineType`: 'treadmill' | 'dumbbell' | 'bench' | 'leg-press'
- `color`: Hex color for the machine

**Features**:
- Different geometries based on machine type
- Metallic material with emissive glow
- Base frame for realism

---

### 4. **ProtectedRoute.tsx** - Auth Guard
**Purpose**: Wrapper that protects routes from unauthenticated access  
**Features**:
- Checks `useStore` for user state
- Redirects to `/auth` if not authenticated
- Loading spinner while checking auth
- Clean loading UI with custom CSS

**JSX Usage**:
```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

---

### 5. **Hero3D.tsx** - Landing Hero Section
**Purpose**: Full-screen hero with 3D mascot and CTA buttons  
**Sections**:
- Main title: "KIMO'S GYM"
- Subtitle and call-to-action buttons
- Floating stats cards (50+ machines, 24/7 access, AI Coach)
- 3D canvas background with mascot

**Styling**:
- Glassmorphism with `backdrop-filter: blur(4px)`
- Gradient backgrounds with accent color (#DC2626)
- Text shadow effects for depth
- Responsive grid layout

---

### 6. **MachineGrid.tsx** - Machine Discovery
**Purpose**: Interactive 2x2 grid of machines with details panel  
**Features**:
- 4 machines: Treadmill, Dumbbell, Bench, Leg Press
- Click to select and view details
- 3D preview of each machine
- Target muscles display
- Step-by-step instructions
- Safety tips

**Styling**:
- Card-based layout with hover effects
- Selected state with glow
- Side panel for detailed view
- Responsive grid (2 columns → 1 column on mobile)

---

### 7. **MachineGuide.tsx** - Exercise Instructions
**Purpose**: Detailed guide for each machine with video-ready structure  
**Sections Per Machine**:
- **Key Benefits**: Muscle groups targeted
- **Step-by-Step**: 5-6 step instructions with numbered markers
- **Breathing Technique**: Proper breathing pattern
- **Safety Tips**: 4-5 important safety notes
- **Start Exercise**: Action button

**Features**:
- Sidebar with machine selector
- Animated transitions between machines
- Color-coded difficulty badges
- Breathing technique visual indicator
- Safety warnings with icons

---

### 8. **ProfileDashboard.tsx** - User Profile
**Purpose**: Complete user profile and subscription management  
**Sections**:
- **User Header**: Avatar, name, email, membership tier, QR code
- **Stats**: Workouts, hours trained, streak, calories burned
- **Subscription Plans**: 4 membership tiers (Musculation, Cardio, Mix, Zumba)
- **Recent Activity**: Last 3 workouts with timestamps

**Features**:
- QR code generation using `qrcode.react`
- Animated stat cards
- Plan cards with price and features
- Activity timeline with hover effects
- Glassmorphism design

**Subscription Plans**:
```jsx
{
  Musculation: 'DA 2,999',
  Cardio: 'DA 2,499',
  Mix: 'DA 3,499',
  Zumba: 'DA 1,999'
}
```

---

## Styling Approach

### CSS-in-JSX Pattern
All components use inline `<style jsx>` for scoped CSS:

```jsx
<style jsx>{`
  .component-class {
    /* CSS rules */
  }
  
  @media (max-width: 768px) {
    /* Responsive rules */
  }
`}</style>
```

### Design System
- **Primary Color**: `#DC2626` (Deep Crimson Red)
- **Secondary Color**: `#000000` / `#111111` (Black)
- **Accent Color**: `#00ccff` (Teal)
- **Success Color**: `#4ade80` (Green)
- **Warning Color**: `#FCA5A5` (Light Red)

### Animation Library
- **Framer Motion**: All component animations and transitions
- **GSAP**: Advanced scroll triggers and timeline animations
- **CSS Animations**: Loading spinners, keyframes

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 1024px, 1200px
- Grid layouts with auto-fit
- Flexible padding and margins

---

## State Management

### Zustand Store (`lib/store.ts`)
```jsx
// User state
const user = useStore((state) => state.user);
const setUser = useStore((state) => state.setUser);
const logout = useStore((state) => state.logout);

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  membership: 'free' | 'premium' | 'elite';
  avatar?: string;
}
```

**Persistence**: Uses localStorage middleware to persist auth state across sessions

---

## Authentication Flow

### 1. Landing Page (`/`)
- Shows for all users (authenticated or not)
- Features overview with hover animations
- CTAs to explore or login

### 2. Auth Page (`/auth`)
- Sign In / Sign Up tabs
- Form validation
- Sets user in Zustand store on successful login
- Stores user ID and session

### 3. Protected Dashboard (`/dashboard`)
- Wrapped with `<ProtectedRoute>`
- Shows Hero3D + MachineGrid
- Accessible only to authenticated users
- Redirects to `/auth` if not logged in

### 4. Profile Page (`/profile`)
- Shows ProfileDashboard
- QR code generation
- Subscription plan selection
- Activity history

---

## 3D Components Usage

### Rendering 3D Models
```jsx
import { Canvas3D } from '@/components/3d/Canvas3D';
import { Mascot3D } from '@/components/3d/Mascot3D';

<Canvas3D cameraPosition={[0, 2, 5]} autoRotate>
  <Mascot3D />
</Canvas3D>
```

### Adding New 3D Models
1. Create GLB file in `public/models/`
2. Use `@react-three/drei`'s `useGLTF` hook
3. Add to Canvas3D children

### Performance Notes
- Canvas is fixed/absolute positioned
- Kept at 60fps with optimized rendering
- Uses `dpr` for pixel ratio scaling
- Lazy loading for off-screen components

---

## Key Features Implemented

### ✅ Authentication
- Sign up / Sign in flow
- Persistent sessions with localStorage
- Protected routes with redirect

### ✅ 3D Visualization
- Interactive 3D canvas with React Three Fiber
- Multiple machine models with variations
- Animated mascot character

### ✅ Machine Guide
- Step-by-step instructions
- Safety tips and breathing techniques
- Difficulty levels and duration estimates

### ✅ User Profile
- Profile information display
- QR code generation for gym access
- Subscription plan management
- Activity tracking

### ✅ Responsive Design
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions

### ✅ Animations
- Framer Motion for smooth transitions
- GSAP for scroll-based animations
- Hover and tap effects throughout

---

## Development Workflow

### Creating a New Component

1. **Create file** in appropriate directory:
   ```
   components/sections/NewSection.tsx
   ```

2. **Add React imports**:
   ```jsx
   import React from 'react';
   import { motion } from 'framer-motion';
   ```

3. **Create component with JSX**:
   ```jsx
   export function NewSection() {
     return (
       <section className="new-section">
         {/* JSX content */}
         <style jsx>{`
           .new-section { /* CSS */ }
         `}</style>
       </section>
     );
   }
   ```

4. **Export and use in pages**:
   ```jsx
   import { NewSection } from '@/components/sections/NewSection';
   
   export default function Page() {
     return <NewSection />;
   }
   ```

---

## Performance Optimization

- **Code Splitting**: Each page loads only needed components
- **Lazy Loading**: 3D models load on demand
- **Memoization**: Framer Motion reduces re-renders
- **CSS Scoping**: Isolated styles prevent conflicts
- **Image Optimization**: Next.js `next/image` for all images

---

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 12+, Android Chrome)

---

## Future Enhancements

- [ ] Real 3D GLB model imports
- [ ] AI coaching chat with Groq API
- [ ] Payment integration with Chargily Pay
- [ ] Leaflet map for gym locations
- [ ] Progress tracking dashboard
- [ ] Workout video integration
- [ ] Social features (friend challenges)
- [ ] Progressive Web App (PWA)

---

## Resources
- React 19: https://react.dev
- Three.js: https://threejs.org
- React Three Fiber: https://docs.pmndrs.io/react-three-fiber
- Framer Motion: https://www.framer.com/motion
- GSAP: https://gsap.com
- Tailwind CSS: https://tailwindcss.com
