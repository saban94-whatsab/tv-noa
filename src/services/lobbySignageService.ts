import type { LobbyProductItem, LobbyScreenConfig } from "@/types/lobbySignage";

export const DEFAULT_LOBBY_PRODUCTS: LobbyProductItem[] = [
  {
    id: "lobby-prod-1",
    sku: "60301",
    name: "דבק קרמיקה ופורצלן 603 מיסטר פיקס",
    category: "דבקים ומליטה",
    imageUrl:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    isPromo: true,
    promoBadgeText: "מבצע השבוע לקבלנים! 🔥",
    coverageM2: 'כ-4-5 ק"ג למ"ר עם מאלג\' 8 מ"מ',
    applicationMethod: "מאלג' משונן 6/8/10 מ\"מ במריחה כפולה",
    dryingTime: "ייבוש ראשוני: 4 שעות | דריכה ומילוי מישקים: 24 שעות",
    packaging: 'שק 25 ק"ג מוגן לחות | 48 שקים במשטח תקני',
    marketingPhrase:
      "הדבק הנבחר של הקבלנים המובילים בישראל – הידבקות מעולה לגרניט פורצלן ומשטחים מאתגרים!",
    displayDurationSeconds: 14,
  },
  {
    id: "lobby-prod-2",
    sku: "11402",
    name: "דבק גמיש C2TE S1 סופר-פלקס 114",
    category: "דבקים ומליטה",
    imageUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    isPromo: true,
    promoBadgeText: "מחיר קבלנים מיוחד ⚡",
    coverageM2: 'כ-4.5 ק"ג למ"ר ללוחות גדולים',
    applicationMethod: "מריחה צולבת במאלג' משונן 10 מ\"מ",
    dryingTime: "התייצבות: 6 שעות | ייבוש סופי: 24-48 שעות",
    packaging: 'שק 25 ק"ג | 48 שקים במשטח',
    marketingPhrase: "עמידות שיא בגמישות וספיגת זעזועים – אידיאלי לאריחי ענק וחיפוי חוץ בטוח!",
    displayDurationSeconds: 12,
  },
  {
    id: "lobby-prod-3",
    sku: "75001",
    name: "טיח גבס למכונה MP75 קנאוף / אורבונד",
    category: "טיח וגבס",
    imageUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    isPromo: false,
    promoBadgeText: "איכות פרמיום",
    coverageM2: '1.05 ק"ג למ"ר לכל מ"מ עובי שכבה',
    applicationMethod: "התזה במכונת טיח ייעודית והחלקה בסרגל H",
    dryingTime: "ייבוש ראשוני: 3 שעות | גמר מוחלק מלא: 7-14 יום",
    packaging: 'שק 25 ק"ג / 30 ק"ג | אספקה ישירה במשטחים סגורים',
    marketingPhrase: "גימור חלק כראי ובידוד תרמי ואקוסטי מעולה בכל חלל פנים – עבודה מהירה ויעילה!",
    displayDurationSeconds: 14,
  },
  {
    id: "lobby-prod-4",
    sku: "10001",
    name: "מלט פורטלנד אפור נשר CEM I 42.5N",
    category: "חומרי מליטה ותשתיות",
    imageUrl:
      "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=80",
    isPromo: false,
    coverageM2: "לפי תערובת הבטון/טיח (יחס 1:3 עד 1:4)",
    applicationMethod: "ערבול במערבל בטון / ידני עד קבלת מרקם אחיד",
    dryingTime: "התקשרות ראשונית: 90 דק' | חוזק סופי: 28 יום",
    packaging: 'שק 25 ק"ג אטום | 56 שקים במשטח סבן',
    marketingPhrase: "חוזק ועמידות ללא פשרות – תו תקן ישראלי מלא ליציקות, ריצוף ותשתיות איתנות.",
    displayDurationSeconds: 12,
  },
  {
    id: "lobby-prod-5",
    sku: "60002",
    name: "סומסום רטוב / מחצבה בבלות ענק",
    category: "תשתיות חצץ וחול",
    imageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    isPromo: true,
    promoBadgeText: "אספקה ישירה מהמגרש 🏗️",
    coverageM2: 'כ-1.5 טון למ"ק מילוי מתחת לריצוף',
    applicationMethod: "פיזור ויישור במגרפות ומכבש ידני/רוטט",
    dryingTime: "מוכן לריצוף מידית לאחר הידוק ופילוס",
    packaging: "שק בלה ענק מחוזק (כ-1 טון) עם אזני הרמה למנוף",
    marketingPhrase: "תשתית יציבה ומאווררת מתחת לאריחים – מניעת שקיעות וספיגת רטיבות מקסימלית!",
    displayDurationSeconds: 12,
  },
  {
    id: "lobby-prod-6",
    sku: "40201",
    name: "חומר איטום ביטומני מועשר פולימרים פלסטומר",
    category: "איטום ובידוד",
    imageUrl:
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80",
    isPromo: true,
    promoBadgeText: "הגנת חורף הרמטית 🌧️",
    coverageM2: 'כ-1.5 עד 2.5 ק"ג למ"ר בשתי שכבות',
    applicationMethod: "רולר, מברשת זפת או התזה ללא דילול",
    dryingTime: "בין שכבות: 4-6 שעות | ייבוש מלא: 48 שעות",
    packaging: 'פח 18 ק"ג / חבית 200 ק"ג לקבלנים',
    marketingPhrase:
      "מחסום חסין חדירת מים לקירות תמך, מרתפים וקורות קשר – איטום שעומד בכל תנאי לחץ!",
    displayDurationSeconds: 12,
  },
];

export const DEFAULT_LOBBY_CONFIG: LobbyScreenConfig = {
  slideIntervalSeconds: 12,
  autoPlayVideo: true,
  returnToDispatchOnEvent: true,
  dispatchDisplaySeconds: 60,
};

const PRODUCTS_STORAGE_KEY = "saban_lobby_products_v1";
const CONFIG_STORAGE_KEY = "saban_lobby_config_v1";

export function getLobbyProducts(): LobbyProductItem[] {
  if (typeof window === "undefined") {
    return DEFAULT_LOBBY_PRODUCTS;
  }
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return DEFAULT_LOBBY_PRODUCTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn("Could not read lobby products from localStorage:", err);
  }
  return DEFAULT_LOBBY_PRODUCTS;
}

export function saveLobbyProducts(items: LobbyProductItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Could not save lobby products to localStorage:", err);
  }
}

export function getLobbyConfig(): LobbyScreenConfig {
  if (typeof window === "undefined") {
    return DEFAULT_LOBBY_CONFIG;
  }
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_LOBBY_CONFIG;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return { ...DEFAULT_LOBBY_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn("Could not read lobby config from localStorage:", err);
  }
  return DEFAULT_LOBBY_CONFIG;
}

export function saveLobbyConfig(cfg: LobbyScreenConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(cfg));
  } catch (err) {
    console.error("Could not save lobby config to localStorage:", err);
  }
}
