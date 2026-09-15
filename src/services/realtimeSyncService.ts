import { getApps, initializeApp, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import type { EmergencyBroadcast } from "@/types/admin";
import type { Order } from "@/types/dispatch";

// Lazy-initialize Firebase app and Firestore instance safely
let firestoreInstance: ReturnType<typeof getFirestore> | null = null;
let broadcastChannel: BroadcastChannel | null = null;

function getSafeFirestore() {
  if (typeof window === "undefined") return null;
  if (!firestoreInstance) {
    try {
      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      firestoreInstance = getFirestore(app);
    } catch (err) {
      console.warn("[RealtimeSync] Could not initialize Firestore:", err);
      firestoreInstance = null;
    }
  }
  return firestoreInstance;
}

function getSafeBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return null;
  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel("saban_dispatch_realtime");
    } catch (err) {
      console.warn("[RealtimeSync] BroadcastChannel unavailable:", err);
      broadcastChannel = null;
    }
  }
  return broadcastChannel;
}

export interface UrgentOrderNotification {
  id: string;
  orderId: string;
  customerName: string;
  city: string;
  status: string;
  round: number;
  timestamp: number;
  message: string;
}

export type RealtimeEvent =
  | { type: "broadcast"; data: EmergencyBroadcast }
  | { type: "broadcast_cancel"; broadcastId: string }
  | { type: "urgent_order"; data: UrgentOrderNotification };

/**
 * Publishes an emergency broadcast to Firestore and local BroadcastChannel
 */
