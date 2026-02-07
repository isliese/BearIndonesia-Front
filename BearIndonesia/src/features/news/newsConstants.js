// 뉴스 태그 및 섹션 상수 정의

// 태그별로 뉴스를 분류하기 위한 상수들 -> 업데이트 필요
export const TAG_SECTIONS = {
  일반: [
    "제약", "치료", "백신", "건강", "건강기능식품", "건강보조식품",
    "의사", "약국", "보건복지부 장관", "국민건강보험", "병원", "질병", "질환",
  ],
  대웅제약: [
    "대웅제약", "Daewoong", "Fexuprazan (펙수프라잔)", "Envlo", "Crezet", "Letybo", "Selatoxin"
  ],
  "규제·당국": [
    "BPOM (식약청)", "Kementerian Kesehatan (보건부)", "BKPM (투자조정청)", "BPJS (국민건강보험)", "KOMNAS (윤리심의위원회)",
    "허가", "임상시험", "전임상시험", "의약품 승인", "인증", "의약품 GMP", "의약품 GDP", "의약품 등록",
    "약물감시", "보건 정책", "의약품 규제", "보건부", "품질", "임상", "규제", "BKPM", "보건부 정책", "BPJS(국민건강보험)", "Kementerian Kesehatan", 
    "전통의약", "대체의학", "바이오", "의료기기", "헬스케어 시스템", "일반공중보건", "신약 동향"
  ],
  "산업·시장": [
    "제약 산업", "제약 비즈니스", "의약품 유통", "의약품 판매", "의약품 가격", "제네릭", "브랜드 제네릭",
    "의약품 특허", "의약품 공급망", "의약품 수입", "의약품 수출", "제약 투자", "의약품 현지 생산", "제약 협력", "제약사 합병?인수",
  ],
  "제품·치료제": [
    "신약", "바이오시밀러", "바이올로직스", "제네릭 의약품", "전통 의약품", "건강 보조제", "의료기기", "전문 의약품", "일반의약품 (OTC)", "화장품", 
    "더마", "백신", "품", "임상", "허가", "신약 동향", "Fexuprazan (펙수프라잔)", "Envlo (SGLT-2)", "Crezet (복합제)", "Letybo (보툴리눔 톡신)", 
    "Selatoxin (셀라톡신)", "Clinical Trial / CTA / PMS", "Clinical Waiver", "Non-Inferiority Margin", "Fast Track Approval"
  ],
  "경쟁사·주주": [
    "칼베 파르마", "키미아 파르마", "바이오 파르마", "덱사 메디카", "산베 파르마", "템포스캔", "파프로스", "피리당 파르마",
    "화이자", "노바티스", "로슈", "사노피", "GSK", "바이엘", "아스트라제네카", "신약 동향", "동향", "Novo Nordisk", "Pfizer", 
    "AstraZeneca", "Bayer", "GlaxoSmithKline (GSK)", "Merck Sharp & Dohme (MSD)", "Sanofi", "Takeda", "Boehringer Ingelheim", "Eisai", "Daewoong Pharmaceutical", 
    "Chong Kun Dang (CKD)", "HK inno.N", "GC Green Cross", "SK Plasma", "Dong-A ST", "Ildong Pharmaceutical", "Daewon Pharmaceutical", "Kalbe Farma", 
    "Kimia Farma", "Dexa Medica", "Sanbe Farma", "Tempo Scan Pacific", "Darya-Varia Laboratoria", "Phapros", "Pyridam Farma", "Novell Pharmaceutical", "Bio Farma",
    "PT Kalbe Farma Tbk", "PT Indofarma Tbk", "PT Kimia Farma Tbk",
    "PT Darya-Varia Laboratoria Tbk", "PT Tempo Scan Pacific Tbk", "PT Phapros Tbk",
    "PT Pyridam Farma Tbk", "PT Industri Jamu & Farmasi Sido Muncul Tbk", "PT Merck Tbk",
    "PT Medikaloka Hermina Tbk", "PT Mitra Keluarga Karyasehat Tbk", "PT Prodia Widyahusada Tbk",
    "PT Royal Prima Tbk", "PT Sarana Meditama Metropolitan Tbk", "PT Siloam International Hospitals Tbk",
    "PT Sejahteraraya Anugrahjaya Tbk", "PT Diagnos Laboratorium Utama Tbk", "PT Bundamedik Tbk",
    "PT Famon Awal Bros Sedaya Tbk", "PT Diastika Biotekindo Tbk", "PT Haloni Jane Tbk",
    "PT Itama Ranoraya Tbk", "PT UBC Medical Indonesia Tbk", "PT Hetzer Medical Indonesia Tbk",
    "PT Multi Medika Internasional Tbk", "PT Jayamas Medica Industri Tbk", "PT Maja Agung Latexindo Tbk"

  ],
  "트렌드·혁신": [
    "디지털 헬스", "원격의료", "보건 빅데이터", "제약 4.0", "헬스 스타트업", "의약품 연구", "의약품 개발", "인도네시아 임상시험", 
    "디지털 헬스", "AI", "첨단 의료", "헬스케어 시스템"
  ],
  "위험·법규/개정": [
    "위조 의약품", "의약품 회수", "의약품 안전성", "약물 부작용", "BPOM 규정 위반", "의약품 유통 관리", "약물 오남용"
  ]
};

// 크롤링하는 뉴스 사이트 목록 (23개) -> 업데이트 필요
export const CRAWLED_NEWS_SITES = [
  "Farmasetika News",
  "CNN Indonesia",
  "CNBC Indonesia",
  "Liputan 6",
  "Detik",
  "detik",
  "Kompas",
  "Sindo News",
  "Tempo",
  "Kontan",
  "Bisnis",
  "Jawa Pos",
  "IDX",
  "Suara",
  "Antara News",
  "Viva",
  "BPOM",
  "MOH",
  "BPJS",
  "인니 정부",
  "인니 대통령"
];

// 분야별 뉴스 섹션 순서
export const SECTION_ORDER = [
  "일반",
  "대웅제약",
  "규제·당국",
  "산업·시장",
  "제품·치료제",
  "경쟁사·주주",
  "트렌드·혁신",
  "위험·법규/개정"
];
