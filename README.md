# Financely — Personal Finance Dashboard

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v13-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Redux_Toolkit](https://img.shields.io/badge/Redux_Toolkit-v2-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

**Financely** is a modern, high-performance personal finance dashboard web application built with **React 19**, **Vite**, **Tailwind CSS v4**, **Redux Toolkit**, and **Firebase (Auth & Cloud Firestore)**. It empowers users to monitor their income, expenses, cash flow, and overall financial balance in real time, complete with interactive charts, smart CSV import/export capabilities, and atomic UI design.

> 📖 **Looking for the in-depth technical walkthrough?**  
> Check out the complete [System Architecture & Workflow Breakdown](./ARCHITECTURE.md), covering the application lifecycle, Firebase session management, router lazy loading, and data synchronization.

---

## Key Features & Functionality

### 1. Financial Health Overview & Aggregations
* **Live Net Balance:** Instant calculation of net account balance across all historical transactions with Indian Rupee (INR ₹) formatting.
* **Income & Expense Summaries:** Dedicated metric cards displaying total income and total expense for the selected period.
* **Real-Time Synchronized State:** Any addition, modification, deletion, or bulk import updates overall balances and chart visualizations immediately.

### 2. Interactive Charts & Analytics
* **Cash Flow Area Chart:** Time-series area chart tracking daily income vs. expense trends powered by **Recharts**, with interactive tooltips and compact currency formatting.
* **Category Distribution Donut/Pie Chart:** Visual breakdown of expenses by category (e.g., Food, Rent, Utilities, Entertainment, Health) highlighting top spending areas.
* **Dynamic Date Range Filtering:**
  * Preset filters: *All Time*, *This Month*, *Last Month*, *Last 30 Days*, and *Year to Date*.
  * **Custom Date Range Modal:** Granular date selection with Quick Pick (Year & Month) and calendar date pickers.

### 3. Full Transaction Lifecycle (CRUD)
* **Add & Edit Transactions:** Modal form with live INR input formatting, category picker, date picker, payment method selector, and optional notes.
* **Payment Methods:** Full support for Card, Cash, Bank Transfer / UPI, Online Payment, and Paper Money.
* **Safe Deletion:** Modal confirmation safeguarding against accidental record deletion.
* **Client-Side Validation:** Validates required fields, positive amounts, and standardized date formats before communicating with Firestore.

### 4. Advanced Transaction Table
* **Instant Multi-Field Search:** Real-time search across transaction names, notes, and category tags without page reloads.
* **Multi-Criteria Filtering:** Simultaneous filtering by transaction type (*All*, *Income*, *Expense*) and payment method.
* **Bi-Directional Sorting:** Sort table records ascending or descending by Date and Amount.
* **Pagination:** Clean, 5-row paginated table with smooth page transitions and total count indicators.

### 5. Smart CSV Engine
* **Export to CSV:** Exports currently filtered transactions to a timestamped CSV file with formatted columns.
* **Flexible CSV Import:**
  * **Add & Merge Mode:** Uploads new transactions while skipping duplicate records based on composite unique hashing.
  * **Replace All Mode:** Safely clears historical records and populates new ones.
  * **Robust Date & Column Normalization:** Automatically recognizes diverse date formats (ISO, delimited, epoch, Excel serial numbers, and 8-digit `YYYYMMDD`) and handles variations in CSV header names (e.g., `amount`, `price`, `cost`, `cr`, `dr`).
  * **Chunked Batch Processing:** Writes imports in batches of <=400 documents to respect Firestore's 500-operation limit.

### 6. Authentication & Session Security
* **Dual Login Options:** Email & Password authentication and Google One-Click Popup authentication.
* **7-Day Session Expiry:** Server-issued authentication timestamp check (`auth_time`) that automatically signs out stale sessions after 7 days.
* **Route Protection:** Seamless separation of protected dashboard routes and guest-only authentication pages.
* **Password Reset:** Built-in password recovery emailing workflow.

### 7. Modern UI/UX & Design System
* **Atomic Design Structure:** Components structured systematically into Atoms (`Button`, `Input`, `Label`), Molecules (`FormField`, `Modal`), and Organisms (`Card`, `Navbar`, `Footer`).
* **Tailwind CSS v4 `@theme inline`:** Semantic CSS variable tokens configured for light mode and dark mode compatibility.
* **Sonner Toasts:** Sleek, non-intrusive toast notifications for success and error feedback.
* **Fully Responsive:** Fluid layout adapting from mobile screens to wide desktop monitors.

---

## Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework & Build** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) | High-speed build tooling and modern React features |
| **Routing** | [React Router v7](https://reactrouter.com/) | Client-side routing with `createBrowserRouter` & route guards |
| **State Management** | [Redux Toolkit (RTK) 2](https://redux-toolkit.js.org/) + [React-Redux 9](https://react-redux.js.org/) | Predictable global store with slices and memoized selectors |
| **Backend & Database**| [Firebase v13](https://firebase.google.com/) | Cloud Firestore (NoSQL database) & Firebase Authentication |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS using CSS variables theme tokens |
| **Visualizations** | [Recharts 3](https://recharts.org/) | Composable SVG-based chart library |
| **CSV Parsing** | [PapaParse 5](https://www.papaparse.com/) | Fast in-browser CSV parsing and unparsing |
| **Notifications** | [Sonner 2](https://sonner.emilkowal.ski/) | Toast notification manager |
| **CSS Utilities** | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Dynamic className composition and conflict resolution |

---

## Project Structure

```text
personal-finance_dashbord/
├── public/                     # Static assets 
├── src/
│   ├── components/             # Domain-specific feature components
│   │   ├── charts/             # IncomeBarChart, ExpencePieChart, CustomDateRangeModal
│   │   ├── status/             # Balance, Income, Expence summary cards & StatusForm
│   │   └── transaction/        # TransactionTable, SearchBar, Filter, ImportModal, DeleteModal
│   ├── features/               # Redux state slices & selectors
│   │   ├── auth/               # authSlice.js, authSelector.js
│   │   └── transaction/        # transactionSlice.js, transactionSelector.js
│   ├── hooks/                  # Custom hooks & domain services
│   │   ├── firebase.js         # Firebase Auth & Firestore client initialization
│   │   ├── transactionModel.js # Transaction schema validation & math aggregations
│   │   ├── transactionService.js# Cloud Firestore CRUD & chunked batch operations
│   │   ├── useLogin.js         # Email & Google login logic
│   │   ├── useRegister.js      # User registration & profile setup
│   │   ├── useForgotPass.js    # Password recovery email handler
│   │   ├── useTransactions.js  # Firestore fetch synchronization hook
│   │   └── useTable.js         # Table search, filter, sort & pagination controller
│   ├── pages/                  # Page route components (lazy loaded)
│   │   ├── Auth/               # SignInPage, SignUpPage, ForgotPasswordPage
│   │   ├── DashbordPage.jsx    # Primary dashboard layout
│   │   └── NotFoundPage.jsx    # 404 Error page
│   ├── routes/                 # Routing configuration & route guards
│   │   ├── Router.jsx          # createBrowserRouter, ProtectedRoute, GuestRoute
│   │   └── routes.js           # Route path constants
│   ├── shared/                 # Reusable cross-cutting modules
│   │   ├── auth/               # AuthInit.jsx (Session lifecycle listener)
│   │   ├── layout/             # AppLayout.jsx, AuthLayout.jsx
│   │   ├── ui/                 # Atomic design UI library
│   │   │   ├── atoms/          # Button, Input, Label
│   │   │   ├── molecules/      # FormField, Modal
│   │   │   ├── organisam/      # Card, Navbar, Footer
│   │   │   └── index.js        # Shared UI barrel export
│   │   └── utils/              # Helper utilities (cn, csv, validator, store, ErrorBoundry)
│   ├── App.jsx                 # App root (Redux Provider, Toaster, AuthInit)
│   ├── index.css               # Tailwind v4 theme & CSS variable declarations
│   └── main.jsx                # React DOM root entry point
├── .env.local                  # Firebase API credentials (git-ignored)
├── ARCHITECTURE.md             # In-depth system architecture & data flow breakdown
├── package.json                # Project dependencies and npm scripts
└── vite.config.js              # Vite configuration & path aliases (@ -> src)
```

---

## Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* A **Firebase Project** with **Authentication** (Email/Password and Google providers enabled) and **Cloud Firestore** created in Test or Production mode.

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd personal-finance_dashbord
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Firestore Security Rules
Ensure Firestore security rules permit authenticated users to read and write their own documents:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 4. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## How It Works (High-Level Overview)

1. **Bootstrapping:** `main.jsx` mounts `App.jsx`, initializing the Redux Store and Sonner Toast notifications.
2. **Session Verification:** `AuthInit.jsx` invokes `watchAuthState()`. Firebase evaluates user credentials and checks whether the session is under the 7-day limit.
3. **Route Resolution:** `Router.jsx` validates whether the user is authorized. Protected routes render inside `AppLayout`, displaying `Navbar`, `DashboardPage`, and `Footer`.
4. **Data Sync:** When `DashboardPage` mounts, `useTransactions()` fetches transactions from `users/{userId}/transactions` in Firestore, computes aggregated metrics, and populates the Redux store.
5. **Interactive UI:** The user can query, sort, paginate, export to CSV, or launch the transaction modal to record new financial activities with instantaneous state updates.

For a full technical breakdown of every hook, slice, and data sequence, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## License
Private / Proprietary. Developed for personal finance tracking.
