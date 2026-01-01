# IIITP ACM SIGCHI Student Chapter Website 🚀

This is the official dynamic website for the IIITP ACM SIGCHI Student Chapter, built with Next.js and powered by Supabase.

---

## ✨ Features

*   **Dynamic Events**: Add, edit, and remove events instantly via the Admin Panel.
*   **Team Management**: Update team members, roles, and profile pictures dynamically.
*   **Managed Content**: Change "About Us" text and "Membership" headings without code.
*   **Static & Fast**: Designed for static hosting (cPanel/Apache) with `output: 'export'`.
*   **Smart Caching**: In-memory caching ensures instant navigation while minimizing database API calls.
*   **Secure**: Protected by Supabase Row Level Security (RLS) policies.

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js 15 (React 19), TailwindCSS, Lucide Icons.
*   **Database**: Supabase (PostgreSQL) for Events, Team, FAQs, and Site Config.
*   **Storage**: Supabase Storage for managing images.
*   **Hosting**: Any Static Host (e.g., A2 Hosting, Hostinger, GitHub Pages) via Apache/LiteSpeed.

---

## 🚀 Getting Started

### 1. Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Configuration (`src/lib/supabaseConfig.ts`)

Ensure your Supabase keys are correctly set in `src/lib/supabaseConfig.ts`.
*   `SUPABASE_URL`: Your project URL.
*   `SUPABASE_ANON_KEY`: Your public API key (safe for client-side use).

### 3. Database Schema

The site relies on 4 main tables in Supabase:
1.  **`events`**: Stores event details, dates, and gallery links.
2.  **`team_members`**: Stores team profiles, roles, and ordering (`order_index`).
3.  **`membership_faqs`**: Stores FAQ questions, answers, and links.
4.  **`about_info`**: Stores the "About Description" and "Membership Heading".

> **Note**: Row Level Security (RLS) is enabled to allow *Public Read* access but *Authenticated Write* access only.

---

## 🛡️ Admin Panel

Access the dashboard at: http://localhost:3000/admin

*   **Login**: Uses Supabase Auth (Email/Password).
*   **Capabilities**:
    *   **Events Tab**: Create upcoming events, mark past events, upload covers.
    *   **Team Tab**: Add members, upload photos, reorder them manually.
    *   **About Tab**: Edit section titles and descriptions.
    *   **FAQs Tab**: Manage common questions and add external links.

---

## 📦 Deployment (Static Export)

This project is configured for **Static Export** (`output: 'export'` in `next.config.ts`).

### Step 1: Build
```bash
sudo npm run build
```
This generates an `out` folder containing all HTML/CSS/JS files.

### Step 2: Deploy to cPanel/Hosting
1.  **Clean Upload**: Delete old defaults (`public_html` contents).
2.  **Upload**: Upload the **contents** of the `out` folder to `public_html`.
3.  **Important**: Ensure the `.htaccess` file (located in `public/`) is included. It handles:
    *   Clean URLs (e.g., `/admin` instead of `/admin.html`).
    *   404 Redirections.

> **Why Trailing Slash?**
> We use `trailingSlash: true` so Next.js creates folders (`events/view/index.html`) instead of files. This is most compatible with standard web servers.

---

## 🤝 Contributing

1.  Fork the repo.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit changes (`git commit -m 'Add AmazingFeature'`).
4.  Push to branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---
&copy; 2026 ACM IIIT Pune. All rights reserved.
