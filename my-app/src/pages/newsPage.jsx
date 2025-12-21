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
  대웅제약: [
    "대웅제약", "Daewoong",
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
  ]
};

const SECTION_ORDER = [
  "일반",
  "대웅제약",
  "규제·당국",
  "산업·시장",
  "제품·치료제",
  "경쟁사·주주",
  "트렌드·혁신",
  "위험·법규/개정"
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
  const getStoredValue = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? stored : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [activeSection, setActiveSection] = useState("all");
  const [activeTag, setActiveTag] = useState("all");
  const [showWordCloud, setShowWordCloud] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  
  // 옵션 유지 체크박스
  const [keepOptions, setKeepOptions] = useState(true);
  
  // 필터 state
  const [sortOrder, setSortOrder] = useState(() => getStoredValue("newsFilter_sort", "최신순"));
  const [periodFilter, setPeriodFilter] = useState(() => getStoredValue("newsFilter_period", "전체"));
  const [pressFilter, setPressFilter] = useState(() => getStoredValue("newsFilter_press", "전체"));
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [showHourOptions, setShowHourOptions] = useState(false);
  const [expandedPressCategories, setExpandedPressCategories] = useState({}); 
  
  // 워드클라우드 기간 선택
  const [wcYear, setWcYear] = useState(2025);
  const [wcStartDate, setWcStartDate] = useState("2025-01-01");
  const [wcEndDate, setWcEndDate] = useState("2025-12-31");
  
  // 엑셀/뉴스레터 년월 선택
  const [excelYear, setExcelYear] = useState(2025);
  const [excelMonth, setExcelMonth] = useState(9);
  const [newsletterYear, setNewsletterYear] = useState(2025);
  const [newsletterMonth, setNewsletterMonth] = useState(9);

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

  const currentSectionTags = useMemo(() => {
    if (activeSection === "all") return [];
    const tags = TAG_SECTIONS[activeSection] || [];
    return tags.filter((name) => tagCount.get(name) > 0);
  }, [activeSection, tagCount]);

  useEffect(() => {
    setActiveTag("all");
  }, [activeSection]);

  // localStorage에 필터 상태 저장 (옵션 유지 활성화 시에만)
  useEffect(() => {
    if (keepOptions) {
      localStorage.setItem("newsFilter_sort", sortOrder);
      localStorage.setItem("newsFilter_period", periodFilter);
      localStorage.setItem("newsFilter_press", pressFilter);
    }
  }, [sortOrder, periodFilter, pressFilter, keepOptions]);

  const pressList = useMemo(() => {
    const sources = new Set(articles.map(a => a.source).filter(Boolean));
    const sortedSources = Array.from(sources).sort();
    
    // 카테고리 자동 분류 시도 (키워드 기반)
    const categories = {
      "일간지": [],
      "경제/IT": [],
      "인터넷신문": [],
      "전문지": [],
      "기타": []
    };
    
    sortedSources.forEach(source => {
      const lower = source.toLowerCase();
      if (lower.includes("경제") || lower.includes("비즈") || lower.includes("it") || lower.includes("tech")) {
        categories["경제/IT"].push(source);
      } else if (lower.includes("데일리") || lower.includes("online") || lower.includes("닷컴")) {
        categories["인터넷신문"].push(source);
      } else if (lower.includes("전문") || lower.includes("매거진") || lower.includes("리뷰")) {
        categories["전문지"].push(source);
      } else if (lower.includes("신문") || lower.includes("일보")) {
        categories["일간지"].push(source);
      } else {
        categories["기타"].push(source);
      }
    });
    
    // 빈 카테고리 제거
    Object.keys(categories).forEach(key => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });
    
    // 카테고리가 2개 이상이면 카테고리별로 반환, 아니면 단순 리스트
    if (Object.keys(categories).length >= 2) {
      return { type: "categorized", data: categories };
    } else {
      return { type: "simple", data: ["전체", ...sortedSources] };
    }
  }, [articles]);

  const filtered = useMemo(() => {
    let result = [...articles];
    
    if (activeSection !== "all") {
      const sectionTags = TAG_SECTIONS[activeSection] || [];
      result = result.filter((a) => 
        a.tags.some((t) => sectionTags.includes(t.name))
      );
    }
    
    if (activeTag !== "all") {
      result = result.filter((a) => 
        a.tags.some((t) => t.name === activeTag)
      );
    }

    if (pressFilter !== "전체") {
      result = result.filter((a) => a.source === pressFilter);
    }

    // 기간 필터
if (periodFilter === "직접입력" && customStartDate && customEndDate) {
  const start = new Date(customStartDate);
  const end = new Date(customEndDate);
  result = result.filter((a) => {
    if (!a.date) return false;
    const articleDate = new Date(a.date);
    return articleDate >= start && articleDate <= end;
  });
} else if (periodFilter !== "전체" && periodFilter !== "직접입력") {
  const now = new Date();
  result = result.filter((a) => {
    if (!a.date) return false;
    const articleDate = new Date(a.date);
    const diffMs = now - articleDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    switch(periodFilter) {
      case "1시간": return diffHours <= 1;
      case "2시간": return diffHours <= 2;
      case "3시간": return diffHours <= 3;
      case "4시간": return diffHours <= 4;
      case "5시간": return diffHours <= 5;
      case "6시간": return diffHours <= 6;
      case "1일": return diffDays <= 1;
      case "1주": return diffDays <= 7;
      case "1개월": return diffDays <= 30;
      case "3개월": return diffDays <= 90;
      case "6개월": return diffDays <= 180;
      case "1년": return diffDays <= 365;
      default: return true;
    }
  });
}
    
    if (sortOrder === "최신순") {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === "오래된순") {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    return result;
  }, [activeSection, activeTag, sortOrder, periodFilter, pressFilter, articles, customStartDate, customEndDate]);

  const resetFilters = () => {
    setSortOrder("최신순");
    setPeriodFilter("전체");
    setPressFilter("전체");
    setCustomStartDate("");
    setCustomEndDate("");
    setShowCustomDate(false);
  };

  const downloadExcel = useCallback(() => {
    if (articles.length === 0) {
      alert("뉴스 데이터가 없습니다.");
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
    XLSX.utils.book_append_sheet(wb, ws, `${excelYear}-${excelMonth}월뉴스`);
    XLSX.writeFile(wb, `${excelYear}년_${excelMonth}월_뉴스.xlsx`);
  }, [articles, excelYear, excelMonth]);

  const generateWordCloud = () => {
    alert(`워드클라우드 생성: ${wcStartDate} ~ ${wcEndDate}`);
    // TODO: 실제 워드클라우드 생성 로직
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
      {/* 왼쪽 사이드바 */}
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

      {/* 메인 콘텐츠 */}
      <div style={{ flex: 1, padding: "2rem" }}>
        <h1 style={{ fontSize: "2.3rem", color: "#ff8c42", textAlign: "center", marginBottom: "1.6rem" }}>
          News
        </h1>

        {/* 상단 액션 버튼 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* 워드클라우드 */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", background: "rgba(100, 181, 246, 0.1)", padding: "0.5rem 1rem", borderRadius: "50px", border: "1px solid rgba(100, 181, 246, 0.3)" }}>
            <input
              type="date"
              value={wcStartDate}
              onChange={(e) => setWcStartDate(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "0.4rem",
                color: "white",
                fontSize: "0.85rem",
              }}
            />
            <span style={{ color: "white" }}>~</span>
            <input
              type="date"
              value={wcEndDate}
              onChange={(e) => setWcEndDate(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "0.4rem",
                color: "white",
                fontSize: "0.85rem",
              }}
            />
            <button
              onClick={generateWordCloud}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              워드클라우드 생성
            </button>
          </div>

          {/* Excel 다운로드 */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", background: "rgba(76, 175, 80, 0.1)", padding: "0.5rem 1rem", borderRadius: "50px", border: "1px solid rgba(76, 175, 80, 0.3)" }}>
            <select
              value={excelYear}
              onChange={(e) => setExcelYear(Number(e.target.value))}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "0.4rem",
                color: "white",
                fontSize: "0.85rem",
              }}
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year} style={{ background: "#1a1a2e" }}>{year}년</option>
              ))}
            </select>
            <select
              value={excelMonth}
              onChange={(e) => setExcelMonth(Number(e.target.value))}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "0.4rem",
                color: "white",
                fontSize: "0.85rem",
              }}
            >
              {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                <option key={month} value={month} style={{ background: "#1a1a2e" }}>{month}월</option>
              ))}
            </select>
            <button
              onClick={downloadExcel}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              Excel 다운로드
            </button>
          </div>

          {/* Newsletter */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", background: "rgba(255, 140, 66, 0.1)", padding: "0.5rem 1rem", borderRadius: "50px", border: "1px solid rgba(255, 140, 66, 0.35)" }}>
            <select
              value={newsletterYear}
              onChange={(e) => setNewsletterYear(Number(e.target.value))}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "0.4rem",
                color: "white",
                fontSize: "0.85rem",
              }}
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year} style={{ background: "#1a1a2e" }}>{year}년</option>
              ))}
            </select>
            <select
              value={newsletterMonth}
              onChange={(e) => setNewsletterMonth(Number(e.target.value))}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "0.4rem",
                color: "white",
                fontSize: "0.85rem",
              }}
            >
              {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                <option key={month} value={month} style={{ background: "#1a1a2e" }}>{month}월</option>
              ))}
            </select>
            <a
              href={`/Newsletter_${newsletterYear}-${String(newsletterMonth).padStart(2, '0')}.html`}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                Newsletter 보러가기
              </button>
            </a>
          </div>
        </div>

        {/* 필터 토글 버튼 */}
        <div style={{ maxWidth: 1200, margin: "0 auto 1rem" }}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{
              background: "rgba(255, 140, 66, 0.15)",
              border: "1px solid rgba(255, 140, 66, 0.4)",
              borderRadius: "12px",
              padding: "0.8rem 1.5rem",
              color: "#ff8c42",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.3s ease",
            }}
          >
            옵션 {isFilterOpen ? "▲" : "▼"}
          </button>
        </div>

        {/* 필터 영역 */}
        {isFilterOpen && (
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
            {/* 정렬 필터 */}
<div style={{ marginBottom: "1.5rem" }}>
  <div style={{ color: "#ff8c42", fontWeight: 700, marginBottom: "0.8rem", fontSize: "1rem" }}>
    정렬
  </div>
  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
    {["최신순", "오래된순", "정확도순", "관련도순"].map((sort) => (
      <button
        key={sort}
        onClick={() => setSortOrder(sort)}
        style={{
          padding: "0.5rem 1rem",
          background: sortOrder === sort ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
          border: "1px solid",
          borderColor: sortOrder === sort ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          color: "white",
          cursor: "pointer",
          fontSize: "0.85rem",
          transition: "all 0.2s ease",
        }}
      >
        {sort}
      </button>
    ))}
  </div>
</div>

              {/* 기간 필터 */}
<div style={{ marginBottom: "1.5rem" }}>
  <div style={{ color: "#ff8c42", fontWeight: 700, marginBottom: "0.8rem", fontSize: "1rem" }}>
    기간
  </div>
  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
    <button
      onClick={() => {
        setPeriodFilter("전체");
        setShowCustomDate(false);
        setShowHourOptions(false);
      }}
      style={{
        padding: "0.5rem 1rem",
        background: periodFilter === "전체" ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
        border: "1px solid",
        borderColor: periodFilter === "전체" ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
        borderRadius: "20px",
        color: "white",
        cursor: "pointer",
        fontSize: "0.85rem",
        transition: "all 0.2s ease",
      }}
    >
      전체
    </button>
    
    {/* 1시간 토글 버튼 */}
    <button
      onClick={() => {
        setShowHourOptions(!showHourOptions);
        setShowCustomDate(false);
        if (!showHourOptions) {
          setPeriodFilter("1시간");
        }
      }}
      style={{
        padding: "0.5rem 1rem",
        background: periodFilter.includes("시간") ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
        border: "1px solid",
        borderColor: periodFilter.includes("시간") ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
        borderRadius: "20px",
        color: "white",
        cursor: "pointer",
        fontSize: "0.85rem",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
      }}
    >
      1시간
      <span style={{ fontSize: "0.7rem" }}>{showHourOptions ? "▲" : "▼"}</span>
    </button>
    
    {["1일", "1주", "1개월", "3개월", "6개월", "1년"].map((period) => (
      <button
        key={period}
        onClick={() => {
          setPeriodFilter(period);
          setShowCustomDate(false);
          setShowHourOptions(false);
        }}
        style={{
          padding: "0.5rem 1rem",
          background: periodFilter === period ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
          border: "1px solid",
          borderColor: periodFilter === period ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          color: "white",
          cursor: "pointer",
          fontSize: "0.85rem",
          transition: "all 0.2s ease",
        }}
      >
        {period}
      </button>
    ))}
    
    {/* 직접입력 토글 버튼 */}
    <button
      onClick={() => {
        setShowCustomDate(!showCustomDate);
        setShowHourOptions(false);
        if (!showCustomDate) {
          setPeriodFilter("직접입력");
        }
      }}
      style={{
        padding: "0.5rem 1rem",
        background: showCustomDate ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
        border: "1px solid",
        borderColor: showCustomDate ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
        borderRadius: "20px",
        color: "white",
        cursor: "pointer",
        fontSize: "0.85rem",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
      }}
    >
      직접입력
      <span style={{ fontSize: "0.7rem" }}>{showCustomDate ? "▲" : "▼"}</span>
    </button>
  </div>
  
  {/* 1시간 세부 옵션 */}
  {showHourOptions && (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.8rem", paddingLeft: "0.5rem" }}>
      {["1시간", "2시간", "3시간", "4시간", "5시간", "6시간"].map((hour) => (
        <button
          key={hour}
          onClick={() => setPeriodFilter(hour)}
          style={{
            padding: "0.4rem 0.8rem",
            background: periodFilter === hour ? "#ff8c42" : "rgba(255, 255, 255, 0.08)",
            border: "1px solid",
            borderColor: periodFilter === hour ? "#ff8c42" : "rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            color: "white",
            cursor: "pointer",
            fontSize: "0.8rem",
            transition: "all 0.2s ease",
          }}
        >
          {hour}
        </button>
      ))}
    </div>
  )}
  
  {/* 직접입력 달력 */}
  {showCustomDate && (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.8rem", padding: "1rem", background: "rgba(255, 255, 255, 0.05)", borderRadius: "12px" }}>
      <input
        type="date"
        value={customStartDate}
        onChange={(e) => setCustomStartDate(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px",
          padding: "0.5rem",
          color: "white",
          fontSize: "0.9rem",
        }}
      />
      <span style={{ color: "white" }}>~</span>
      <input
        type="date"
        value={customEndDate}
        onChange={(e) => setCustomEndDate(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px",
          padding: "0.5rem",
          color: "white",
          fontSize: "0.9rem",
        }}
      />
    </div>
  )}
</div>


{/* 언론사 필터 */}
<div style={{ marginBottom: "1.5rem" }}>
  <div style={{ color: "#ff8c42", fontWeight: 700, marginBottom: "0.8rem", fontSize: "1rem" }}>
    언론사
  </div>
  
  {pressList.type === "categorized" ? (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {/* 전체 버튼 */}
        <button
          onClick={() => {
            setPressFilter("전체");
            setExpandedPressCategories({});
          }}
          style={{
            padding: "0.5rem 1rem",
            background: pressFilter === "전체" ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
            border: "1px solid",
            borderColor: pressFilter === "전체" ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            color: "white",
            cursor: "pointer",
            fontSize: "0.85rem",
            transition: "all 0.2s ease",
          }}
        >
          전체
        </button>
        
        {/* 유형별 토글 버튼 */}
        <button
          onClick={() => {
            const allExpanded = Object.keys(pressList.data).every(cat => expandedPressCategories[cat]);
            if (allExpanded) {
              setExpandedPressCategories({});
            } else {
              const expanded = {};
              Object.keys(pressList.data).forEach(cat => expanded[cat] = true);
              setExpandedPressCategories(expanded);
            }
          }}
          style={{
            padding: "0.5rem 1rem",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            color: "white",
            cursor: "pointer",
            fontSize: "0.85rem",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          유형별
          <span style={{ fontSize: "0.7rem" }}>
            {Object.keys(expandedPressCategories).length > 0 ? "▲" : "▼"}
          </span>
        </button>
      </div>

      {/* 카테고리별 언론사 */}
      {Object.keys(expandedPressCategories).length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingLeft: "0.5rem" }}>
          {Object.entries(pressList.data).map(([category, sources]) => (
            expandedPressCategories[category] && (
              <div key={category}>
                <div style={{ 
                  color: "white",
                  fontSize: "0.9rem", 
                  fontWeight: 600, 
                  marginBottom: "0.5rem",
                  paddingLeft: "0.5rem"
                }}>
                  {category} ({sources.length})
                </div>
                
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", paddingLeft: "1rem" }}>
                  {sources.map((source) => (
                    <button
                      key={source}
                      onClick={() => setPressFilter(source)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: pressFilter === source ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
                        border: "1px solid",
                        borderColor: pressFilter === source ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
                        borderRadius: "20px",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {source}
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  ) : (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {pressList.data.map((press) => (
        <button
          key={press}
          onClick={() => setPressFilter(press)}
          style={{
            padding: "0.5rem 1rem",
            background: pressFilter === press ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
            border: "1px solid",
            borderColor: pressFilter === press ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            color: "white",
            cursor: "pointer",
            fontSize: "0.85rem",
            transition: "all 0.2s ease",
          }}
        >
          {press}
        </button>
      ))}
    </div>
  )}
</div>

            {/* 옵션 버튼 */}
<div style={{ display: "flex", gap: "1rem", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.1)", marginTop: "1rem" }}>
  <button
    onClick={resetFilters}
    style={{
      padding: "0.6rem 1.5rem",
      background: "transparent",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50px",
      color: "white",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "normal",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
    }}
  >
    <span style={{ fontSize: "1rem" }}>↻</span>
    <span>옵션 초기화</span>
  </button>
              {/* 토글 스위치 형태의 옵션 유지 */}
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <span style={{ color: "#aaa", fontSize: "0.9rem" }}>옵션 유지</span>
                <div
                  onClick={() => setKeepOptions(!keepOptions)}
                  style={{
                    position: "relative",
                    width: "44px",
                    height: "24px",
                    background: keepOptions ? "#4caf50" : "rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    transition: "background 0.3s ease",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: keepOptions ? "22px" : "2px",
                      width: "20px",
                      height: "20px",
                      background: "white",
                      borderRadius: "50%",
                      transition: "left 0.3s ease",
                    }}
                  />
                </div>
              </label>
            </div>
          </div>
        )}

        {/* 세부 태그 필터 */}
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
              해당 조건의 뉴스가 없습니다.
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
                    