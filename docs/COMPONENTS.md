# AIStudyPlans Frontend Components Documentation

This document provides detailed information about the frontend components used in the AIStudyPlans (SchedulEd) application.

## Table of Contents

1. [Layout Components](#layout-components)
   - [Header](#header)
   - [Footer](#footer)
2. [Landing Page Components](#landing-page-components)
   - [Hero](#hero)
   - [Features](#features)
   - [Pricing](#pricing)
   - [FAQ](#faq)
   - [HowItWorks](#howitworks)
   - [WaitlistForm](#waitlistform)
3. [Dashboard Components](#dashboard-components)
   - [StudyPlanCard](#studyplancard)
   - [StudyTimer](#studytimer)
   - [StudyPlanPreview](#studyplanpreview)
4. [Component Style Guide](#component-style-guide)

## Layout Components

### Header

**File Path**: `app/components/Header.tsx`

**Description**: The main navigation component that appears at the top of every page. It provides links to various sections of the application and includes a responsive mobile menu.

**Props**: None

**Key Features**:
- Responsive design with mobile menu toggle
- Smooth scrolling to page sections
- Active link highlighting
- Call-to-action button
- Logo and branding

**Usage Example**:
```jsx
import Header from '@/app/components/Header';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
```

### Footer

**File Path**: `app/components/Footer.tsx`

**Description**: The footer component that appears at the bottom of every page. It contains links to various sections, social media, and copyright information.

**Props**: None

**Key Features**:
- Multiple link sections for navigation
- Social media icons
- Copyright information
- Responsive layout

**Usage Example**:
```jsx
import Footer from '@/app/components/Footer';

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

## Landing Page Components

### Hero

**File Path**: `app/components/Hero.tsx`

**Description**: The main banner component that appears at the top of the landing page. It highlights the core value proposition and includes a call-to-action.

**Props**: None

**State**:
- `isVisible`: Controls animation visibility
- `email`: Tracks email input for the quick signup form

**Key Features**:
- Animated entrance
- Value proposition headline
- Study plan preview
- Call-to-action buttons
- Quick email capture form
- User count display

**Usage Example**:
```jsx
import Hero from '@/app/components/Hero';

export default function LandingPage() {
  return (
    <div>
      <Hero />
      {/* Other components */}
    </div>
  );
}
```

### Features

**File Path**: `app/components/Features.tsx`

**Description**: Displays the key features of the application in a grid layout with icons and descriptions.

**Props**: None

**Key Features**:
- Feature cards with icons
- Descriptive feature text
- Responsive grid layout
- Visual hierarchy

**Usage Example**:
```jsx
import Features from '@/app/components/Features';

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <Features />
      {/* Other components */}
    </div>
  );
}
```

### Pricing

**File Path**: `app/components/Pricing.tsx`

**Description**: Displays the subscription tiers available to users with features and pricing information.

**Props**: None

**Component Structure**:
- `PricingTier`: Inner component that displays a single pricing plan
- `Pricing`: Main component that manages the pricing display and toggle state

**PricingTier Props**:
- `name`: String - The name of the pricing tier
- `price`: String - The price of the tier
- `period`: String - The billing period (monthly/annually)
- `description`: String - Short description of the tier
- `features`: Array - List of features with included status
- `buttonText`: String - Call-to-action text
- `highlighted`: Boolean - Whether to highlight the tier as popular

**State**:
- `annual`: Boolean toggle between annual and monthly pricing

**Key Features**:
- Monthly/annual pricing toggle
- Highlighted popular plan
- Feature comparison
- Responsive grid layout
- Clear call-to-action buttons

**Usage Example**:
```jsx
import Pricing from '@/app/components/Pricing';

export default function LandingPage() {
  return (
    <div>
      {/* Other components */}
      <Pricing />
      {/* Other components */}
    </div>
  );
}
```

### FAQ

**File Path**: `app/components/FAQ.tsx`

**Description**: Displays frequently asked questions in an accordion format, allowing users to expand and collapse answers.

**Props**: None

**State**:
- `openItem`: Tracks the currently open FAQ item

**Key Features**:
- Accordion-style expansion/collapse
- Animated transitions
- Question and answer formatting
- Accessibility considerations

**Usage Example**:
```jsx
import FAQ from '@/app/components/FAQ';

export default function LandingPage() {
  return (
    <div>
      {/* Other components */}
      <FAQ />
      {/* Other components */}
    </div>
  );
}
```

### HowItWorks

**File Path**: `app/components/HowItWorks.tsx`

**Description**: Explains the step-by-step process of how the application works, with numbered steps and illustrations.

**Props**: None

**Key Features**:
- Numbered steps with clear progression
- Visual illustrations
- Descriptive text for each step
- Responsive layout

**Usage Example**:
```jsx
import HowItWorks from '@/app/components/HowItWorks';

export default function LandingPage() {
  return (
    <div>
      {/* Other components */}
      <HowItWorks />
      {/* Other components */}
    </div>
  );
}
```

### WaitlistForm

**File Path**: `app/components/WaitlistForm.tsx`

**Description**: A form component that allows users to join the waitlist by submitting their name and email.

**Props**: None

**State**:
- `formData`: Object containing name and email input values
- `errors`: Object containing validation error messages
- `isSubmitting`: Boolean indicating form submission state
- `submitResult`: Object containing submission result status and message
- `isVisible`: Boolean controlling animation visibility

**Key Features**:
- Client-side form validation
- Error messaging
- Loading state indication
- Success/error feedback
- Animation effects using Framer Motion
- API integration for form submission

**Usage Example**:
```jsx
import WaitlistForm from '@/app/components/WaitlistForm';

export default function LandingPage() {
  return (
    <div>
      {/* Other components */}
      <WaitlistForm />
      {/* Other components */}
    </div>
  );
}
```

## Dashboard Components

### StudyPlanCard

**File Path**: `components/StudyPlanCard.tsx`

**Description**: Displays a summary of a study plan as a card component on the dashboard.

**Props**:
- `title`: String - The title of the study plan
- `subject`: String - The subject of the study plan
- `dueDate`: String - The due date of the study plan
- `progress`: Number - The completion progress percentage
- `onView`: Function - Handler for viewing the plan
- `onEdit`: Function - Handler for editing the plan
- `onDelete`: Function - Handler for deleting the plan

**Key Features**:
- Visual progress indicator
- Action buttons for plan management
- Due date display
- Clean card layout
- Hover effects

**Usage Example**:
```jsx
import StudyPlanCard from '@/components/StudyPlanCard';

export default function Dashboard() {
  return (
    <div className="grid gap-4">
      <StudyPlanCard 
        title="Data Science Fundamentals"
        subject="Computer Science"
        dueDate="2023-12-31"
        progress={75}
        onView={() => handleViewPlan(1)}
        onEdit={() => handleEditPlan(1)}
        onDelete={() => handleDeletePlan(1)}
      />
      {/* More study plan cards */}
    </div>
  );
}
```

### StudyTimer

**File Path**: `components/StudyTimer.tsx`

**Description**: A Pomodoro-style timer component for focused study sessions.

**Props**: None

**State**:
- `time`: Number of seconds remaining
- `isActive`: Boolean indicating if timer is running
- `isBreak`: Boolean indicating if it's a break period
- `sessionCount`: Number of completed sessions

**Key Features**:
- Start/pause/reset controls
- Visual progress indicator
- Session/break mode switching
- Session count tracking
- Audio notifications

**Usage Example**:
```jsx
import StudyTimer from '@/components/StudyTimer';

export default function StudyPage() {
  return (
    <div className="study-container">
      <h2>Study Session</h2>
      <StudyTimer />
      {/* Study materials */}
    </div>
  );
}
```

### StudyPlanPreview

**File Path**: `components/StudyPlanPreview.tsx`

**Description**: Displays a preview of a study plan with weekly breakdown and resources.

**Props**:
- `planTitle`: String - The title of the study plan
- `planSubject`: String - The subject of the study plan
- `weeks`: Array - Weekly content and time allocations
- `totalHours`: Number - Total study hours for the plan

**Key Features**:
- Weekly breakdown of study topics
- Time allocation per activity
- Progress tracking
- Resource links
- Print functionality

**Usage Example**:
```jsx
import StudyPlanPreview from '@/components/StudyPlanPreview';

export default function PlanDetails() {
  const planData = {
    planTitle: "Machine Learning Basics",
    planSubject: "Computer Science",
    weeks: [
      {
        title: "Week 1: Python Fundamentals",
        hours: 8,
        activities: [
          { name: "Python syntax", hours: 2 },
          { name: "Data structures", hours: 3 },
          { name: "Control flow", hours: 3 }
        ]
      },
      // More weeks
    ],
    totalHours: 48
  };
  
  return <StudyPlanPreview {...planData} />;
}
```

## Component Style Guide

All components follow these styling guidelines:

### 1. Styling Approach

- **Tailwind CSS**: Primary styling method
- **CSS Modules**: Used for component-specific styles
- **Framer Motion**: Used for animations and transitions

### 2. Responsive Design

- Mobile-first approach
- Breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

### 3. Animation & Interaction

- Subtle hover states
- Smooth transitions (0.2s - 0.3s duration)
- Entrance animations
- Interactive elements provide visual feedback

### 4. Color Palette

- Primary: Indigo (`#4f46e5`)
- Primary Light: Indigo-100 (`#e0e7ff`)
- Primary Dark: Indigo-700 (`#4338ca`)
- Text Primary: Gray-800 (`#1f2937`)
- Text Secondary: Gray-600 (`#4b5563`)
- Accent: Purple-500 (`#8b5cf6`)
- Background Light: Gray-50 (`#f9fafb`)
- Border Color: Gray-200 (`#e5e7eb`)

### 5. Typography

- Font Family: Inter, system-ui, sans-serif
- Heading Sizes:
  - H1: 3rem (48px)
  - H2: 2.25rem (36px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)
- Body Text: 1rem (16px)
- Small Text: 0.875rem (14px) 