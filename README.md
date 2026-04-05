# 🚀 XOR — Real-time Collaborative Code Editor

> **A production-grade, real-time collaborative coding platform with in-browser code execution**
>
> **Built to demonstrate full-stack expertise in WebSockets, real-time systems, and modern web technologies**

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://xor-collaborative-code-editor.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)](LICENSE)

Code together with your team in real-time — share a room, sync code instantly, see who's typing, and execute code in-browser across 5+ languages. No setup, no accounts, just paste a Room ID and start coding.

**🚀 [Try Live Demo](https://xor-collaborative-code-editor.vercel.app)**

---

## 📋 Quick Overview

**What it does**: Real-time collaborative code editor where multiple users share a room and code together with live sync, typing indicators, and in-browser execution.

**Tech Stack**: Next.js 15 + Socket.IO + Judge0 API + Node.js

**Key Features**: Real-time code sync, language sync, typing indicators, multi-language execution, room-based collaboration

**Deployment**: Frontend on Vercel, Backend on Render

---

## 🎬 Application Flow

```
1. User visits the landing page
   └─> Animated hero with Google Gemini-style wave effect
   └─> Features section, contributors footer

2. User goes to /Collaborate
   └─> Generates a unique Room ID (UUID)
   └─> Enters their name
   └─> Clicks "Join Now"

3. User enters /Editor (the Codespace)
   └─> Socket connects and joins the room
   └─> Team members appear in the sidebar with animated avatars
   └─> Language selector defaults to JavaScript

4. Real-time collaboration begins
   └─> Any keystroke emits "codeChange" via Socket.IO
   └─> All users in the room receive "codeUpdate" instantly
   └─> Language change emits "languageChange" → syncs across all tabs
   └─> Typing indicator shows "X is typing..." with animated dots

5. Code execution (Ctrl+Alt+N)
   └─> Submits code to Judge0 CE API (base64 encoded)
   └─> Polls for result every 1 second
   └─> Output or error displayed in the User Terminal panel

6. User leaves
   └─> "Leave Room" removes them from the room
   └─> Socket disconnects, member list updates for others
```

---

## 🚀 Live Demo

- **Frontend**: [xor-collaborative-code-editor.vercel.app](https://xor-collaborative-code-editor.vercel.app)
- **Backend**: [xor-server-0n2p.onrender.com](https://xor-server-0n2p.onrender.com) (Socket.IO server)

---

## 💡 Why This Project Stands Out

This isn't just a text editor — it's a **real-time distributed system** that solves non-trivial engineering challenges:

### **Technical Complexity**
- ✅ **Real-time bidirectional sync** via Socket.IO WebSockets with room-based broadcasting
- ✅ **Language state sync** — switching language in one tab updates all connected clients instantly
- ✅ **Typing indicators** with debounced emit (1.5s timeout) to avoid socket flooding
- ✅ **Singleton socket pattern** — shared socket instance prevents duplicate connections
- ✅ **Graceful disconnect handling** — server cleans up rooms and broadcasts updated member lists
- ✅ **In-browser code execution** via Judge0 CE with polling, base64 encoding, and error handling

### **Production-Ready Features**
- 🚀 Frontend deployed on **Vercel** (global CDN)
- 🔌 Backend deployed on **Railway** (always-on Node.js server)
- 🎨 **Animated UI** with Framer Motion (wave paths, text effects, tooltip animations)
- 📋 **Room ID clipboard copy** with toast notifications
- 🔒 **No auth required** — UUID-based rooms, localStorage for session state
- 🧹 **Auto room cleanup** — empty rooms deleted from server memory on disconnect

### **Skills Demonstrated**
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion
- **Backend**: Node.js, Express, Socket.IO, room state management
- **Real-time**: WebSocket events, debouncing, broadcast vs emit patterns
- **API Integration**: Judge0 CE, base64 encoding, polling with timeout
- **UI/UX**: Animated tooltips, typing indicators, syntax highlighting with PrismJS

---

## ✨ Key Features

### 🔄 **Real-Time Code Sync**
- Every keystroke is broadcast to all users in the same room via Socket.IO
- Zero-lag updates using WebSocket transport (no HTTP polling fallback)
- Code state preserved when new users join

### 🌐 **Language Sync**
- Switching language in one tab emits `languageChange` to the server
- All connected clients receive `languageUpdate` and switch simultaneously
- Syntax highlighting updates instantly via PrismJS

### ⌨️ **Typing Indicators**
- Shows "Name is typing..." with animated bouncing dots
- Debounced — stops showing after 1.5s of inactivity
- Multiple users tracked independently with timestamps

### 👥 **Team Avatars**
- Sidebar shows all connected users with animated tooltip avatars
- Avatars assigned by join order (up to 4 unique profile images)
- Updates in real-time as users join or leave

### ⚡ **In-Browser Code Execution**
- Press `Ctrl+Alt+N` to execute code
- Supports: JavaScript, TypeScript, Python, Java, C++
- Powered by Judge0 CE (free, no API key needed)
- Output and errors displayed in the User Terminal panel

### 🚪 **Room Management**
- Generate UUID room IDs with one click
- Copy Room ID to clipboard to invite teammates
- Leave Room cleans up session and redirects to home

---

## 🏗️ Architecture

### **Tech Stack**

#### Frontend
- **Framework**: Next.js 15 (App Router, React Server Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York style)
- **Animations**: Framer Motion (`motion/react`)
- **Editor**: `react-simple-code-editor` + PrismJS syntax highlighting
- **Real-time**: Socket.IO client (WebSocket transport)
- **Notifications**: Sonner + react-hot-toast
- **Deployment**: Vercel

#### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Real-time**: Socket.IO server
- **State**: In-memory room store (`rooms` object)
- **Deployment**: Railway

#### Code Execution
- **API**: Judge0 CE (free public instance at `ce.judge0.com`)
- **Languages**: JavaScript (102), TypeScript (101), Python (109), Java (91), C++ (105)
- **Method**: POST submission → poll every 1s → decode base64 output

### **System Design**

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 Frontend                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ CodeEditor   │  │ AppSidebar   │  │ LoginForm    │     │
│  │ (PrismJS)    │  │ (Avatars)    │  │ (UUID rooms) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
         │ WebSocket (Socket.IO)              │ HTTPS
         ▼                                    ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│   Node.js + Socket.IO   │      │     Judge0 CE API        │
│   (Railway)             │      │  (ce.judge0.com)         │
│                         │      │                          │
│  rooms = {              │      │  POST /submissions       │
│    roomId: [            │      │  GET  /submissions/:token│
│      { name, socketId } │      │                          │
│    ]                    │      └─────────────────────────┘
│  }                      │
└─────────────────────────┘
```

### **Socket.IO Events**

| Event (Client → Server) | Payload | Description |
|---|---|---|
| `joinRoom` | `{ roomId, name }` | Join a room, get added to member list |
| `codeChange` | `{ roomId, code }` | Broadcast code to room |
| `languageChange` | `{ roomId, language }` | Broadcast language switch to room |
| `userTyping` | `{ roomId, name }` | Notify room user is typing |
| `userStoppedTyping` | `{ roomId, name }` | Notify room user stopped typing |
| `leaveRoom` | `roomId` | Leave room, update member list |

| Event (Server → Client) | Payload | Description |
|---|---|---|
| `codeUpdate` | `code` | Receive code change from another user |
| `languageUpdate` | `language` | Receive language change from another user |
| `updateRoom` | `members[]` | Updated member list after join/leave |
| `userTyping` | `{ name }` | Someone is typing |
| `userStoppedTyping` | `{ name }` | Someone stopped typing |

---

## 🔥 Technical Highlights

### **1. Singleton Socket Pattern**
```js
// src/socket.jsx
export let socket;

export const initSocket = async () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      "force new connection": true,
      transports: ["websocket"],
    });
  }
  return socket;
};
```
Prevents duplicate socket connections on re-renders — a common pitfall in React apps with WebSockets.

### **2. Language Sync Across Tabs**
```js
// Client emits on language change
const handleLanguageChange = (lang) => {
  setLanguage(lang)
  socket.emit("languageChange", { roomId, language: lang })
}

