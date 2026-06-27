"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  type MapMarker,
  type MarkerType,
  type MarkerStatus,
  STATUS_STYLES,
  TYPE_ICONS,
} from "@/lib/map";

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
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<MarkerType>>(
    new Set(["landmark", "activity", "asset", "shop", "vehicle", "poi"]),
  );
  const [activeStatuses, setActiveStatuses] = useState<MarkerStatus[]>(
    ["confirmed", "speculated", "leaked"],
  );

  // 初始化地图
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [25.79, -80.2],
      zoom: 9,
      minZoom: 6,
      maxZoom: 16,
      zoomControl: true,
      attributionControl: true,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      keyboard: false,
    });

    // CartoDB Dark Matter 暗色底图，与站点深色风格契合
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      },
    ).addTo(map);

    // markers 容器层
    const markersLayer = L.layerGroup().addTo(map);
    layerRef.current = markersLayer;
    mapRef.current = map;

    // 监听容器尺寸变化，强制 map invalidateSize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(containerRef.current);

    // 初始化后延迟 invalidateSize 一次（确保容器尺寸已稳定）
    const timer = setTimeout(() => map.invalidateSize(), 100);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // 渲染 markers
  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;

    layerRef.current.clearLayers();

    markers.forEach((data) => {
      if (!activeTypes.has(data.type) || !activeStatuses.includes(data.status)) {
        return;
      }

      const style = STATUS_STYLES[data.status];

      // 三态水滴形 marker 图标
      const iconHtml = `
        <div style="
          width: 28px;
          height: 28px;
          border-radius: 50% 50% 50% 0;
          background: ${style.color};
          border: 2px solid #fff;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        ">
          <span style="transform: rotate(45deg); font-size: 12px;">${TYPE_ICONS[data.type]}</span>
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: "gta6-map-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      // popup 内容
      const name = locale === "zh" ? data.name : data.name_en;
      const desc = locale === "zh" ? data.description : data.description_en;
      const sourcesHtml = data.sources
        .map(
          (s) =>
            `<a href="${s.url}" target="_blank" rel="noopener noreferrer" style="display:block;font-size:11px;color:#10b981;margin-top:2px;">${s.label}</a>`,
        )
        .join("");
      const popupHtml = `
        <div style="padding:4px;max-width:240px;">
          <div style="font-weight:600;font-size:14px;margin-bottom:4px;">${name}</div>
          <div style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:500;background:${style.color}22;color:${style.color};margin-bottom:6px;">${labels.status[data.status]}</div>
          <div style="font-size:12px;color:#666;margin-bottom:6px;">${desc}</div>
          <div style="font-size:10px;font-weight:600;color:#999;text-transform:uppercase;">${labels.sources}</div>
          ${sourcesHtml}
        </div>
      `;

      const marker = L.marker([data.coordinates.lat, data.coordinates.lng], {
        icon,
      }).bindPopup(popupHtml, { maxWidth: 280 });

      layerRef.current!.addLayer(marker);
    });
  }, [markers, activeTypes, activeStatuses, locale, labels]);

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
    setActiveStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
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
      <div className="absolute right-3 top-3 z-[1000] w-56 rounded-xl border border-zinc-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95 sm:right-4 sm:top-4">
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
                  activeStatuses.includes(opt.value)
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
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-zinc-900/80 px-3 py-1 text-xs text-white opacity-70 sm:hidden">
        {locale === "zh" ? "双指缩放 · 单指拖动" : "Pinch to zoom · Drag to pan"}
      </div>
    </div>
  );
}
