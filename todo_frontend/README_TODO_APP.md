Things Todo - Ocean Professional

Features
- Supabase email/password authentication
- User-scoped todo CRUD (create, edit, toggle complete, delete)
- Ocean Professional styling: blue primary, amber accents, subtle gradients, soft shadows, rounded corners
- Accessible, single-column layout

Setup
1) Copy .env.example to .env and set:
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_KEY
2) Configure the 'todos' table and RLS as described in SUPABASE.md.
3) Install dependencies: npm install
4) Run the app: npm start

Notes
- Things Todo uses a Supabase client in src/services/supabaseClient.js.
- Auth view: src/components/AuthView.jsx
- Todo view and items: src/components/TodoView.jsx, TodoItem.jsx, TodoInput.jsx

Styling
- Core styles in src/index.css
- Theme toggle available in header (light/dark).
