// 地图配置与类型定义

// Marker 三态标注：确认 / 推测 / 泄漏
export type MarkerStatus = "confirmed" | "speculated" | "leaked";

// Marker 类型：地标 / 活动 / 资产 / 商店 / 载具刷新点 / 兴趣点
export type MarkerType =
  | "landmark"
  | "activity"
  | "asset"
  | "shop"
  | "vehicle"
  | "poi";

export interface MapMarker {
  id: string;
  name: string;
  name_en: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: MarkerType;
  status: MarkerStatus;
  confidence: number; // 0-1
  description: string;
  description_en: string;
  sources: { label: string; url: string }[];
}

// 地图初始视图配置（以罪恶城为中心）
export const MAP_INITIAL_VIEW = {
  center: [25.79, -80.2] as [number, number], // [lat, lng]
  zoom: 9,
  minZoom: 6,
  maxZoom: 16,
} as const;

// 三态视觉配置：颜色与图标
export const STATUS_STYLES: Record<
  MarkerStatus,
  { color: string; bgClass: string; textClass: string; ringClass: string }
> = {
  confirmed: {
    color: "#10b981", // emerald
    bgClass: "bg-emerald-500",
    textClass: "text-emerald-700 dark:text-emerald-400",
    ringClass: "ring-emerald-500/30",
  },
  speculated: {
    color: "#f59e0b", // amber
    bgClass: "bg-amber-500",
    textClass: "text-amber-700 dark:text-amber-400",
    ringClass: "ring-amber-500/30",
  },
  leaked: {
    color: "#f43f5e", // rose
    bgClass: "bg-rose-500",
    textClass: "text-rose-700 dark:text-rose-400",
    ringClass: "ring-rose-500/30",
  },
};

// Marker 类型图标配置
export const TYPE_ICONS: Record<MarkerType, string> = {
  landmark: "📍",
  activity: "🎯",
  asset: "🏠",
  shop: "🏪",
  vehicle: "🚗",
  poi: "⭐",
};
