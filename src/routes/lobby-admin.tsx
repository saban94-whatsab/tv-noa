import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Tv,
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  Sparkles,
  Play,
  Flame,
  Tag,
  Clock,
  Layers,
  Wrench,
  Package,
  ExternalLink,
  Sliders,
  Eye,
  CheckCircle2,
  Building2,
  Video,
  ArrowRight,
} from "lucide-react";
import type { LobbyProductItem, LobbyScreenConfig } from "@/types/lobbySignage";
import {
  DEFAULT_LOBBY_PRODUCTS,
  getLobbyProducts,
  saveLobbyProducts,
  getLobbyConfig,
  saveLobbyConfig,
} from "@/services/lobbySignageService";
import { LobbyMediaOrchestrator } from "@/components/lobby/LobbyMediaOrchestrator";
import { DispatchProvider } from "@/context/DispatchContext";

export const Route = createFileRoute("/lobby-admin")({
  head: () => ({
    meta: [
      { title: "ח. סבן · ניהול וסימולציית מסכי לובי (Lobby Admin & Simulator)" },
      {
        name: "description",
        content: "ממשק ניהול מוצרי שילוט, מבצעי שבוע, קישורי וידאו וסימולטור חי של מסכי הלובי.",
      },
    ],
  }),
  component: LobbyAdminRouteComponent,
});

function LobbyAdminRouteComponent() {
  return (
    <DispatchProvider>
      <LobbyAdminContent />
    </DispatchProvider>
  );
}

