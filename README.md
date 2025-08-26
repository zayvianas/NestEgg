# 💸 NestEgg – Your Financial Flow, Finally in Focus

**NestEgg** is an intelligent personal finance management app designed to help users track income, organize bills, monitor debt, and gain weekly financial clarity — without needing spreadsheets or guesswork.

Built and maintained by **Zayviana Singletary**, NestEgg is more than a budgeting tool — it's a full-stack product demonstrating modern SDLC practices, database planning, scalable architecture, and future-ready AI integration.

---

## 🧭 Why I Built NestEgg

Like many people navigating changing pay cycles and multiple bills, I wanted a system that could:
- Tell me **what to pay and when**, based on **real weekly income**
- Help me manage everything from **credit cards** to **Klarna/Affirm** to **subscriptions**
- Recommend **smart financial actions** based on what's due and what I earned

So I created **NestEgg** — a financial app that makes your income and obligations work together, not against each other.

---

## 🌱 MVP Scope (v1.0)

- [x] Add & manage recurring bills (subscriptions, rent, car note, etc.)
- [x] Track weekly/biweekly income
- [x] Organize bills by upcoming weeks
- [x] Smart suggestions for what to pay before next paycheck
- [x] View total debt, total income, and weekly cash flow
- [x] SQLite database for local storage and fast development
- [x] React-based frontend with CRUD forms and custom views

---

## 🚀 Roadmap / Vision

> *(This roadmap includes protected original ideas. Please credit and do not replicate without permission.)*

### 🧠 Coming Soon
- [ ] **Nessa**, the NestEgg AI assistant:
  - Answers budgeting questions
  - Gives friendly reminders
  - Helps explain finances to users in plain language
- [ ] Switch backend database from SQLite → **PostgreSQL** for production scalability
- [ ] Add Apple Push Notifications (e.g., “Pay Before Friday” reminders)
- [ ] Household/Family Budget Mode (shared account view)
- [ ] Weekly dashboard with calendar-style overview
- [ ] Paycheck calculator (based on hourly wage and hours)
- [ ] Visual graphs of spending, savings, and progress toward goals
- [ ] One-click export to PDF or CSV
- [ ] User authentication and saved account profiles

---

## 🛠️ Tech Stack

| Layer       | Tools & Frameworks                           |
|-------------|----------------------------------------------|
| **Frontend**| React, JSX, CSS (custom + optional Tailwind) |
| **Backend** | Node.js, Express                             |
| **Database**| SQLite (v1) → PostgreSQL (v2 planned)         |
| **State**   | React Hooks (`useState`, `useEffect`)        |
| **Version Control** | Git (SSH) + GitHub                   |

---

## 📁 Project SDLC Phases

| Phase         | Summary                                                                 |
|---------------|-------------------------------------------------------------------------|
| **Initiation**| Problem: No weekly-focused budget planner that adapts to real pay dates |
| **Planning**  | Outlined feature list, tech stack, folder structure, MVP timeline       |
| **Design**    | Designed schema, sketched flow between paychecks, bills, and decisions  |
| **Development**| Built UI forms, set up Express API, connected to SQLite                |
| **Testing**   | Debugged CRUD issues, bill rollovers, income changes, UI behaviors      |
| **Deployment**| GitHub repo initialized with full history and future release planning   |
| **Maintenance**| README + GitHub issues used to log bugs and upcoming features          |

---

## 🧪 How to Run This Project

```bash
# Clone the repo
git clone git@github.com:zayvianas/NestEgg.git
cd NestEgg

# Install dependencies
npm install

# Start development server
npm start
