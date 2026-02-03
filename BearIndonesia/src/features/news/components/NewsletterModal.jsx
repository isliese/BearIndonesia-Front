// 뉴스레터 모달 컴포넌트

import React from "react";

const NewsletterModal = ({
  isOpen,
  onClose,
  pdfUrl,
  isLoading,
  errorMessage,
  year,
  month,
}) => {
  if (!isOpen) return null;

  const safeMonth = String(month || "").padStart(2, "0");
  const fileName = `뉴스레터-${year || ""}-${safeMonth}.pdf`;

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
          padding: "1.5rem",
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "95%",
          width: "900px",
          maxHeight: "90%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {isLoading && (
          <div style={{ color: "#555", fontSize: "1rem" }}>뉴스레터를 생성 중입니다. 잠시만 기다려주세요...</div>
        )}
        {!isLoading && errorMessage && (
          <div style={{ color: "#e53935", fontSize: "1rem" }}>{errorMessage}</div>
        )}
        {!isLoading && !errorMessage && pdfUrl && (
          <iframe
            title="뉴스레터 미리보기"
            src={pdfUrl}
            style={{
              width: "100%",
              height: "70vh",
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: "12px",
            }}
          />
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          {!isLoading && !errorMessage && pdfUrl && (
            <a
              href={pdfUrl}
              download={fileName}
              style={{
                display: "inline-block",
                padding: "0.7rem 1.6rem",
                background: "#2e7d32",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "0.95rem",
                fontWeight: "bold",
              }}
            >
              PDF 저장
            </a>
          )}
          <button
            onClick={onClose}
            style={{
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
    </div>
  );
};

export default NewsletterModal;
