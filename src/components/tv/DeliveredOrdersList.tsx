import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  PackageCheck,
  Search,
  Truck,
  Warehouse,
  RotateCcw,
  Boxes,
  Eye,
  EyeOff,
} from "lucide-react";
import { useDispatchBoard } from "@/context/DispatchContext";
import type { Order, OrderStatus } from "@/types/dispatch";
import { cn } from "@/lib/utils";

interface DeliveredOrdersListProps {
  orders: Order[];
  className?: string;
  defaultExpanded?: boolean;
}

export function DeliveredOrdersList({
  orders,
  className,
  defaultExpanded = false,
}: DeliveredOrdersListProps) {
  const { quickUpdateStatus } = useDispatchBoard();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [searchQuery, setSearchQuery] = useState("");
  const [changingOrderId, setChangingOrderId] = useState<string | null>(null);

  const todayHebrewDate = new Date().toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      order.orderId.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.warehouse.toLowerCase().includes(q) ||
      order.driver.toLowerCase().includes(q) ||
      order.city.toLowerCase().includes(q)
    );
  });

  const totalPallets = orders.reduce((acc, o) => acc + (o.logisticsMetrics?.sabanPallets || 0), 0);
  const totalBags = orders.reduce((acc, o) => acc + (o.logisticsMetrics?.bellaBags || 0), 0);

  return (
    <div
      id="delivered-orders-section"
      dir="rtl"
      className={cn(
        "w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 backdrop-blur-xs transition-all",
        className,
      )}
    >
      {/* ── כפתור כותרת הזמנות סופקו מתאריך היום (עיצוב ירוק עדין) ── */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl text-right hover:bg-emerald-500/10 dark:hover:bg-emerald-900/30 transition-all cursor-pointer select-none group"
        aria-expanded={isExpanded}
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* אייקון וי ירוק עדין */}
          <div className="flex items-center justify-center size-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs">
            <CheckCircle2 className="size-5" />
          </div>

          {/* כותרת מפורשת */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-emerald-800 dark:text-emerald-300">
                הזמנות סופקו מתאריך היום
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-black text-emerald-700 dark:text-emerald-300">
                {orders.length} {orders.length === 1 ? "הזמנה" : "הזמנות"}
              </span>
            </div>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
              {todayHebrewDate} · לחיצה {isExpanded ? "להסתרת" : "להצגת"} רשימת ההזמנות שסופקו
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* תגי סיכום קטנים כאשר מכווץ */}
          {orders.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700/90 dark:text-emerald-400/90 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 rounded-lg">
              <span>{totalPallets} משטחים</span>
              <span>·</span>
              <span>{totalBags} בלות</span>
            </div>
          )}

          {/* חיווי חץ פתיחה/סגירה */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs group-hover:bg-emerald-500/25 transition-all">
            <span>{isExpanded ? "הסתר רשימה" : "הצג רשימה"}</span>
            {isExpanded ? (
              <ChevronUp className="size-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ChevronDown className="size-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
        </div>
      </button>

      {/* ── רשימה לאורך: מומחשת בשורה עם שם, לוח מחסן, נהג משוייך ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-emerald-500/20"
          >
            <div className="p-3 sm:p-4 space-y-3">
              {/* סרגל חיפוש וסינון פנימי אם יש יותר מ-3 הזמנות */}
              {orders.length > 2 && (
                <div className="flex items-center gap-2 max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-emerald-600/60 dark:text-emerald-400/60" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="חיפוש לפי לקוח, מספר הזמנה, נהג או מחסן..."
                      className="w-full pl-3 pr-9 py-1.5 text-xs bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1"
                    >
                      נקה
                    </button>
                  )}
                </div>
              )}

              {filteredOrders.length === 0 ? (
                <div className="py-6 text-center text-sm font-medium text-muted-foreground">
                  {orders.length === 0
                    ? "טרם סופקו הזמנות בתאריך של היום."
                    : "לא נמצאו הזמנות סופקו התואמות לחיפוש."}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-background/80 dark:bg-card/80 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all shadow-xs"
                    >
                      {/* 1. שם / לקוח והזמנה */}
                      <div className="flex items-start gap-3 min-w-0 md:w-5/12">
                        <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-xs shrink-0 mt-0.5">
                          ✓
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-sm text-foreground">
                              #{order.orderId}
                            </span>
                            <span className="font-bold text-sm text-foreground truncate">
                              {order.customerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                            {order.city && (
                              <span className="flex items-center gap-1">
                                <MapPin className="size-3 text-muted-foreground/70" />
                                <span>
                                  {order.address ? `${order.address}, ` : ""}
                                  {order.city}
                                </span>
                              </span>
                            )}
                            {order.itemsFormatted && (
                              <span className="truncate max-w-[280px] text-muted-foreground/80">
                                · {order.itemsFormatted}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 2. לוח מחסן */}
                      <div className="flex items-center gap-2 md:w-2/12 shrink-0">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/80 border border-border text-xs font-semibold text-foreground">
                          <Warehouse className="size-3.5 text-primary shrink-0" />
                          <span className="truncate" title={order.warehouse}>
                            {order.warehouse || "מחסן כללי"}
                          </span>
                        </div>
                      </div>

                      {/* 3. נהג משוייך */}
                      <div className="flex items-center gap-2 md:w-2/12 shrink-0">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/80 border border-border text-xs font-semibold text-foreground">
                          <Truck className="size-3.5 text-amber-500 shrink-0" />
                          <span className="truncate" title={order.driver}>
                            {order.driver || "לא שויך נהג"}
                          </span>
                        </div>
                      </div>

                      {/* 4. שעת יעד וסטטוס סופק + כפתור החזרה אם נדרש */}
                      <div className="flex items-center gap-2.5 md:w-3/12 justify-end shrink-0">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                          <Clock className="size-3.5 text-muted-foreground/70" />
                          <span>{order.targetTime || "--:--"}</span>
                        </div>

                        {/* תג סטטוס ירוק עדין */}
                        <div className="flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          <PackageCheck className="size-3.5" />
                          <span>סופק</span>
                        </div>

                        {/* כפתור החזרה מהירה במידה וסומן בטעות */}
                        {changingOrderId === order.orderId ? (
                          <div className="flex items-center gap-1">
                            {(["ממתין", "בהעמסה"] as OrderStatus[]).map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => {
                                  quickUpdateStatus(order.orderId, status);
                                  setChangingOrderId(null);
                                }}
                                className="px-2 py-1 text-[11px] font-bold rounded-md bg-secondary hover:bg-primary hover:text-white border border-border transition-colors cursor-pointer"
                              >
                                {status}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => setChangingOrderId(null)}
                              className="px-1.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
                            >
                              ביטול
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setChangingOrderId(order.orderId)}
                            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            title="שנה סטטוס / החזר הזמנה אם סומנה בטעות"
                          >
                            <RotateCcw className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
