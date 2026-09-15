import React, { useState, useEffect } from "react";
import {
  BellRing,
  X,
  Send,
  AlertTriangle,
  Info,
  Siren,
  Volume2,
  Tv,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import type { ScreenDevice } from "@/types/admin";
import { useAdminControl } from "@/context/AdminControlContext";
import { toast } from "sonner";

interface InstantAlertModalProps {
  screen?: ScreenDevice | null;
  screens?: ScreenDevice[];
  isOpen: boolean;
  onClose: () => void;
}

interface AlertPreset {
  id: string;
  label: string;
  title: string;
  message: string;
  level: "critical" | "warning" | "info";
  icon: string;
}

const PRESETS: AlertPreset[] = [
  {
    id: "truck_waiting",
    label: "משאית בשער 2",
    title: "משאית ממתינה להעמסה",
    message: "משאית ממתינה כעת בשער 2, נא לתת עדיפות להעמסת ההזמנה מיד.",
    level: "warning",
    icon: "🚚",
  },
  {
    id: "hold_loading",
    label: "עצור העמסה זמנית",
    title: "עצור העמסה זמנית!",
    message: "נא לעצור העמסה של ההזמנה הנוכחית לבדיקת פריטים דחופה מול משרד ההפצה.",
    level: "critical",
    icon: "🛑",
  },
  {
    id: "call_office",
    label: "קריאה למשרד ההפצה",
    title: "נא ליצור קשר עם המשרד",
    message: "מנהל מחסן או מלקט ראשי - נא ליצור קשר טלפוני מיידי עם סדרן ההפצה.",
    level: "warning",
    icon: "📞",
  },
  {
    id: "clear_dock",
    label: "פינוי רחבת פריקה",
    title: "פינוי מעברים ורחבה דחוף",
    message: "משאית פריקת סחורה נכנסת לרציף, נא לפנות את המעבר הראשי ממלגזות ומשטחים.",
    level: "warning",
    icon: "📦",
  },
  {
    id: "order_released",
    label: "אישור שחרור משאית",
    title: "ההזמנה מאושרת ליציאה",
    message: "ההזמנה נבדקה ואושרה סופית במשרד, הנהג רשאי לצאת לדרכו.",
    level: "info",
    icon: "✅",
  },
  {
    id: "priority_change",
    label: "החלפת סדר העמסות",
    title: "שינוי סדר עדיפויות להעמסה",
    message: "עקב דחיפות נהג, נא להקדים את ליקוט ההזמנה הבאה ברשימה.",
    level: "info",
    icon: "⚡",
  },
];

export function InstantAlertModal({ screen, screens, isOpen, onClose }: InstantAlertModalProps) {
  const { sendInstantAlert, canDispatch } = useAdminControl();

  const [title, setTitle] = useState("קריאה דחופה למחסן");
  const [message, setMessage] = useState("משאית ממתינה בשער 2, נא לסיים ליקוט של משטח גבס.");
  const [level, setLevel] = useState<"critical" | "warning" | "info">("warning");
  const [voiceAnnounce, setVoiceAnnounce] = useState(true);
  const [durationMinutes, setDurationMinutes] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const targetScreens = screens && screens.length > 0 ? screens : screen ? [screen] : [];

  if (!isOpen || targetScreens.length === 0) return null;

  const isSingle = targetScreens.length === 1;
  const singleScreen = targetScreens[0];
  const isOnline = isSingle ? singleScreen.status === "online" : true;
  const onlineCount = targetScreens.filter((s) => s.status === "online").length;

  const handleApplyPreset = (preset: AlertPreset) => {
    setTitle(preset.title);
    setMessage(preset.message);
    setLevel(preset.level);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("נא להזין כותרת להתראה");
      return;
    }
    if (!message.trim()) {
      toast.error("נא להזין תוכן התראה קצרה");
      return;
    }

    setIsSubmitting(true);
    try {
      sendInstantAlert(
        targetScreens.map((s) => s.id),
        {
          title: title.trim(),
          message: message.trim(),
          level,
          voiceAnnounce,
          durationMinutes,
        },
      );

      if (isSingle) {
        toast.success(
          `ההתראה נשלחה בהצלחה למסך "${singleScreen.name}"! (${durationMinutes} דקות תוקף)`,
        );
      } else {
        toast.success(
          `ההתראה נשלחה בהצלחה ל-${targetScreens.length} מסכים נבחרים! (${durationMinutes} דקות תוקף)`,
        );
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("שגיאה בשליחת ההתראה");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="instant-alert-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-3 rounded-2xl flex items-center justify-center shadow-lg ${
                level === "critical"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-rose-500/10"
                  : level === "warning"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-amber-500/10"
                    : "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sky-500/10"
              }`}
            >
              {level === "critical" ? (
                <Siren className="w-6 h-6 animate-pulse" />
              ) : level === "warning" ? (
                <BellRing className="w-6 h-6 animate-bounce" />
              ) : (
                <Info className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="instant-alert-title"
                  className="text-lg sm:text-xl font-black text-white tracking-tight"
                >
                  {isSingle
                    ? "התראה מיידית למסך שידור"
                    : `התראה מיידית ל-${targetScreens.length} מסכים`}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {isSingle ? "יעד ספציפי בלבד" : `${targetScreens.length} מסכים נבחרו`}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isSingle
                  ? "שליחת הודעה מתפרצת חיה שתוצג באופן מיידי ובלעדי על גבי מסך זה בלבד"
                  : `שליחת הודעה מתפרצת חיה שתוצג בו-זמנית ובאופן מיידי על ${targetScreens.length} המסכים שנבחרו`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="סגור חלון"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Targeted Screen(s) Info Card */}
        <div className="px-5 sm:px-6 pt-4">
          {isSingle ? (
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-800 text-sky-400 border border-slate-700">
                  <Tv className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-black text-slate-100 text-sm">
                    <span>{singleScreen.name}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${
                        isOnline
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`}
                      />
                      {isOnline ? "מחובר (Online)" : "מנותק (Offline)"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                    <span>{singleScreen.warehouseLocation}</span>
                    <span>&bull;</span>
                    <span className="text-sky-400 font-medium">
                      אחראי: {singleScreen.branchManager}
                    </span>
                    <span>&bull;</span>
                    <span className="font-mono text-slate-500">IP: {singleScreen.ipAddress}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl self-start sm:self-auto flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>משודר למסך זה בלבד</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800 text-sky-400 border border-slate-700">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-black text-slate-100 text-sm">
                      <span>{targetScreens.length} מסכי שידור נבחרו להודעה</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                        שידור קבוצתי ממוקד
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      ההתראה תוקפץ בו-זמנית ובאופן בלעדי במסכים שסומנו להלן
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{onlineCount} מחוברים</span>
                  </span>
                  {targetScreens.length - onlineCount > 0 && (
                    <span className="text-[11px] font-medium text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2.5 py-1 rounded-lg">
                      {targetScreens.length - onlineCount} מנותקים
                    </span>
                  )}
                </div>
              </div>

              {/* Target Screen Badges */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80 max-h-28 overflow-y-auto">
                {targetScreens.map((s) => {
                  const on = s.status === "online";
                  return (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-[11px]"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${on ? "bg-emerald-400" : "bg-rose-500"}`}
                      />
                      <span className="font-bold">{s.name}</span>
                      <span className="text-slate-500 text-[10px]">({s.warehouseLocation})</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:px-6 space-y-5">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>תבניות הודעה מהירות בקליק אחד:</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                לחיצה ממלאת כותרת, טקסט ורמת דחיפות
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-slate-600 text-right transition-all text-xs group"
                >
                  <span className="text-base">{preset.icon}</span>
                  <span className="truncate text-slate-200 group-hover:text-white font-medium">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Urgency Level Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              רמת דחיפות ההתראה:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setLevel("critical")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  level === "critical"
                    ? "bg-rose-950/70 border-rose-500 text-white shadow-lg shadow-rose-900/30 ring-2 ring-rose-500/40"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40"
                }`}
              >
                <Siren
                  className={`w-5 h-5 mb-1 ${level === "critical" ? "text-rose-400 animate-pulse" : "text-slate-500"}`}
                />
                <span className="text-xs font-black">קריטית / חירום</span>
                <span className="text-[10px] text-slate-400 mt-0.5">צליל אזעקה ורקע אדום</span>
              </button>

              <button
                type="button"
                onClick={() => setLevel("warning")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  level === "warning"
                    ? "bg-amber-950/70 border-amber-500 text-white shadow-lg shadow-amber-900/30 ring-2 ring-amber-500/40"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40"
                }`}
              >
                <AlertTriangle
                  className={`w-5 h-5 mb-1 ${level === "warning" ? "text-amber-400" : "text-slate-500"}`}
                />
                <span className="text-xs font-black">אזהרה תפעולית</span>
                <span className="text-[10px] text-slate-400 mt-0.5">צליל התראה ורקע כתום</span>
              </button>

              <button
                type="button"
                onClick={() => setLevel("info")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  level === "info"
                    ? "bg-sky-950/70 border-sky-500 text-white shadow-lg shadow-sky-900/30 ring-2 ring-sky-500/40"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40"
                }`}
              >
                <Info
                  className={`w-5 h-5 mb-1 ${level === "info" ? "text-sky-400" : "text-slate-500"}`}
                />
                <span className="text-xs font-black">הודעה שוטפת</span>
                <span className="text-[10px] text-slate-400 mt-0.5">צליל עדין ורקע כחול</span>
              </button>
            </div>
          </div>

          {/* Title & Short Message */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <label className="font-bold text-slate-300">כותרת ההתראה (נושא):</label>
                <span className="text-slate-500 text-[10px] font-mono">{title.length}/60</span>
              </div>
              <input
                type="text"
                maxLength={60}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="למשל: משאית ממתינה בשער 2..."
                className="w-full bg-slate-950 border border-slate-750 focus:border-sky-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <label className="font-bold text-slate-300">תוכן ההתראה הקצרה למסך:</label>
                <span className="text-slate-500 text-[10px] font-mono">{message.length}/180</span>
              </div>
              <textarea
                rows={3}
                maxLength={180}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="הזן הודעה תמציתית וברורה שתוצג בבירור במרכז המסך..."
                className="w-full bg-slate-950 border border-slate-750 focus:border-sky-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors resize-none"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                💡 טיפ: הודעות קצרות וברורות נקראות בקלות רבה יותר על גבי מסך הטלוויזיה מרחוק.
              </p>
            </div>
          </div>

          {/* Options: Voice & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={voiceAnnounce}
                onChange={(e) => setVoiceAnnounce(e.target.checked)}
                className="w-4 h-4 rounded accent-sky-500 bg-slate-800 border-slate-700"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>כריזה קולית בעברית (TTS)</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  הקראת ההתראה בקול רם ברמקולי המסך
                </span>
              </div>
            </label>

            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>משך הצגה:</span>
              </span>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value={2}>2 דקות (מהיר)</option>
                <option value={5}>5 דקות (מומלץ)</option>
                <option value={10}>10 דקות</option>
                <option value={30}>30 דקות</option>
              </select>
            </div>
          </div>

          {/* TV Live Mini Preview */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Tv className="w-3 h-3 text-slate-400" />
              <span>
                תצוגה מקדימה כפי שתופיע במסך{" "}
                {isSingle ? `"${singleScreen.name}"` : `הנבחרים (${targetScreens.length} מסכים)`}:
              </span>
            </div>
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                level === "critical"
                  ? "bg-rose-950/80 border-rose-500 text-rose-100 shadow-lg shadow-rose-950"
                  : level === "warning"
                    ? "bg-amber-950/80 border-amber-500 text-amber-100 shadow-lg shadow-amber-950"
                    : "bg-sky-950/80 border-sky-500 text-sky-100 shadow-lg shadow-sky-950"
              }`}
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`p-1.5 rounded-lg ${
                      level === "critical"
                        ? "bg-rose-500 text-white"
                        : level === "warning"
                          ? "bg-amber-500 text-black font-bold"
                          : "bg-sky-500 text-white"
                    }`}
                  >
                    {level === "critical" ? (
                      <Siren className="w-4 h-4" />
                    ) : (
                      <BellRing className="w-4 h-4" />
                    )}
                  </span>
                  <span className="text-xs font-black uppercase tracking-wide">
                    {level === "critical"
                      ? "התראת חירום מבצעית"
                      : level === "warning"
                        ? "התראה תפעולית דחופה"
                        : "הודעת עדכון משרד"}
                  </span>
                </div>
                {voiceAnnounce && (
                  <span className="flex items-center gap-1 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-400/30">
                    <Volume2 className="w-3 h-3" />
                    <span>קריינות קולית פעילה</span>
                  </span>
                )}
              </div>
              <h4 className="text-base font-black text-white">{title || "כותרת ההתראה"}</h4>
              <p className="text-xs mt-1 text-slate-200 line-clamp-2 leading-relaxed">
                {message || "תוכן ההתראה הקצרה יופיע כאן..."}
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-colors"
            >
              ביטול
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !message.trim()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all ${
                level === "critical"
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 border border-rose-400/40"
                  : level === "warning"
                    ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 border border-amber-400/40"
                    : "bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30 border border-sky-400/40"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? "משגר התראה..."
                  : isSingle
                    ? `שגר התראה למסך "${singleScreen.name}"`
                    : `שגר התראה ל-${targetScreens.length} מסכים עכשיו`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
