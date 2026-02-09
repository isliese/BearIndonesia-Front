import React, { useEffect, useMemo, useState } from "react";
import { fetchCompetitorReport } from "../../../api/reportApi";

const MAJOR_COMPETITORS = ["Kalbe Farma", "Kimia Farma", "Indofarma", "Bio Farma"];
const OTHER_COMPETITORS = ["Dexa Medica", "Sanbe Farma", "Tempo Scan Pacific", "Phapros"];
const PRESET_KEYWORDS = [...MAJOR_COMPETITORS, ...OTHER_COMPETITORS];
const DEFAULT_DAYS = 30;
const formatDateInput = (date) => date.toISOString().slice(0, 10);

const CompetitorReportPage = () => {
  const [selectedKeyword, setSelectedKeyword] = useState(PRESET_KEYWORDS[0]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - DEFAULT_DAYS);
    return formatDateInput(d);
  });
  const [endDate, setEndDate] = useState(() => formatDateInput(new Date()));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const competitorKeywords = PRESET_KEYWORDS;

  const fetchReport = async () => {
    if (!competitorKeywords.length) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchCompetitorReport({
        keywords: competitorKeywords.join(","),
        topLimit: 8,
        start: startDate,
        end: endDate,
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
  const rangeIssueTitles = report?.rangeIssueTitles || [];
  const mentionedKeywords = report?.mentionedKeywords || [];

  const overallKeywordRanks = useMemo(() => {
    return keywordRanks.slice(0, 12);
  }, [keywordRanks]);

  const mentionedByKeyword = useMemo(() => {
    const out = {};
    mentionedKeywords.forEach((row) => {
      if (!out[row.keyword]) out[row.keyword] = [];
      out[row.keyword].push(row);
    });
    return out;
  }, [mentionedKeywords]);

  const selectedMentions = mentionedByKeyword[selectedKeyword] || [];

  return (
    <div style={pageStyle}>
      {loading && <div style={infoBoxStyle}>불러오는 중...</div>}
      {error && <div style={errorBoxStyle}>{error}</div>}

      {!loading && !error && report && (
        <>
          <div style={cardStyle}>
            <div style={titleRow}>
              <h2 style={sectionTitleLarge}>월간/주간 핵심 이슈 TOP</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <label style={filterLabel}>기간 필터</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={dateInputStyle}
                />
                <span style={{ color: "#cfcfcf" }}>~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={dateInputStyle}
                />
                <button onClick={fetchReport} style={primaryButton}>필터 적용</button>
              </div>
            </div>
            <div style={periodStyle}>선택 기간 기준: {startDate} ~ {endDate}</div>
            {rangeIssueTitles.length === 0 && (
              <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
            )}
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {rangeIssueTitles.slice(0, 8).map((row, idx) => (
                <div key={`range-title-${idx}`} style={rankRow}>
                  <span>{idx + 1}. {row.title}</span>
                  <span style={rankMeta}>{row.source || ""}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={sectionTitle}>전체 키워드 언급량 (전체 기사 기준)</h3>
            {overallKeywordRanks.length === 0 && (
              <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
            )}
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {overallKeywordRanks.map((row) => (
                <div key={row.keyword} style={{ display: "grid", gridTemplateColumns: "160px 1fr 60px", gap: "0.8rem", alignItems: "center" }}>
                  <div style={{ color: "#e6e6e6" }}>{row.keyword}</div>
                  <div style={barTrack}>
                    <div
                      style={{
                        ...barFill,
                        width: `${Math.min(100, (row.count / (overallKeywordRanks[0]?.count || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "right", color: "#ffb86b", fontWeight: 600 }}>{row.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={titleRow}>
              <h3 style={sectionTitle}>경쟁사 리포트 대시보드</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              {competitorKeywords.map((kw) => (
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

          <div style={cardStyle}>
            <h3 style={sectionTitle}>동향 요약</h3>
            <div style={{ color: "#dcdcdc", lineHeight: 1.6 }}>
              {selectedInsight || "요약 데이터 없음"}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={sectionTitle}>언급 키워드</h3>
            {selectedMentions.length === 0 && (
              <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
            )}
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {selectedMentions.slice(0, 10).map((row) => (
                <div key={`${row.keyword}-${row.tag}`} style={rankRow}>
                  <span>{row.tag}</span>
                  <span style={rankCount}>{row.count}</span>
                </div>
              ))}
            </div>
          </div>

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

    </div>
  );
};

const pageStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  padding: "2rem 1.2rem",
  maxWidth: 1180,
  width: "100%",
  margin: "0 auto",
  color: "white",
};

const titleRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  marginBottom: "0.6rem",
  flexWrap: "wrap",
};

const periodStyle = {
  color: "#d0d0d0",
  fontSize: "0.9rem",
  marginBottom: "0.8rem",
};

const filterLabel = {
  color: "#d8d8d8",
  fontSize: "0.85rem",
};

const dateInputStyle = {
  padding: "0.4rem 0.6rem",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(10,10,20,0.6)",
  color: "white",
  outline: "none",
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

const rankMeta = {
  color: "#b8b8b8",
  fontSize: "0.8rem",
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

const barTrack = {
  height: "10px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.08)",
  overflow: "hidden",
};

const barFill = {
  height: "100%",
  borderRadius: "999px",
  background: "linear-gradient(90deg, #ff8c42, #ffa726)",
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
  width: "min(820px, 92vw)",
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

const modalItemButton = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: "14px",
  padding: "0.8rem",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "grid",
  gap: "0.3rem",
  textAlign: "left",
  color: "white",
  cursor: "pointer",
};

export default CompetitorReportPage;
