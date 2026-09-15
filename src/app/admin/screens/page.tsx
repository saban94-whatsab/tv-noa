import React, { useState } from "react";
import {
  Tv,
  Plus,
  RefreshCw,
  Volume2,
  VolumeX,
  Sliders,
  ShieldAlert,
  Clock,
  Trash2,
  ExternalLink,
  Power,
  Sparkles,
  Search,
  CheckCircle,
  AlertCircle,
  KeyRound,
  BellRing,
  Table as TableIcon,
  LayoutGrid,
} from "lucide-react";
import { useAdminControl } from "@/context/AdminControlContext";
import { InstantAlertModal } from "@/components/admin/InstantAlertModal";
import type { ScreenDevice } from "@/types/admin";
import { toast } from "sonner";

interface ScreensPageProps {
  onNavigate?: (path: string) => void;
}

export default function ScreensPage({ onNavigate }: ScreensPageProps) {
  const {
    screens,
    pairDevice,
    unpairDevice,
    sendRemoteCommand,
    generatePairingCode,
    pendingPairingCodes,
    broadcasts,
    cancelBroadcast,
    canManageSystem,
    canDispatch,
  } = useAdminControl();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedScreenIds, setSelectedScreenIds] = useState<string[]>([]);
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [alertTargetScreens, setAlertTargetScreens] = useState<ScreenDevice[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [pairingCodeInput, setPairingCodeInput] = useState("");
  const [newScreenName, setNewScreenName] = useState("");
  const [newScreenWarehouse, setNewScreenWarehouse] = useState("מחסן 4 החרש");
  const [newScreenManager, setNewScreenManager] = useState("אורן");
  const [selectedScreenFilter, setSelectedScreenFilter] = useState<"all" | "online" | "offline">(
    "all",
  );

  const filteredScreens = screens.filter((screen) => {
    const matchesSearch =
      screen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screen.warehouseLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screen.branchManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screen.ipAddress.includes(searchQuery);

    if (selectedScreenFilter === "online") return matchesSearch && screen.status === "online";
    if (selectedScreenFilter === "offline") return matchesSearch && screen.status === "offline";
    return matchesSearch;
  });

  const isAllSelected =
    filteredScreens.length > 0 && filteredScreens.every((s) => selectedScreenIds.includes(s.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const filteredSet = new Set(filteredScreens.map((s) => s.id));
      setSelectedScreenIds((prev) => prev.filter((id) => !filteredSet.has(id)));
    } else {
      const combined = new Set([...selectedScreenIds, ...filteredScreens.map((s) => s.id)]);
      setSelectedScreenIds(Array.from(combined));
    }
  };

  const handleToggleScreen = (screenId: string) => {
    setSelectedScreenIds((prev) =>
      prev.includes(screenId) ? prev.filter((id) => id !== screenId) : [...prev, screenId],
    );
  };

  const handleClearSelection = () => {
    setSelectedScreenIds([]);
  };

  const handleOpenAlertForScreen = (screen: ScreenDevice) => {
    setAlertTargetScreens([screen]);
    setIsAlertModalOpen(true);
  };

  const handleOpenAlertForSelected = () => {
    const targets = screens.filter((s) => selectedScreenIds.includes(s.id));
    if (targets.length === 0) {
      toast.error("נא לסמן לפחות מסך אחד בטבלה");
      return;
    }
    setAlertTargetScreens(targets);
    setIsAlertModalOpen(true);
  };

  const handleRefreshSelected = () => {
    if (selectedScreenIds.length === 0) return;
    selectedScreenIds.forEach((id) => sendRemoteCommand(id, "refresh"));
    toast.success(`נשלחה פקודת ריענון ל-${selectedScreenIds.length} מסכים שנבחרו`);
  };

  const handleScreensaverSelected = (force: boolean) => {
    if (selectedScreenIds.length === 0) return;
    selectedScreenIds.forEach((id) => {
      const sc = screens.find((s) => s.id === id);
      if (sc && sc.forcedScreensaver !== force) {
        sendRemoteCommand(id, "toggle_screensaver");
      }
    });
    toast.success(
      force
        ? `שומר מסך כפוי הופעל ל-${selectedScreenIds.length} מסכים`
        : `שומר מסך בוטל ל-${selectedScreenIds.length} מסכים`,
    );
  };

  const handleGenerateCode = () => {
    const code = generatePairingCode(newScreenWarehouse);
    setPairingCodeInput(code);
    toast.info(`נוצר קוד צימוד חדש: ${code} (תוקף: 15 דקות)`);
  };

  const handlePairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairingCodeInput) {
      toast.error("נא להזין קוד צימוד בן 6 ספרות");
      return;
    }

    const res = pairDevice(pairingCodeInput, newScreenName, newScreenWarehouse, newScreenManager);
    if (res.success) {
      toast.success(`המכשיר "${res.screen?.name}" צומד בהצלחה למערכת!`);
      setIsPairingModalOpen(false);
      setPairingCodeInput("");
      setNewScreenName("");
    } else {
      toast.error(res.error || "הצימוד נכשל");
    }
  };

  const handleRemoteRefresh = (screenId: string, screenName: string) => {
    sendRemoteCommand(screenId, "refresh");
    toast.success(`נשלחה פקודת ריענון למסך: ${screenName}`);
  };

  const handleToggleScreensaver = (
    screenId: string,
    currentForced: boolean,
    screenName: string,
  ) => {
    sendRemoteCommand(screenId, "toggle_screensaver");
    toast.success(
      currentForced
        ? `שומר המסך הופסק במסך: ${screenName}`
        : `הופעל שומר מסך כפוי במסך: ${screenName}`,
    );
  };

  const handleVolumeChange = (screenId: string, volume: number) => {
    sendRemoteCommand(screenId, "set_volume", volume);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                ניהול מסכי שידור וצימוד התקנים
              </h2>
              <p className="text-xs text-slate-400">
                צימוד מסכי Smart TV במחסנים, שליטה מרחוק ובקרת שמע
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPairingModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 transition-all border border-sky-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>צימוד מסך חדש (6 ספרות)</span>
          </button>
        </div>
      </div>

      {/* Filter, Search and View Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
          <input
            type="text"
            placeholder="חיפוש לפי שם מסך, מחסן, IP או מנהל..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-9 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedScreenFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedScreenFilter === "all"
                  ? "bg-slate-800 text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800/40"
              }`}
            >
              הכל ({screens.length})
            </button>
            <button
              onClick={() => setSelectedScreenFilter("online")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                selectedScreenFilter === "online"
                  ? "bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800/50"
                  : "text-slate-400 hover:bg-slate-800/40"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>מחוברים ({screens.filter((s) => s.status === "online").length})</span>
            </button>
            <button
              onClick={() => setSelectedScreenFilter("offline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                selectedScreenFilter === "offline"
                  ? "bg-rose-950/80 text-rose-300 font-bold border border-rose-800/50"
                  : "text-slate-400 hover:bg-slate-800/40"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>מנותקים ({screens.filter((s) => s.status === "offline").length})</span>
            </button>
          </div>

          {/* View Mode Switcher: Table vs Cards */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                viewMode === "table"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="תצוגת טבלה"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>טבלה</span>
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                viewMode === "cards"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="תצוגת כרטיסים"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>כרטיסים</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Selection Action Bar - appears when at least one screen is selected */}
      {selectedScreenIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 border-2 border-amber-500/50 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">
                  נבחרו {selectedScreenIds.length} מתוך {screens.length} מסכים
                </span>
                <span className="text-[10px] bg-amber-500/25 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  פעולה מרוכזת
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                בחר פעולה להפעלה מיידית על המסכים שסומנו ברשימה
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Action Button: 'שלח התראה' for selected screens */}
            <button
              onClick={handleOpenAlertForSelected}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-lg shadow-amber-500/25 transition-all active:scale-95 border border-amber-300"
            >
              <BellRing className="w-4 h-4 text-black" />
              <span>שלח התראה ({selectedScreenIds.length})</span>
            </button>

            <button
              onClick={handleRefreshSelected}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>ריענון מרחוק</span>
            </button>

            <button
              onClick={() => handleScreensaverSelected(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
            >
              <Power className="w-3.5 h-3.5 text-amber-400" />
              <span>כפה שומר מסך</span>
            </button>

            <button
              onClick={handleClearSelection}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition-colors"
            >
              נקה בחירה
            </button>
          </div>
        </div>
      )}

      {/* Main Content: Table View or Cards View */}
      {viewMode === "table" ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-950 cursor-pointer"
                      title={isAllSelected ? "בטל בחירת הכל" : "בחר את כל המסכים בטבלה"}
                    />
                  </th>
                  <th className="py-3.5 px-4">שם מסך ודגם</th>
                  <th className="py-3.5 px-4">מחסן ומיקום</th>
                  <th className="py-3.5 px-4">מנהל סניף</th>
                  <th className="py-3.5 px-4">רשת ו-IP</th>
                  <th className="py-3.5 px-4">סטטוס שידור</th>
                  <th className="py-3.5 px-4">סאונד</th>
                  <th className="py-3.5 px-4 text-center">פעולות מהירות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredScreens.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                      לא נמצאו מסכים התואמים את החיפוש או הסינון.
                    </td>
                  </tr>
                ) : (
                  filteredScreens.map((screen) => {
                    const isOnline = screen.status === "online";
                    const isSelected = selectedScreenIds.includes(screen.id);
                    const activeScreenAlert = broadcasts.find(
                      (b) =>
                        b.isActive &&
                        b.expiresAt > Date.now() &&
                        (b.targetScreenIds?.includes(screen.id) ||
                          b.targetScreenIds?.includes("all")),
                    );

                    return (
                      <tr
                        key={screen.id}
                        className={`transition-colors ${
                          isSelected
                            ? "bg-amber-500/10 hover:bg-amber-500/15"
                            : "hover:bg-slate-800/40"
                        }`}
                      >
                        {/* Checkbox Column */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleScreen(screen.id)}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-950 cursor-pointer"
                            title={`בחר את מסך "${screen.name}"`}
                          />
                        </td>

                        {/* Screen Name & Model */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-slate-800 text-sky-400 border border-slate-700 shrink-0">
                              <Tv className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-white text-sm truncate">
                                  {screen.name}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                  {screen.appVersion}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 block truncate">
                                {screen.modelInfo || "Smart TV"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Warehouse Location */}
                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                          {screen.warehouseLocation}
                        </td>

                        {/* Branch Manager */}
                        <td className="py-3.5 px-4">
                          <span className="text-sky-400 font-semibold">{screen.branchManager}</span>
                        </td>

                        {/* IP & Pairing Token */}
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          <div>{screen.ipAddress}</div>
                          <div className="text-[10px] text-slate-600">
                            טוקן: {screen.deviceToken.slice(0, 10)}...
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                              isOnline
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`}
                            />
                            {isOnline ? "Online" : "Offline"}
                          </span>
                          {screen.forcedScreensaver && (
                            <span className="block mt-1 text-[10px] font-bold text-amber-400">
                              (שומר מסך פעיל)
                            </span>
                          )}
                          {activeScreenAlert && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30 truncate max-w-[140px]">
                              <BellRing className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{activeScreenAlert.title}</span>
                            </div>
                          )}
                        </td>

                        {/* Volume */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                          <div className="flex items-center gap-1.5">
                            {screen.volume === 0 ? (
                              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                            )}
                            <span className="font-mono font-bold text-sky-400">
                              {screen.volume}%
                            </span>
                          </div>
                        </td>

                        {/* Quick Actions (Including explicit 'שלח התראה' button) */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Explicit 'שלח התראה' Button requested by user */}
                            <button
                              onClick={() => handleOpenAlertForScreen(screen)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 text-xs font-bold border border-amber-500/40 hover:border-amber-400/60 transition-all shadow-sm shadow-amber-500/10 active:scale-95 group"
                              title={`שליחת הודעת פופ-אפ מיידית למסך "${screen.name}"`}
                            >
                              <BellRing className="w-3.5 h-3.5 text-amber-400 group-hover:animate-bounce" />
                              <span>שלח התראה</span>
                            </button>

                            <button
                              onClick={() => handleRemoteRefresh(screen.id, screen.name)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                              title="ריענון מרחוק"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                            </button>

                            <button
                              onClick={() =>
                                handleToggleScreensaver(
                                  screen.id,
                                  screen.forcedScreensaver,
                                  screen.name,
                                )
                              }
                              className={`p-2 rounded-xl transition-colors ${
                                screen.forcedScreensaver
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                              }`}
                              title={
                                screen.forcedScreensaver ? "בטל שומר מסך כפוי" : "כפה שומר מסך"
                              }
                            >
                              <Power className="w-3.5 h-3.5 text-amber-400" />
                            </button>

                            <button
                              onClick={() => onNavigate?.(`/admin/screens/${screen.id}`)}
                              className="p-2 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 border border-sky-800/40 transition-colors"
                              title="ערוך הגדרות מסך מלאות"
                            >
                              <Sliders className="w-3.5 h-3.5 text-sky-400" />
                            </button>

                            {canManageSystem && (
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      `האם אתה בטוח שברצונך לבטל את צימוד המסך "${screen.name}"?`,
                                    )
                                  ) {
                                    unpairDevice(screen.id);
                                    toast.success(`צימוד המסך בוטל`);
                                  }
                                }}
                                className="p-2 rounded-xl hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                                title="ביטול צימוד"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Screen Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScreens.map((screen) => {
            const isOnline = screen.status === "online";
            const isSelected = selectedScreenIds.includes(screen.id);
            return (
              <div
                key={screen.id}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-amber-500/60 bg-slate-900/95 ring-1 ring-amber-500/30"
                    : "border-slate-800 hover:border-slate-700/80"
                }`}
              >
                <div>
                  {/* Header: Checkbox + Title + Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleScreen(screen.id)}
                        className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-950 cursor-pointer"
                        title="בחר מסך לפעולה"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-white tracking-tight">
                            {screen.name}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            {screen.appVersion}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{screen.warehouseLocation}</span>
                          <span>&bull;</span>
                          <span className="text-sky-400">אחראי: {screen.branchManager}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                          isOnline
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`}
                        />
                        {isOnline ? "Online (מחובר)" : "Offline (מנותק)"}
                      </span>
                    </div>
                  </div>

                  {/* Device Tech Info */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs mb-4">
                    <div>
                      <span className="text-slate-500 block text-[10px]">כתובת IP ברשת:</span>
                      <span className="font-mono text-slate-300 font-medium">
                        {screen.ipAddress}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">טוקן צימוד (Token):</span>
                      <span className="font-mono text-slate-400 text-[11px] truncate block">
                        {screen.deviceToken.slice(0, 16)}...
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">דגם המכשיר:</span>
                      <span className="text-slate-300 truncate block">
                        {screen.modelInfo || "Smart TV"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">סבב ברירת מחדל:</span>
                      <span className="text-amber-400 font-bold">
                        {screen.defaultRound === "all"
                          ? "כל הסבבים"
                          : screen.defaultRound === "round1"
                            ? "סבב 1 בלבד"
                            : "סבב 2 בלבד"}
                      </span>
                    </div>
                  </div>

                  {/* Live Controls: Volume + Screensaver */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        {screen.volume === 0 ? (
                          <VolumeX className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-sky-400" />
                        )}
                        <span>עוצמת סאונד וכריזה:</span>
                      </div>
                      <span className="font-mono font-bold text-sky-400">{screen.volume}%</span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={screen.volume}
                      onChange={(e) => handleVolumeChange(screen.id, parseInt(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>
                </div>

                {/* Active Screen Alert Banner if present */}
                {(() => {
                  const activeScreenAlert = broadcasts.find(
                    (b) =>
                      b.isActive &&
                      b.expiresAt > Date.now() &&
                      (b.targetScreenIds?.includes(screen.id) ||
                        b.targetScreenIds?.includes("all")),
                  );
                  if (!activeScreenAlert) return null;
                  const isOnlyThisScreen =
                    activeScreenAlert.targetScreenIds?.includes(screen.id) &&
                    !activeScreenAlert.targetScreenIds?.includes("all");

                  return (
                    <div
                      className={`mt-4 p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 animate-pulse ${
                        activeScreenAlert.level === "critical"
                          ? "bg-rose-500/10 border-rose-500/40 text-rose-200"
                          : "bg-amber-500/10 border-amber-500/40 text-amber-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <BellRing
                          className={`w-3.5 h-3.5 shrink-0 ${
                            activeScreenAlert.level === "critical"
                              ? "text-rose-400"
                              : "text-amber-400"
                          }`}
                        />
                        <span className="font-black shrink-0">
                          {isOnlyThisScreen ? "התראה ספציפית פעילה:" : "שידור פעיל:"}
                        </span>
                        <span className="truncate text-slate-200 font-medium">
                          {activeScreenAlert.title}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          cancelBroadcast(activeScreenAlert.id);
                          toast.success("ההתראה בוטלה בהצלחה");
                        }}
                        className="text-[11px] text-amber-300 hover:text-white underline font-semibold shrink-0"
                      >
                        בטל
                      </button>
                    </div>
                  );
                })()}

                {/* Bottom Quick Commands Bar */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleRemoteRefresh(screen.id, screen.name)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                      title="פקודת רענון דפדפן מרחוק"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                      <span>ריענון מרחוק</span>
                    </button>

                    <button
                      onClick={() =>
                        handleToggleScreensaver(screen.id, screen.forcedScreensaver, screen.name)
                      }
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        screen.forcedScreensaver
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                      }`}
                    >
                      <Power className="w-3.5 h-3.5 text-amber-400" />
                      <span>{screen.forcedScreensaver ? "בטל שומר מסך" : "כפה שומר מסך"}</span>
                    </button>

                    {/* Immediate Alert Button specifically for this screen */}
                    <button
                      onClick={() => handleOpenAlertForScreen(screen)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold border border-amber-500/40 transition-all shadow-sm shadow-amber-500/10 active:scale-95 group"
                      title={`שליחת התראה מיידית קצרה למסך "${screen.name}"`}
                    >
                      <BellRing className="w-3.5 h-3.5 text-amber-400 group-hover:animate-bounce" />
                      <span>שלח התראה</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate?.(`/admin/screens/${screen.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 text-xs font-bold border border-sky-800/50 transition-colors"
                    >
                      ערוך הגדרות &larr;
                    </button>

                    {canManageSystem && (
                      <button
                        onClick={() => {
                          if (
                            confirm(`האם אתה בטוח שברצונך לבטל את צימוד המסך "${screen.name}"?`)
                          ) {
                            unpairDevice(screen.id);
                            toast.success(`צימוד המסך בוטל`);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                        title="ביטול צימוד (Unpair)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Immediate Alert Modal - Supports Single and Multiple Target Screens */}
      <InstantAlertModal
        screens={alertTargetScreens}
        isOpen={isAlertModalOpen}
        onClose={() => {
          setIsAlertModalOpen(false);
          setAlertTargetScreens([]);
        }}
      />

      {/* Pairing Modal */}
      {isPairingModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    צימוד מסך חכם (Device Pairing)
                  </h3>
                  <p className="text-xs text-slate-400">הזן את קוד הצימוד שמופיע במסך הטלוויזיה</p>
                </div>
              </div>
              <button
                onClick={() => setIsPairingModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePairSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  קוד צימוד (6 ספרות):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="לדוגמה: 742891"
                    value={pairingCodeInput}
                    onChange={(e) => setPairingCodeInput(e.target.value.replace(/[^0-9]/g, ""))}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono text-xl tracking-widest text-sky-400 font-black focus:outline-none focus:border-sky-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700"
                    title="חולל קוד בדיקה זמני"
                  >
                    חולל קוד
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  הקוד נוצר בעת פתיחת המסך בנתיב <span className="font-mono text-sky-400">/tv</span>{" "}
                  ותקף ל-15 דקות.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">שם המסך:</label>
                <input
                  type="text"
                  placeholder="למשל: טלוויזיה מחסן 4 רציף העמסה"
                  value={newScreenName}
                  onChange={(e) => setNewScreenName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">שיוך מחסן:</label>
                  <select
                    value={newScreenWarehouse}
                    onChange={(e) => setNewScreenWarehouse(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="מחסן 4 החרש">מחסן 4 החרש</option>
                    <option value="מחסן 1 התלמיד">מחסן 1 התלמיד</option>
                    <option value="משרד הפצה ראשי">משרד הפצה ראשי</option>
                    <option value="עמדת ליקוט דרומית">עמדת ליקוט דרומית</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">מנהל אחראי:</label>
                  <input
                    type="text"
                    value={newScreenManager}
                    onChange={(e) => setNewScreenManager(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    placeholder="למשל: אורן, תמיר"
                  />
                </div>
              </div>

              <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl text-xs text-sky-300 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  לאחר הצימוד יוקצה למסך Device Token ייעודי בטוח, והוא יקבל עדכונים ופקודות בזמן
                  אמת.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPairingModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-600/30 transition-all"
                >
                  השלם צימוד מכשיר
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
