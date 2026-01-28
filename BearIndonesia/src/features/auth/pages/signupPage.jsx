import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../../../api/authApi";
import { setAuthSession } from "../../../utils/auth";

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !name.trim() || !password.trim()) {
      setError("이름, 이메일, 비밀번호를 입력해주세요.");
      return;
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const data = await registerUser({
        email: email.trim(),
        name: name.trim(),
        password: password.trim(),
      });
      if (!data?.token || !data?.user) {
        throw new Error("회원가입 응답이 올바르지 않습니다.");
      }
      setAuthSession({ token: data.token, user: data.user });
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err?.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 80px)",
      padding: "2rem"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "520px",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        border: "1px solid rgba(255, 140, 66, 0.2)",
        padding: "2.2rem",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)"
      }}>
        <h2 style={{
          fontSize: "1.8rem",
          color: "#ff8c42",
          marginBottom: "0.4rem"
        }}>
          회원가입
        </h2>
        <p style={{ color: "#b0b0b0", marginBottom: "2rem" }}>
          BearIndonesia와 함께 인도네시아 뉴스와 인사이트를 관리하세요.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ color: "#d0d0d0", fontSize: "0.9rem" }}>이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="아르미"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ color: "#d0d0d0", fontSize: "0.9rem" }}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@daewoong.co.kr"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ color: "#d0d0d0", fontSize: "0.9rem" }}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ color: "#d0d0d0", fontSize: "0.9rem" }}>비밀번호 확인</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              style={inputStyle}
            />
          </div>
          {error && (
            <div style={{ color: "#ff8c42", fontSize: "0.9rem" }}>{error}</div>
          )}
          <button type="submit" style={primaryButtonStyle}>
            회원가입
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/login", { state: { from: location.state?.from } })}
          style={secondaryButtonStyle}
        >
          이미 계정이 있으신가요? 로그인하기
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.9rem 1rem",
  marginTop: "0.4rem",
  borderRadius: "12px",
  border: "1px solid rgba(255, 140, 66, 0.3)",
  background: "rgba(255, 255, 255, 0.08)",
  color: "white",
  outline: "none",
  fontSize: "1rem",
  boxSizing: "border-box"
};

const primaryButtonStyle = {
  marginTop: "0.4rem",
  padding: "0.9rem",
  background: "linear-gradient(135deg, #ff8c42, #ffa726)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600"
};

const secondaryButtonStyle = {
  marginTop: "1.2rem",
  width: "100%",
  padding: "0.85rem",
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 140, 66, 0.4)",
  borderRadius: "12px",
  color: "#ff8c42",
  cursor: "pointer",
  fontSize: "0.95rem",
  fontWeight: "600"
};

export default SignupPage;
