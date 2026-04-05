# XOR — Real-time Collaborative Code Editor

A real-time collaborative code editor where multiple developers can join a shared room and code together simultaneously, with live code sync, typing indicators, and in-browser code execution.

**Built by [Anand Ediga](https://github.com/957333)**

---

## Features

- Real-time multi-user code synchronization via Socket.IO
- Live typing indicators (see who's typing)
- In-browser code execution (Ctrl+Alt+N) powered by Judge0 API
- Supports JavaScript, TypeScript, JSX/TSX, Python, Java, C++, CSS, HTML
- Room-based collaboration — share a Room ID to invite teammates
- Animated UI with Framer Motion

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion  
**Backend:** Node.js, Express, Socket.IO  
**Code Execution:** Judge0 CE via RapidAPI  

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/957333/xor-collaborative-editor.git
cd xor-collaborative-editor
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Set up frontend environment variables

```bash
cp .env.example .env.local
```

Fill in your values in `.env.local`:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

> Code execution uses the free public [Judge0 CE](https://ce.judge0.com) instance — no API key or credit card needed.

### 4. Install and run the backend server

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 5. Run the frontend

```bash
# From project root
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How to Use

1. Go to `/Collaborate`
2. Generate a Room ID or paste an existing one
3. Enter your name and click **Join Now**
4. Share the Room ID with teammates — they join the same room
5. Code together in real-time
6. Press **Ctrl+Alt+N** to execute code and see output

---

## Deployment

**Frontend → Vercel**
- Connect your GitHub repo to [vercel.com](https://vercel.com)
- Add environment variables in Vercel dashboard

**Backend → Railway or Render**
- Deploy the `/server` folder
- Set `CLIENT_URL` to your Vercel frontend URL
- Copy the deployed backend URL into Vercel's `NEXT_PUBLIC_BACKEND_URL`

---

## License

MIT
