# ⚡ RunSurge-UI

> A user-friendly web interface for submitting and managing jobs in the RunSurge distributed execution platform.

RunSurge-UI is a modern web application built with **Next.js**, styled using **Tailwind CSS**, and secured via **JWT authentication**. It provides an intuitive interface for users to manage job submissions and monitor progress.

---

## ✨ Features

- 🎯 **Simple/Complex Job Submission** – Easily submit and track compute jobs.
- 👤 **User Dashboard** – Monitor job status and view account balance.
- 🔐 **Authentication** – Secure login/signup with JWT and bcryptjs.
- 📱 **Responsive UI** – Built with Tailwind CSS for mobile-friendly design.

---

## 📦 Prerequisites

Make sure the following are installed:

- **Node.js** v18+ → [nodejs.org](https://nodejs.org/)
- **Git** → [git-scm.com](https://git-scm.com/)
- Code Editor (recommended: [VS Code](https://code.visualstudio.com/))

Verify installations:

```bash
node -v
npm -v
```

---

## 🚀 Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Run-Surge/RunSurge-UI.git
cd RunSurge-UI
```

### 2. Install Dependencies

Navigate into `src/` and install required packages:

```bash
cd src
npm install
```

This installs:
- Core: `next`, `react`, `react-dom`, `jsonwebtoken`, `bcryptjs`, `js-cookie`, `react-hot-toast`
- Dev: `tailwindcss`, `autoprefixer`, `postcss`, `eslint`, `eslint-config-next`

### 3. Run the Dev Server

```bash
npm run dev
```

Access the app at:

```
http://localhost:3000
```

### 4. Test the Interface

- Test login/signup and job submission flows.
- Confirm toast notifications are functional.
- Watch terminal logs for errors.

### 5. Build for Production (Optional)

```bash
npm run build
npm run start
```

- Production server runs at `http://localhost:3000`.


---

## 📁 Project Structure

```bash
src/
├── app/           # Next.js app router, pages, layout
├── components/    # Reusable UI components
├── libs/          # Utility functions (e.g., API helpers, JWT utils)
├── package.json   # Scripts and dependencies
```

Other Config Files:
- `next.config.js` – Next.js config
- `tailwind.config.js` – Tailwind CSS setup

---

## 📚 Dependencies

### Production

- `next@14.2.30`
- `react@18.2.0`, `react-dom@18.2.0`
- `bcryptjs@2.4.3`
- `js-cookie@3.0.5`
- `jsonwebtoken@9.0.2`
- `react-hot-toast@2.4.1`

### Development

- `tailwindcss@3.4.0`, `postcss@8.4.32`, `autoprefixer@10.4.16`
- `eslint@8.56.0`, `eslint-config-next@14.0.4`

---

## ⚙️ Notes

- No `.env` file is used. Look inside `libs/`, `app/`, or `components/` for hardcoded configs.
- Backend services (e.g., job API, auth) must be available, usually at:
  ```
  http://localhost:8000/api
  ```

---

## 🛠 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Node.js mismatch** | Use `nvm use 18` |
| **Install errors** | Delete `node_modules/` & `package-lock.json`, then retry |
| **Port conflict** | Run on another port:<br>`PORT=3001 npm run dev` |
| **JWT/auth issues** | Check backend is up and correct API URL is used |

---

## 🤝 Contributing

1. Fork this repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit and push:
   ```bash
   git commit -m "Add your feature"
   git push origin feature/your-feature
   ```
4. Open a Pull Request.

Ensure:
- Follow existing code style
- Add test coverage if necessary

---

## 📄 License

This project is licensed under the [MIT License](https://github.com/Run-Surge/.github/blob/main/LICENSE).
