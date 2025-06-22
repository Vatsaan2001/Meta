import React, { useState, useEffect, useRef } from "react";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("login"); // login, register, forgot, notes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
const [fontSize, setFontSize] = useState("medium");
const [accentColor, setAccentColor] = useState("#2196f3");
const [menuOpen, setMenuOpen] = useState(false);

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const fileInputRef = useRef(null);


useEffect(() => {
  document.documentElement.style.setProperty('--accent-color', accentColor);
  const sizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px',
  };
  document.documentElement.style.setProperty('--current-font-size', sizeMap[fontSize]);
}, [accentColor, fontSize]);

useEffect(() => {
  const timeout = setTimeout(() => {
    if (title || content || tags) {
      const draft = {
        title,
        content,
        tags
      };
      localStorage.setItem("note_draft", JSON.stringify(draft));
    }
  }, 1000); // saves every second

  return () => clearTimeout(timeout);
}, [title, content, tags]);

useEffect(() => {
  const savedDraft = localStorage.getItem("note_draft");
  if (savedDraft) {
    const { title, content, tags } = JSON.parse(savedDraft);
    setTitle(title || "");
    setContent(content || "");
    setTags(tags || "");
  }
}, []);

  // Load from localStorage
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(savedUsers);

    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (savedUser) {
      setCurrentUser(savedUser);
      setMode("notes");
      const savedNotes = JSON.parse(localStorage.getItem(`notes_${savedUser.email}`)) || [];
      const normalized = savedNotes.map(n => ({ ...n, tags: n.tags || [] }));
      setNotes(normalized);
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`notes_${currentUser.email}`, JSON.stringify(notes));
    }
  }, [notes, currentUser]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password || password !== confirmPassword) {
      alert("Please check email and password");
      return;
    }
    if (users.find((u) => u.email === email)) {
      alert("User already exists.");
      return;
    }
    const newUser = { email, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("Registered successfully!");
    setMode("login");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      const savedNotes = JSON.parse(localStorage.getItem(`notes_${user.email}`)) || [];
      const normalized = savedNotes.map(n => ({ ...n, tags: n.tags || [] }));
      setNotes(normalized);
      setMode("notes");
    } else {
      alert("Invalid email or password");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.email === resetEmail);
    if (user) {
      const newPassword = prompt("Enter new password:");
      if (newPassword) {
        const updated = users.map(u =>
          u.email === resetEmail ? { ...u, password: newPassword } : u
        );
        setUsers(updated);
        localStorage.setItem("users", JSON.stringify(updated));
        alert("Password updated!");
        setMode("login");
      }
    } else {
      alert("User not found.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setMode("login");
  };

  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const handleAddOrUpdateNote = async () => {
    if (!title && !content && attachments.length === 0) return;

    const base64Files = await Promise.all(
      attachments.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await readFileAsBase64(file)
      }))
    );

