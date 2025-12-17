import React, { useMemo, useState, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import septemberData from "../data/september.json";

/* -------------------- 유틸 -------------------- */
function getInitials(text = "") {
  const s = String(text).trim();
  if (!s) return "??";
  if (s.startsWith("@")) return s.replace(/^@/, "").slice(0, 2).toUpperCase();
  const parts = s.split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((w) => w[0]).join("");
  return (initials || s.slice(0, 2)).toUpperCase();
}

/** 섹션 정의 */
const TAG_SECTIONS = {
  일반: [
    "제약","의약품","치료","화장품","백신","건강","건강기능식품","건강보조식품",
    "의사","약국","보건복지부 장관","국민건강보험","병원","질병","질환",
  ],
  "규제·당국": [
    "BPOM (식약청)","Kementerian Kesehatan (보건부)","BKPM (투자조정청)","BPJS (국민건강보험)","KOMNAS (윤리심의위원회)",
    "허가","임상시험","전임상시험","의약품 승인","인증","의약품 GMP","의약품 GDP","의약품 등록",
    "약물감시","보건 정책","의약품 규제","보건부","의약품관련정부규정","의약품 전자 카탈로그",
  ],
  "산업·시장": [
    "제약 산업","제약 비즈니스","의약품 유통","의약품 판매","의약품 가격","제네릭","브랜드 제네릭",
    "의약품 특허","의약품 공급망","의약품 수입","의약품 수출","제약 투자","의약품 현지 생산","제약 협력","제약사 합병•인수",
  ],
  "제품·치료제": [
    "신약","바이오시밀러","바이올로직스","제네릭 의약품","전통 의약품","건강 보조제","의료기기","전문 의약품","일반의약품 (OTC)",
  ],
  "경쟁사·주주": [
    "칼베 파르마","키미아 파르마","바이오 파르마","덱사 메디카","산베 파르마","템포스캔","파프로스","피리당 파르마",
    "화이자","노바티스","로슈","사노피","GSK","바이엘","아스트라제네카",
  ],
  "트렌드·혁신": [
    "디지털 헬스","원격의료","보건 빅데이터","제약 4.0","헬스 스타트업","의약품 연구","의약품 개발","인도네시아 임상시험",
  ],
  "위험·법규/개정": [
    "위조 의약품","의약품 회수","의약품 안전성","약물 부작용","BPOM 규정 위반","의약품 유통 관리","약물 오남용",
  ],
  대웅제약: [
    "대웅제약","Fexuprazan (펙수프라잔)","Envlo (SGLT-2 억제제)","Crezet (로수바스타틴+에제티미브 복합제)",
    "Letybo (보툴리눔 톡신)","Selatoxin"
  ],
};

/** 표시 순서 */
const SECTION_ORDER = [
  "일반",
  "규제·당국",
  "산업·시장",
  "제품·치료제",
  "경쟁사·주주",
  "트렌드·혁신",
  "위험·법규/개정",
  "대웅제약",
];

/* -------------------- 하이라이팅 -------------------- */
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

/* -------------------- 카드 컴포넌트 -------------------- */
const NewsCard = ({ article, onOpen }) => {
  const koTitle = article.korTitle || article.title;
  const koSummary = article.korSummary || "";
  const author = article.source || "";
  const avatar = getInitials(author);

  return (
    <div
      onClick={onOpen}
      style={{
        position: "relative",
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "1.2rem",
        transition: "all 0.25s ease",
        cursor: "pointer",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
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

/* -------------------- 페이지 -------------------- */
const UnifiedNewsPage = ({ setCurrentPage, setSelectedNews, setPrevPage }) => {
  const [activeSection, setActiveSection] = useState("all");
  const [activeTag, setActiveTag] = useState("all");
  const [showWordCloud, setShowWordCloud] = useState(false);

  // 9월 데이터 정규화
  const articles = useMemo(() => {
    return (Array.isArray(septemberData) ? septemberData : [septemberData]).map((a) => ({
      ...a,
      tags: Array.isArray(a.tags)
        ? a.tags.map((t) =>
            typeof t === "string" ? { name: t } : { ...t, name: String(t?.name ?? "").trim() }
          )
        : [],
    }));
  }, []);

  // 태그 카운트
  const tagCount = useMemo(() => {
    const m = new Map();
    for (const a of articles) {
      for (const t of a.tags) {
        const name = t?.name?.trim();
        if (!name) continue;
        m.set(name, (m.get(name) || 0) + 1);
      }
    }
    return m;
  }, [articles]);

  // 현재 섹션의 태그만 필터링
  const currentSectionTags = useMemo(() => {
    if (activeSection === "all") return [];
    const tags = TAG_SECTIONS[activeSection] || [];
    return tags.filter((name) => tagCount.get(name) > 0);
  }, [activeSection, tagCount]);

  // 섹션 변경 시 태그 초기화
  useEffect(() => {
    setActiveTag("all");
  }, [activeSection]);

  // 필터링된 기사
  const filtered = useMemo(() => {
    let result = articles;
    
    // 섹션 필터
    if (activeSection !== "all") {
      const sectionTags = TAG_SECTIONS[activeSection] || [];
      result = result.filter((a) => 
        a.tags.some((t) => sectionTags.includes(t.name))
      );
    }
    
    // 태그 필터
    if (activeTag !== "all") {
      result = result.filter((a) => 
        a.tags.some((t) => t.name === activeTag)
      );
    }
    
    return result;
  }, [activeSection, activeTag, articles]);

  // 엑셀 다운로드
  const downloadExcel = useCallback(() => {
    if (articles.length === 0) {
      alert("9월 뉴스 데이터가 없습니다.");
      return;
    }
    const sheetData = articles.map((a) => ({
      Date: a.date || null,
      "Category (한국어)": a.category || null,
      "Category (영어)": a.engCategory || null,
      언론사: a.source || null,
      "키워드(tags)": a.tags.map((t) => t.name).join(", "),
      "헤드라인 (한국어)": a.korTitle || null,
      "헤드라인 (영어)": a.engTitle || null,
      "헤드라인 (인도네시아어)": a.title || null,
      "요약 (한국어)": a.korSummary || null,
      "요약 (영어)": a.engSummary || null,
      "본문 (한국어 번역)": a.translated || null,
      "본문 (인도네시아어)": a.content || null,
      링크: a.link || null,
      "중요도(점수)": a.importance ?? null,
    }));
    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "9월뉴스");
    XLSX.writeFile(wb, "9월_뉴스.xlsx");
  }, [articles]);

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* 왼쪽 사이드바 - 분야 선택 */}
      <div
        style={{
          width: "240px",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          padding: "2rem 1rem",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ color: "#ff8c42", marginBottom: "1.5rem", fontSize: "1.3rem", textAlign: "center" }}>
          분야별 뉴스
        </h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {/* 전체 버튼 */}
          <div
            onClick={() => setActiveSection("all")}
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
          
          {/* 각 분야 버튼 */}
          {SECTION_ORDER.map((section) => (
            <div
              key={section}
              onClick={() => setActiveSection(section)}
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

      {/* 메인 콘텐츠 영역 */}
      <div style={{ flex: 1, padding: "2rem" }}>
        <h1 style={{ fontSize: "2.3rem", color: "#ff8c42", textAlign: "center", marginBottom: "1.6rem" }}>
          News
        </h1>

        {/* 상단 액션 버튼 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.8rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowWordCloud(true)}
            style={{
              background: "rgba(100, 181, 246, 0.1)",
              border: "1px solid rgba(100, 181, 246, 0.3)",
              borderRadius: "50px",
              padding: "0.65rem 1.1rem",
              color: "white",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "bold",
            }}
          >
            워드클라우드 생성
          </button>

          <button
            onClick={downloadExcel}
            style={{
              background: "rgba(76, 175, 80, 0.1)",
              border: "1px solid rgba(76, 175, 80, 0.3)",
              borderRadius: "50px",
              padding: "0.65rem 1.1rem",
              color: "white",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "bold",
            }}
          >
            9월 기사 Excel 다운로드
          </button>

          <a
            href="/Newsletter_2025-09.html"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                background: "rgba(255, 140, 66, 0.1)",
                border: "1px solid rgba(255, 140, 66, 0.35)",
                borderRadius: "50px",
                padding: "0.65rem 1.1rem",
                color: "white",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: "bold",
              }}
            >
              9월 Newsletter 보러가기
            </button>
          </a>
        </div>

        {/* 세부 태그 필터 (분야가 선택되었을 때만 표시) */}
        {activeSection !== "all" && currentSectionTags.length > 0 && (
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
        )}

        {/* 카드 목록 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.2rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {filtered.length > 0 ? (
            filtered.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onOpen={() => {
                  setSelectedNews(article);
                  setPrevPage("news");
                  setCurrentPage("newsDetail");
                }}
              />
            ))
          ) : (
            <div style={{ 
              gridColumn: "1 / -1", 
              textAlign: "center", 
              color: "#999", 
              padding: "3rem",
              fontSize: "1.1rem" 
            }}>
              해당 분야의 뉴스가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 워드클라우드 모달 */}
      {showWordCloud && (
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
              onClick={() => setShowWordCloud(false)}
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
      )}
    </div>
  );
};

export default UnifiedNewsPage;