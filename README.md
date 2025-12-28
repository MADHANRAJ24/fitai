# FitAI - Next-Gen Fitness Intelligence

A premium, high-performance fitness application built with Next.js 14, Tailwind CSS v4, and TypeScript. Experience the future of personal well-being with AI-driven insights, biometric scanning, and smart scheduling.

## Features

### 🤖 AI Coach
- **Personality**: A supportive, intelligent fitness advisor.
- **Interface**: Glassmorphic chat UI with real-time "typing" simulation.
- **Insights**: Context-aware workout recovery and focus area suggestions.

### 📷 Smart Scanner
- **Food Analysis**: Instant calorie and macro estimation (Mock AI).
- **Body Posture**: Webcam-based posture alignment check.
- **Tech**: Integrated `react-webcam` with overlay animations.

### 📅 Intelligent Scheduling
- **Algorithm**: Generates a weekly workout split (Push/Pull/Legs) based on your available days.
- **Flow**: Multi-step wizard collecting duration, intensity, and focus preferences.

### 📊 Comprehensive Tracking
- **Workouts**: Detailed log with intensity tags and caloric burn.
- **Nutrition**: Visual macro indicators (Protein, Carbs, Fats) and hydration tracking.
- **Habits**: Daily "punch card" lists for Sleep, Meditation, and Steps.

### 🏆 Gamification & Community
- **Leaderboards**: Compete for Weekly XP and Streaks.
- **Badges**: Earn achievements like "Early Bird" and "7-Day Streak".
- **Social Feed**: See community activity in real-time.

### 💎 Subscription Plans
- **Tiered Pricing**: Free, Pro (AI Coach), and Elite (Scanner Access).
- **UI**: Interactive pricing cards with monthly/yearly toggles.

### 🎙️ Voice & Wearables (New)
- **Voice Command**: Hands-free control with specific keywords (Mock).
- **Device Sync**: Dashboard for visualizing heart rate and sleep data.

### 🧬 Bio-Future Lab (Unique)
- **Chrono-Predictor**: Circadian rhythm AI forecasting your peak focus windows.
- **Neural Player**: Binaural interaction for brainwave entrainment (Alpha/Theta waves).

### 💰 Fitness Finance (New)
- **ROI Calculator**: Track "Cost per Workout" and "Health ROI".
- **Budgeting**: Visual breakdown of Gym, Gear, and Food expenses.

### 🏆 Social Ecosystem (New)
- **Activity Feed**: Share workouts and "Cheer" friends with interactive animations.
- **Challenges**: Join global events (e.g., "Squattober") and track progress.

### 🎮 The RPG Protocol (Unique)
- **Character Sheet**: View your fitness journey as RPG stats (Strength, Agility, Wisdom).
- **Muscle Heatmap**: Cyberpunk-style visualization of your muscle recovery status.

### 👁️ AI Vision Trainer (Phase 11)
- **Rep Counter**: Uses your webcam to count squats/pushups in real-time.
- **Form Analysis**: Live skeletal overlay for "Terminator-style" feedback.

### 👨‍🍳 AI Diet Chef (Phase 12)
- **Recipe Generator**: Turn "Chicken & Rice" into a protein-packed gourmet meal plan.
- **Macro Calculation**: Auto-estimates Protein, Carbs, and Calories.

### ✨ UI/UX Hyper-Polish (Phase 13)
- **Fluid & Alive**: Global page transitions and interactive hover cards.
- **Gamified**: Confetti celebrations for major milestones.

### 💰 Monetization Ready (Phase 14)
- **Tiered Access**: Logic to lock premium features (Vision/Diet) behind Pro/Elite plans.
- **Strategic Pricing**: Monthly/Yearly toggles with discount incentives.

### 🔐 Backend Architecture
- **Supabase Ready**: Pre-configured `AuthContext` and Client.
- **Service Layer**: Abstraction to easily switch between Mock/Real data.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 (Alpha/Beta config), CSS Variables, Glassmorphism
- **Language**: TypeScript
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Charts**: Recharts

## Environment Setup (Optional)
To enable real Backend and AI features, create a `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
OPENAI_API_KEY=your_key
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure
- `src/app`: App Router pages (Dashboard, Onboarding, etc.)
- `src/components/ui`: Reusable design system components (Cards, Buttons).
- `src/components/features`: Complex feature implementations (Scanner, Chat).
