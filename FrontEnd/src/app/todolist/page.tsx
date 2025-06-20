"use client";
import { useEffect, useState } from "react";

interface Todo {
  id: string; // เปลี่ยนจาก number เป็น string (UUID)
  title: string;
  completed: boolean;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // ตรวจสอบ token ใน localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      // decode JWT เพื่อดึง email (payload)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserEmail(payload.email || null);
      } catch {
        setUserEmail(null);
      }
    } else {
      setUserEmail(null);
    }
  }, []);

  // ตรวจสอบ token ทุกครั้งที่ token เปลี่ยน (เช่น หลัง login/logout)
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserEmail(payload.email || null);
        } catch {
          setUserEmail(null);
        }
      } else {
        setUserEmail(null);
      }
    };
    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  // Fetch todos from backend
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    console.log("fetchTodos called");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/todos", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const error = await res.text();
        console.error("fetchTodos error:", error);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("fetchTodos exception:", err);
    }
    setLoading(false);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    console.log("addTodo called", title);
    if (!title.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        const error = await res.text();
        console.error("addTodo error:", error);
      }
    } catch (err) {
      console.error("addTodo exception:", err);
    }
    setTitle("");
    fetchTodos();
  }

  async function toggleTodo(id: string, completed: boolean) {
    console.log("toggleTodo called", id, completed);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) {
        const error = await res.text();
        console.error("toggleTodo error:", error);
      }
    } catch (err) {
      console.error("toggleTodo exception:", err);
    }
    fetchTodos();
  }

  async function deleteTodo(id: string) {
    console.log("deleteTodo called", id);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const error = await res.text();
        console.error("deleteTodo error:", error);
      }
    } catch (err) {
      console.error("deleteTodo exception:", err);
    }
    fetchTodos();
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserEmail(null);
    window.location.reload();
  };

  return (
    <div className=" min-h-screen  max-w-xl mx-auto py-10 px-4 shadow-lg rounded-lg">
      <div className="mb-4 flex justify-end items-center">
        {isLoggedIn && userEmail ? (
          <span className="text-green-600 font-medium transition-colors duration-200">
            {userEmail}
          </span>
        ) : (
          <>
            <span className="text-red-600 mr-2">ยังไม่ได้ Login</span>
            <a
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200 shadow"
              style={{ display: isLoggedIn ? "none" : "inline-block" }}
            >
              Login
            </a>
          </>
        )}
      </div>
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 drop-shadow">
        Todolist
      </h1>
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          className="flex-1 text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 bg-gray-50 shadow-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo"
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-black px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors duration-200"
          disabled={loading}
        >
          Add
        </button>
      </form>
      {loading && (
        <div className="text-center text-blue-500 animate-pulse">
          Loading...
        </div>
      )}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 bg-gray-100 rounded shadow-sm p-2 hover:bg-gray-200 transition-colors duration-200"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
              disabled={loading}
              className="accent-blue-600 w-5 h-5 transition-all duration-200"
            />
            <span
              className={
                todo.completed
                  ? "line-through text-gray-400 transition-colors duration-200"
                  : "text-gray-900 font-medium transition-colors duration-200"
              }
            >
              {todo.title}
            </span>
            <button
              className="ml-auto text-red-500 hover:underline hover:text-red-700 transition-colors duration-200"
              onClick={() => deleteTodo(todo.id)}
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {isLoggedIn && (
        <div className="mt-8 flex justify-center">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200 shadow"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