const note = {
  id: editingId || Date.now(),
  title,
  content,
  tags: tags.split(",").map(t => t.trim()).filter(Boolean),
  attachments: base64Files,
  pinned: false,
  createdAt: editingId ? notes.find(n => n.id === editingId)?.createdAt : new Date().toLocaleString()
};
localStorage.removeItem("note_draft");
    setNotes(prev =>
      editingId ? prev.map(n => (n.id === editingId ? note : n)) : [note, ...prev]
    );

    setTitle("");
    setContent("");
    setTags("");
    setAttachments([]);
    setEditingId(null);
    setSelectedNote(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleDelete = (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this note?");
  if (!confirmDelete) return;

  const updatedNotes = notes.filter(note => note.id !== id);
  setNotes(updatedNotes);
  localStorage.setItem("notes", JSON.stringify(updatedNotes));
  setSelectedNote(null);
};

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(", "));
    setEditingId(note.id);
  };

  const handlePin = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

 const filteredNotes = notes
  .filter(
    n =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  .sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1; // pinned notes go first
  });

  return (
    <div className={`app-wrapper ${darkMode ? 'dark' : ''}`}>
      {mode === "login" && (
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
            <p>
              New user? <span onClick={() => setMode("register")} className="link">Register</span>
              <br/>
              Forgot password? <span onClick={() => setMode("forgot")} className="link">Reset</span>
            </p>
          </form>
        </div>
      )}

      {mode === "register" && (
        <div className="login-container">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            <button type="submit">Register</button>
            <p>
              Already have an account? <span onClick={() => setMode("login")} className="link">Login</span>
            </p>
          </form>
        </div>
      )}

      {mode === "forgot" && (
        <div className="login-container">
          <h2>Reset Password</h2>
          <form onSubmit={handleForgotPassword}>
            <input type="email" placeholder="Your registered email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required />
            <button type="submit">Reset Password</button>
            <p>
              Go back? <span onClick={() => setMode("login")} className="link">Login</span>
            </p>
          </form>
        </div>
      )}

      {mode === "notes" && (
        <div className="notes-app">
           <div className="note-stats">
      <p><strong>📋 Total Notes:</strong> {notes.length}</p>
      <p><strong>📌Pinned:</strong> {notes.filter(n => n.pinned).length}</p>    </div>
          <div className="flex justify-between items-center mb-4">
            <h2>Notes App</h2>
            <div className="menu-wrapper">
              <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
              <div className={`menu-buttons ${menuOpen ? "show" : ""}`}>
                <button onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? "🌙 Dark" : "🌞 Light"}
                </button>
                <button onClick={() => setSettingsOpen(!settingsOpen)}>
                  ⚙️ Settings
                </button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>

          <div className="note-form">
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)}></textarea>
            <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />
            <input type="file" multiple onChange={handleFileUpload} ref={fileInputRef} />
            <button onClick={handleAddOrUpdateNote}>{editingId ? "Update" : "Add"} Note</button>
          </div>

          <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

          <div className="note-list">
            {filteredNotes.length === 0 ? (
              <p className="no-results">No results found.</p>
            ) : (
              filteredNotes.map(note => (
                <div key={note.id} className="note-card" onClick={() => setSelectedNote(note)}>
                  <h4>{note.title}</h4>
                  <p>{note.content.slice(0, 100)}...</p>
                  <div className="tags">
                    {(note.tags || []).map((tag, idx) => (
                      <span key={idx} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedNote && (
            <div className="note-preview">
              <h3>{selectedNote.title}</h3>
              {selectedNote.createdAt && (
  <p className="note-timestamp"><strong>Created:</strong> {selectedNote.createdAt}</p>
)}
              <p>{selectedNote.content}</p>
              {(selectedNote.tags || []).length > 0 && (
                <div className="tags">
                  {(selectedNote.tags || []).map((tag, i) => (
                    <span key={i} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
              {selectedNote.attachments.length > 0 && (
                <div className="attachments">
                  {selectedNote.attachments.map((file, i) => (
                    <div key={i} className="file">
                      {file.type.startsWith("image/") ? (
                        <img src={file.data} alt={file.name} />
                      ) : file.type === "application/pdf" ? (
                        <iframe src={file.data} title={file.name} width="100%" height="300px"></iframe>
                      ) : (
                        <a href={file.data} target="_blank" rel="noreferrer">
                          📎 {file.name}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {settingsOpen && (
  <div className="settings-panel">
    <h3>Settings</h3>
    <label>
      Font Size:
      <select value={fontSize} onChange={e => setFontSize(e.target.value)}>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </label>
    <label>
      Accent Color:
      <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} />
    </label>
    <button onClick={() => setSettingsOpen(false)}>Close</button>
    

  </div>
)}

              <div className="note-actions">
                <button onClick={() => handleEdit(selectedNote)}>✏️ Edit</button>
                <button onClick={() => handleDelete(selectedNote.id)}>🗑️ Delete</button>
                <button onClick={() => handlePin(selectedNote.id)}>
                  📌 {selectedNote.pinned ? "Unpin" : "Pin"}
                </button>
                <button onClick={() => setSelectedNote(null)}>❌ Close</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
