// 뉴스 카드 컴포넌트 그리드

import React from "react";
import NewsCard from "./NewsCard";

const NewsGrid = ({ articles, onOpen }) => {
  return (
    <div
      style={{
        overflowX: "auto",
        overflowY: "hidden",
        paddingBottom: "0.25rem",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        style={{
          display: "grid",
          // 화면이 줄어도 항상 3열 유지 (필요 시 가로 스크롤)
          gridTemplateColumns: "repeat(3, 420px)",
          gap: "22px",
          width: "1304px",
          maxWidth: "1304px",
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
