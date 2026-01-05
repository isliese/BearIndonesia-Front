// 뉴스 사이드바 컴포넌트

import React from "react";

const NewsSidebar = ({ activeSection, onChangeSection, sectionOrder }) => {
  return (
    <div
      style={{
        width: "240px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        padding: "3.5rem 1rem",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        position: "fixed",
        top: "80px",
        left: 0,
        height: "calc(100vh - 80px)",
        overflowY: "auto",
        zIndex: 10,
      }}
    >
      <h2
        style={{
          color: "#ff8c42",
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
          fontSize: "1.3rem",
          textAlign: "center",
        }}
      >
        분야별 뉴스
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        <div
          onClick={() => onChangeSection("all")}
          style={{
            padding: "1rem",
            borderRadius: "12px",
            cursor: "pointer",
            background: activeSection === "all" ? "#ff8c42" : "rgba(255,255,255,0.1)",
            color: "white",
            textAlign: "center",
            transition: "all 0.3s ease",
            userSelect: "none",
            fontWeight: activeSection === "all" ? "bold" : "normal",
          }}
        >
          전체
        </div>

        {sectionOrder.map((section) => (
          <div
            key={section}
            onClick={() => onChangeSection(section)}
            style={{
              padding: "1rem",
              borderRadius: "12px",
              cursor: "pointer",
              background: activeSection === section ? "#ff8c42" : "rgba(255,255,255,0.1)",
              color: "white",
              textAlign: "center",
              transition: "all 0.3s ease",
              userSelect: "none",
              fontWeight: activeSection === section ? "bold" : "normal",
            }}
          >
            {section}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSidebar;
