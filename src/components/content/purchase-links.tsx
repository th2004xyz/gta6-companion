import purchaseLinks from "@/data/purchase-links.json";

// 预购渠道链接组件：渲染购买 CTA 按钮列表
// affiliateQuery 非空时自动追加联盟参数，并按 Google 规范加 rel="sponsored"
// 联盟 ID 在 src/data/purchase-links.json 中统一维护
interface StoreLink {
  id: string;
  label: { zh: string; en: string };
  url: string;
  affiliateQuery: string;
}

export function PurchaseLinks({ locale }: { locale: "zh" | "en" }) {
  const stores = purchaseLinks.stores as StoreLink[];
  const t = (key: "title" | "disclosure") =>
    purchaseLinks[key][locale];

  return (
    <section className="mt-10 rounded-2xl border border-white/10 bg-[#14141c] p-5">
      <h2 className="text-xl font-semibold tracking-tight">{t("title")}</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {stores.map((store) => {
          const isAffiliate = store.affiliateQuery.length > 0;
          const href = isAffiliate
            ? `${store.url}${store.url.includes("?") ? "&" : "?"}${store.affiliateQuery}`
            : store.url;
          return (
            <a
              key={store.id}
              href={href}
              target="_blank"
              rel={isAffiliate ? "sponsored nofollow noopener" : "noopener noreferrer"}
              className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-100 transition-colors hover:border-fuchsia-500/50 hover:bg-white/5"
            >
              {store.label[locale]}
              <span className="text-xs font-normal text-zinc-500">
                {isAffiliate ? (locale === "zh" ? "推广" : "Ad") : "↗"}
              </span>
            </a>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-zinc-500">{t("disclosure")}</p>
    </section>
  );
}
