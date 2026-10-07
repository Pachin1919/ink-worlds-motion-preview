import { createFileRoute } from "@tanstack/react-router";
import { ArtworkFigure } from "@/components/ink/artwork-figure";
import { SiteFooter, SiteHeader } from "@/components/ink/site-shell";
import { useLanguage } from "@/components/ink/language-provider";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About — Ink Worlds" }, { name: "description", content: "The visual and interaction approach behind the Ink Worlds digital exhibition." },
    { property: "og:title", content: "About — Ink Worlds" }, { property: "og:description", content: "Interaction as a way of looking: the approach behind Ink Worlds." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: AboutPage,
});

function AboutPage() {
  const { t } = useLanguage();
  return <div id="top" className="paper-page"><SiteHeader /><main id="content">
    <section className="page-intro about-intro"><p className="eyebrow">{t.about.eyebrow}</p><h1>{t.about.title}</h1><p>{t.about.intro}</p></section>
    <ArtworkFigure state="dark" className="about-image" />
    <section className="about-grid"><article><span>01</span><h2>{t.about.approachTitle}</h2><p>{t.about.approachBody}</p></article><article><span>02</span><h2>{t.about.interactionTitle}</h2><p>{t.about.interactionBody}</p></article><article><span>03</span><h2>{t.about.makerTitle}</h2><p>{t.about.makerBody}</p></article><article><span>04</span><h2>{t.about.sourceTitle}</h2><p>{t.about.sourceBody}</p></article></section>
  </main><SiteFooter /></div>;
}