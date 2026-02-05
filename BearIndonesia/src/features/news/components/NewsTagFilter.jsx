// 뉴스 분야별 태그 필터 컴포넌트

import React from "react";

const COMPANY_TICKER_LABELS = {
  "PT Kalbe Farma Tbk": "KLBF/Kalbe Farma",
  "Kalbe Farma": "KLBF/Kalbe Farma",
  "PT Indofarma Tbk": "INAF/Indofarma",
  "Indofarma": "INAF/Indofarma",
  "PT Kimia Farma Tbk": "KAEF/Kimia Farma",
  "Kimia Farma": "KAEF/Kimia Farma",
  "PT Darya-Varia Laboratoria Tbk": "DVLA/Darya-Varia",
  "Darya-Varia Laboratoria": "DVLA/Darya-Varia",
  "PT Tempo Scan Pacific Tbk": "TSPC/Tempo Scan",
  "Tempo Scan Pacific": "TSPC/Tempo Scan",
  "PT Phapros Tbk": "PEHA/Phapros",
  "Phapros": "PEHA/Phapros",
  "PT Pyridam Farma Tbk": "PYFA/Pyridam Farma",
  "Pyridam Farma": "PYFA/Pyridam Farma",
  "PT Industri Jamu & Farmasi Sido Muncul Tbk": "SIDO/Sido Muncul",
  "Sido Muncul": "SIDO/Sido Muncul",
  "PT Merck Tbk": "MERK/Merck",
  "Merck": "MERK/Merck",
  "PT Medikaloka Hermina Tbk": "HEAL/Hermina",
  "Medikaloka Hermina": "HEAL/Hermina",
  "PT Mitra Keluarga Karyasehat Tbk": "MIKA/Mitra Keluarga",
  "Mitra Keluarga Karyasehat": "MIKA/Mitra Keluarga",
  "PT Prodia Widyahusada Tbk": "PRDA/Prodia",
  "Prodia Widyahusada": "PRDA/Prodia",
  "PT Royal Prima Tbk": "PRIM/Royal Prima",
  "Royal Prima": "PRIM/Royal Prima",
  "PT Sarana Meditama Metropolitan Tbk": "SAME/Sarana Meditama",
  "Sarana Meditama Metropolitan": "SAME/Sarana Meditama",
  "PT Siloam International Hospitals Tbk": "SILO/Siloam",
  "Siloam International Hospitals": "SILO/Siloam",
  "PT Sejahteraraya Anugrahjaya Tbk": "SRAJ/Sejahteraraya",
  "Sejahteraraya Anugrahjaya": "SRAJ/Sejahteraraya",
  "PT Diagnos Laboratorium Utama Tbk": "DGNS/Diagnos",
  "Diagnos Laboratorium Utama": "DGNS/Diagnos",
  "PT Bundamedik Tbk": "BMHS/Bundamedik",
  "Bundamedik": "BMHS/Bundamedik",
  "PT Famon Awal Bros Sedaya Tbk": "PRAY/Awal Bros",
  "Famon Awal Bros Sedaya": "PRAY/Awal Bros",
  "PT Diastika Biotekindo Tbk": "CHEK/Diastika Biotekindo",
  "Diastika Biotekindo": "CHEK/Diastika Biotekindo",
  "PT Haloni Jane Tbk": "HALO/Haloni Jane",
  "Haloni Jane": "HALO/Haloni Jane",
  "PT Itama Ranoraya Tbk": "IRRA/Itama Ranoraya",
  "Itama Ranoraya": "IRRA/Itama Ranoraya",
  "PT UBC Medical Indonesia Tbk": "LABS/UBC Medical",
  "UBC Medical Indonesia": "LABS/UBC Medical",
  "PT Hetzer Medical Indonesia Tbk": "MEDS/Hetzer Medical",
  "Hetzer Medical Indonesia": "MEDS/Hetzer Medical",
  "PT Multi Medika Internasional Tbk": "MMIX/Multi Medika",
  "Multi Medika Internasional": "MMIX/Multi Medika",
  "PT Jayamas Medica Industri Tbk": "OMED/Jayamas Medica",
  "Jayamas Medica Industri": "OMED/Jayamas Medica",
  "PT Maja Agung Latexindo Tbk": "SURI/Maja Agung",
  "Maja Agung Latexindo": "SURI/Maja Agung",
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
        maxWidth: 1150,
        margin: "0 auto 2rem",
        padding: "1.5rem",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
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
          const label = COMPANY_TICKER_LABELS[tag] || tag;
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
