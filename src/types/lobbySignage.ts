export interface LobbyProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  isPromo: boolean;
  promoBadgeText?: string; // e.g. "מבצע השבוע!", "מחיר קבלנים"
  coverageM2: string; // e.g. "1.4 ק\"ג למ\"ר לכל מ\"מ עובי"
  applicationMethod: string; // e.g. "מאלג' משונן / התזה"
  dryingTime: string; // e.g. "ייבוש ראשוני: 3 שעות | מלא: 24 שעות"
  packaging: string; // e.g. "שק 25 ק\"ג / 48 שקים במשטח"
  marketingPhrase: string; // e.g. משפט שיווקי לטיקר
  displayDurationSeconds: number; // default: 12
}

export interface LobbyScreenConfig {
  slideIntervalSeconds: number;
  autoPlayVideo: boolean;
  returnToDispatchOnEvent: boolean;
  dispatchDisplaySeconds: number;
}
