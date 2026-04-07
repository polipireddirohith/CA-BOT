# Implementation Plan - Personal CA Bot

## Current Progress

- [x] **Backend Skeleton**: FastAPI server with SQLAlchemy models for Users, Transactions, and Goals.
- [x] **Dynamic Budgeting**: Implemented logic in `budgeting.py` that auto-adjusts savings targets based on goal proximity.
- [x] **Data-Driven Chat**: Enhanced `chat_endpoint` to perform real analysis on user data.
- [x] **Responsive Frontend**: Next.js app with high-end dashboard UI using Tailwind CSS and Framer Motion.
- [x] **Seed Data**: Automated mock data injection for testing.

## Recent Changes

### 1. Dynamic Allocation Engine
We moved away from a static 50/30/20 rule. The engine now:
- Scans all active user goals.
- Calculates the remaining amount and months for each goal.
- Determines the required monthly savings.
- Re-allocates funds by prioritizing "Savings" and reducing "Wants" (and "Needs" if necessary) to meet the targets.

### 2. Proactive AI CA
The chat bot is no longer just a placeholder. When asked about "budget" or "goals", it:
- Calculates current utilization percentages.
- Provides warnings if "Wants" spending is nearing its limit.
- Gives specific advice on how much to save monthly to reach a goal by a specific date.
- Suggests investment strategies based on the user's risk profile.

## Next Steps

### Phase 2: AI & External Integrations
1. **Gemini Pro Integration**: Replace the rule-based chat logic with a RAG-based LLM system using the actual database context.
2. **Transaction categorization**: Use the LLM to classify raw transaction descriptions into "Needs", "Wants", or "Savings" automatically.

### Phase 3: Financial Gamification
1. **Streak system**: Reward users for staying under budget for consecutive days/weeks.
2. **Visual upgrades**: Add more interactive charts (e.g., using Recharts) for spending over time.

### Phase 4: Core Features
1. **User Authentication**: Implement JWT-based auth with personalized profiles.
2. **Mobile Optimization**: Ensure the dashboard is fully functional on mobile devices with a collapsed ChatBot UI.

### Phase 5: Deployment
1. [x] **Deployment Guide**: Created detailed production rollout plan.
2. [x] **Docker Integration**: Added Dockerfiles and Docker Compose for easy deployment.
3. [ ] **PostgreSQL Migration**: Move from SQLite to a managed database like Supabase or Neon.
4. [ ] **Vercel/Render Hosting**: Deploy the live app to production endpoints.

---
> [!TIP]
> Use the [deployment_guide.md](file:///d:/CA%20bot/deployment_guide.md) to start your production rollout!