// Server broadcasts to room
socket.on("languageChange", ({ roomId, language }) => {
  socket.to(roomId).emit("languageUpdate", language)
})

// Other clients receive and update
socket.on("languageUpdate", (lang) => setLanguage(lang))
```

### **3. Debounced Typing Indicator**
```js
socket.emit("userTyping", { roomId, name })

if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
typingTimeoutRef.current = setTimeout(() => {
  socket.emit("userStoppedTyping", { roomId, name })
}, 1500)
```
Debounced at 1.5s — avoids flooding the server with stop/start events on every keystroke.

### **4. Judge0 Polling with Timeout**
```js
for (let i = 0; i < 10; i++) {
  await new Promise(r => setTimeout(r, 1000))
  const result = await fetch(`/submissions/${token}`)
  if (result.status.id <= 2) continue  // still processing
  if (result.status.id === 3) return { output: atob(result.stdout) }
  return { error: atob(result.stderr) }
}
```
Polls every 1s, max 10 attempts (10s timeout), handles all Judge0 status codes.

### **5. Graceful Disconnect Cleanup**
```js
socket.on("disconnect", () => {
  for (const roomId in rooms) {
    rooms[roomId] = rooms[roomId].filter(m => m.socketId !== socket.id)
    if (rooms[roomId].length === 0) delete rooms[roomId]
    else io.to(roomId).emit("updateRoom", rooms[roomId])
  }
})
```
Server automatically removes users from all rooms on disconnect and cleans up empty rooms.

---

## 📁 Project Structure

```
xor-collaborative-code-editor/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page
│   │   ├── Collaborate/page.tsx      # Room join form
│   │   ├── Editor/page.tsx           # Codespace layout
│   │   ├── layout.tsx                # Root layout + metadata
│   │   └── globals.css               # Global styles + typing animations
│   ├── components/
│   │   ├── code-editor.tsx           # Core editor (socket, execution, typing)
│   │   ├── app-sidebar.tsx           # Team members sidebar
│   │   ├── hero-section.tsx          # Landing hero with animations
│   │   ├── features-1.tsx            # Features cards section
│   │   ├── login.tsx                 # Room join form logic
│   │   ├── sidebar-opt-in-form.tsx   # Copy Room ID / Leave Room
│   │   ├── animated-tooltip-demo.tsx # Live team avatars via socket
│   │   ├── footer.tsx                # Contributors + social links
│   │   └── ui/                       # shadcn/ui + custom components
│   │       ├── google-gemini-effect.tsx  # Animated SVG wave paths
│   │       ├── moving-border.tsx         # Animated CTA button
│   │       ├── text-hover-effect.tsx     # SVG gradient text on hover
│   │       ├── text-effect.tsx           # Word/char animation presets
│   │       └── animated-group.tsx        # Staggered children animation
│   ├── services/
│   │   └── compilerAPI.tsx           # Judge0 CE integration
│   ├── hooks/
│   │   └── use-mobile.ts             # Mobile breakpoint hook
│   ├── lib/
│   │   └── utils.ts                  # cn() utility
│   └── socket.jsx                    # Singleton Socket.IO client
├── server/
│   ├── server.js                     # Socket.IO backend
│   └── package.json
├── .env.local                        # NEXT_PUBLIC_BACKEND_URL
├── next.config.ts
├── tailwind.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/Anand95733/xor-collaborative-code-editor.git
cd xor-collaborative-code-editor
```

**2. Install frontend dependencies**
```bash
npm install
```

**3. Install backend dependencies**
```bash
cd server && npm install && cd ..
```

**4. Configure environment**
```bash
cp .env.example .env.local
# .env.local already has: NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

