import { asset } from "@/lib/asset";
import { useLanguage } from "./language-provider";

export function ArtworkFigure({ state, caption, className = "" }: { state: "dark" | "light"; caption?: string; className?: string }) {
  const { t } = useLanguage();
  const light = state === "light";
  return (
    <figure className={`artwork-figure ${className}`}>
      <img src={light ? asset("/assets/inner-world.png") : asset("/assets/outer-world.png")} alt={light ? t.innerAlt : t.outerAlt} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}