export async function syncPublishBroadcast(broadcast: EmergencyBroadcast): Promise<void> {
  // 1. Post to cross-tab BroadcastChannel immediately
  try {
    const channel = getSafeBroadcastChannel();
    channel?.postMessage({ type: "broadcast", data: broadcast });
  } catch (e) {
    console.warn("[RealtimeSync] Channel broadcast error:", e);
  }

  // 2. Publish to Firestore 'broadcasts' collection
  const db = getSafeFirestore();
  if (db) {
    try {
      const docRef = doc(db, "emergency_broadcasts", broadcast.id);
      await setDoc(docRef, {
        ...broadcast,
        syncedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("[RealtimeSync] Firestore broadcast sync deferred:", err);
    }
  }
}

/**
 * Publishes broadcast cancellation to Firestore and local BroadcastChannel
 */
export async function syncCancelBroadcast(broadcastId: string): Promise<void> {
  try {
    const channel = getSafeBroadcastChannel();
    channel?.postMessage({ type: "broadcast_cancel", broadcastId });
  } catch (e) {
    console.warn("[RealtimeSync] Channel cancel error:", e);
  }

  const db = getSafeFirestore();
  if (db) {
    try {
      const docRef = doc(db, "emergency_broadcasts", broadcastId);
      await setDoc(
        docRef,
        {
          isActive: false,
          cancelledAt: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (err) {
      console.warn("[RealtimeSync] Firestore cancel sync deferred:", err);
    }
  }
}

/**
 * Publishes an urgent or new order event to Firestore and local BroadcastChannel
 */
export async function syncPublishUrgentOrder(order: Order, customMessage?: string): Promise<void> {
  const notification: UrgentOrderNotification = {
    id: `urg-${order.orderId}-${Date.now()}`,
    orderId: order.orderId,
    customerName: order.customerName,
    city: order.city,
    status: order.status,
    round: order.round,
    timestamp: Date.now(),
    message:
      customMessage ||
      `הזמנה דחופה חדשה #${order.orderId} עבור ${order.customerName} (${order.city})`,
  };

  try {
    const channel = getSafeBroadcastChannel();
    channel?.postMessage({ type: "urgent_order", data: notification });
  } catch (e) {
    console.warn("[RealtimeSync] Channel order error:", e);
  }

  const db = getSafeFirestore();
  if (db) {
    try {
      const docRef = doc(db, "urgent_orders", order.orderId);
      await setDoc(docRef, {
        ...notification,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("[RealtimeSync] Firestore urgent order sync deferred:", err);
    }
  }
}

/**
 * Subscribes to real-time broadcasts using Firestore onSnapshot & local BroadcastChannel
 */
export function subscribeToRealtimeBroadcasts(
  onBroadcastReceived: (broadcast: EmergencyBroadcast) => void,
  onBroadcastCancelled: (broadcastId: string) => void,
): Unsubscribe {
  let firestoreUnsub: Unsubscribe | null = null;
  const channel = getSafeBroadcastChannel();

  // 1. Cross-tab BroadcastChannel listener
  const handleChannelMessage = (event: MessageEvent<RealtimeEvent>) => {
    if (!event.data) return;
    if (event.data.type === "broadcast") {
      onBroadcastReceived(event.data.data);
    } else if (event.data.type === "broadcast_cancel") {
      onBroadcastCancelled(event.data.broadcastId);
    }
  };

  if (channel) {
    channel.addEventListener("message", handleChannelMessage);
  }

  // 2. Firestore onSnapshot real-time listener
  const db = getSafeFirestore();
  if (db) {
    try {
      const broadcastsQuery = query(
        collection(db, "emergency_broadcasts"),
        orderBy("createdAt", "desc"),
        limit(10),
      );

      firestoreUnsub = onSnapshot(
        broadcastsQuery,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data() as EmergencyBroadcast;
            if (change.type === "added" || change.type === "modified") {
              if (data.isActive && data.expiresAt > Date.now()) {
                onBroadcastReceived(data);
              } else if (!data.isActive) {
                onBroadcastCancelled(data.id || change.doc.id);
              }
            } else if (change.type === "removed") {
              onBroadcastCancelled(change.doc.id);
            }
          });
        },
        (error) => {
          console.warn("[RealtimeSync] Firestore broadcasts onSnapshot note:", error.message);
        },
      );
    } catch (err) {
      console.warn("[RealtimeSync] Could not attach Firestore snapshot listener:", err);
    }
  }

  return () => {
    if (channel) {
      channel.removeEventListener("message", handleChannelMessage);
    }
    if (firestoreUnsub) {
      firestoreUnsub();
    }
  };
}

/**
 * Subscribes to real-time urgent orders using Firestore onSnapshot & local BroadcastChannel
 */
export function subscribeToRealtimeUrgentOrders(
  onUrgentOrderReceived: (notification: UrgentOrderNotification) => void,
): Unsubscribe {
  let firestoreUnsub: Unsubscribe | null = null;
  const channel = getSafeBroadcastChannel();

  const handleChannelMessage = (event: MessageEvent<RealtimeEvent>) => {
    if (!event.data) return;
    if (event.data.type === "urgent_order") {
      onUrgentOrderReceived(event.data.data);
    }
  };

  if (channel) {
    channel.addEventListener("message", handleChannelMessage);
  }

  const db = getSafeFirestore();
  if (db) {
    try {
      const ordersQuery = query(
        collection(db, "urgent_orders"),
        orderBy("timestamp", "desc"),
        limit(15),
      );

      let initialLoad = true;
      firestoreUnsub = onSnapshot(
        ordersQuery,
        (snapshot) => {
          if (initialLoad) {
            initialLoad = false;
            return;
          }
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added" || change.type === "modified") {
              const data = change.doc.data() as UrgentOrderNotification;
              if (data && data.orderId) {
                onUrgentOrderReceived(data);
              }
            }
          });
        },
        (error) => {
          console.warn("[RealtimeSync] Firestore urgent orders onSnapshot note:", error.message);
        },
      );
    } catch (err) {
      console.warn("[RealtimeSync] Could not attach Firestore orders listener:", err);
    }
  }

  return () => {
    if (channel) {
      channel.removeEventListener("message", handleChannelMessage);
    }
    if (firestoreUnsub) {
      firestoreUnsub();
    }
  };
}
