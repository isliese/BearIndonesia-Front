// 워드클라우드 모달 컴포넌트

import React from "react";

const WordCloudModal = ({
  isOpen,
  onClose,
  imageUrl,
  isLoading,
  errorMessage,
  startDate,
  endDate,
}) => {
  if (!isOpen) return null;

  const toCompactDate = (value) => String(value || "").replace(/-/g, "");
  const fileName = `워드클라우드${toCompactDate(startDate)}-${toCompactDate(endDate)}.png`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "90%",
          maxHeight: "90%",
        }}
      >
        {isLoading && (
          <div style={{ color: "#555", fontSize: "1rem" }}>AI 워드클라우드를 생성 중입니다...</div>
        )}
        {!isLoading && errorMessage && (
          <div style={{ color: "#e53935", fontSize: "1rem" }}>{errorMessage}</div>
        )}
        {!isLoading && !errorMessage && imageUrl && (
          <img
            src={imageUrl}
            alt="워드클라우드"
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              display: "block",
              borderRadius: "8px",
              margin: "0 auto",
            }}
          />
        )}
        {!isLoading && !errorMessage && imageUrl && (
          <a
            href={imageUrl}
            download={fileName}
            style={{
              display: "inline-block",
              marginTop: "1rem",
              marginRight: "1rem",
              padding: "0.7rem 1.6rem",
              background: "#2e7d32",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: "bold",
            }}
          >
            이미지 저장
          </a>
        )}
        <button
          onClick={onClose}
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem 2rem",
            background: "#ff8c42",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default WordCloudModal;
