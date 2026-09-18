# 🔒 Secure Environment Variables & Git Workflow Guide (`ENV_SETUP.md`)

> **GovCheck Project Security & Onboarding Manual**  
> This guide explains how to secure API keys, database credentials, passwords, and private tokens using `.env`, `.env.example`, and `.gitignore`, ensuring confidential data is never leaked or pushed to GitHub.

---

## 📌 Table of Contents
1. [What is `.env`?](#a-what-is-env)
2. [What is `.env.example`?](#b-what-is-envexample)
3. [What is `.gitignore`?](#c-what-is-gitignore)
4. [Initial Setup for a New Developer](#d-initial-setup-for-a-new-developer)
5. [How to Push the Project to GitHub Safely](#5-how-to-push-the-project-to-github-safely)
6. [How to Verify That Secrets Were NOT Pushed](#6-how-to-verify-that-secrets-were-not-pushed)
7. [What If `.env` or Secrets Were Already Committed?](#7-what-if-env-or-secrets-were-already-committed)
8. [Team & Group Collaboration Workflow](#8-team--group-collaboration-workflow)
9. [Development vs. Production Environments](#9-development-vs-production-environments)
10. [Final Beginner-Friendly Checklist](#10-final-beginner-friendly-checklist)

---

## A. What is `.env`?

### 1. What is `.env`?
A **`.env`** (short for *environment*) file is a plain text configuration file stored in the root of your project. It holds key-value pairs representing application settings, connection strings, and secret credentials.

Example of a local `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=my_secret_database_password
GMAIL_USER=myemail@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

### 2. Why is it used?
In modern applications, source code should be **separated from configuration**. Different environments (your local laptop, a classmate's laptop, staging, and live production) require different settings (e.g., local database passwords vs. cloud database passwords). Storing configuration in `.env` makes the code portable and modular.

### 3. Why must API keys and passwords NEVER be hardcoded?
* **Security Risk:** Hardcoding passwords or API tokens directly into `.js`, `.ts`, `.php`, or `.html` files permanently embeds secrets in the code.
* **Public Scrapers:** Malicious bots continuously scan public GitHub repositories for database credentials, Gmail App Passwords, and API tokens within seconds of a commit.
* **Unauthorized Access & Financial Costs:** Leaked credentials can lead to database corruption, unauthorized spam emails sent from your account, or unexpected cloud provider charges.

### 4. Why should `.env` NEVER be uploaded to GitHub?
Because `.env` contains your actual, private secrets. Once pushed to a remote repository, anyone with read access to that repository (or anyone on the internet if public) can read all of your passwords.

---

## B. What is `.env.example`?

### 1. Why do we have `.env.example`?
When a new team member clones the project, their computer will not have a `.env` file (since `.env` is ignored by Git). Without knowing which variables the app expects, the project will fail to run.

**`.env.example`** acts as a **public blueprint or template**. It lists all the required variable names with empty or dummy placeholder values.

### 2. Example of `.env.example`:
```env
# Server Configuration
PORT=5000

# PostgreSQL Database Credentials
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_NAME=postgres

# Gmail 2FA OTP Service
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_char_google_app_password
EMAIL_FROM="GovCheck Official Portal" <your_email@gmail.com>

# Frontend Client URL
VITE_API_URL=http://localhost:5000/api
```

### 3. Why is `.env.example` safe to commit?
* `.env.example` contains **only placeholder names** (e.g., `your_postgres_password_here`).
* It contains **zero real passwords or private API tokens**.
* It can safely be committed and pushed to GitHub for everyone to see.

---

## C. What is `.gitignore`?

### 1. What does `.gitignore` do?
`.gitignore` is a special file that tells Git which files or directories to **ignore** and never track. Files matched by `.gitignore` will not show up in `git status` as untracked files and will never be included in commits.

### 2. How Git knows not to include `.env`
In our project's root `.gitignore`, we specify:

```gitignore
# 1. Environment & Secrets (CRITICAL - NEVER COMMIT REAL SECRETS TO GIT)
.env
.env.*
.env.local
.env.development.local
.env.test.local
.env.production.local
!.env.example
```

* `.env` & `.env.*`: Ignores all environment files.
* `!.env.example`: The exclamation point (`!`) is a whitelist exception that tells Git: *"Ignore all `.env` files, BUT keep tracking `.env.example`."*

---

## D. Initial Setup for a New Developer

Follow these steps when downloading or cloning the repository for the first time:

### Step 1: Clone the Repository
Open your terminal (PowerShell / Command Prompt / Git Bash) and run:

**On Windows (PowerShell / Command Prompt):**
```powershell
git clone https://github.com/jamestejares1-debug/Licensing-And-Business-Permit.git
cd Licensing-And-Business-Permit
```

**On Git Bash / macOS / Linux:**
```bash
git clone https://github.com/jamestejares1-debug/Licensing-And-Business-Permit.git
cd Licensing-And-Business-Permit
```

---

### Step 2: Create your Local `.env` File

#### 👉 Option 1: Using VS Code (Easiest)
1. Open the project in VS Code (`code .`).
2. In the file explorer on the left, right-click on `.env.example` and select **Copy**, then right-click in the root folder and select **Paste**.
3. Rename the copied file to exactly `.env`.
4. Open `.env` and replace all placeholder values with your real local database credentials and Google App Password.
5. Save the file (`Ctrl + S`).

#### 👉 Option 2: Using Command Line / Terminal

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**On macOS / Linux / Git Bash:**
```bash
cp .env.example .env
```

After copying, open `.env` in your code editor and fill in your actual credentials.

---

### Step 3: Install Dependencies & Run

```bash
# 1. Install & Start Backend
cd backend
npm install
npm run dev

# 2. Install & Start Frontend (in a new terminal window)
cd ../frontend
npm install
npm run dev
```

---

## 5. How to Push the Project to GitHub Safely

Follow this step-by-step checklist every time you commit and push code:

### Step 1 — Check Git Status
```bash
git status
```
* **What to look for:** Look under `Untracked files:` or `Changes not staged for commit:`.  
* **Verification:** Verify that `.env` is **NOT** listed. Only `.env.example` (if updated), `.gitignore`, and your code files should appear.

---

### Step 2 — Verify `.env` is Ignored
Run this command to check all files currently being ignored by Git:
```bash
git status --ignored
```
* **What to look for:** You should see `.env` listed under `Ignored files:`. This confirms Git is actively ignoring it.

---

### Step 3 — Review Changes Before Staging
```bash
git diff
```
* Inspect line-by-line changes.
* Ensure no hardcoded passwords, tokens, or personal emails were accidentally written into `.ts`, `.tsx`, `.js`, or `.json` files.

---

### Step 4 — Stage Files and Double-Check Staged Content
```bash
git add .
```
> ⚠️ **Never blindly commit after `git add .` without checking!**

Run:
```bash
git status
```
and:
```bash
git diff --cached
```
* **`git diff --cached`** displays the exact changes staged for commit.
* Confirm that no secret keys or passwords appear in the staged diff.

---

### Step 5 — Commit
```bash
git commit -m "Configure environment variables securely"
```

---

### Step 6 — Push to GitHub
```bash
git push origin main
```
*(Note: Replace `main` with your active branch name if working on a feature branch, e.g., `git push origin feature-branch`).*

---

## 6. How to Verify That Secrets Were NOT Pushed

To be 100% confident that `.env` is safe on your machine and not on GitHub:

### 1. Check Git Index for `.env`
Run:
```bash
git ls-files .env
```
* **Expected Result:** The output must be **completely blank**.
* If nothing is printed, it means Git has never indexed or tracked `.env`.

### 2. Search for Accidentally Staged Secrets
Run:
```bash
git ls-files | grep -i "\.env$"
```
*(On Windows PowerShell: `git ls-files | Select-String "\.env$"`)*
* Only `.env.example` should appear. Real `.env` must not appear.

---

## 7. What If `.env` or Secrets Were Already Committed?

If someone in your group accidentally committed a `.env` file or hardcoded credentials in a previous commit:

### ⚠️ Critical Rule: Adding to `.gitignore` is NOT enough!
If a file was already tracked in Git history, simply adding it to `.gitignore` will **NOT** remove it from Git tracking.

### Step 1: Remove `.env` from Git tracking (without deleting your local file)
Run:
```bash
git rm --cached .env
git add .gitignore
git commit -m "Stop tracking .env file"
git push origin main
```
* The `--cached` flag tells Git to stop tracking the file and remove it from GitHub, while keeping your local `.env` intact on your computer.

### Step 2: Immediate Credential Invalidation & Rotation (MANDATORY)
> 🚨 **IMPORTANT:** Removing a secret from the latest commit does NOT erase it from Git commit history. If an API key or password was pushed to a public or shared GitHub repo:
> 1. Consider that credential **compromised immediately**.
> 2. Go to the provider (e.g., Google Account Security, PostgreSQL, Brevo, Firebase) and **revoke/delete the compromised key/password**.
> 3. Generate a brand new credential.
> 4. Put the new credential into your private local `.env`.

### Step 3: Git History Purge (If Necessary)
If full history cleaning is required for high-risk corporate keys, specialized tools like `git-filter-repo` or BFG Repo-Cleaner are used to rewrite history. Consult your team lead before rewriting shared Git branch history.

---

## 8. Team & Group Collaboration Workflow

When working in a team or university group:

1. **Local `.env` for Each Member:** Every developer creates their own `.env` file on their own machine with their own local settings.
2. **Never Send Secrets via Chat:** Never share `.env` files or API secrets through Discord, Facebook Messenger, Slack, or GitHub issues. Use secure password managers (e.g., Bitwarden, 1Password, KeePass) if credentials need to be shared.
3. **Adding a New Environment Variable:**
   * If **Developer A** adds a new variable `SMS_GATEWAY_KEY`:
     1. Developer A adds `SMS_GATEWAY_KEY=real_secret_value` to their local `.env`.
     2. Developer A opens `.env.example` and adds:
        ```env
        SMS_GATEWAY_KEY=your_sms_gateway_api_key
        ```
     3. Developer A commits and pushes `.env.example`.
     4. Other team members pull the latest code, check `.env.example`, and add `SMS_GATEWAY_KEY=` to their local `.env`.

---

## 9. Development vs. Production Environments

| Environment | Where it runs | How Environment Variables are Handled |
| :--- | :--- | :--- |
| **Local Development** | Your laptop / PC | Stored in local `.env` file (loaded by `dotenv` / Vite). |
| **Local XAMPP / Postgres** | Local services | Set in `.env` (e.g., `DB_HOST=localhost`, `DB_PORT=5432`). |
| **Docker Compose** | Docker containers | Passed via `compose.yaml` or `.env` file locally. |
| **Production / Cloud** | Vercel / Render / Railway / AWS / VPS | Entered securely in the hosting provider's **Environment Variables Dashboard**. No `.env` file is uploaded. |

---

## 10. Final Beginner-Friendly Checklist

Before finalizing your work, verify each item:

- [ ] `.env` exists locally on your machine.
- [ ] `.env` contains your actual local configuration and secrets.
- [ ] `.env` and `.env.*` are listed in `.gitignore`.
- [ ] `git ls-files .env` returns completely empty output (confirming `.env` is NOT tracked).
- [ ] `.env.example` exists in the repository root.
- [ ] `.env.example` contains **only dummy placeholders** and **no real secrets**.
- [ ] Backend application successfully reads `process.env` variables.
- [ ] Frontend successfully accesses `import.meta.env` variables.
- [ ] Database connection and API services function properly.
- [ ] `git status` and `git diff --cached` were checked before committing.
- [ ] No hardcoded passwords, tokens, or personal emails are in the committed code.
- [ ] Repository is safely committed and pushed to GitHub.
