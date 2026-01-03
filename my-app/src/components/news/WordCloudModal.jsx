import React from "react";

const WordCloudModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
        <img
          src="/wordcloud.png"
          alt="워드클라우드"
          style={{
            maxWidth: "100%",
            maxHeight: "70vh",
            display: "block",
            borderRadius: "8px",
            margin: "0 auto",
          }}
        />
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
