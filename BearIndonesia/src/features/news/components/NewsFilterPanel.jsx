// 뉴스 필터 패널 컴포넌트

import React from "react";

const NewsFilterPanel = ({
  isOpen,
  onToggle,
  sortOrder,
  setSortOrder,
  periodFilter,
  setPeriodFilter,
  showCustomDate,
  setShowCustomDate,
  showHourOptions,
  setShowHourOptions,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  pressList,
  pressFilter,
  setPressFilter,
  expandedPressCategories,
  setExpandedPressCategories,
  keepOptions,
  setKeepOptions,
  onReset,
}) => {
  const defaultSort = "최신순";
  const defaultPeriod = "전체";
  const defaultPress = "전체";

  const toggleSort = (sort) => {
    setSortOrder(sortOrder === sort ? defaultSort : sort);
  };

  const clearPeriod = () => {
    setPeriodFilter(defaultPeriod);
    setShowCustomDate(false);
    setShowHourOptions(false);
  };

  const togglePeriod = (period) => {
    if (periodFilter === period) {
      clearPeriod();
      return;
    }
    setPeriodFilter(period);
    setShowCustomDate(false);
    setShowHourOptions(false);
  };

  const togglePress = (press) => {
    setPressFilter(pressFilter === press ? defaultPress : press);
  };

  return (
    <>
      <div style={{ maxWidth: 1304, width: "100%", margin: "0 auto 1rem", boxSizing: "border-box" }}>
        <button
          onClick={onToggle}
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
          옵션 {isOpen ? "▲" : "▼"}
        </button>
      </div>

      {isOpen && (
        <div
          style={{
            maxWidth: 1304,
            width: "100%",
            margin: "0 auto 2rem",
            padding: "1.5rem",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxSizing: "border-box",
          }}
        >
          <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ color: "#ff8c42", fontWeight: 700, fontSize: "1rem", paddingTop: "0.4rem" }}>
              정렬
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["최신순", "오래된순", "정확도순"].map((sort) => (
                <button
                  key={sort}
                  onClick={() => toggleSort(sort)}
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

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: showHourOptions || showCustomDate ? "0.8rem" : "0" }}>
              <div style={{ color: "#ff8c42", fontWeight: 700, paddingTop: "0.4rem", fontSize: "1rem" }}>
                기간
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => {
                    clearPeriod();
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    background: periodFilter === defaultPeriod ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
                    border: "1px solid",
                    borderColor: periodFilter === defaultPeriod ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
                    borderRadius: "20px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  전체
                </button>

                <button
                  onClick={() => {
                    if (periodFilter.includes("시간") && showHourOptions) {
                      clearPeriod();
                    } else {
                      setShowHourOptions(true);
                      setShowCustomDate(false);
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
                    onClick={() => togglePeriod(period)}
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

                <button
                  onClick={() => {
                    if (showCustomDate || periodFilter === "직접입력") {
                      clearPeriod();
                    } else {
                      setShowCustomDate(true);
                      setShowHourOptions(false);
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
            </div>

            {showHourOptions && (
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  alignItems: "center",
                  paddingLeft: "4.5rem",
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                }}
              >
                {["1시간", "2시간", "3시간", "4시간", "5시간", "6시간"].map((hour) => (
                  <button
                    key={hour}
                    onClick={() => {
                      if (periodFilter === hour) {
                        clearPeriod();
                      } else {
                        setPeriodFilter(hour);
                      }
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      background: periodFilter === hour ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
                      border: "1px solid",
                      borderColor: periodFilter === hour ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
                      borderRadius: "20px",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            )}

            {showCustomDate && (
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  paddingLeft: "4.5rem",
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                }}
              >
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

          <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap"  }}>
            <div style={{ color: "#ff8c42", fontWeight: 700, paddingTop: "0.4rem", fontSize: "1rem" }}>
              뉴스 사이트
            </div>

            {pressList.type === "categorized" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      setPressFilter(defaultPress);
                      setExpandedPressCategories({});
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      background: pressFilter === defaultPress ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
                      border: "1px solid",
                      borderColor: pressFilter === defaultPress ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
                      borderRadius: "20px",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    전체
                  </button>

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
                    전체보기
                    <span style={{ fontSize: "0.7rem" }}>
                      {Object.keys(expandedPressCategories).length > 0 ? "▲" : "▼"}
                    </span>
                  </button>

                  {pressFilter !== defaultPress && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        padding: "0.5rem 0.9rem",
                        borderRadius: "20px",
                        background: "rgba(255, 140, 66, 0.18)",
                        border: "1px solid rgba(255, 140, 66, 0.35)",
                        color: "#ffae66",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        maxWidth: "min(380px, 70vw)",
                      }}
                      title={pressFilter}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {pressFilter}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPressFilter(defaultPress)}
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 999,
                          border: "1px solid rgba(255, 255, 255, 0.18)",
                          background: "rgba(0,0,0,0.2)",
                          color: "white",
                          cursor: "pointer",
                          lineHeight: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                        }}
                        aria-label="선택된 뉴스 사이트 해제"
                        title="선택 해제"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

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
                                onClick={() => togglePress(source)}
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
                    onClick={() => togglePress(press)}
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

          <div style={{ display: "flex", gap: "1rem", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.1)", marginTop: "1rem" }}>
            <button
              onClick={onReset}
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
              <span>옵션 초기화</span>
            </button>
            
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
    </>
  );
};

export default NewsFilterPanel;
