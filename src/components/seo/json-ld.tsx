// 结构化数据组件：输出 VideoGame schema.org JSON-LD
// 帮助搜索引擎理解本站描述的对象（GTA6 游戏）及其属性
export function VideoGameJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Grand Theft Auto VI",
    alternateName: "GTA6",
    description:
      "Action-adventure game set in Leonida (fictionalized Florida), featuring dual protagonists Lucia and Jason, developed by Rockstar North and published by Rockstar Games.",
    genre: ["Action", "Adventure", "Open world"],
    gamePlatform: ["PlayStation 5", "Xbox Series X", "Xbox Series S"],
    datePublished: "2026-11-19",
    publisher: {
      "@type": "Organization",
      name: "Rockstar Games",
    },
    developer: {
      "@type": "Organization",
      name: "Rockstar North",
    },
    applicationCategory: "Game",
    operatingSystem: "PlayStation 5, Xbox Series X|S",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// 面包屑结构化数据
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// FAQ 结构化数据：帮助搜索引擎抓取常见问题，提升富结果展示机会
export function FaqJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
