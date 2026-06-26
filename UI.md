# UI & UX Design Blueprint

## Pages

### Citizen Flow
1. **`/` (Landing Page)**: Call to action: "Report an Issue".
2. **`/report`**: 
   - **Step 1**: Camera/Upload component.
   - **Step 2**: Location confirmation (Map picker).
   - **Step 3**: "AI Processing" loading state (Show sequential agent animations: "Vision Agent analyzing..." -> "Context Agent mapping..." -> "Generating Report").
   - **Step 4**: Success screen with the generated AI summary.
3. **`/feed`**: Public feed of nearby issues to allow Community Validation (upvoting).

### Admin Flow
1. **`/admin` (Dashboard)**:
   - **Left Sidebar**: Navigation (Dashboard, Reports, Analytics).
   - **Top Row**: KPI Cards (Total Issues, Critical Priority, Resolved).
   - **Main Content**: Split view.
     - **Left**: Google Maps Component with heatmap/pins.
     - **Right**: Priority Queue (List of issues sorted by `priority.score`).
   - **Issue Detail Modal**: Clicking a pin opens a modal showing the full AI-generated intelligence report.

## Components (shadcn/ui)
- `Button`, `Card`, `Dialog` (Modals), `Badge` (for Severity tags), `Progress` (for Priority scores), `Toast` (for notifications).

## Loading Animations
- Crucial for the "Agentic" feel. When processing, we will display a terminal-like or step-by-step progress UI indicating the agents are working sequentially, even though it's a single API call under the hood.
