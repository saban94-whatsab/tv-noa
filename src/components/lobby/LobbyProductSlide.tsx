import { motion } from "framer-motion";
import {
  Layers,
  Wrench,
  Clock,
  Package,
  Sparkles,
  PhoneCall,
  Flame,
  CheckCircle2,
  Tag,
  Building2,
  HelpCircle,
} from "lucide-react";
import type { LobbyProductItem } from "@/types/lobbySignage";

interface LobbyProductSlideProps {
  product: LobbyProductItem;
  currentIndex?: number;
  totalCount?: number;
}

export function LobbyProductSlide({
  product,
  currentIndex = 1,
  totalCount = 1,
}: LobbyProductSlideProps) {
  return (
    <div
      dir="rtl"
      className="relative flex flex-col justify-between w-full h-full min-h-screen bg-[#FDFBF7] text-slate-800 overflow-hidden select-none font-sans"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 15% 20%, rgba(2, 132, 199, 0.05) 0%, transparent 60%), radial-gradient(ellipse at 85% 80%, rgba(245, 158, 11, 0.04) 0%, transparent 55%)",
      }}
    >
      {/* Top Header Bar */}
      <header className="shrink-0 flex items-center justify-between px-6 sm:px-10 py-4 bg-white/80 backdrop-blur-md border-b border-amber-900/10 shadow-xs z-20">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-gradient-to-br from-sky-600 to-sky-700 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
            <Building2 className="size-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                ח. סבן חומרי בניין (1994) בע״מ
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                מרכז השילוט והשיווק בלובי
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              הפתרונות המובילים לבנייה, שלד, גמר ופיתוח תחת קורת גג אחת
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              פריט נבחר
            </span>
            <span className="text-sm font-black text-slate-700">
              {currentIndex} מתוך {totalCount}
            </span>
          </div>
          <div className="size-10 rounded-full border-2 border-sky-500/30 flex items-center justify-center font-black text-sky-700 bg-sky-50 text-sm">
            {currentIndex}/{totalCount}
          </div>
        </div>
      </header>

      {/* Main Showcase Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Product Image & Promo Spotlight (Col 1-5 on desktop) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative flex-1 min-h-[280px] sm:min-h-[380px] rounded-3xl overflow-hidden bg-white border border-amber-900/10 shadow-xl shadow-slate-200/60 p-4 sm:p-6 flex flex-col items-center justify-center">
              {/* Promo Pulse Badge */}
              {product.isPromo && (
                <div className="absolute top-4 right-4 z-20">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full shadow-lg shadow-rose-500/30"
                  >
                    <Flame className="size-4 fill-white" />
                    <span>{product.promoBadgeText || "מבצע השבוע!"}</span>
                  </motion.div>
                </div>
              )}

              {/* SKU & Category Pin */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-600 border border-slate-200">
                  מק״ט {product.sku}
                </span>
              </div>

              {/* Product Visual */}
              <div className="relative w-full h-full max-h-[360px] flex items-center justify-center group overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-h-[320px] w-auto max-w-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  onError={(e) => {
                    // Fallback visual if image fails to load
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
              </div>

              {/* Category pill at bottom of image card */}
              <div className="w-full mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-semibold text-sky-700">
                  <Tag className="size-3.5" />
                  {product.category}
                </span>
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 className="size-3.5" />
                  זמין במלאי המגרש
                </span>
              </div>
            </div>
          </div>

          {/* Product Specifications & Details (Col 6-12 on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-6">
            {/* Title & Brand statement */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-lg shadow-slate-200/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-sky-600">
                  מפרט טכני מקצועי ואיכות מובטחת
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                {product.name}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                {product.marketingPhrase}
              </p>
            </div>

            {/* 4 Technical Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* 1. Coverage m2 */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-900/10 shadow-md shadow-slate-100 flex items-start gap-4">
                <div className="size-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  <Layers className="size-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    כיסוי משוער למ״ר
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-slate-800">
                    {product.coverageM2}
                  </p>
                </div>
              </div>

              {/* 2. Application method */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-900/10 shadow-md shadow-slate-100 flex items-start gap-4">
                <div className="size-11 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Wrench className="size-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    שיטת יישום מומלצת
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-slate-800">
                    {product.applicationMethod}
                  </p>
                </div>
              </div>

              {/* 3. Drying time */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-900/10 shadow-md shadow-slate-100 flex items-start gap-4">
                <div className="size-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="size-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    זמני ייבוש והתקשרות
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-slate-800">
                    {product.dryingTime}
                  </p>
                </div>
              </div>

              {/* 4. Packaging */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-900/10 shadow-md shadow-slate-100 flex items-start gap-4">
                <div className="size-11 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Package className="size-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    תכולת אריזה ואספקה
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-slate-800">
                    {product.packaging}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom In-Store Call-to-Action Banner */}
            <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 rounded-2xl p-4 sm:p-5 text-white shadow-xl shadow-sky-600/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-right">
                <div className="size-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <HelpCircle className="size-6 text-white" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black tracking-tight">
                    💬 שאל את הדלפק על מוצר זה!
                  </h4>
                  <p className="text-xs sm:text-sm text-sky-100 font-medium">
                    יועצי המכירות שלנו כאן לשירותך – תמחור קבלנים, כמויות ופתרונות שינוע במנוף
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 bg-white text-sky-800 text-xs sm:text-sm font-black px-4 py-2 rounded-xl shadow-md">
                  <PhoneCall className="size-4 text-sky-600" />
                  פנה לנציג בדלפק
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Ticker Banner (Marquee from right to left) */}
      <footer className="shrink-0 bg-slate-900 text-white overflow-hidden py-3 border-t border-slate-800 shadow-inner z-20">
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "50%"] }}
            transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
            className="flex items-center gap-12 text-sm sm:text-base font-bold tracking-wide"
          >
            <span className="flex items-center gap-2 text-amber-400">
              <Sparkles className="size-4" />
              ח. סבן – אספקה מהירה ישירות לאתר הבנייה בכל רחבי הארץ
            </span>
            <span className="text-slate-400">✦</span>
            <span className="text-sky-300">
              {product.name} – {product.marketingPhrase}
            </span>
            <span className="text-slate-400">✦</span>
            <span className="text-emerald-400">
              צי משאיות מנוף מתקדם לפריקה בגובה ובשטחים צפופים
            </span>
            <span className="text-slate-400">✦</span>
            <span className="text-amber-300">
              מחירי קבלנים מיוחדים להזמנות משטחים ופול-טריילרים מלאים
            </span>
            <span className="text-slate-400">✦</span>
            <span className="text-slate-200">שירות אדיב וייעוץ מקצועי בדלפק המכירות הראשי</span>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