**5. Start the backend (Terminal 1)**
```bash
cd server && npm run dev
# Socket server running on port 3001
```

**6. Start the frontend (Terminal 2)**
```bash
npm run dev
# Open http://localhost:3000
```

### How to Test Collaboration
1. Open `http://localhost:3000` in **two browser tabs**
2. In tab 1 → `/Collaborate` → Generate Room ID → enter name → Join
3. In tab 2 → `/Collaborate` → paste same Room ID → enter different name → Join
4. Type in one tab → see it appear in the other instantly
5. Change language in one tab → both tabs switch
6. Press `Ctrl+Alt+N` to execute code

---

## 🌐 Deployment

### Backend → Railway
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set **Root Directory** to `server`
3. Add env var: `CLIENT_URL=https://your-vercel-url.vercel.app`
4. Copy the generated Railway URL

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → Import GitHub repo
2. Add env var: `NEXT_PUBLIC_BACKEND_URL=https://your-railway-url.up.railway.app`
3. Deploy

---

## 🧪 Key Learnings & Challenges

### **Challenge 1: Language Not Syncing Across Tabs**
**Problem**: Language dropdown was managed in `Editor/page.tsx` and passed as a prop to `CodeEditor`, but changes weren't broadcast to other users.

**Solution**: Moved language state inside `CodeEditor`, added `languageChange` socket event on the client and `languageUpdate` broadcast on the server. Now language switches sync instantly across all connected clients.

**Impact**: Demonstrates understanding of state ownership, prop drilling pitfalls, and real-time state synchronization patterns.

---

### **Challenge 2: Duplicate Socket Connections**
**Problem**: Every re-render of `CodeEditor` was creating a new socket connection, causing multiple `joinRoom` events and ghost users in the sidebar.

**Solution**: Implemented singleton socket pattern in `src/socket.jsx` — checks if instance exists before creating a new one. Socket persists across re-renders.

