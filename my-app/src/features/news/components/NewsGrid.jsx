// 뉴스 카드 컴포넌트 그리드

import React from "react";
import NewsCard from "./NewsCard";

const NewsGrid = ({ articles, onOpen }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "1.2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        marginBottom: "2.5rem",
      }}
    >
      {articles.length > 0 ? (
        articles.map((article) => (
          <NewsCard
            key={article.id}
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
  );
};

export default NewsGrid;
