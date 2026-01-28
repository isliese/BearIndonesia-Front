import React from "react";
import { useNavigate } from "react-router-dom";
import AReumiUser from "../../../assets/images/AReumi_User.png";
import { getAuthUser, getDisplayName } from "../../../utils/auth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = getAuthUser();

  if (!user) {
    return (
      <div style={pageContainerStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: "#ff8c42", marginBottom: "0.6rem" }}>로그인이 필요합니다</h2>
          <p style={{ color: "#b0b0b0", marginBottom: "1.6rem" }}>
            회원 정보를 보려면 로그인해주세요.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={primaryButtonStyle}
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <img
            src={AReumiUser}
            alt="Profile"
            style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #ff8c42" }}
          />
          <div>
            <h2 style={{ margin: 0, color: "white" }}>{getDisplayName(user)}</h2>
            <div style={{ color: "#b0b0b0" }}>{user.email}</div>
          </div>
        </div>

        <div style={infoBoxStyle}>
          <div style={{ color: "#ff8c42", fontWeight: "600", marginBottom: "0.5rem" }}>
            회원 정보
          </div>
          <div style={{ color: "#d0d0d0", lineHeight: 1.6 }}>
            BearIndonesia에서 스크랩한 기사와 관심 뉴스를 관리할 수 있습니다.
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/scrap")}
          style={secondaryButtonStyle}
        >
          스크랩한 기사 보러가기
        </button>
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

const infoBoxStyle = {
  background: "rgba(255, 140, 66, 0.1)",
  borderRadius: "14px",
  padding: "1rem 1.2rem",
  border: "1px solid rgba(255, 140, 66, 0.25)",
  marginBottom: "1.6rem",
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

export default ProfilePage;
