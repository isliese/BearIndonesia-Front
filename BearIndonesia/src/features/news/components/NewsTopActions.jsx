// 상단 액션 컴포넌트

import React, { useState } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

const NewsTopActions = ({
  wcStartDate,
  wcEndDate,
  setWcStartDate,
  setWcEndDate,
  onGenerateWordCloud,
  wordCloudLoading,
  excelYear,
  excelMonth,
  setExcelYear,
  setExcelMonth,
  onDownloadExcel,
  newsletterYear,
  newsletterMonth,
  setNewsletterYear,
  setNewsletterMonth,
  onOpenNewsletter,
  newsletterLoading,
}) => {
  const [isWcHover, setIsWcHover] = useState(false);
  const [isExcelHover, setIsExcelHover] = useState(false);
  const [isNewsletterHover, setIsNewsletterHover] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const today = now.toISOString().slice(0, 10);
  const selectableYears = [];
  for (let year = 2025; year <= currentYear; year += 1) {
    selectableYears.push(year);
  }
  const getSelectableMonths = (year) => {
    const maxMonth = year === currentYear ? currentMonth : 12;
    return Array.from({ length: maxMonth }, (_, i) => i + 1);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        marginBottom: "2rem",
        flexWrap: "wrap",
        alignItems: "center",
        ...(isMobile
          ? {
              flexDirection: "column",
              gap: "0.75rem",
              width: "100%",
            }
          : null),
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          background: "rgba(100, 181, 246, 0.1)",
          padding: "0.5rem 1rem",
          borderRadius: "50px",
          border: "1px solid rgba(100, 181, 246, 0.3)",
          ...(isMobile
            ? {
                flexWrap: "wrap",
                width: "100%",
                maxWidth: "560px",
                boxSizing: "border-box",
              }
            : null),
        }}
      >
        <input
          type="date"
          id="wc-start-date"
          name="wcStartDate"
          value={wcStartDate}
          onChange={(e) => setWcStartDate(e.target.value)}
          min="2025-01-01"
          max={today}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "0.4rem",
            color: "white",
            fontSize: "0.85rem",
            ...(isMobile ? { flex: "1 1 150px", minWidth: 0 } : null),
          }}
        />
        <span style={{ color: "white" }}>~</span>
        <input
          type="date"
          id="wc-end-date"
          name="wcEndDate"
          value={wcEndDate}
          onChange={(e) => setWcEndDate(e.target.value)}
          min="2025-01-01"
          max={today}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "0.4rem",
            color: "white",
            fontSize: "0.85rem",
            ...(isMobile ? { flex: "1 1 150px", minWidth: 0 } : null),
          }}
        />
        <div style={{ position: "relative", display: "inline-flex" }}>
          <button
            onClick={onGenerateWordCloud}
            disabled={wordCloudLoading}
            onMouseEnter={() => setIsWcHover(true)}
            onMouseLeave={() => setIsWcHover(false)}
            style={{
              background: isWcHover ? "rgba(100, 181, 246, 0.22)" : "transparent",
              border: "1px solid rgba(100, 181, 246, 0.35)",
              color: "white",
              cursor: wordCloudLoading ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
              fontWeight: "bold",
              opacity: wordCloudLoading ? 0.6 : 1,
              padding: "0.35rem 0.9rem",
              borderRadius: "999px",
              transition: "transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease",
              boxShadow: isWcHover ? "0 6px 14px rgba(100, 181, 246, 0.25)" : "none",
              transform: isWcHover ? "translateY(-1px)" : "translateY(0)",
              ...(isMobile ? { width: "100%", whiteSpace: "nowrap" } : null),
            }}
          >
            {wordCloudLoading ? "로딩 중..." : "워드클라우드 생성"}
          </button>
          {isWcHover && !wordCloudLoading && (
            <div
              style={{
                position: "absolute",
                bottom: "140%",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(15, 23, 42, 0.92)",
                color: "white",
                padding: "0.5rem 0.7rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                border: "1px solid rgba(148, 163, 184, 0.35)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
                zIndex: 1,
              }}
	            >
	              기간을 넓게 설정하면 워드클라우드 생성 시간이 다소 길어질 수 있습니다.
	            </div>
	          )}
	        </div>
	      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          background: "rgba(76, 175, 80, 0.1)",
          padding: "0.5rem 1rem",
          borderRadius: "50px",
          border: "1px solid rgba(76, 175, 80, 0.3)",
          ...(isMobile
            ? {
                flexWrap: "wrap",
                width: "100%",
                maxWidth: "560px",
                boxSizing: "border-box",
              }
            : null),
        }}
      >
        <select
          id="excel-year"
          name="excelYear"
          value={excelYear}
          onChange={(e) => setExcelYear(Number(e.target.value))}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "0.4rem",
            color: "white",
            fontSize: "0.85rem",
            ...(isMobile ? { flex: "1 1 110px", minWidth: 0 } : null),
          }}
        >
          {selectableYears.map((year) => (
            <option key={year} value={year} style={{ background: "#1a1a2e" }}>
              {year}년
            </option>
          ))}
        </select>
        <select
          id="excel-month"
          name="excelMonth"
          value={excelMonth}
          onChange={(e) => setExcelMonth(Number(e.target.value))}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "0.4rem",
            color: "white",
            fontSize: "0.85rem",
            ...(isMobile ? { flex: "1 1 90px", minWidth: 0 } : null),
          }}
        >
          {getSelectableMonths(excelYear).map((month) => (
            <option key={month} value={month} style={{ background: "#1a1a2e" }}>
              {month}월
            </option>
          ))}
        </select>
        <button
          onClick={onDownloadExcel}
          onMouseEnter={() => setIsExcelHover(true)}
          onMouseLeave={() => setIsExcelHover(false)}
          style={{
            background: isExcelHover ? "rgba(76, 175, 80, 0.22)" : "transparent",
            border: "1px solid rgba(76, 175, 80, 0.35)",
            color: "white",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "bold",
            padding: "0.35rem 0.9rem",
            borderRadius: "999px",
            transition: "transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease",
            boxShadow: isExcelHover ? "0 6px 14px rgba(76, 175, 80, 0.25)" : "none",
            transform: isExcelHover ? "translateY(-1px)" : "translateY(0)",
            ...(isMobile ? { width: "100%", whiteSpace: "nowrap" } : null),
          }}
        >
          Excel 다운로드
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          background: "rgba(255, 140, 66, 0.1)",
          padding: "0.5rem 1rem",
          borderRadius: "50px",
          border: "1px solid rgba(255, 140, 66, 0.35)",
          ...(isMobile
            ? {
                flexWrap: "wrap",
                width: "100%",
                maxWidth: "560px",
                boxSizing: "border-box",
              }
            : null),
        }}
      >
        <select
          id="newsletter-year"
          name="newsletterYear"
          value={newsletterYear}
          onChange={(e) => setNewsletterYear(Number(e.target.value))}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "0.4rem",
            color: "white",
            fontSize: "0.85rem",
            ...(isMobile ? { flex: "1 1 110px", minWidth: 0 } : null),
          }}
        >
          {selectableYears.map((year) => (
            <option key={year} value={year} style={{ background: "#1a1a2e" }}>
              {year}년
            </option>
          ))}
        </select>
        <select
          id="newsletter-month"
          name="newsletterMonth"
          value={newsletterMonth}
          onChange={(e) => setNewsletterMonth(Number(e.target.value))}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "0.4rem",
            color: "white",
            fontSize: "0.85rem",
            ...(isMobile ? { flex: "1 1 90px", minWidth: 0 } : null),
          }}
        >
          {getSelectableMonths(newsletterYear).map((month) => (
            <option key={month} value={month} style={{ background: "#1a1a2e" }}>
              {month}월
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onOpenNewsletter}
          disabled={newsletterLoading}
          onMouseEnter={() => setIsNewsletterHover(true)}
          onMouseLeave={() => setIsNewsletterHover(false)}
          style={{
            background: isNewsletterHover ? "rgba(255, 140, 66, 0.22)" : "transparent",
            border: "1px solid rgba(255, 140, 66, 0.45)",
            color: "white",
            cursor: newsletterLoading ? "not-allowed" : "pointer",
            fontSize: "0.9rem",
            fontWeight: "bold",
            padding: "0.35rem 0.9rem",
            borderRadius: "999px",
            transition: "transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease",
            boxShadow: isNewsletterHover ? "0 6px 14px rgba(255, 140, 66, 0.25)" : "none",
            transform: isNewsletterHover ? "translateY(-1px)" : "translateY(0)",
            opacity: newsletterLoading ? 0.6 : 1,
            ...(isMobile ? { width: "100%", whiteSpace: "nowrap" } : null),
          }}
        >
          {newsletterLoading ? "생성 중..." : "Newsletter 보러가기"}
        </button>
      </div>
    </div>
  );
};

export default NewsTopActions;
