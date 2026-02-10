import React, { useEffect, useState } from "react";
import { fetchAdminUsers, updateUserRole } from "../../../api/adminApi";
import { getAuthUser, isAdminUser } from "../../../utils/auth";

const AdminUsersPage = () => {
  const [authUser, setAuthUser] = useState(() => getAuthUser());
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const update = () => setAuthUser(getAuthUser());
    update();
    window.addEventListener("authchange", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("authchange", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    if (!isAdminUser(authUser)) return;
    let mounted = true;
    setLoading(true);
    setError("");
    fetchAdminUsers()
      .then((list) => {
        if (!mounted) return;
        setUsers(Array.isArray(list) ? list : []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || "유저 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [authUser]);

  const handleToggleRole = async (user) => {
    const nextRole = user?.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      await updateUserRole(user.id, nextRole);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)));
      window.dispatchEvent(
        new CustomEvent("app-toast", {
          detail: { message: `권한이 ${nextRole}로 변경되었습니다.`, type: "success" },
        }),
      );
    } catch (e) {
      window.dispatchEvent(
        new CustomEvent("app-toast", {
          detail: { message: e?.message || "권한 변경에 실패했습니다.", type: "info" },
        }),
      );
    }
  };

  if (!isAdminUser(authUser)) {
    return (
      <div style={{ padding: "2rem 1.2rem", textAlign: "center", color: "#ff8c42" }}>
        권한이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.2rem", boxSizing: "border-box" }}>
      <h1 style={{ color: "#ff8c42", marginBottom: "1rem" }}>Admin · Users</h1>
      <div style={{ color: "#b0b0b0", marginBottom: "1.5rem" }}>유저 권한(Role)을 관리합니다.</div>

      {loading && <div style={{ color: "#b0b0b0" }}>불러오는 중...</div>}
      {!loading && error && <div style={{ color: "#ff8c42" }}>{error}</div>}

      {!loading && !error && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                {["ID", "Email", "Name", "Role", "Created", "Last Login", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "0.85rem 0.9rem",
                      fontSize: "0.9rem",
                      color: "#d9e7ef",
                      borderBottom: "1px solid rgba(255,255,255,0.12)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={tdStyle}>{u.id}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "0.15rem 0.55rem",
                        borderRadius: "999px",
                        border: "1px solid rgba(255,140,66,0.35)",
                        background: u.role === "ADMIN" ? "rgba(255,140,66,0.22)" : "rgba(255,255,255,0.08)",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={tdStyle}>{u.createdAt || "-"}</td>
                  <td style={tdStyle}>{u.lastLoginAt || "-"}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => handleToggleRole(u)}
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(255, 140, 66, 0.45)",
                        color: "white",
                        padding: "0.35rem 0.7rem",
                        borderRadius: "10px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Role 변경
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td style={{ ...tdStyle, color: "#b0b0b0" }} colSpan={7}>
                    유저가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const tdStyle = {
  padding: "0.75rem 0.9rem",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.92)",
  fontSize: "0.9rem",
  whiteSpace: "nowrap",
};

export default AdminUsersPage;

