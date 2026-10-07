import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ArtworkFigure } from "@/components/ink/artwork-figure";
import { SiteFooter, SiteHeader } from "@/components/ink/site-shell";
import { useLanguage } from "@/components/ink/language-provider";

export const Route = createFileRoute("/works/")({
  head: () => ({ meta: [
    { title: "Works — Ink Worlds" }, { name: "description", content: "Catalogue for Ink Worlds: one interactive landscape and two viewing studies." },
    { property: "og:title", content: "Works — Ink Worlds" }, { property: "og:description", content: "One interactive landscape, observed through three viewing modes." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: WorksPage,
});

function WorksPage() {
  const { t } = useLanguage();
  return <div id="top" className="paper-page"><SiteHeader /><main id="content">
    <section className="page-intro"><p className="eyebrow">{t.works.eyebrow}</p><h1>{t.works.title}</h1><p>{t.works.intro}</p></section>
    <section className="catalogue-feature"><Link to="/works/two-worlds" className="catalogue-image"><ArtworkFigure state="dark" /></Link><div><p className="eyebrow">{t.works.complete}</p><h2>{t.works.completeTitle}</h2><p>{t.works.completeBody}</p><Link to="/works/two-worlds" className="text-link">{t.works.open}<ArrowUpRight aria-hidden="true" /></Link></div></section>
    <section className="study-grid">
      <article><ArtworkFigure state="dark" /><p className="eyebrow">{t.works.study}</p><h2>{t.works.darkTitle}</h2><p>{t.works.darkBody}</p></article>
      <article><ArtworkFigure state="light" /><p className="eyebrow">{t.works.study}</p><h2>{t.works.lightTitle}</h2><p>{t.works.lightBody}</p></article>
    </section>
    <p className="catalogue-note">{t.works.footer}</p>
  </main><SiteFooter /></div>;
}