import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ArtworkFigure } from "@/components/ink/artwork-figure";
import { InteractiveWorld } from "@/components/ink/interactive-world";
import { SiteFooter, SiteHeader } from "@/components/ink/site-shell";
import { useLanguage } from "@/components/ink/language-provider";

export const Route = createFileRoute("/works/two-worlds")({
  head: () => ({ meta: [
    { title: "Two Worlds — Ink Worlds" }, { name: "description", content: "Explore Two Worlds, PACHIN’s interactive two-layer floating landscape." },
    { property: "og:title", content: "Two Worlds — Ink Worlds" }, { property: "og:description", content: "A floating landscape in two synchronized states of light." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: TwoWorldsPage,
});

function TwoWorldsPage() {
  const { t } = useLanguage();
  return <div id="top" className="paper-page"><SiteHeader /><main id="content">
    <section className="detail-intro"><Link to="/works" className="back-link"><ArrowLeft aria-hidden="true" />{t.detail.back}</Link><p className="eyebrow">{t.detail.eyebrow}</p><h1>{t.detail.title}</h1><p>{t.detail.intro}</p></section>
    <section className="viewing-section"><div className="section-heading"><h2>{t.detail.surfaceTitle}</h2><p>{t.detail.surfaceNote}</p></div><InteractiveWorld compact /></section>
    <section className="process-section"><div><p className="eyebrow">{t.detail.processEyebrow}</p><h2>{t.detail.processTitle}</h2></div><div className="process-copy"><p>{t.detail.processBody1}</p><p>{t.detail.processBody2}</p></div></section>
    <section className="studies-section"><h2>{t.detail.studiesTitle}</h2><div className="study-grid"><article><ArtworkFigure state="dark" /><h3>{t.detail.darkStudy}</h3><p>{t.detail.darkStudyBody}</p></article><article><ArtworkFigure state="light" /><h3>{t.detail.lightStudy}</h3><p>{t.detail.lightStudyBody}</p></article></div></section>
    <section className="credits-section"><p className="eyebrow">{t.detail.creditsTitle}</p><p>{t.detail.creditsBody}</p></section>
  </main><SiteFooter /></div>;
}