// src/pages/SectionNewsPage.jsx
import React, { useState, useMemo } from "react";
import {
  getAllArticles,
  getAllNewsDatesSorted, // (필요 시 유지)
  getNewsForDate,       // (필요 시 유지)
} from "../data/totalData";

/* -------------------- 유틸 함수 -------------------- */
const getInitials = (name = "") => {
  try {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "N";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "N";
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } catch {
    return "N";
  }
};

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

/* -------------------- 컴포넌트 -------------------- */
const SectionNewsPage = ({ setCurrentPage, setSelectedNews, setPrevPage }) => {
  const [activeTag, setActiveTag] = useState("all");

  // ✅ 6개 파일에서 합쳐진 전체 기사 로드
  const allNews = useMemo(() => getAllArticles(), []);

  const tags = [
    { id: "all", label: "전체" },
    { id: "일반", label: "일반" },
    { id: "규제·당국", label: "규제·당국" },
    { id: "산업·시장", label: "산업·시장" },
    { id: "제품·치료제", label: "제품·치료제" },
    { id: "경쟁사·주주", label: "경쟁사·주주" },
    { id: "트렌드·혁신", label: "트렌드·혁신" },
    { id: "위험·법규/개정", label: "위험·법규/개정" },
    { id: "대웅제약", label: "대웅제약" },
  ];

  // ✅ activeTag에 따라 필터링
  const filteredNews = useMemo(() => {
    if (activeTag === "all") return allNews;
    return allNews.filter((news) => (news?.tag ?? news?.category) === activeTag);
  }, [activeTag, allNews]);

  // 뉴스 카드
  const NewsCard = ({ article, onOpen }) => {
    const koTitle = article.korTitle || article.title || "";
    const koSummary = article.korSummary || article.summary || "";
    const author = article.source || article.author || "";
    const avatar = getInitials(author);

    return (
      <div
        onClick={onOpen}
        style={{
          position: "relative",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          padding: "1.5rem",
          transition: "transform 0.2s ease, opacity 0.2s ease",
          cursor: "pointer",
          overflow: "hidden",
          minHeight: "240px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.opacity = 0.9;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.opacity = 1;
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
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
              flex: "0 0 auto",
            }}
          >
            {avatar}
          </div>
          <div
            style={{
              color: "#b0b0b0",
              fontSize: "0.9rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {author || "출처 미상"}
          </div>
        </div>

        <div
          style={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            marginBottom: "0.75rem",
            color: "white",
          }}
        >
          {koTitle}
        </div>

        <div
          style={{
            color: "#d0d0d0",
            marginBottom: "1rem",
            lineHeight: "1.6",
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
          <span>{article.date || ""}</span>
          <span
            style={{
              background: "rgba(255, 140, 66, 0.2)",
              color: "#ff8c42",
              padding: "0.25rem 0.75rem",
              borderRadius: "15px",
              fontSize: "0.8rem",
              maxWidth: "50%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {article.tags?.[0]?.name ?? "태그"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", padding: "2rem", height: "100vh" }}>
      {/* 왼쪽 카테고리 메뉴 */}
      <div
        style={{
          width: "150px",
          marginLeft: "2rem",
          marginBottom: "5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          position: "sticky",
          top: "2rem",
          alignSelf: "center",
        }}
      >
        {tags.map((tag) => (
          <div
            key={tag.id}
            onClick={() => setActiveTag(tag.id)}
            style={{
              padding: "1rem",
              borderRadius: "15px",
              cursor: "pointer",
              background: activeTag === tag.id ? "#ff8c42" : "rgba(255,255,255,0.1)",
              color: "white",
              textAlign: "center",
              transition: "all 0.3s ease",
              userSelect: "none",
            }}
          >
            {tag.label}
          </div>
        ))}
      </div>

      {/* 오른쪽 뉴스 리스트 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginTop: "1rem",
          maxHeight: "100vh",
          paddingRight: "1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* 리스트 전체 너비 컨테이너 */}
        <div
          style={{
            width: "78%",
            maxWidth: "1100px",
            minWidth: "720px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              marginBottom: "1.5rem",
              color: "#ff8c42",
              fontSize: "2rem",
            }}
          >
            분야별 뉴스
          </h1>

          {filteredNews.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {filteredNews.map((news) => (
                <NewsCard
                  key={news.id ?? `${news.date}-${news.title}`}
                  article={{
                    ...news,
                    korTitle: news.korTitle || news.title,
                    korSummary: news.korSummary || news.summary || "",
                  }}
                  onOpen={() => {
                    setSelectedNews?.(news);
                    setPrevPage?.("section");
                    setCurrentPage?.("newsDetail");
                  }}
                />
              ))}
            </div>
          ) : (
            <p style={{ color: "#bbb" }}>해당 분야의 뉴스가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionNewsPage;
