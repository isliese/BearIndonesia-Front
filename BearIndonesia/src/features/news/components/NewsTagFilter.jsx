// 뉴스 분야별 태그 필터 컴포넌트

import React from "react";

const COMPANY_TICKERS = {
  // Global pharma (tickers only when confident)
  화이자: { ticker: "PFE", name: "Pfizer" },
  Pfizer: { ticker: "PFE", name: "Pfizer" },
  "Pfizer Inc.": { ticker: "PFE", name: "Pfizer" },
  사노피: { ticker: "SAN", name: "Sanofi" },
  Sanofi: { ticker: "SAN", name: "Sanofi" },
  바이엘: { ticker: "BAYN", name: "Bayer" },
  Bayer: { ticker: "BAYN", name: "Bayer" },

  // 제약·바이오
  "PT Kalbe Farma Tbk": { ticker: "KLBF", name: "Kalbe Farma" },
  "Kalbe Farma": { ticker: "KLBF", name: "Kalbe Farma" },
  "PT Indofarma Tbk": { ticker: "INAF", name: "Indofarma" },
  Indofarma: { ticker: "INAF", name: "Indofarma" },
  "PT Kimia Farma Tbk": { ticker: "KAEF", name: "Kimia Farma" },
  "Kimia Farma": { ticker: "KAEF", name: "Kimia Farma" },
  "PT Darya-Varia Laboratoria Tbk": { ticker: "DVLA", name: "Darya-Varia" },
  "Darya-Varia Laboratoria": { ticker: "DVLA", name: "Darya-Varia" },
  "PT Tempo Scan Pacific Tbk": { ticker: "TSPC", name: "Tempo Scan" },
  "Tempo Scan Pacific": { ticker: "TSPC", name: "Tempo Scan" },
  "PT Phapros Tbk": { ticker: "PEHA", name: "Phapros" },
  Phapros: { ticker: "PEHA", name: "Phapros" },
  "PT Pyridam Farma Tbk": { ticker: "PYFA", name: "Pyridam Farma" },
  "Pyridam Farma": { ticker: "PYFA", name: "Pyridam Farma" },
  "PT Industri Jamu & Farmasi Sido Muncul Tbk": { ticker: "SIDO", name: "Sido Muncul" },
  "PT Industri Jamu & Farmasi Sido Muncul Tbk.": { ticker: "SIDO", name: "Sido Muncul" },
  "Sido Muncul": { ticker: "SIDO", name: "Sido Muncul" },
  "PT Merck Tbk": { ticker: "MERK", name: "Merck" },
  Merck: { ticker: "MERK", name: "Merck" },

  // 의료 서비스/헬스케어
  "PT Medikaloka Hermina Tbk": { ticker: "HEAL", name: "Hermina" },
  "Medikaloka Hermina": { ticker: "HEAL", name: "Hermina" },
  "PT Mitra Keluarga Karyasehat Tbk": { ticker: "MIKA", name: "Mitra Keluarga" },
  "Mitra Keluarga Karyasehat": { ticker: "MIKA", name: "Mitra Keluarga" },
  "PT Prodia Widyahusada Tbk": { ticker: "PRDA", name: "Prodia" },
  "Prodia Widyahusada": { ticker: "PRDA", name: "Prodia" },
  "PT Royal Prima Tbk": { ticker: "PRIM", name: "Royal Prima" },
  "Royal Prima": { ticker: "PRIM", name: "Royal Prima" },
  "PT Sarana Meditama Metropolitan Tbk": { ticker: "SAME", name: "Sarana Meditama" },
  "Sarana Meditama Metropolitan": { ticker: "SAME", name: "Sarana Meditama" },
  "PT Siloam International Hospitals Tbk": { ticker: "SILO", name: "Siloam" },
  "Siloam International Hospitals": { ticker: "SILO", name: "Siloam" },
  "PT Sejahteraraya Anugrahjaya Tbk": { ticker: "SRAJ", name: "Sejahteraraya" },
  "Sejahteraraya Anugrahjaya": { ticker: "SRAJ", name: "Sejahteraraya" },
  "PT Diagnos Laboratorium Utama Tbk": { ticker: "DGNS", name: "Diagnos" },
  "Diagnos Laboratorium Utama": { ticker: "DGNS", name: "Diagnos" },
  "PT Bundamedik Tbk": { ticker: "BMHS", name: "Bundamedik" },
  Bundamedik: { ticker: "BMHS", name: "Bundamedik" },
  "PT Famon Awal Bros Sedaya Tbk": { ticker: "PRAY", name: "Awal Bros" },
  "Famon Awal Bros Sedaya": { ticker: "PRAY", name: "Awal Bros" },

  // 의료기기/장비 등
  "PT Diastika Biotekindo Tbk": { ticker: "CHEK", name: "Diastika Biotekindo" },
  "Diastika Biotekindo": { ticker: "CHEK", name: "Diastika Biotekindo" },
  "PT Haloni Jane Tbk": { ticker: "HALO", name: "Haloni Jane" },
  "Haloni Jane": { ticker: "HALO", name: "Haloni Jane" },
  "PT Itama Ranoraya Tbk": { ticker: "IRRA", name: "Itama Ranoraya" },
  "Itama Ranoraya": { ticker: "IRRA", name: "Itama Ranoraya" },
  "PT UBC Medical Indonesia Tbk": { ticker: "LABS", name: "UBC Medical" },
  "UBC Medical Indonesia": { ticker: "LABS", name: "UBC Medical" },
  "PT Hetzer Medical Indonesia Tbk": { ticker: "MEDS", name: "Hetzer Medical" },
  "Hetzer Medical Indonesia": { ticker: "MEDS", name: "Hetzer Medical" },
  "PT Multi Medika Internasional Tbk": { ticker: "MMIX", name: "Multi Medika" },
  "Multi Medika Internasional": { ticker: "MMIX", name: "Multi Medika" },
  "PT Jayamas Medica Industri Tbk": { ticker: "OMED", name: "Jayamas Medica" },
  "Jayamas Medica Industri": { ticker: "OMED", name: "Jayamas Medica" },
  "PT Maja Agung Latexindo Tbk": { ticker: "SURI", name: "Maja Agung" },
  "Maja Agung Latexindo": { ticker: "SURI", name: "Maja Agung" },
};

const toLabel = (tag) => {
  const info = COMPANY_TICKERS[tag];
  if (!info) return tag;
  return `${info.name}(#${info.ticker})`;
};

const NewsTagFilter = ({ activeSection, currentSectionTags, activeTags, setActiveTags }) => {
  if (activeSection === "all" || currentSectionTags.length === 0) {
    return null;
  }

  const isAllActive = activeTags.length === 0;

  const toggleTag = (tag) => {
    setActiveTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  };

  return (
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
      <div style={{ color: "#ff8c42", fontWeight: 700, marginBottom: "1rem", fontSize: "1.1rem" }}>
        {activeSection} :
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveTags([])}
          style={{
            padding: "0.5rem 1rem",
            background: isAllActive ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
            border: "1px solid",
            borderColor: isAllActive ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            color: "white",
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "all 0.2s ease",
          }}
        >
          전체
        </button>

        {currentSectionTags.map((tag) => {
          const label = toLabel(tag);
          return (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            style={{
              padding: "0.5rem 1rem",
              background: activeTags.includes(tag) ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
              border: "1px solid",
              borderColor: activeTags.includes(tag) ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              color: "white",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.2s ease",
            }}
          >
            {label}
          </button>
        );
        })}
      </div>
    </div>
  );
};

export default NewsTagFilter;
