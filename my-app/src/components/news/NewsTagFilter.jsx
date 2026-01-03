import React from "react";

const NewsTagFilter = ({ activeSection, currentSectionTags, activeTag, setActiveTag }) => {
  if (activeSection === "all" || currentSectionTags.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto 2rem",
        padding: "1.5rem",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div style={{ color: "#ff8c42", fontWeight: 700, marginBottom: "1rem", fontSize: "1.1rem" }}>
        {activeSection} 세부 필터:
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveTag("all")}
          style={{
            padding: "0.5rem 1rem",
            background: activeTag === "all" ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
            border: "1px solid",
            borderColor: activeTag === "all" ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            color: "white",
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "all 0.2s ease",
          }}
        >
          전체
        </button>

        {currentSectionTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            style={{
              padding: "0.5rem 1rem",
              background: activeTag === tag ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
              border: "1px solid",
              borderColor: activeTag === tag ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              color: "white",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.2s ease",
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewsTagFilter;
