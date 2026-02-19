// 뉴스 카드 컴포넌트 그리드

import React from "react";
import NewsCard from "./NewsCard";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

const NewsGrid = ({ articles, onOpen }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1200px)");

  return (
    <div
      style={{
        overflowX: isMobile ? "visible" : "auto",
        overflowY: "hidden",
        paddingBottom: isMobile ? 0 : "0.25rem",
        paddingLeft: isMobile ? "0.25rem" : 0,
        paddingRight: isMobile ? "0.25rem" : 0,
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(3, minmax(0, 1fr))",
          gap: isMobile ? "12px" : "16px",
          width: "100%",
          maxWidth: isMobile ? "680px" : "min(1600px, 100%)",
          margin: "0 auto",
          marginBottom: "2.5rem",
        }}
      >
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <NewsCard
              key={article.id ?? article.link ?? `${article.title ?? "news"}-${article.date ?? "na"}-${index}`}
              article={article}
              onOpen={() => onOpen(article)}
            />
          ))
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "#999",
              padding: "3rem",
              fontSize: "1.1rem",
            }}
          >
            해당 조건의 뉴스가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsGrid;
