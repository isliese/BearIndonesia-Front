// 상단 액션 컴포넌트

import React from "react";

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
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        marginBottom: "2rem",
        flexWrap: "wrap",
        alignItems: "center",
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
        }}
      >
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
          onClick={onGenerateWordCloud}
          disabled={wordCloudLoading}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: wordCloudLoading ? "not-allowed" : "pointer",
            fontSize: "0.9rem",
            fontWeight: "bold",
            opacity: wordCloudLoading ? 0.6 : 1,
          }}
        >
          {wordCloudLoading ? "로딩 중..." : "워드클라우드 생성"}
        </button>
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
        }}
      >
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
          {[2024, 2025, 2026].map((year) => (
            <option key={year} value={year} style={{ background: "#1a1a2e" }}>
              {year}년
            </option>
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
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month} style={{ background: "#1a1a2e" }}>
              {month}월
            </option>
          ))}
        </select>
        <button
          onClick={onDownloadExcel}
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

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          background: "rgba(255, 140, 66, 0.1)",
          padding: "0.5rem 1rem",
          borderRadius: "50px",
          border: "1px solid rgba(255, 140, 66, 0.35)",
        }}
      >
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
          {[2024, 2025, 2026].map((year) => (
            <option key={year} value={year} style={{ background: "#1a1a2e" }}>
              {year}년
            </option>
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
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month} style={{ background: "#1a1a2e" }}>
              {month}월
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => alert("현재 개발중인 기능입니다.")}
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
      </div>
    </div>
  );
};

export default NewsTopActions;
