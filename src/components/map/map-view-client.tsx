"use client";

import dynamic from "next/dynamic";

// 客户端 wrapper：用于在 server component 中安全地 dynamic import MapView
// 因为 next/dynamic 的 ssr:false 不能在 Server Component 使用
const MapView = dynamic(() => import("./map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-7rem)] items-center justify-center bg-zinc-900 text-zinc-400">
      Loading map...
    </div>
  ),
});

export default MapView;
