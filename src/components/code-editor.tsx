"use client"

import { executeCode } from "@/services/compilerAPI"
import { toast } from "react-hot-toast"
import { useState, useEffect, useRef } from "react"
import Editor from "react-simple-code-editor"
import Prism from "prismjs"
import { initSocket } from "@/socket"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import "prismjs/components/prism-javascript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-markup"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-java"
import "prismjs/components/prism-python"
import "prismjs/themes/prism-tomorrow.css"

const LANGUAGE_CONFIG = [
  { id: 105, name: "cpp" },
  { id: 102, name: "javascript" },
  { id: 102, name: "jsx" },
  { id: 101, name: "typescript" },
  { id: 101, name: "tsx" },
  { id: 109, name: "python" },
  { id: 91,  name: "java" },
  { id: 102, name: "css" },
  { id: 102, name: "html" },
]

const getPrismLanguage = (lang: string) => {
  switch (lang) {
    case "javascript": return Prism.languages.javascript
    case "jsx":        return Prism.languages.jsx
    case "typescript": return Prism.languages.typescript
    case "tsx":        return Prism.languages.tsx
    case "css":        return Prism.languages.css
    case "html":       return Prism.languages.markup
    case "cpp":        return Prism.languages.cpp
    case "java":       return Prism.languages.java
    case "python":     return Prism.languages.python
    default:           return Prism.languages.javascript
  }
}

export function CodeEditor({
  value = "",
  onChange,
  roomId: propRoomId,
}: {
  value?: string
  onChange?: (value: string) => void
  roomId?: string
}) {
  const [code, setCode] = useState(value)
  const [language, setLanguage] = useState("javascript")
  const [output, setOutput] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [roomId, setRoomId] = useState<string | undefined>(propRoomId)
  const [socket, setSocket] = useState<any>(null)
  const [typingUsers, setTypingUsers] = useState<{ name: string; timestamp: number }[]>([])
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Socket init
  useEffect(() => {
    initSocket().then(setSocket)
  }, [])

  // Room ID from localStorage
  useEffect(() => {
    if (!propRoomId) {
      const data = localStorage.getItem("currentUser")
      const storedRoomId = data ? JSON.parse(data).roomId : undefined
      if (storedRoomId) {
        setRoomId(storedRoomId)
      } else {
        router.push("/")
      }
    }
  }, [propRoomId, router])

  // Socket room events
  useEffect(() => {
    if (!socket || !roomId) return
    const data = localStorage.getItem("currentUser")
    const name = data ? JSON.parse(data).name : "Anonymous"

    socket.emit("joinRoom", { roomId, name })

    socket.on("codeUpdate", (updatedCode: string) => setCode(updatedCode))

    // Sync language from other users
    socket.on("languageUpdate", (lang: string) => setLanguage(lang))

    socket.on("userTyping", ({ name }: { name: string }) => {
      setTypingUsers(prev => {
        const filtered = prev.filter(u => u.name !== name)
        return [...filtered, { name, timestamp: Date.now() }]
      })
    })

    socket.on("userStoppedTyping", ({ name }: { name: string }) => {
      setTypingUsers(prev => prev.filter(u => u.name !== name))
    })

    const interval = setInterval(() => {
      setTypingUsers(prev => prev.filter(u => Date.now() - u.timestamp < 3000))
    }, 3000)

    return () => {
      socket.off("codeUpdate")
      socket.off("languageUpdate")
      socket.off("userTyping")
      socket.off("userStoppedTyping")
      clearInterval(interval)
      socket.emit("leaveRoom", roomId)
    }
  }, [socket, roomId])

  // Handle language change — update locally and broadcast
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    if (socket && roomId) {
      socket.emit("languageChange", { roomId, language: lang })
    }
  }

  // Handle code change — update locally and broadcast
  const handleValueChange = (newCode: string) => {
    setCode(newCode)
    onChange?.(newCode)
    if (!socket || !roomId) return

    socket.emit("codeChange", { roomId, code: newCode })

    const data = localStorage.getItem("currentUser")
    const name = data ? JSON.parse(data).name : "Anonymous"
    socket.emit("userTyping", { roomId, name })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("userStoppedTyping", { roomId, name })
      typingTimeoutRef.current = null
    }, 1500)
  }

  // Ctrl+Alt+N code execution
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.altKey || e.key.toLowerCase() !== "n") return
      e.preventDefault()
      if (isExecuting) return
      setIsExecuting(true)

      const langConfig = LANGUAGE_CONFIG.find(l => l.name === language)
      const languageId = langConfig?.id ?? 102

      try {
        const result = await executeCode(code, languageId)
        if (result.error) {
          toast.error("Execution failed")
          setOutput(result.error)
        } else {
          setOutput(result.output)
          toast.success("Code executed successfully!")
        }
      } catch (err) {
        toast.error("Failed to execute code")
        setOutput(`Error: ${(err as Error).message}`)
      } finally {
        setIsExecuting(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [code, language, isExecuting])

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#1e1e1e] border-b border-zinc-700">
        <h2 className="text-white font-semibold">XOR Codespace</h2>
        <span className="text-zinc-400 text-sm">Press Ctrl+Alt+N to run</span>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[150px] bg-zinc-800 border-zinc-600 text-white">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="jsx">JSX</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="tsx">TSX</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="python">Python</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Editor + Terminal */}
      <div className="flex flex-1">
        <div className="w-3/4 h-full">
          <Editor
            value={code}
            onValueChange={handleValueChange}
            highlight={code => Prism.highlight(code, getPrismLanguage(language), language)}
            padding={16}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
              backgroundColor: "#2d2d2d",
              minHeight: "500px",
              color: "#ccc",
            }}
            className="min-h-[500px] w-full"
          />
        </div>
        <div className="w-1/4 p-4 bg-[#2d2d2d] border-l border-zinc-700">
          <h2 className="text-lg text-white mb-2">User Terminal</h2>
          <div className="typing-indicator">
            {typingUsers.map(user => (
              <div key={user.name} className="typing-user">
                <span>
                  {user.name} is typing
                  <div className="typing-dots">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </span>
              </div>
            ))}
          </div>
          {isExecuting && (
            <p className="text-zinc-400 text-sm mt-2">Running...</p>
          )}
          {output && (
            <div className="mt-4">
              <h3 className="text-sm text-white mb-2">Output:</h3>
              <pre className="whitespace-pre-wrap text-white text-sm">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
