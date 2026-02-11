# Bishoujo Figure Collection Manager

A web application for managing bishoujo figure reservations and purchases with a 12-month timeline view. Built with Next.js 16, Supabase, and shadcn/ui. Designed to be embedded in a React Native WebView for mobile app usage.

---

## Features

### User Features

- **12-Month Calendar Timeline** - View all reserved/purchased figures across a full year at a glance
- **Grid / List View Toggle** - Switch between monthly grid view and flat list view
- **Search & Filter** - Search by name/manufacturer, filter by status (reserved/purchased/wishlist) and manufacturer
- **Figure Registration (Multi-step Flow)**
  1. `/calendar/add` - Search figures from the database using a Command palette
  2. Select multiple figures with edition badges (first edition, reprint, 2nd reprint, etc.)
  3. Fill in details per figure: status, payment type (deposit/full/partial), amount, date, shop
  4. Submit all at once
- **Figure Detail Sheet** - Click a figure card to view/update progress status
  - Timeline-style progress tracker: Deposit Paid > Full Payment > Shipped > Delivered
  - Inline amount editing (edit remaining balance, auto-updates total price)
- **Empty State** - Welcome message with blurred calendar background when no figures are registered
- **Mobile Search Page** - Dedicated `/search` page with filter sheet for mobile

### Admin Features

- **Figure Database Management** (`/admin/figures`)
  - Browse all registered figures with sidebar filters (series, manufacturer, category, scale, status)
  - Search figures, view in 2-column card grid
  - Right-side drawer for figure detail view and edit/delete actions
- **Figure Registration to DB** (`/admin/figures/add`)
  - Multi-figure registration form with progress overlay
  - Image uploader supporting both file upload and URL input
  - Drag-and-drop image reordering with thumbnail selection
  - Searchable list box for series and character (with create-new capability)
  - Hierarchical selection: series > character filtering
  - Registers figures via Supabase RPC (`register_figure`)
- **Master Data Management** (`/admin/master`)
  - CRUD for: Series, Characters, Manufacturers, Categories, Scales
  - Search + card grid layout with add/edit/delete dialogs

---

## Tech Stack

| Layer         | Technology                          |
| ------------- | ----------------------------------- |
| Framework     | Next.js 16 (App Router)             |
| UI            | shadcn/ui + Tailwind CSS v4         |
| Database      | Supabase (PostgreSQL + RPC)         |
| Language      | TypeScript                          |
| Font          | Geist / Geist Mono (Google Fonts)   |
| Deployment    | Vercel                              |
| Mobile        | React Native WebView (planned)      |

---

## Project Structure

\`\`\`
app/
  page.tsx                       # Home - 12-month calendar timeline
  search/
    page.tsx                     # Mobile search page with filters
  calendar/
    add/
      page.tsx                   # Multi-step figure registration flow
  admin/
    figures/
      page.tsx                   # Figure database browser (server)
      client.tsx                 # Figure database browser (client)
      add/
        page.tsx                 # Admin figure registration form
      actions.ts                 # Server actions (Supabase RPC calls)
    master/
      page.tsx                   # Master data CRUD

components/
  header.tsx                     # App header (sticky, responsive)
  bottom-nav.tsx                 # Mobile bottom navigation bar
  calendar-timeline.tsx          # 12-month grid/list view with filters
  figure-card.tsx                # Figure card for calendar grid
  figure-detail-sheet.tsx        # Figure detail + progress management (Sheet/Dialog)
  figure-details-form.tsx        # Registration detail form (radio-style selectors)
  empty-state.tsx                # Empty state with welcome message
  image-uploader.tsx             # Image upload + URL + drag reorder + thumbnail
  searchable-list-box.tsx        # Always-open searchable list with create-new

lib/
  figure-data.ts                 # Types and mock figure database
  supabase.ts                    # Supabase browser client
  supabase-server.ts             # Supabase server client
  utils.ts                       # Utility functions (cn)
\`\`\`

---

## Database Schema (Supabase)

### Tables

- `figure` - name, name_jp, name_en, manufacturer_id, series_id, category_id, scale_id, size, material, price_kr, price_jp, price_cn
- `figure_release` - figure_id, release_year, release_month, release_text, release_no, is_reissue
- `figure_images` - figure_id, image_url

### RPC Functions

- `register_figure` - Creates a figure record, release info, and image records in a single transaction

### Master Data Tables

- Series, Characters, Manufacturers, Categories, Scales

---

## Environment Variables

| Variable             | Description                       |
| -------------------- | --------------------------------- |
| `SUPABASE_URL`       | Supabase project URL (server)     |
| `SUPABASE_ANON_KEY`  | Supabase anonymous key (server)   |

---

## Mobile App Integration

This web app is designed to be loaded inside a React Native WebView.

- **Bottom navigation** is hidden in WebView (React Native provides its own navigation)
- **Safe area insets** are supported via `env(safe-area-inset-*)` CSS
- **Touch-optimized** - 44px minimum touch targets, active state feedback, momentum scrolling
- **Viewport locked** - No pinch-to-zoom, `viewport-fit: cover`
- **Overscroll disabled** - Prevents pull-to-refresh conflicts with native gestures

### Hiding Web Navigation in WebView

Pass `?platform=app` query parameter when loading the URL in React Native WebView to hide the web-side bottom navigation.

---

## Getting Started

\`\`\`bash
# Install dependencies
npx shadcn@latest init

# Set environment variables
# SUPABASE_URL and SUPABASE_ANON_KEY

# Run development server
npm run dev
\`\`\`

---

## Key UX Decisions

| Feature                  | Decision                                                                 |
| ------------------------ | ------------------------------------------------------------------------ |
| Figure registration      | Page-based flow (`/calendar/add`) instead of modal                       |
| Status/Payment selection | Radio card style instead of Select dropdowns                             |
| Series/Character input   | Always-open searchable list box with create-new support                  |
| Figure detail view       | Sheet (mobile) / Dialog (desktop) with timeline progress tracker         |
| Amount editing           | Inline edit with pencil icon (edit remaining balance, auto-calc total)   |
| Admin figure detail      | Right-side drawer (Supabase-inspired)                                    |
| Mobile navigation        | Bottom tab bar (hidden when in WebView)                                  |
