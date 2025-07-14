"use client";
import { useEffect, useState } from "react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotifications(stored);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        aria-label="Notifications"
        style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}
        onClick={() => { setOpen((o) => !o); if (!open) markAllRead(); }}
      >
        <span style={{ fontSize: 24 }}>🔔</span>
        {unreadCount > 0 && (
          <span style={{ position: "absolute", top: 0, right: 0, background: "red", color: "white", borderRadius: "50%", fontSize: 12, padding: "2px 6px" }}>{unreadCount}</span>
        )}
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: 32, background: "white", border: "1px solid #ccc", borderRadius: 8, minWidth: 220, zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", padding: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Notifications</div>
          {notifications.length === 0 ? (
            <div style={{ color: "#888" }}>Aucune notification</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {notifications.slice().reverse().map((n, i) => (
                <li key={i} style={{ padding: 6, borderBottom: "1px solid #eee", background: n.read ? "#fff" : "#f6f6fa" }}>{n.text}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 