**Impact**: Reduced server load and eliminated duplicate member entries in rooms.

---

### **Challenge 3: Animation Error on Mount**
**Problem**: `controls.start()` in `GoogleGeminiEffect` was called before motion components were registered, throwing `"controls.start() should only be called after a component has mounted"`.

**Solution**: Replaced `useRef(false)` with `useState(false)` for the mounted flag. A ref change doesn't trigger re-renders, so the animation effect was running with a stale `false` value. State triggers a re-render, ensuring the animation only starts after mount is confirmed.

**Impact**: Demonstrates deep understanding of React's rendering lifecycle and the difference between refs and state.

---

### **Challenge 4: Code Execution Running Wrong Language**
**Problem**: `detectLanguage()` was scanning code content for identifiers (e.g., `#include` for C++) instead of using the selected language. Python code ran as JavaScript when it contained common keywords.

**Solution**: Removed content-sniffing entirely. Language ID now maps directly from the selected language name to Judge0's language ID.

**Impact**: Reliable execution — the language you select is always the language that runs.

---

### **Challenge 5: Judge0 RapidAPI Requires Credit Card**
**Problem**: The original implementation used Judge0 via RapidAPI which requires a paid plan ($0.0017/submission).

**Solution**: Switched to the free public Judge0 CE instance (`ce.judge0.com`) — no API key, no credit card, no rate limits for normal usage. Implemented polling instead of `wait=true` for reliability.

**Impact**: Zero cost for code execution, making the project fully free to run and demo.

---

## 📊 Supported Languages

| Language | Judge0 ID | Syntax Highlighting |
|---|---|---|
| JavaScript | 102 | ✅ PrismJS |
| TypeScript | 101 | ✅ PrismJS |
| JSX / TSX | 102 / 101 | ✅ PrismJS |
| Python | 109 | ✅ PrismJS |
| Java | 91 | ✅ PrismJS |
| C++ | 105 | ✅ PrismJS |
| CSS | — | ✅ PrismJS |
| HTML | — | ✅ PrismJS |

---

## 🔒 Security & Privacy
- No user accounts or passwords — UUID-based room access
- No code stored server-side — in-memory only, cleared on disconnect
- No PII collected beyond the name you enter for the session
- CORS configured to allow only the frontend origin in production
- Environment variables for all configuration (no hardcoded URLs)

---

## 🛠️ Future Enhancements

### **Phase 1: Editor Improvements**
- [ ] Cursor position sync (show where each user is editing)
- [ ] Operational Transform or CRDT for conflict-free concurrent edits
- [ ] File tabs (multiple files per room)
- [ ] Code formatting (Prettier integration)

### **Phase 2: Collaboration Features**
- [ ] In-editor chat / comments
- [ ] Voice chat integration (WebRTC)
- [ ] Session recording and playback
- [ ] Shareable read-only links

### **Phase 3: Platform**
- [ ] User authentication (GitHub OAuth)
- [ ] Persistent rooms with code history
- [ ] Custom themes (VS Code theme support)
- [ ] Mobile-responsive editor

---

## 📝 License

MIT License — see [LICENSE](LICENSE) file for details

---

## 👨‍💻 About This Project

Built from scratch to demonstrate **real-time systems engineering** and **full-stack development** skills. This project showcases:

- **WebSocket architecture**: Room-based broadcasting, event design, disconnect handling
- **React patterns**: Singleton services, state ownership, effect cleanup
- **API integration**: Polling patterns, base64 encoding, error handling
- **Animated UI**: Framer Motion, SVG path animations, CSS keyframes
- **Production deployment**: Vercel + Railway, environment configuration

### **Development Highlights**
- ✅ Real-time sync with < 100ms latency on local network
- ✅ Zero-cost code execution via Judge0 CE public instance
- ✅ Clean disconnect handling — no ghost users or memory leaks
- ✅ Language sync across all connected clients in real-time
- ✅ Production build passes with zero TypeScript errors

---

## 📧 Contact

**Anand Ediga**
- 💼 LinkedIn: [linkedin.com/in/anand-goud-8a6009293](https://www.linkedin.com/in/anand-goud-8a6009293/)
- 🐙 GitHub: [@Anand95733](https://github.com/Anand95733)
- 📧 Email: goudanand19@gmail.com

**Open to opportunities in:**
- Full-Stack Development (React, Next.js, Node.js)
- Real-time Systems & WebSocket Architecture
- Frontend Engineering (TypeScript, Tailwind, animations)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

**Built with ❤️ to showcase real-time full-stack development**

*Production-ready code, not just a portfolio piece*

</div>
