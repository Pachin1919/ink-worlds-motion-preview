import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import stair from "@/assets/basalt-stair-study.jpg";
import inlet from "@/assets/mineral-inlet-study.jpg";
import reeds from "@/assets/stone-reeds-study.jpg";
import darkDetail from "@/assets/outer-gate-detail.webp";
import lightDetail from "@/assets/inner-gate-detail.webp";
import { useLanguage } from "./language-provider";

export function StudioWall({ catalogue = false }: { catalogue?: boolean }) {
  const { t } = useLanguage();
  return <section id={catalogue ? "studio-studies" : "landscape-studies"} className="studio-wall" aria-labelledby="studio-title">
    <header><p className="eyebrow">{t.studio.label}</p><h2 id="studio-title">{t.studio.title}</h2><p className="studio-note">{t.studio.note}</p></header>
    <figure className="studio-wall__tall"><img src={stair} width={960} height={1200} loading="lazy" decoding="async" alt={t.studio.stairAlt} /><figcaption><strong>{t.studio.stair}</strong><span>{t.studio.stairCaption}</span></figcaption></figure>
    <div className="studio-wall__small"><figure><img src={reeds} width={1200} height={900} loading="lazy" decoding="async" alt={t.studio.reedsAlt} /><figcaption><strong>{t.studio.reeds}</strong><span>{t.studio.reedsCaption}</span></figcaption></figure>{!catalogue && <Link to="/works" hash="studio-studies" className="text-link">{t.studio.browse}<ArrowUpRight aria-hidden="true" /></Link>}</div>
  </section>;
}

export function MineralInterlude() {
  const { t } = useLanguage();
  return <section className="mineral-interlude"><figure><img src={inlet} width={1600} height={800} loading="lazy" decoding="async" alt={t.studio.inletAlt} /><figcaption><h2>{t.studio.inlet}</h2><span>{t.studio.inletCaption}</span></figcaption></figure></section>;
}

export function CloseReading() {
  const { t } = useLanguage();
  return <section className="close-reading"><header><p className="eyebrow">{t.studio.reading}</p><h2>{t.home.processTitle}</h2><p>{t.home.processBody}</p></header><div className="reading-table"><div className="reading-note"><h3>{t.studio.gate}</h3><p>{t.studio.gateBody}</p></div><figure><img src={darkDetail} width={600} height={534} loading="lazy" decoding="async" alt={t.studio.darkAlt} /><figcaption>{t.studio.darkDetail}</figcaption></figure><figure><img src={lightDetail} width={600} height={534} loading="lazy" decoding="async" alt={t.studio.lightAlt} /><figcaption>{t.studio.lightDetail}</figcaption></figure></div></section>;
}