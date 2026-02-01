// News 페이지 (통합 버전) 

import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { request } from "../../../api/httpClient";
// 컴포넌트 imports
import NewsFilterPanel from "../components/NewsFilterPanel";
import NewsGrid from "../components/NewsGrid";
import NewsSidebar from "../components/NewsSidebar";
import NewsTagFilter from "../components/NewsTagFilter";
import NewsTopActions from "../components/NewsTopActions";
import WordCloudModal from "../components/WordCloudModal";
import { SECTION_ORDER, TAG_SECTIONS, CRAWLED_NEWS_SITES } from "../newsConstants";


const UnifiedNewsPage = ({ setSelectedNews }) => {
  const getStoredValue = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? stored : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [activeSection, setActiveSection] = useState("all");
  const [activeTags, setActiveTags] = useState([]);
  const [showWordCloud, setShowWordCloud] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const mainContentRef = useRef(null);
  const hasRestoredRef = useRef(false);
  const isRestoringRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  
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
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const [excelYear, setExcelYear] = useState(currentYear);
  const [excelMonth, setExcelMonth] = useState(currentMonth);
  const [newsletterYear, setNewsletterYear] = useState(currentYear);
  const [newsletterMonth, setNewsletterMonth] = useState(currentMonth);

  const normalizeTags = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((t) => (typeof t === "string" ? { name: t } : { ...t, name: String(t?.name ?? "").trim() }))
        .filter((t) => t.name);
    }
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed
            .map((t) => (typeof t === "string" ? { name: t } : { ...t, name: String(t?.name ?? "").trim() }))
            .filter((t) => t.name);
        }
      } catch {
        return value
          .split(",")
          .map((t) => ({ name: t.trim() }))
          .filter((t) => t.name);
      }
    }
    if (value && typeof value === "object") {
      const name = String(value?.name ?? "").trim();
      return name ? [{ name }] : [];
    }
    return [];
  };

  const getSessionValue = (key, defaultValue) => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored === null) return defaultValue;
      return JSON.parse(stored);
    } catch {
      return defaultValue;
    }
  };

  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    const savedSection = getSessionValue("news_activeSection", "all");
    const savedTags = getSessionValue("news_activeTags", []);
    if (savedSection && savedSection !== "all") {
      isRestoringRef.current = true;
      setActiveSection(savedSection);
      if (Array.isArray(savedTags) && savedTags.length > 0) {
        setActiveTags(savedTags);
      }
    }
  }, []);

  useEffect(() => {
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }
    setActiveTags([]);
  }, [activeSection]);

  useEffect(() => {
    try {
      sessionStorage.setItem("news_activeSection", JSON.stringify(activeSection));
      sessionStorage.setItem("news_activeTags", JSON.stringify(activeTags));
    } catch {
      // ignore write errors
    }
  }, [activeSection, activeTags]);


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const response = await fetch("/api/articles", { signal: controller.signal });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }
        const data = await response.json();
        const results = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        const normalized = results.map((item) => ({
          ...item,
          id: item?.id ?? item?.rawNewsId ?? item?.raw_news_id ?? null,
          date: item?.publishedDate ?? item?.date ?? "",
          korContent: item?.korContent ?? item?.translated ?? "",
          idSummary: item?.idSummary ?? item?.id_summary ?? "",
          img:
            item?.img ??
            item?.image ??
            item?.imageUrl ??
            item?.image_url ??
            item?.thumbnail ??
            item?.thumb ??
            item?.coverImage ??
            item?.cover_image ??
            item?.photo ??
            "",
          semanticConfidence: item?.semanticConfidence ?? item?.semantic_confidence ?? null,
          tagMismatch: item?.tagMismatch ?? item?.tag_mismatch ?? null,
          categoryMismatch: item?.categoryMismatch ?? item?.category_mismatch ?? null,
          tags: normalizeTags(item?.tags),
        }));
        if (isMounted) {
          setArticles(normalized);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        if (isMounted) {
          setLoadError(err.message || "뉴스 데이터를 불러오지 못했습니다.");
          setArticles([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
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

  // localStorage에 필터 상태 저장 (옵션 유지 활성화 시)
  useEffect(() => {
    if (keepOptions) {
      localStorage.setItem("newsFilter_sort", sortOrder);
      localStorage.setItem("newsFilter_period", periodFilter);
      localStorage.setItem("newsFilter_press", pressFilter);
    }
  }, [sortOrder, periodFilter, pressFilter, keepOptions]);

  const pressList = useMemo(() => {
    // 23개 크롤링 뉴스 사이트 목록을 모두 필터 옵션으로 표시
    // 중복 제거 (예: "Detik"과 "detik")
    const uniqueSites = [];
    const seen = new Set();
    CRAWLED_NEWS_SITES.forEach(site => {
      const siteLower = site.toLowerCase().trim();
      if (!seen.has(siteLower)) {
        seen.add(siteLower);
        // 대문자로 시작하는 버전 우선 (예: "Detik" 우선)
        const existing = uniqueSites.find(s => s.toLowerCase().trim() === siteLower);
        if (existing) {
          // 이미 있으면 더 적절한 버전 유지 (대문자로 시작하는 것)
          if (site[0] === site[0].toUpperCase() && existing[0] !== existing[0].toUpperCase()) {
            const index = uniqueSites.indexOf(existing);
            uniqueSites[index] = site;
          }
        } else {
          uniqueSites.push(site);
        }
      }
    });
    
    // 카테고리 자동 분류 시도 (키워드 기반)
    const categories = {
      "종합 뉴스": [],
      "경제/IT": [],
      "정부 기관": [],
      "기타": []
    };
    
    uniqueSites.forEach(site => {
      const lower = site.toLowerCase();
      if (lower.includes("bpom") || lower.includes("moh") || lower.includes("bpjs") || lower.includes("정부") || lower.includes("대통령")) {
        categories["정부 기관"].push(site);
      } else if (lower.includes("경제") || lower.includes("비즈") || lower.includes("it") || lower.includes("tech") || lower.includes("cnbc") || lower.includes("kontan") || lower.includes("bisnis") || lower.includes("idx")) {
        categories["경제/IT"].push(site);
      } else if (lower.includes("cnn") || lower.includes("detik") || lower.includes("kompas") || lower.includes("tempo") || lower.includes("liputan") || lower.includes("sindo") || lower.includes("suara") || lower.includes("antara") || lower.includes("viva") || lower.includes("jawa")) {
        categories["종합 뉴스"].push(site);
      } else {
        categories["기타"].push(site);
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
      return { type: "simple", data: ["전체", ...uniqueSites.sort()] };
    }
  }, []);

  const filtered = useMemo(() => {
    let result = [...articles];
    
    if (activeSection !== "all") {
      const sectionTags = TAG_SECTIONS[activeSection] || [];
      result = result.filter((a) => 
        a.tags.some((t) => sectionTags.includes(t.name))
      );
    }
    
    if (activeTags.length > 0) {
      result = result.filter((a) => 
        a.tags.some((t) => activeTags.includes(t.name))
      );
    }

    if (pressFilter !== "전체") {
      // 뉴스 사이트 필터링 (대소문자 무시, 부분 일치 허용)
      result = result.filter((a) => {
        if (!a.source) return false;
        const sourceLower = a.source.toLowerCase().trim();
        const filterLower = pressFilter.toLowerCase().trim();
        return sourceLower === filterLower || 
               sourceLower.includes(filterLower) || 
               filterLower.includes(sourceLower);
      });
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
  }, [activeSection, activeTags, sortOrder, periodFilter, pressFilter, articles, customStartDate, customEndDate]);

  const resetFilters = () => {
    setSortOrder("최신순");
    setPeriodFilter("전체");
    setPressFilter("전체");
    setCustomStartDate("");
    setCustomEndDate("");
    setShowCustomDate(false);
  };

  const downloadExcel = useCallback(async () => {
    if (!excelYear || !excelMonth) {
      alert("?? ??? ??????.");
      return;
    }

    try {
      const blob = await request(`/api/articles/excel?year=${excelYear}&month=${excelMonth}`, {
        responseType: "blob",
      });
      const safeMonth = String(excelMonth).padStart(2, "0");
      const fileName = `${excelYear}-${safeMonth}-news.xlsx`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("?? ???? ??", error);
      alert("?? ????? ??????.");
    }
  }, [excelYear, excelMonth]);


  const generateWordCloud = () => {
    alert(`워드클라우드 생성: ${wcStartDate} ~ ${wcEndDate}`);
    // TODO: 실제 워드클라우드 생성 로직
  };

  const sidebarWidth = isSidebarCollapsed ? 80 : 240;

  return (
    <div style={{ minHeight: "100vh", display: "flex", }}>
      {/* 왼쪽 사이드바 */}
      <NewsSidebar
        activeSection={activeSection}
        onChangeSection={setActiveSection}
        sectionOrder={SECTION_ORDER}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* 메인 콘텐츠 */}
      <div
        ref={mainContentRef}
        style={{
          flex: 1,
          padding: "0.1rem",
          marginLeft: `${sidebarWidth}px`,
          marginRight: isSidebarCollapsed ? `${sidebarWidth}px` : "0",
          transition: "margin 0.3s ease",
        }}
      >
        <h1 style={{ fontSize: "2.3rem", color: "#ff8c42", textAlign: "center", marginBottom: "1.6rem" }}>
          News
        </h1>

        {/* 상단 액션 버튼 */}
        <NewsTopActions
          wcStartDate={wcStartDate}
          wcEndDate={wcEndDate}
          setWcStartDate={setWcStartDate}
          setWcEndDate={setWcEndDate}
          onGenerateWordCloud={generateWordCloud}
          excelYear={excelYear}
          excelMonth={excelMonth}
          setExcelYear={setExcelYear}
          setExcelMonth={setExcelMonth}
          onDownloadExcel={downloadExcel}
          newsletterYear={newsletterYear}
          newsletterMonth={newsletterMonth}
          setNewsletterYear={setNewsletterYear}
          setNewsletterMonth={setNewsletterMonth}
        />

        <NewsFilterPanel
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          periodFilter={periodFilter}
          setPeriodFilter={setPeriodFilter}
          showCustomDate={showCustomDate}
          setShowCustomDate={setShowCustomDate}
          showHourOptions={showHourOptions}
          setShowHourOptions={setShowHourOptions}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          pressList={pressList}
          pressFilter={pressFilter}
          setPressFilter={setPressFilter}
          expandedPressCategories={expandedPressCategories}
          setExpandedPressCategories={setExpandedPressCategories}
          keepOptions={keepOptions}
          setKeepOptions={setKeepOptions}
          onReset={resetFilters}
        />

        <NewsTagFilter
          activeSection={activeSection}
          currentSectionTags={currentSectionTags}
          activeTags={activeTags}
          setActiveTags={setActiveTags}
        />

        {isLoading && (
          <div style={{ textAlign: "center", color: "#999", padding: "1rem 0" }}>
            뉴스 데이터를 불러오는 중...
          </div>
        )}
        {!isLoading && loadError && (
          <div style={{ textAlign: "center", color: "#ff8c42", padding: "1rem 0" }}>
            {loadError}
          </div>
        )}

        <NewsGrid
          articles={filtered}
          onOpen={(article) => {
            setSelectedNews?.(article);
            navigate("/news/detail", { state: { from: `${location.pathname}${location.search}` } });
          }}
        />
      </div>

      {/* 워드클라우드 모달 */}
      <WordCloudModal
        isOpen={showWordCloud}
        onClose={() => setShowWordCloud(false)}
      />

    </div>
  );
};

export default UnifiedNewsPage;
