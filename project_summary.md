# ACM IIIT Pune Website Migration - Executive Summary

This document summarizes the transition of the ACM IIIT Pune website from a static, hardcoded Next.js site to a fully dynamic, database-driven application hosted on cPanel.

## 🛠️ Key Changes & Features

| Feature | Before 🛑 | After ✅ |
| :--- | :--- | :--- |
| **Data Source** | Hardcoded JSON/TS files | **Supabase Database** (PostgreSQL) |
| **Management** | Developer required (Code edits) | **Admin Panel** (GUI for non-coders) |
| **Images** | Local folder (`public/team`) | **Supabase Storage** (CDN Cloud) |
| **Performance** | Basic Client Fetching | **Smart Caching** (Instant Navigation) |
| **Hosting** | Netlify/Vercel oriented | **cPanel/Apache Optimized** |

---

## 🐛 Challenges & Solutions

### 1. Static Hosting Compatibility (404 Errors)
*   **The Issue**: The hosting provider (Apache/LiteSpeed) did not support "clean URLs" out of the box. Visiting `/admin` or `/events/view` resulted in **404 Not Found** because the server looked for a file named `admin` instead of `admin.html`.
*   **The Fix**:
    1.  Enabled `trailingSlash: true` in `next.config.ts`. This forces the build to create folders (`admin/index.html`) which servers handle natively.
    2.  Added a `.htaccess` file to `public/` to properly route valid requests and handle 404s.
    3.  Updated all internal links (e.g., `window.location.href`) to include the trailing slash (`/events/view/`).

### 2. "Zombie Files" & Mixed Content
*   **The Issue**: After changing the build output structure, old files (like `view.html`) lingered on the server alongside new folders (`view/`), causing conflicts and "Page Not Found" errors even when the URL looked correct.
*   **The Fix**: Performed a **"Clean Slate" Upload**. We strictly mandated deleting the old `admin`, `events`, and `out` folders on the server before uploading the new build to ensure no stale files remained.

### 3. Performance Bottlenecks (Loading States)
*   **The Issue**: Since we moved to Client-Side Rendering (CSR) for static hosting compatibility, every page navigation initially triggered a loading spinner while fetching data, making the site feel slow.
*   **The Fix**: Implemented a **Custom In-Memory Cache**.
    *   First visit: Fetches from database (0.5s).
    *   Subsequent visits: Loads instantly from memory (0ms).
    *   Added a branded **"Tech Orbit" Loading Animation** to make the initial wait feel polished and intentional.

### 4. Admin Security & Validation
*   **The Issue**: We needed a secure way to manage content without a backend server logic (Node.js).
*   **The Fix**:
    *   Used **Supabase Auth** with Row Level Security (RLS).
    *   The database *itself* rejects unauthorized writes, so the static frontend is safe even if code is inspected.
    *   Added strict input validation (dates, image checks) in the Admin UI to prevent bad data entry.

### 5. Dynamic Content Scalability
*   **The Issue**: Adding a new "FAQ" or "Team Member" required code changes.
*   **The Fix**:
    *   Created `team_members`, `about_info`, and `membership_faqs` tables.
    *   Built a **Tabbed Admin Dashboard** to manage all these assets in one place.
    *   The frontend now loops through whatever is in the database, meaning the site scales infinitely without developer intervention.

---

## 🔒 Security Posture
*   **Secrets**: No sensitive keys (`SERVICE_ROLE`) are exposed in the code.
*   **Public Access**: Only the `ANON_KEY` is public, which is safe and restricted by strict RLS policies.
*   **Data Integrity**: Use of UUIDs and strong typing prevents common ID enumeration attacks.

## 🚀 Deployment Status
The site is **Production Ready**.
*   Build Command: `sudo npm run build`
*   Output Directory: `out/`
*   Hosting Requirement: Any static host (Apache/Nginx/cPanel) with the provided `.htaccess`.
