import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  ChevronRight,
  ChevronLeft,
  Tv,
  ArrowLeft,
} from "lucide-react";
import type { LobbyProductItem, LobbyScreenConfig } from "@/types/lobbySignage";
import { getLobbyProducts, getLobbyConfig } from "@/services/lobbySignageService";
import { LobbyProductSlide } from "./LobbyProductSlide";
import { DriveMediaPlayer } from "@/components/screensaver/DriveMediaPlayer";
import { useDispatchBoard } from "@/context/DispatchContext";
import { OrderCard } from "@/components/tv/OrderCard";
import { TVHeader } from "@/components/tv/TVHeader";
import { UrgentDeliveriesTicker } from "@/components/tv/UrgentDeliveriesTicker";

interface LobbyMediaOrchestratorProps {
  previewMode?: boolean;
  onCustomNavigate?: (path: string) => void;
}

type Mode = "product" | "video" | "gallery" | "dispatch_override";

export function LobbyMediaOrchestrator({ previewMode = false }: LobbyMediaOrchestratorProps) {
  const { published, recentlyChangedOrderIds } = useDispatchBoard();

  const [products, setProducts] = useState<LobbyProductItem[]>([]);
  const [config, setConfig] = useState<LobbyScreenConfig>(getLobbyConfig());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("product");
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [dispatchCountdown, setDispatchCountdown] = useState(60);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastPublishedCountRef = useRef(published.length);
  const lastOrderChangeTimesRef = useRef<Record<string, number>>({});

  // 1. Load initial products & config
  useEffect(() => {
    const prods = getLobbyProducts();
    setProducts(prods);
    setConfig(getLobbyConfig());
  }, []);

  // 2. React to Dispatch updates (new orders or recently changed status)
  useEffect(() => {
    if (!config.returnToDispatchOnEvent) return;

    const currentCount = published.length;
    const countChanged = currentCount !== lastPublishedCountRef.current && currentCount > 0;
    lastPublishedCountRef.current = currentCount;

    // Check recent changes
    let hasRecentStatusChange = false;
    const now = Date.now();
    for (const [id, time] of Object.entries(recentlyChangedOrderIds || {})) {
      const prevTime = lastOrderChangeTimesRef.current[id] || 0;
      if (time > prevTime && now - time < 8000) {
        hasRecentStatusChange = true;
      }
    }
    lastOrderChangeTimesRef.current = { ...recentlyChangedOrderIds };

    if (countChanged || hasRecentStatusChange) {
      // Temporarily switch to dispatch view for configured duration
      setMode("dispatch_override");
      setDispatchCountdown(config.dispatchDisplaySeconds || 60);
    }
  }, [
    published,
    recentlyChangedOrderIds,
    config.returnToDispatchOnEvent,
    config.dispatchDisplaySeconds,
  ]);

  // 3. Countdown when in dispatch_override mode
  useEffect(() => {
    if (mode !== "dispatch_override") return;

    const timer = setInterval(() => {
      setDispatchCountdown((prev) => {
        if (prev <= 1) {
          setMode("product");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode]);

  // Current active product
  const activeProduct = products[currentIndex] || products[0];

  // Advance to next step in dynamic playlist
  const advanceNext = useCallback(() => {
    if (products.length === 0) return;

    if (mode === "product") {
      // If the current product has a video and autoPlay is true, play video
      if (activeProduct?.videoUrl && config.autoPlayVideo) {
        setMode("video");
        return;
      }
      // Every 3 products, show Drive media / gallery slide for richness
      if ((currentIndex + 1) % 3 === 0) {
        setMode("gallery");
        return;
      }
      // Otherwise next product
      setCurrentIndex((prev) => (prev + 1) % products.length);
    } else if (mode === "video") {
      // After video, check gallery or next product
      if ((currentIndex + 1) % 3 === 0) {
        setMode("gallery");
      } else {
        setMode("product");
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }
    } else if (mode === "gallery") {
      // Return to next product
      setMode("product");
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }
  }, [products.length, mode, activeProduct, config.autoPlayVideo, currentIndex]);

  const advancePrev = () => {
    if (products.length === 0) return;
    setMode("product");
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  // 4. Timer for product & gallery modes
  useEffect(() => {
    if (isPaused || mode === "video" || mode === "dispatch_override" || products.length === 0) {
      return;
    }

    const duration =
      mode === "product"
        ? (activeProduct?.displayDurationSeconds || config.slideIntervalSeconds || 12) * 1000
        : 14000; // Gallery duration: 14s

    const timeout = setTimeout(() => {
      advanceNext();
    }, duration);

    return () => clearTimeout(timeout);
  }, [mode, currentIndex, activeProduct, isPaused, products.length, config, advanceNext]);

  // Video end handler
  const handleVideoEnded = () => {
    advanceNext();
  };

  return (
    <div
      className={`relative w-full h-full bg-black overflow-hidden select-none ${previewMode ? "rounded-2xl" : "min-h-screen"}`}
    >
      {/* Floating Manual Controls & Indicator (discreet overlay in corner) */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 text-white shadow-xl text-xs">
        <span className="flex items-center gap-1.5 font-bold text-sky-400">
          <Tv className="size-3.5" />
          {mode === "product" && "שילוט מוצר"}
          {mode === "video" && "סרטון הדגמה"}
          {mode === "gallery" && "מדיה מהמגרש"}
          {mode === "dispatch_override" && `לוח סידור (${dispatchCountdown}s)`}
        </span>

        <div className="h-3 w-px bg-slate-700 mx-1" />

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={isPaused ? "המשך סבב" : "השהה סבב"}
        >
          {isPaused ? (
            <Play className="size-3.5 text-emerald-400" />
          ) : (
            <Pause className="size-3.5" />
          )}
        </button>

        <button
          onClick={advancePrev}
          className="p-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="פריט קודם"
        >
          <ChevronRight className="size-3.5" />
        </button>

        <button
          onClick={advanceNext}
          className="p-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="פריט הבא"
        >
          <ChevronLeft className="size-3.5" />
        </button>

        {mode === "video" && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "בטל השתקה" : "השתק"}
          >
            {isMuted ? (
              <VolumeX className="size-3.5 text-amber-400" />
            ) : (
              <Volume2 className="size-3.5 text-emerald-400" />
            )}
          </button>
        )}

        {mode === "dispatch_override" && (
          <button
            onClick={() => setMode("product")}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold cursor-pointer"
          >
            חזור לשילוט <ArrowLeft className="size-3" />
          </button>
        )}
      </div>

      {/* Main Orchestration Views */}
      <AnimatePresence mode="wait">
        {/* VIEW 1: PRODUCT SIGNAGE SLIDE */}
        {mode === "product" && activeProduct && (
          <motion.div
            key={`product-${activeProduct.id}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <LobbyProductSlide
              product={activeProduct}
              currentIndex={currentIndex + 1}
              totalCount={products.length}
            />
          </motion.div>
        )}

        {/* VIEW 2: PRODUCT VIDEO SHOWCASE (Full screen with product watermark) */}
        {mode === "video" && activeProduct?.videoUrl && (
          <motion.div
            key={`video-${activeProduct.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full min-h-screen bg-black flex items-center justify-center overflow-hidden"
          >
            <video
              ref={videoRef}
              src={activeProduct.videoUrl}
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={handleVideoEnded}
              className="w-full h-full object-contain"
            />

            {/* Video Overlay Watermark & Info */}
            <div
              className="absolute bottom-6 right-6 z-30 max-w-lg bg-slate-950/85 backdrop-blur-md p-4 rounded-2xl border border-slate-800 text-white shadow-2xl"
              dir="rtl"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1">
                <Film className="size-4" />
                <span>סרטון הדגמה ויישום בשטח</span>
              </div>
              <h3 className="text-lg font-black text-white line-clamp-1">{activeProduct.name}</h3>
              <p className="text-xs text-slate-300 line-clamp-2 mt-1 font-medium">
                {activeProduct.marketingPhrase}
              </p>
            </div>

            {/* Skip video button */}
            <button
              onClick={advanceNext}
              className="absolute bottom-6 left-6 z-30 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <span>דלג לשקופית הבאה</span>
              <SkipForward className="size-4" />
            </button>
          </motion.div>
        )}

        {/* VIEW 3: DRIVE MEDIA & WAREHOUSE GALLERY */}
        {mode === "gallery" && (
          <motion.div
            key="gallery-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-full min-h-screen bg-slate-950"
          >
            <DriveMediaPlayer onActivity={advanceNext} isScreensaverActive={true} />
            <div className="absolute top-4 right-4 z-40 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 text-white text-xs font-bold flex items-center gap-2">
              <Sparkles className="size-4 text-amber-400" />
              <span>תמונות ומדיה מפרויקטי ח. סבן</span>
            </div>
          </motion.div>
        )}

        {/* VIEW 4: DISPATCH OVERRIDE (Event Triggered) */}
        {mode === "dispatch_override" && (
          <motion.div
            key="dispatch-override"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            dir="rtl"
            className="relative w-full h-full min-h-screen bg-slate-950 text-white p-4 sm:p-6 overflow-y-auto"
          >
            {/* Urgent Dispatch Banner */}
            <div className="mb-4 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 p-4 rounded-2xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <span className="size-3 rounded-full bg-amber-400 animate-ping" />
                <div>
                  <h2 className="text-lg font-black text-white">
                    📢 עדכון לוגיסטי בשידור חי מלוח הסידור
                  </h2>
                  <p className="text-xs text-sky-100 font-medium">
                    המסך יחזור לשילוט המוצרים בעוד {dispatchCountdown} שניות
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMode("product")}
                className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
              >
                חזור מיד לשילוט
              </button>
            </div>

            <TVHeader />
            <div className="my-3">
              <UrgentDeliveriesTicker />
            </div>

            {/* Grid of latest active orders */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 mt-4">
              {published.slice(0, 6).map((order, idx) => (
                <OrderCard key={order.orderId} order={order} index={idx} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
