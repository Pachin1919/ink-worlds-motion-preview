import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ArtworkFigure } from "@/components/ink/artwork-figure";
import { InteractiveWorld } from "@/components/ink/interactive-world";
import { SiteFooter, SiteHeader } from "@/components/ink/site-shell";
import { useLanguage } from "@/components/ink/language-provider";
import { CloseReading, MineralInterlude, StudioWall } from "@/components/ink/studio-chapters";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Ink Worlds — Digital Exhibition" }, { name: "description", content: "An interactive floating landscape held between two states of light, by PACHIN." },
    { property: "og:title", content: "Ink Worlds — Digital Exhibition" }, { property: "og:description", content: "Explore a floating landscape through a fading digital brush." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Index,
});

function Index() {
  const { t } = useLanguage();
  return (
    <div id="top" className="home-page"><section className="home-hero" aria-labelledby="home-title"><InteractiveWorld /><SiteHeader overlay /><div className="hero-identity"><p>{t.maker}</p><h1 id="home-title">{t.home.title}</h1><span>{t.home.subtitle}</span></div><div className="hero-hint"><span>{t.home.hint}</span><ArrowDown aria-hidden="true" /></div></section>
      <main id="content" className="home-narrative">
        <section className="statement-section"><p className="eyebrow">{t.home.statementKicker}</p><div><h2>{t.home.statementTitle}</h2><p>{t.home.statementBody}</p></div></section>
        <StudioWall /><MineralInterlude />
        <section className="original-comparison"><header><p className="eyebrow">{t.home.entryKicker} · {t.home.entryTitle}</p><h2>{t.home.comparisonTitle}</h2><Link to="/works/two-worlds" className="text-link">{t.home.enter}<ArrowUpRight aria-hidden="true" /></Link></header><div className="comparison-grid"><ArtworkFigure state="dark" caption={t.home.darkCaption} /><ArtworkFigure state="light" caption={t.home.lightCaption} /></div></section>
        <CloseReading />
        <section className="home-credits"><p>{t.home.credits}</p></section>
      </main><SiteFooter /></div>
  );
}
