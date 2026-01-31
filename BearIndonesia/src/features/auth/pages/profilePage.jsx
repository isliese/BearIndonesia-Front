import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AReumiUser from "../../../assets/images/AReumi_User.png";
import { request } from "../../../api/httpClient";
import { getAuthToken, getAuthUser, getDisplayName } from "../../../utils/auth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const token = getAuthToken();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      setIsLoading(true);
      await request("/auth/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          currentPassword,
          newPassword,
          confirmPassword,
        },
      });
      setSuccess("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      let message = "비밀번호 변경에 실패했습니다.";
      if (err?.body) {
        try {
          const parsed = JSON.parse(err.body);
          if (parsed?.message) message = parsed.message;
          else if (parsed?.error) message = parsed.error;
        } catch {
          // ignore parse error
        }
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={pageContainerStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: "#ff8c42", marginBottom: "0.6rem" }}>회원 정보</h2>
          <p style={{ color: "#b0b0b0", marginBottom: "1.6rem" }}>
            회원 정보를 보려면 로그인해주세요.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={primaryButtonStyle}
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <img
            src={AReumiUser}
            alt="Profile"
            style={profileImageStyle}
          />
          <div>
            <h2 style={{ margin: 0, color: "white" }}>{getDisplayName(user)}</h2>
            <div style={{ color: "#b0b0b0" }}>{user.email}</div>
          </div>
        </div>

        <div style={actionRowStyle}>
          <button
            type="button"
            onClick={() => navigate("/scrap")}
            style={secondaryButtonStyle}
          >
            스크랩 목록 보기
          </button>
          <button
            type="button"
            onClick={openModal}
            style={primaryButtonStyle}
          >
            비밀번호 변경
          </button>
        </div>

        {isModalOpen && (
          <div style={modalOverlayStyle} role="dialog" aria-modal="true">
            <div style={modalCardStyle}>
              <div style={modalHeaderStyle}>
                <h3 style={{ margin: 0, color: "#ffb07b" }}>비밀번호 변경</h3>
                <button type="button" onClick={closeModal} style={modalCloseStyle}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleChangePassword} style={{ display: "grid", gap: "0.8rem" }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>현재 비밀번호</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="현재 비밀번호"
                    style={inputStyle}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>새 비밀번호</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호"
                    style={inputStyle}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>새 비밀번호 확인</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호 확인"
                    style={inputStyle}
                  />
                </div>

                {error && <div style={errorStyle}>{error}</div>}
                {success && <div style={successStyle}>{success}</div>}

                <button type="submit" style={primaryButtonStyle} disabled={isLoading}>
                  {isLoading ? "변경 중..." : "비밀번호 변경"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const pageContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(100vh - 80px)",
  padding: "2rem",
};

const cardStyle = {
  width: "100%",
  maxWidth: "640px",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 140, 66, 0.2)",
  padding: "2.2rem",
  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)",
};

const headerRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "1.5rem",
};

const actionRowStyle = {
  display: "grid",
  gap: "0.8rem",
};

const profileImageStyle = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  border: "2px solid #ff8c42",
};

const inputGroupStyle = {
  display: "grid",
  gap: "0.4rem",
};

const labelStyle = {
  color: "#d0d0d0",
  fontSize: "0.9rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  borderRadius: "10px",
  border: "1px solid rgba(255, 140, 66, 0.4)",
  background: "rgba(0, 0, 0, 0.35)",
  color: "white",
};

const primaryButtonStyle = {
  padding: "0.9rem 1rem",
  background: "linear-gradient(135deg, #ff8c42, #ffa726)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
  width: "100%",
};

const secondaryButtonStyle = {
  width: "100%",
  padding: "0.85rem",
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 140, 66, 0.4)",
  borderRadius: "12px",
  color: "#ff8c42",
  cursor: "pointer",
  fontSize: "0.95rem",
  fontWeight: "600",
};

const errorStyle = {
  background: "rgba(255, 82, 82, 0.15)",
  border: "1px solid rgba(255, 82, 82, 0.4)",
  color: "#ffbdbd",
  padding: "0.6rem 0.8rem",
  borderRadius: "10px",
  fontSize: "0.9rem",
};

const successStyle = {
  background: "rgba(76, 175, 80, 0.15)",
  border: "1px solid rgba(76, 175, 80, 0.4)",
  color: "#c8f7c5",
  padding: "0.6rem 0.8rem",
  borderRadius: "10px",
  fontSize: "0.9rem",
};

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(9, 12, 20, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1.5rem",
  zIndex: 1000,
};

const modalCardStyle = {
  width: "100%",
  maxWidth: "520px",
  background: "rgba(22, 27, 41, 0.95)",
  borderRadius: "18px",
  border: "1px solid rgba(255, 140, 66, 0.25)",
  padding: "1.8rem",
  boxShadow: "0 18px 36px rgba(0, 0, 0, 0.35)",
};

const modalHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "1rem",
};

const modalCloseStyle = {
  background: "transparent",
  border: "none",
  color: "#ffb07b",
  fontSize: "1.2rem",
  cursor: "pointer",
};

export default ProfilePage;
