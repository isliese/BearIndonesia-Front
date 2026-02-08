import React, { useEffect, useMemo, useState } from "react";
import { fetchCompetitorReport } from "../../../api/reportApi";

const MAJOR_COMPETITORS = ["Kalbe Farma", "Kimia Farma", "Indofarma", "Bio Farma"];
const OTHER_COMPETITORS = ["Dexa Medica", "Sanbe Farma", "Tempo Scan Pacific", "Phapros"];
const PRESET_KEYWORDS = [...MAJOR_COMPETITORS, ...OTHER_COMPETITORS];

const CompetitorReportPage = () => {
  const [selectedKeyword, setSelectedKeyword] = useState(PRESET_KEYWORDS[0]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const keywords = PRESET_KEYWORDS;

  const fetchReport = async () => {
    if (!keywords.length) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchCompetitorReport({
        keywords: keywords.join(","),
        topLimit: 8,
      });
      setReport(data);
    } catch (err) {
      setError(err.message || "리포트 데이터를 불러오지 못했습니다.");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const totalsByKeyword = useMemo(() => {
    const out = {};
    if (!report?.totals) return out;
    report.totals.forEach((t) => {
      out[t.keyword] = t;
    });
    return out;
  }, [report]);

  const impactsByKeyword = useMemo(() => {
    const out = {};
    if (!report?.impacts) return out;
    report.impacts.forEach((row) => {
      out[row.keyword] = row;
    });
    return out;
  }, [report]);

  const insightsByKeyword = useMemo(() => {
    const out = {};
    if (!report?.insights) return out;
    report.insights.forEach((row) => {
      out[row.keyword] = row.summary;
    });
    return out;
  }, [report]);

  const clustersByKeyword = useMemo(() => {
    const out = {};
    if (!report?.clusters) return out;
    report.clusters.forEach((row) => {
      if (!out[row.keyword]) out[row.keyword] = [];
      out[row.keyword].push(row);
    });
    return out;
  }, [report]);

  const pinsByKeyword = useMemo(() => {
    const out = {};
    if (!report?.pins) return out;
    report.pins.forEach((row) => {
      if (!out[row.keyword]) out[row.keyword] = [];
      out[row.keyword].push(row);
    });
    return out;
  }, [report]);

  const dailyByKeyword = useMemo(() => {
    const out = {};
    if (!report?.daily) return out;
    report.daily.forEach((row) => {
      if (!out[row.keyword]) out[row.keyword] = [];
      out[row.keyword].push(row);
    });
    return out;
  }, [report]);

  const sourcesByKeyword = useMemo(() => {
    const out = {};
    if (!report?.sources) return out;
    report.sources.forEach((row) => {
      if (!out[row.keyword]) out[row.keyword] = [];
      out[row.keyword].push(row);
    });
    return out;
  }, [report]);

  const articlesByKeyword = useMemo(() => {
    const out = {};
    if (!report?.topArticles) return out;
    report.topArticles.forEach((row) => {
      if (!out[row.keyword]) out[row.keyword] = [];
      out[row.keyword].push(row);
    });
    return out;
  }, [report]);

  const selectedDaily = dailyByKeyword[selectedKeyword] || [];
  const selectedSources = sourcesByKeyword[selectedKeyword] || [];
  const selectedArticles = articlesByKeyword[selectedKeyword] || [];
  const selectedClusters = clustersByKeyword[selectedKeyword] || [];
  const selectedPins = pinsByKeyword[selectedKeyword] || [];
  const selectedInsight = insightsByKeyword[selectedKeyword] || "";

  const pinsByDate = useMemo(() => {
    const out = {};
    selectedPins.forEach((p) => {
      out[p.date] = p;
    });
    return out;
  }, [selectedPins]);

  const maxDaily = Math.max(1, ...selectedDaily.map((d) => d.count));

  const keywordRanks = report?.keywordRanks || [];
  const weeklyIssues = report?.weeklyIssues || [];
  const monthlyIssues = report?.monthlyIssues || [];
  const keywordTrends = report?.keywordTrends || [];

  const trendSeries = useMemo(() => {
    const dateMap = new Map();
    keywordTrends.forEach((row) => {
      (row.points || []).forEach((p) => {
        if (!dateMap.has(p.date)) dateMap.set(p.date, {});
        dateMap.get(p.date)[row.keyword] = p.count;
      });
    });

    const dates = Array.from(dateMap.keys()).sort();
    const slicedDates = dates.length > 30 ? dates.slice(dates.length - 30) : dates;
    const series = slicedDates.map((date) => {
      const counts = dateMap.get(date) || {};
      const total = keywords.reduce((sum, k) => sum + (counts[k] || 0), 0);
      return { date, counts, total };
    });
    const maxTotal = Math.max(1, ...series.map((s) => s.total));

    return { series, maxTotal };
  }, [keywordTrends, keywords]);

  const colorPalette = [
    "#ff8c42",
    "#5bd1ff",
    "#8b6cff",
    "#69f0ae",
    "#ffd166",
    "#ff6b6b",
    "#4db6ac",
    "#9575cd",
  ];

  return (
    <div style={pageStyle}>
      {loading && <div style={infoBoxStyle}>불러오는 중...</div>}
      {error && <div style={errorBoxStyle}>{error}</div>}

      {!loading && !error && report && (
        <>
          <div style={cardStyle}>
            <div style={titleRow}>
              <h2 style={sectionTitleLarge}>월간/주간 핵심 이슈 TOP</h2>
              <div style={periodStyle}>
                전체 기간: {report?.start ?? "-"} ~ {report?.end ?? "-"}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <div style={{ color: "#b8b8b8", marginBottom: "0.4rem" }}>최근 30일</div>
                {monthlyIssues.length === 0 && (
                  <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
                )}
                <div style={{ display: "grid", gap: "0.45rem" }}>
                  {monthlyIssues.slice(0, 8).map((row, idx) => (
                    <div key={`m-${row.keyword}-${idx}`} style={rankRow}>
                      <span>{idx + 1}. {row.keyword}</span>
                      <span style={rankCount}>{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ color: "#b8b8b8", marginBottom: "0.4rem" }}>최근 7일</div>
                {weeklyIssues.length === 0 && (
                  <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
                )}
                <div style={{ display: "grid", gap: "0.45rem" }}>
                  {weeklyIssues.slice(0, 8).map((row, idx) => (
                    <div key={`w-${row.keyword}-${idx}`} style={rankRow}>
                      <span>{idx + 1}. {row.keyword}</span>
                      <span style={rankCount}>{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={sectionTitle}>키워드 트렌드 그래프 (스택드 바)</h3>
            {trendSeries.series.length === 0 && (
              <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
            )}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
              {keywords.map((kw, idx) => (
                <div key={kw} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: colorPalette[idx] }} />
                  <span style={{ fontSize: "0.85rem", color: "#dcdcdc" }}>{kw}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "flex-end", height: "140px", overflowX: "auto", paddingBottom: "0.4rem" }}>
              {trendSeries.series.map((row) => (
                <div key={row.date} style={{ width: "14px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }} title={`${row.date}: ${row.total}`}>
                  {keywords.map((kw, idx) => {
                    const count = row.counts[kw] || 0;
                    const height = row.total === 0 ? 0 : (count / trendSeries.maxTotal) * 120;
                    return (
                      <div
                        key={`${row.date}-${kw}`}
                        style={{
                          height: `${height}px`,
                          background: colorPalette[idx],
                          borderRadius: "3px 3px 0 0",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={titleRow}>
              <h3 style={sectionTitle}>경쟁사 리포트 대시보드</h3>
              <button onClick={() => setIsModalOpen(true)} style={primaryButton}>동향 모달 열기</button>
            </div>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              {keywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setSelectedKeyword(kw)}
                  style={{
                    ...chipStyle,
                    borderColor: selectedKeyword === kw ? "rgba(255,140,66,0.8)" : "rgba(255,255,255,0.15)",
                    background: selectedKeyword === kw ? "rgba(255,140,66,0.2)" : "rgba(255,255,255,0.05)",
                  }}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {selectedInsight && (
            <div style={cardStyle}>
              <h3 style={sectionTitle}>이슈 요약</h3>
              <div style={{ color: "#dcdcdc", lineHeight: 1.6 }}>{selectedInsight}</div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
            <div style={cardStyle}>
              <h3 style={sectionTitle}>일자별 언급 추이</h3>
              <div style={{ display: "flex", gap: "6px", alignItems: "flex-end", height: "140px" }}>
                {selectedDaily.length === 0 && (
                  <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
                )}
                {selectedDaily.map((d) => {
                  const pin = pinsByDate[d.date];
                  return (
                    <div
                      key={`${d.keyword}-${d.date}`}
                      title={`${d.date}: ${d.count}${pin ? ` (핀 ${pin.ratio}x)` : ""}`}
                      style={{
                        width: "10px",
                        height: `${(d.count / maxDaily) * 120}px`,
                        background: pin
                          ? "linear-gradient(180deg, #ff5252, #ff8c42)"
                          : "linear-gradient(180deg, #ff8c42, #ffa726)",
                        borderRadius: "4px",
                        border: pin ? "1px solid rgba(255,255,255,0.7)" : "none",
                      }}
                    />
                  );
                })}
              </div>
              {selectedPins.length > 0 && (
                <div style={{ marginTop: "0.8rem", color: "#ffc1a6", fontSize: "0.85rem" }}>
                  이벤트 핀: {selectedPins.map((p) => p.date).join(", ")}
                </div>
              )}
            </div>

            <div style={cardStyle}>
              <h3 style={sectionTitle}>주요 출처</h3>
              {selectedSources.length === 0 && (
                <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
              )}
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {selectedSources.slice(0, 6).map((s) => (
                  <li key={`${s.keyword}-${s.source}`} style={{ marginBottom: "0.6rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{s.source}</span>
                      <span style={{ color: "#ffb86b" }}>{s.count}</span>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(100, (s.count / (selectedSources[0]?.count || 1)) * 100)}%`,
                          background: "linear-gradient(90deg, #80cbc4, #64b5f6)",
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {selectedClusters.length > 0 && (
            <div style={cardStyle}>
              <h3 style={sectionTitle}>이슈 클러스터</h3>
              <div style={{ display: "grid", gap: "0.9rem" }}>
                {selectedClusters.map((c) => (
                  <div
                    key={`${c.keyword}-${c.clusterId}`}
                    style={{
                      padding: "0.8rem",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                      {c.title}
                    </div>
                    <div style={{ color: "#b8b8b8", fontSize: "0.85rem", marginBottom: "0.35rem" }}>
                      기사 {c.count}건 · {c.topTitles?.join(" / ")}
                    </div>
                    <div style={{ display: "grid", gap: "0.4rem" }}>
                      {(c.sampleArticles || []).map((a) => (
                        <a
                          key={`${a.articleId}-${a.link}`}
                          href={a.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "#ffd3b5",
                            textDecoration: "none",
                            fontSize: "0.9rem",
                          }}
                        >
                          {a.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={cardStyle}>
            <h3 style={sectionTitle}>관련 기사</h3>
            {selectedArticles.length === 0 && (
              <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
            )}
            <div style={{ display: "grid", gap: "0.8rem" }}>
              {selectedArticles.map((a) => (
                <a
                  key={`${a.keyword}-${a.link}`}
                  href={a.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr auto",
                    gap: "0.8rem",
                    textDecoration: "none",
                    color: "white",
                    padding: "0.8rem",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.1)",
                    }}
                  >
                    {a.img ? (
                      <img
                        src={a.img}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        loading="lazy"
                      />
                    ) : (
                      <div style={{ fontSize: "0.75rem", color: "#bbb", textAlign: "center", paddingTop: "20px" }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                      {a.korTitle || a.title}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#cfcfcf" }}>
                      {a.date} · {a.source}
                    </div>
                    {a.korSummary && (
                      <div style={{ fontSize: "0.82rem", color: "#b8b8b8", marginTop: "0.4rem" }}>
                        {a.korSummary}
                      </div>
                    )}
                  </div>
                  <div style={{ alignSelf: "center", color: "#ffb86b", fontWeight: 600 }}>
                    {a.importance ?? "-"}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <div style={modalHeader}>
              <h3 style={{ margin: 0, color: "#ffb86b" }}>경쟁사 동향 모달</h3>
              <button style={closeButton} onClick={() => setIsModalOpen(false)}>닫기</button>
            </div>
            <div style={modalSectionTitle}>메이저 4개</div>
            <div style={modalGrid}>
              {MAJOR_COMPETITORS.map((kw) => (
                <div key={kw} style={modalItem}>
                  <div style={{ fontWeight: 600 }}>{kw}</div>
                  <div style={{ fontSize: "1.6rem", color: "#ffb86b" }}>{totalsByKeyword[kw]?.count ?? 0}</div>
                  <div style={{ fontSize: "0.8rem", color: "#b8b8b8" }}>언급 수</div>
                  <div style={{ fontSize: "0.8rem", color: "#b8b8b8" }}>영향도 {impactsByKeyword[kw]?.score ?? "-"}</div>
                </div>
              ))}
            </div>
            <div style={modalSectionTitle}>그 외 4개</div>
            <div style={modalGrid}>
              {OTHER_COMPETITORS.map((kw) => (
                <div key={kw} style={modalItem}>
                  <div style={{ fontWeight: 600 }}>{kw}</div>
                  <div style={{ fontSize: "1.6rem", color: "#ffb86b" }}>{totalsByKeyword[kw]?.count ?? 0}</div>
                  <div style={{ fontSize: "0.8rem", color: "#b8b8b8" }}>언급 수</div>
                  <div style={{ fontSize: "0.8rem", color: "#b8b8b8" }}>영향도 {impactsByKeyword[kw]?.score ?? "-"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const pageStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  padding: "2rem",
  color: "white",
};

const titleRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  marginBottom: "0.8rem",
};

const periodStyle = {
  color: "#d0d0d0",
  fontSize: "0.9rem",
};

const primaryButton = {
  padding: "0.55rem 1.2rem",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #ff8c42, #ffa726)",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

const cardStyle = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: "18px",
  padding: "1.2rem",
  border: "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
};

const sectionTitleLarge = {
  margin: 0,
  color: "#ffb86b",
  fontSize: "1.25rem",
};

const sectionTitle = {
  margin: 0,
  marginBottom: "0.8rem",
  color: "#ffb86b",
  fontSize: "1.1rem",
};

const infoBoxStyle = {
  background: "rgba(255,255,255,0.08)",
  padding: "1rem",
  borderRadius: "14px",
  color: "#ddd",
};

const errorBoxStyle = {
  background: "rgba(255, 99, 71, 0.15)",
  padding: "1rem",
  borderRadius: "14px",
  color: "#ffb3a7",
  border: "1px solid rgba(255, 99, 71, 0.4)",
};

const rankRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0.6rem 0.8rem",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const rankCount = {
  color: "#ffb86b",
  fontWeight: 600,
};

const chipStyle = {
  background: "rgba(255, 140, 66, 0.18)",
  color: "#ffb86b",
  padding: "0.35rem 0.7rem",
  borderRadius: "999px",
  border: "1px solid rgba(255, 140, 66, 0.45)",
  fontSize: "0.8rem",
  cursor: "pointer",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(10, 10, 20, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  zIndex: 20,
};

const modalCard = {
  width: "min(880px, 95vw)",
  background: "rgba(20, 20, 35, 0.95)",
  borderRadius: "20px",
  padding: "1.5rem",
  border: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(16px)",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
};

const closeButton = {
  background: "rgba(255,255,255,0.12)",
  border: "none",
  borderRadius: "10px",
  padding: "0.4rem 0.8rem",
  color: "#f0f0f0",
  cursor: "pointer",
};

const modalSectionTitle = {
  marginTop: "1rem",
  marginBottom: "0.6rem",
  color: "#f7cba2",
  fontWeight: 700,
};

const modalGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "0.8rem",
};

const modalItem = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: "14px",
  padding: "0.8rem",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "grid",
  gap: "0.3rem",
};

export default CompetitorReportPage;
