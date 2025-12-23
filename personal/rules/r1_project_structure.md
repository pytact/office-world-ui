# R1 — Project Structure  
### UI Project Initialization and Architecture Rules  
**Version:** Updated  

## Purpose  
When a user starts a new UI project, collect all essential project requirements using a structured questionnaire. Based on the user’s answers, generate a complete, ready-to-use project structure with correct configurations, dependencies, and boilerplate code following professional standards.

The goal of this rule is to ensure:  
- Zero assumptions  
- Strict adherence to questionnaire  
- Accurate project scaffolding  
- Enterprise-grade folder structure  
- Smooth integration with subsequent rule files (R2, R3, etc.)  

---

## ⚠️ **CRITICAL DIRECTIVE — ALWAYS ASK QUESTIONS FIRST**  
Never assume or infer the following:  
- Framework  
- Language  
- Styling choice  
- Authentication  
- API usage  
- State management  
- UI library  
- Build tool  
- Routing approach  

Do **not** assume based on:  
- Examples in rule files  
- Any files the user provides  
- Past project context  
- Defaults  
- User’s skill level  
- Requirement wording  

The system must strictly follow the questionnaire **before generating anything**.

---

# Initialization Questionnaire (Ask in exact order)

## 1. Framework Selection  
**Question:** Which frontend framework would you like to use?  
Options:  
- React (with Next.js)  
- React (with Vite)  
- Vue.js  
- Angular  
- Svelte  
- Other (specify)

## 2. Language  
**Question:** Which language do you want to use?  
- TypeScript  
- JavaScript  

## 3. Project Type  
**Question:** Is this an API-based project?  
- Yes  
- No  

### If Yes (API Project)  
Ask:  
- What is your API base URL?  
- Which HTTP client do you prefer?  
  - Axios  
  - Fetch API  
  - React Query (Fetch)

### If No (Design Project)  
Ask:  
Is this a personal/design project?  
- Yes  
- No  

**Rules for design projects:**  
- Do not create HTTP client  
- Do not create service layer  
- Do not create API types  
- Do create design tokens  
- Do create layout components  

---

## 4. Authentication  
**Question:** Which authentication method do you want?  
- Auth0  
- Firebase Auth  
- JWT  
- OAuth2  
- Custom  
- No authentication  

## 5. State Management  
Options:  
- React Query + Context  
- Redux Toolkit  
- Zustand  
- Jotai  
- Recoil  
- React Context  

## 6. Styling  
Options:  
- Tailwind CSS  
- CSS Modules  
- Styled Components  
- Emotion  
- Material-UI  
- Chakra UI  
- Ant Design  
- Plain CSS or SCSS  

## 7. Form Handling  
Options:  
- React Hook Form + Zod  
- Formik + Yup  
- React Hook Form + Yup  
- Plain React State  

## 8. UI Component Library  
Options:  
- shadcn/ui  
- Material-UI  
- Chakra UI  
- Ant Design  
- Headless UI  
- Radix UI  
- Custom components only  

## 9. Routing  
Options:  
- Next.js App Router  
- React Router  
- TanStack Router  
- File-based routing (Next.js default)  

## 10. Build Tool (If not using Next.js)  
- Vite  
- CRA  
- Webpack  
- Parcel  

## 11. Package Manager  
- npm  
- yarn  
- pnpm  
- bun  

## 12. Testing Framework  
- Vitest + RTL  
- Jest + RTL  
- Playwright  
- Cypress  
- No testing  

## 13. Additional Features  
Ask if needed:  
- Dark mode  
- i18n  
- PWA support  
- Storybook  
- ESLint + Prettier  
- Husky  
- Docker  

## 14. Project Name  
**Question:** What is your project name?  

---

# Folder Structure Schema  

```
{project-name}/
├── app/
│   ├── (auth)/ 
│   ├── api/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── containers/
│   │   ├── hooks/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── reconnaissance/
│   ├── settings/
│   ├── tests/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/               # Generic UI components
│   ├── common/           # Reusable common components
│   └── layout/           # Global layouts
│
├── services/             # API service functions
│
├── validations/          # Zod schemas
│
├── containers/           # Global containers (rare)
│
├── contexts/             # Global contexts
│
├── hooks/                # Global hooks
│
├── types/
│
├── utils/
│
├── constants/
│
├── public/
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md

```

---

# Naming Conventions  
| Category | Pattern | Example |  
|---------|---------|---------|  
| Services | services/{name}.ts | services/user.ts |  
| API Queries | lib/{name}ApiQuery.ts | lib/userApiQuery.ts |  
| Components | components/{Feature}/{Component}.tsx | components/users/UserCard.tsx |  
| Hooks | hooks/use{Name}.tsx | hooks/useAuth.tsx |  
| Request Types | utils/types/requests/{name}.ts | utils/types/requests/user.ts |  
| Response Types | utils/types/responses/{name}.ts | utils/types/responses/user.ts |  
| Contexts | contexts/{Context}.tsx | contexts/auth.tsx |  

---

# API-based Project Example  

```
my-project/
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── .env.example
└── app/
    ├── components/
    ├── lib/
    ├── services/
    ├── hooks/
    ├── contexts/
    └── utils/
```

---

# Design-Based Project Example  

```
my-project/
├── package.json
├── tsconfig.json
├── next.config.mjs
└── app/
    ├── components/
    │   ├── common/
    │   └── layout/
    ├── lib/
    │   ├── design-tokens.ts
    └── hooks/
```

---

# Configuration Files Generated  
- package.json  
- tsconfig.json  
- next.config.mjs  
- postcss.config.mjs  
- tailwind.config.ts  
- .eslintrc.json  
- .prettierrc  
- .env.example  
- .env.local  

---

# Dependency Installation  

```
cd {project-name}
{package-manager} install
```

---

# Final Notes  
- Never assume any tech.  
- Always ask all questionnaire questions first.  
- Only generate after receiving full answers.  
- Follow exact folder, naming, and config rules.  
- Skip API layers for design-only projects.  