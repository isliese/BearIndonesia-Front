// 뉴스 카드 컴포넌트

import React from "react";
import ScrapStarButton from "../../../components/ScrapStarButton";

function getInitials(text = "") {
  const s = String(text).trim();
  if (!s) return "미상";
  if (s.startsWith("@")) return s.replace(/^@/, "").slice(0, 2).toUpperCase();
  const parts = s.split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((w) => w[0]).join("");
  return (initials || s.slice(0, 2)).toUpperCase();
}

const renderHighlighted = (text = "") => {
  const segments = String(text).split(/(\*\*[^*]+\*\*)/g);
  return segments.map((seg, idx) => {
    const m = seg.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <strong key={idx} style={{ color: "#ffcc80" }}>
          {m[1]}
        </strong>
      );
    }
    return <span key={idx}>{seg}</span>;
  });
};

const NewsCard = ({ article, onOpen }) => {
  const koTitle = article.korTitle || article.title;
  const koSummary = article.korSummary || "";
  const author = article.source || "";
  const avatar = getInitials(author);
  const isMismatch = Boolean(article.tagMismatch || article.categoryMismatch);
  const showMismatch = import.meta.env.MODE !== "production";
  const dimmed = showMismatch && isMismatch;

  const starStyle = dimmed
    ? { position: "absolute", top: "12px", left: "12px" }
    : { position: "absolute", top: "12px", right: "12px" };

  return (
    <div
      onClick={onOpen}
      style={{
        position: "relative",
        background: dimmed ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "1.2rem",
        transition: "all 0.25s ease",
        cursor: "pointer",
        overflow: "hidden",
        border: dimmed ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.12)",
        opacity: dimmed ? 0.6 : 1,
        filter: dimmed ? "grayscale(0.6)" : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 140, 66, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <ScrapStarButton article={article} style={starStyle} />
      {dimmed && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(255, 140, 66, 0.15)",
            color: "#ffb36b",
            border: "1px solid rgba(255, 140, 66, 0.35)",
            borderRadius: "12px",
            padding: "0.2rem 0.5rem",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          검증 필요
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "0.8rem" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ff8c42, #ffa726)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            marginRight: "0.75rem",
            
          }}
        >
          {avatar}
        </div>
        <div style={{ color: "#b0b0b0", fontSize: "0.9rem" }}>{author}</div>
      </div>

      <div style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem", color: "white" }}>
        {koTitle}
      </div>

      <div
        style={{
          color: "#d0d0d0",
          marginBottom: "0.9rem",
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 5,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {renderHighlighted(koSummary)}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#999",
          fontSize: "0.85rem",
        }}
      >
        <span>{article.date}</span>
        <span
          style={{
            background: "rgba(255, 140, 66, 0.18)",
            color: "#ff8c42",
            padding: "0.25rem 0.6rem",
            borderRadius: "14px",
            fontSize: "0.8rem",
            border: "1px solid rgba(255,140,66,0.35)",
          }}
        >
          {article.tags?.[0]?.name ?? "태그"}
        </span>
      </div>
    </div>
  );
};

export default NewsCard;
