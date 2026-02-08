// 뉴스 사이드바 컴포넌트

import React from "react";
import menuIcon from "../../../assets/images/menu.png";

const NewsSidebar = ({
  activeSection,
  onChangeSection,
  sectionOrder,
  isCollapsed,
  onToggleCollapse,
  isMobile = false,
}) => {

  // 스크롤을 맨 위로 초기화하는 함수
  const scrollToTop = () => {
    setTimeout(() => {
      // 메인 앱의 스크롤 컨테이너 찾기
      const scrollContainers = document.querySelectorAll('div[style*="overflowY"]');
      scrollContainers.forEach(container => {
        const style = window.getComputedStyle(container);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          container.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
      // window 스크롤도 함께
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  // 카테고리 변경 핸들러
  const handleSectionChange = (section) => {
    onChangeSection(section);
    scrollToTop();
  };
  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          onClick={onToggleCollapse}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",
            zIndex: 9,
          }}
        />
      )}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          type="button"
          style={{
            position: "fixed",
            top: "clamp(92px, 12vw, 132px)",
            left: "12px",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "none",
            background: "rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            padding: 0,
            zIndex: 20,
          }}
          aria-label="Open sidebar"
        >
          <img
            src={menuIcon}
            alt=""
            style={{ width: "30px", height: "30px", display: "block" }}
          />
        </button>
      )}
      <div
        style={{
        width: isCollapsed ? "0px" : "260px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        padding: isMobile ? "112px 0 0" : "80px 0 0",
        borderRight: isCollapsed ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        zIndex: 10,
        boxShadow: isMobile && !isCollapsed ? "0 18px 44px rgba(0,0,0,0.45)" : "none",
        opacity: isCollapsed ? 0 : 1,
        pointerEvents: isCollapsed ? "none" : "auto",
        transition: "width 0.3s ease, opacity 0.3s ease",
      }}
      >
      <button
        onClick={onToggleCollapse}
        type="button"
        style={{
          position: "absolute",
          top: isMobile ? "clamp(92px, 12vw, 132px)" : "92px",
          right: "12px",
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          border: "none",
          background: "rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          padding: 0,
        }}
        aria-label="Toggle sidebar"
      >
        <img
          src={menuIcon}
          alt=""
          style={{ width: "30px", height: "30px", display: "block" }}
        />
      </button>

      {!isCollapsed && (
        <div style={{ padding: "4.5rem 1rem 1rem" }}>
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
          onClick={() => handleSectionChange("all")}
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
            onClick={() => handleSectionChange(section)}
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
      )}
      </div>
    </>
  );
};

export default NewsSidebar;
