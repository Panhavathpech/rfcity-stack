# R&F City marketing site + admin portal

This repo now hosts both the public-facing marketing site (Vite + React) and a secure Next.js admin portal that stores contact submissions in InstantDB, sends Resend email alerts, and surfaces data in a login-protected dashboard that can expand into a CMS.

## Project layout

```
/src                Marketing site components (Vite)
/admin-portal       Next.js 16 App Router admin workspace
/admin-portal/db    InstantDB schema reference
```

## Requirements

- Node.js 18+
- InstantDB account (app id + admin token)
- Resend account (verified domain/sender)

## Environment variables

### Marketing site (`.env` generated from `.env.example`)

| Key | Description |
| --- | --- |
| `VITE_CONTACT_API` | Base URL of the admin API (e.g., `https://admin.example.com/api`). Defaults to `/api` for same-origin setups. |
| `VITE_SHOW_ADMIN_LINK` | `true` to expose the “Admin Portal” link in the navbar. |
| `VITE_ADMIN_PORTAL_URL` | URL that staff should visit to log into the admin portal. |

### Admin portal (`admin-portal/.env` generated from `.env.example`)

| Key | Description |
| --- | --- |
| `INSTANT_APP_ID` | InstantDB application id. |
| `INSTANT_ADMIN_TOKEN` | Admin token with access to the tables below. |
| `RESEND_API_KEY` | Resend API key for transactional email. |
| `SUPPORT_FROM_EMAIL` | Verified Resend sender (e.g., `admin@yourdomain.com`). |
| `CONTACT_ALERT_RECIPIENT` | Inbox that receives new contact notifications. |
| `NEXTAUTH_SECRET` | Random string for NextAuth JWT encryption. |
| `NEXTAUTH_URL` | Base URL for the portal (e.g., `http://localhost:3000`). |
| `PASSWORD_PEPPER` | Additional secret appended before hashing user passwords. |
| `CONTACT_ALLOWED_ORIGIN` | Origin allowed to POST to `/api/contact` (set to your marketing site domain in production, defaults to `*`). |
| `SITE_BASE_URL` | Base URL used inside transactional emails. |

## InstantDB setup

1. Create an app in the Instant dashboard and grab the `appId` + admin token.
2. Use the statements in `admin-portal/db/schema.sql` (or the Instant schema editor) to create:
   - `contacts` (captures marketing form submissions)
   - `users` (admin users w/ role + status)
   - `content_blocks` (future CMS content)
3. Seed the initial owner account directly in InstantDB:
   - Generate a password hash:  
     `node -e "const bcrypt = require('bcryptjs'); console.log(require('bcryptjs').hashSync(process.argv[1]+process.env.PASSWORD_PEPPER, 10))" "PlaintextPassword"`
   - Insert a row into `users` with role `owner`, status `active`, and the hash above.
4. Once the first owner exists you can invite additional admins via the UI.

## Resend configuration

- Verify the sending domain for `SUPPORT_FROM_EMAIL`.
- Optionally create a dedicated API key/segment for system mail.
- Emails sent today: contact alerts, invite emails, and password reset notifications.

## Running the apps locally

```bash
# Marketing site
npm install
npm run dev

# Admin portal
cd admin-portal
npm install
npm run dev
```

- The marketing site expects the admin API at `VITE_CONTACT_API` (defaults to `/api`).
- The Vite dev server proxies `/api/*` calls to `http://localhost:3000`, so keep the admin portal running while testing the form locally.

## Automated deployment (Option A)

### Landing page → `rfcity.twd.digital`

1. Host the repo on GitHub (or GitLab) with the default branch named `main`.
2. In your A2 Hosting cPanel account create an FTP/FTPS user that is scoped to `/public_html/rfcity`.
3. Add the following repository secrets so `.github/workflows/deploy-landing.yml` can log in:
   - `RFCITY_FTP_HOST` – e.g., `ftp.yourdomain.com`
   - `RFCITY_FTP_PORT` – optional, defaults to `21` (set to `21` or `990` for FTPS implicit)
   - `RFCITY_FTP_USER` / `RFCITY_FTP_PASS` – the credentials created in step 2
4. Push to `main`. The workflow will run `npm ci`, `npm run build`, and sync the contents of `dist/` to `/public_html/rfcity` using `SamKirkland/FTP-Deploy-Action`. Subsequent pushes only upload changed files thanks to the persisted state file.
5. (Optional) Trigger the workflow manually via the “Run workflow” button if you need an ad-hoc deploy.

### Admin portal → `admin.rfcity.twd.digital`

1. In cPanel open **Git Version Control**, click **Create**, and point the repository URL to this repo. Set the deployment path to the Node app root (e.g., `/home/hlyjphxp/nodeapps/rfcity-admin`).
2. In **Setup Node.js App** configure the app root to the same path and choose Node 20+. Passenger will now watch the repo directory.
3. Enable **Deploy HEAD** in the cPanel Git UI (or use the generated `post-receive` hook). Every push will now clone the latest commit into the deployment path.
4. The `.cpanel.yml` file added in this commit runs automatically after each deploy and:
   - Installs production dependencies with `npm ci --omit=dev`
   - Builds the Next.js app
   - Touches `tmp/restart.txt` so Passenger restarts the process
5. Set the required environment variables for the Node app via the cPanel interface (`NEXTAUTH_URL=https://admin.rfcity.twd.digital`, InstantDB credentials, Resend keys, etc.).
6. Push to `main` whenever you need to release admin changes—cPanel handles the rest.

## Admin portal workflows

- **Contacts:** Incoming marketing leads are stored in InstantDB and surfaced under `/contacts` with search/filter tooling.
- **Email alerts:** Every POST to `/api/contact` persists the record and triggers a Resend alert containing the submission details.
- **User management:** Owners invite teammates, reset passwords, and disable accounts under `/users`. Admins can adjust roles/status except for owner promotion.
- **CMS-ready content:** `/content` lists the `content_blocks` table so future editors can add/update website content. Editing controls are stubbed so we can layer a WYSIWYG + media manager later.

## Deploying / connecting the marketing form

1. Deploy the admin portal (Vercel or similar) with the env vars above.
2. Point `VITE_CONTACT_API` to the deployed API base (e.g., `https://admin.yourdomain.com/api`).
3. Set `CONTACT_ALLOWED_ORIGIN` to the exact origin of the marketing site (e.g., `https://www.yourdomain.com`) so the contact POST clears CORS.
4. Optionally add `VITE_SHOW_ADMIN_LINK=true` so internal users can jump straight to the dashboard from the site navbar.

## Roadmap notes

- The `content_blocks` API already exists as a read endpoint so the marketing site can fetch CMS data once editors begin updating content.
- When ready to add mutations, extend `app/api/content/route.ts` with POST/PATCH handlers using the same InstantDB helper functions and build a corresponding editor UI under `/content`.
