"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, {
  type Map as MapType,
  type Marker as MarkerTypeLib,
  type Popup as PopupType,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  type MapMarker,
  type MarkerType,
  type MarkerStatus,
  STATUS_STYLES,
  TYPE_ICONS,
} from "@/lib/map";

// 简洁自绘底图样式（不依赖外部瓦片服务）
// 海洋深色背景 + 网格参考线，P1 阶段预览地图够用
const SIMPLE_STYLE: StyleSpecification = {
  version: 8,
  name: "GTA6 Companion Preview",
  // 无 sources：纯背景色 + 通过 background layer 绘制
  sources: {
    "simple-tiles": {
      type: "raster",
      tiles: [],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#0a1628",
      },
    },
  ],
};

interface MapViewProps {
  markers: MapMarker[];
  locale: string;
  labels: {
    legend: string;
    noMarkers: string;
    sources: string;
    status: { confirmed: string; speculated: string; leaked: string };
  };
}

export default function MapView({ markers, locale, labels }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapType | null>(null);
  const markersRef = useRef<{ marker: MarkerTypeLib; popup: PopupType; data: MapMarker }[]>([]);
  const [activeTypes, setActiveTypes] = useState<Set<MarkerType>>(
    new Set(["landmark", "activity", "asset", "shop", "vehicle", "poi"]),
  );
  const [activeStatuses, setActiveStatuses] = useState<Set<MarkerStatus>>(
    new Set(["confirmed", "speculated", "leaked"]),
  );
  const [mapReady, setMapReady] = useState(false);

  // 初始化地图
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: SIMPLE_STYLE,
      center: [25.79, -80.2],
      zoom: 9,
      minZoom: 6,
      maxZoom: 16,
      // 移动端手势优化配置
      dragRotate: false, // 禁用旋转，移动端更直觉
      touchZoomRotate: true, // 启用双指缩放
      touchPitch: false,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      setMapReady(true);
      // 添加网格参考层（伪瓦片效果）
      addGridLayer(map);
    });

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 渲染 markers
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    // 清除旧 markers
    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    const map = mapRef.current;

    markers.forEach((data) => {
      // 根据过滤器决定是否显示
      if (!activeTypes.has(data.type) || !activeStatuses.has(data.status)) {
        return;
      }

      const style = STATUS_STYLES[data.status];

      // 创建 marker DOM 元素（三态颜色 + 类型图标）
      const el = document.createElement("div");
      el.className = "map-marker";
      el.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        background: ${style.color};
        border: 2px solid #fff;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      `;
      const icon = document.createElement("span");
      icon.style.cssText = "transform: rotate(45deg); font-size: 12px;";
      icon.textContent = TYPE_ICONS[data.type];
      el.appendChild(icon);

      // 创建 popup 内容
      const popupContent = document.createElement("div");
      popupContent.style.cssText = "padding: 4px; max-width: 240px;";
      const title = document.createElement("div");
      title.style.cssText = "font-weight: 600; font-size: 14px; margin-bottom: 4px;";
      title.textContent = locale === "zh" ? data.name : data.name_en;
      const statusBadge = document.createElement("div");
      statusBadge.style.cssText = `display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 500; background: ${style.color}22; color: ${style.color}; margin-bottom: 6px;`;
      statusBadge.textContent = labels.status[data.status];
      const desc = document.createElement("div");
      desc.style.cssText = "font-size: 12px; color: #666; margin-bottom: 6px;";
      desc.textContent = locale === "zh" ? data.description : data.description_en;
      const sourcesHeader = document.createElement("div");
      sourcesHeader.style.cssText = "font-size: 10px; font-weight: 600; color: #999; text-transform: uppercase;";
      sourcesHeader.textContent = labels.sources;
      popupContent.appendChild(title);
      popupContent.appendChild(statusBadge);
      popupContent.appendChild(desc);
      popupContent.appendChild(sourcesHeader);
      data.sources.forEach((source) => {
        const link = document.createElement("a");
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.cssText = "display: block; font-size: 11px; color: #10b981; margin-top: 2px;";
        link.textContent = source.label;
        popupContent.appendChild(link);
      });

      const popup = new maplibregl.Popup({ offset: 25, maxWidth: "280px" }).setDOMContent(
        popupContent,
      );

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([data.coordinates.lng, data.coordinates.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push({ marker, popup, data });
    });
  }, [markers, activeTypes, activeStatuses, mapReady, locale, labels]);

  // 添加网格参考层
  const addGridLayer = (map: MapType) => {
    // 简单的经纬度网格线，作为参考
    const gridLines: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    // 生成网格线
    for (let lat = 24; lat <= 27; lat += 0.5) {
      gridLines.features.push({
        type: "Feature",
        properties: { type: "grid" },
        geometry: {
          type: "LineString",
          coordinates: [
            [-81.5, lat],
            [-79.5, lat],
          ],
        },
      });
    }
    for (let lng = -81.5; lng <= -79.5; lng += 0.5) {
      gridLines.features.push({
        type: "Feature",
        properties: { type: "grid" },
        geometry: {
          type: "LineString",
          coordinates: [
            [lng, 24],
            [lng, 27],
          ],
        },
      });
    }

    map.addSource("grid", {
      type: "geojson",
      data: gridLines,
    });

    map.addLayer({
      id: "grid-lines",
      type: "line",
      source: "grid",
      paint: {
        "line-color": "#1e3a5f",
        "line-width": 0.5,
        "line-opacity": 0.5,
      },
    });
  };

  const toggleType = (type: MarkerType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const toggleStatus = (status: MarkerStatus) => {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  const typeOptions: { value: MarkerType; label: string }[] = [
    { value: "landmark", label: locale === "zh" ? "地标" : "Landmark" },
    { value: "activity", label: locale === "zh" ? "活动" : "Activity" },
    { value: "asset", label: locale === "zh" ? "资产" : "Asset" },
    { value: "shop", label: locale === "zh" ? "商店" : "Shop" },
    { value: "vehicle", label: locale === "zh" ? "载具" : "Vehicle" },
    { value: "poi", label: locale === "zh" ? "兴趣点" : "POI" },
  ];

  const statusOptions: { value: MarkerStatus; label: string; color: string }[] = [
    { value: "confirmed", label: labels.status.confirmed, color: "#10b981" },
    { value: "speculated", label: labels.status.speculated, color: "#f59e0b" },
    { value: "leaked", label: labels.status.leaked, color: "#f43f5e" },
  ];

  return (
    <div className="relative h-[calc(100vh-3.5rem-3.5rem)] w-full sm:h-[calc(100vh-3.5rem)]">
      {/* 地图容器 */}
      <div ref={containerRef} className="h-full w-full" />

      {/* 图层过滤面板（桌面端浮于右上） */}
      <div className="absolute right-3 top-3 z-10 w-56 rounded-xl border border-zinc-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95 sm:right-4 sm:top-4">
        {/* 类型过滤 */}
        <div className="mb-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {locale === "zh" ? "类型" : "Type"}
          </div>
          <div className="grid grid-cols-2 gap-1">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleType(opt.value)}
                className={`rounded px-2 py-1 text-left text-xs transition ${
                  activeTypes.has(opt.value)
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    : "text-zinc-400 line-through dark:text-zinc-500"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 状态过滤 */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {labels.legend}
          </div>
          <div className="space-y-1">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleStatus(opt.value)}
                className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs transition ${
                  activeStatuses.has(opt.value)
                    ? "text-zinc-700 dark:text-zinc-200"
                    : "text-zinc-400 line-through dark:text-zinc-500"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: opt.color }}
                />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 移动端提示：双指缩放 */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-zinc-900/80 px-3 py-1 text-xs text-white opacity-70 sm:hidden">
        {locale === "zh" ? "双指缩放 · 单指拖动" : "Pinch to zoom · Drag to pan"}
      </div>
    </div>
  );
}