function LobbyAdminContent() {
  const [products, setProducts] = useState<LobbyProductItem[]>([]);
  const [config, setConfig] = useState<LobbyScreenConfig>(getLobbyConfig());
  const [editingProduct, setEditingProduct] = useState<LobbyProductItem | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setProducts(getLobbyProducts());
    setConfig(getLobbyConfig());
  }, []);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let updated: LobbyProductItem[];
    const exists = products.some((p) => p.id === editingProduct.id);

    if (exists) {
      updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    } else {
      updated = [editingProduct, ...products];
    }

    setProducts(updated);
    saveLobbyProducts(updated);
    setEditingProduct(null);
    triggerSuccess();
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק מוצר זה ממסך הלובי?")) return;
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveLobbyProducts(updated);
    triggerSuccess();
  };

  const handleResetDefaults = () => {
    if (!confirm("האם לאפס את כל המוצרים לברירת המחדל המקורית של ח. סבן?")) return;
    setProducts(DEFAULT_LOBBY_PRODUCTS);
    saveLobbyProducts(DEFAULT_LOBBY_PRODUCTS);
    triggerSuccess();
  };

  const handleSaveConfig = () => {
    saveLobbyConfig(config);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleNewProduct = () => {
    const newItem: LobbyProductItem = {
      id: `prod-${Date.now()}`,
      sku: "100" + Math.floor(10 + Math.random() * 90),
      name: "מוצר בנייה חדש",
      category: "חומרי מליטה וגמר",
      imageUrl:
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "",
      isPromo: true,
      promoBadgeText: "מבצע מיוחד!",
      coverageM2: 'כ-2 ק"ג למ"ר',
      applicationMethod: "מאלג' / מברשת",
      dryingTime: "ייבוש ראשוני: 3 שעות | סופי: 24 שעות",
      packaging: 'שק 25 ק"ג | 48 שקים במשטח',
      marketingPhrase: "איכות מעולה ועמידות לשנים רבות – עכשיו במחיר קבלנים ישיר!",
      displayDurationSeconds: 12,
    };
    setEditingProduct(newItem);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      {/* Admin Top Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/30">
            <Tv className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                מרכז ניהול שילוט מוצרים בלובי (Lobby Signage Admin)
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-950 text-sky-300 border border-sky-800">
                ח. סבן 1994
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              שליטה מלאה במצגות המוצרים, תמחור קבלנים, סרטוני הדרכה וסימולטור חי של טלוויזיית החנות
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/lobby"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <ExternalLink className="size-4" />
            פתח מסך מלא (/lobby)
          </a>

          <button
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <Eye className="size-4 text-sky-400" />
            {isSimulatorOpen ? "הסתר סימולטור" : "הצג סימולטור חי"}
          </button>

          <button
            onClick={handleNewProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            הוסף מוצר לשילוט
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {saveSuccess && (
        <div className="max-w-7xl mx-auto mb-6 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="size-4" />
          השינויים נשמרו בהצלחה ועודכנו במסכי הלובי!
        </div>
      )}

      {/* Main Grid: Management vs Simulator */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left/Main Column: Product Cards & Config (xl:col-span-7) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Screen Configuration Card */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-sky-400">
                <Sliders className="size-4" />
                <span>הגדרות מסך וזמני החלפה</span>
              </div>
              <button
                onClick={handleSaveConfig}
                className="text-xs bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                שמור הגדרות
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">זמן שקופית (שניות)</label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={config.slideIntervalSeconds}
                  onChange={(e) =>
                    setConfig({ ...config, slideIntervalSeconds: Number(e.target.value) || 12 })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  ניגון סרטונים אוטומטי
                </label>
                <select
                  value={config.autoPlayVideo ? "true" : "false"}
                  onChange={(e) =>
                    setConfig({ ...config, autoPlayVideo: e.target.value === "true" })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="true">כן (נגן סרטון כשיש קישור)</option>
                  <option value="false">לא (רק תמונות ומפרטים)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  הצגת לוח סידור באירוע
                </label>
                <select
                  value={config.returnToDispatchOnEvent ? "true" : "false"}
                  onChange={(e) =>
                    setConfig({ ...config, returnToDispatchOnEvent: e.target.value === "true" })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="true">כן (הצג 60 שנ' בעדכון)</option>
                  <option value="false">לא (הישאר בשילוט רציף)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Items Table / Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>רשימת המוצרים במסך הלובי ({products.length})</span>
              </h2>
              <button
                onClick={handleResetDefaults}
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                איפוס לברירת מחדל
              </button>
            </div>

            {products.map((item, index) => (
              <div
                key={item.id}
                className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative size-16 rounded-xl bg-white p-1 border border-slate-700 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    {item.isPromo && (
                      <span className="absolute top-0 right-0 bg-rose-600 text-[9px] text-white font-black px-1 rounded-bl">
                        HOT
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-400">מק״ט {item.sku}</span>
                      <span className="text-[11px] text-slate-400">· {item.category}</span>
                      {item.videoUrl && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Video className="size-2.5" /> וידאו
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-medium">
                      {item.marketingPhrase}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setEditingProduct(item)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="ערוך מוצר"
                  >
                    <Edit className="size-3.5" />
                    <span>ערוך</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(item.id)}
                    className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="מחק מוצר"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Screen Simulator (xl:col-span-5) */}
        {isSimulatorOpen && (
          <div className="xl:col-span-5 space-y-4">
            <div className="sticky top-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>סימולטור חי של מסך הלובי (Live Preview)</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  יחס 16:9 כמו בטלוויזיה
                </span>
              </div>

              {/* TV Mockup Frame */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden border-4 border-slate-800 bg-black shadow-2xl relative">
                <LobbyMediaOrchestrator previewMode={true} />
              </div>

              <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="font-bold text-slate-300">💡 טיפ לניהול התצוגה:</p>
                <p>
                  המסך בלובי עובר אוטומטית בין שקופיות המוצר המוגדרות. מוצרים עם קישור וידאו (MP4)
                  ינגנו את הסרטון במסך מלא לאחר השקופית!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2 text-lg font-black text-white">
                <Edit className="size-5 text-sky-400" />
                <span>עריכת מוצר לשילוט הלובי</span>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ סגור
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">שם המוצר</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">מק״ט</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">קטגוריה</label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">משך תצוגה (שניות)</label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={editingProduct.displayDurationSeconds}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        displayDurationSeconds: Number(e.target.value) || 12,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  כתובת תמונת מוצר (URL)
                </label>
                <input
                  type="url"
                  required
                  value={editingProduct.imageUrl}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-left font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  קישור וידאו הדגמה (MP4 / Direct Video URL - אופציונלי)
                </label>
                <input
                  type="url"
                  placeholder="https://.../video.mp4"
                  value={editingProduct.videoUrl || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, videoUrl: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-left font-mono"
                />
              </div>

              {/* Promo settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPromoCheck"
                    checked={editingProduct.isPromo}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isPromo: e.target.checked })
                    }
                    className="size-4 rounded accent-rose-600"
                  />
                  <label htmlFor="isPromoCheck" className="text-white font-bold cursor-pointer">
                    הצג תגית מבצע בולטת (Pulse Badge)
                  </label>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">טקסט תגית מבצע</label>
                  <input
                    type="text"
                    placeholder="מבצע השבוע!, מחיר קבלנים"
                    value={editingProduct.promoBadgeText || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, promoBadgeText: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              {/* 4 Technical specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">כיסוי לפי מ״ר</label>
                  <input
                    type="text"
                    value={editingProduct.coverageM2}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, coverageM2: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">שיטת יישום</label>
                  <input
                    type="text"
                    value={editingProduct.applicationMethod}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, applicationMethod: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">זמן ייבוש</label>
                  <input
                    type="text"
                    value={editingProduct.dryingTime}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, dryingTime: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">תכולת אריזה</label>
                  <input
                    type="text"
                    value={editingProduct.packaging}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, packaging: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  משפט שיווקי לשורת הטיקר הנע (Marquee)
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.marketingPhrase}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, marketingPhrase: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg shadow-sky-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="size-4" />
                  שמור מוצר לשילוט
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
