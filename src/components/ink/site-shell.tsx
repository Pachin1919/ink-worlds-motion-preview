import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./language-provider";

export function SkipLink() {
  const { t } = useLanguage();
  return <a className="skip-link" href="#content">{t.skip}</a>;
}

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const { language, setLanguage, t } = useLanguage();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <header className={overlay ? "site-header site-header--overlay" : "site-header"}>
      <Link to="/" className="wordmark" aria-label={t.nav.home}>IW</Link>
      <nav className="site-nav" aria-label={language === "zh" ? "主导航" : "Primary navigation"}>
        <Link to="/" activeOptions={{ exact: true }}>{t.nav.home}</Link>
        <Link to="/works" activeOptions={{ exact: false }}>{t.nav.works}</Link>
        <Link to="/about">{t.nav.about}</Link>
      </nav>
      <Button variant="language" size="sm" onClick={() => setLanguage(language === "en" ? "zh" : "en")} aria-label={language === "en" ? "切换为中文" : "Switch to English"} data-path={pathname}>
        {t.languageName}
      </Button>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div><strong>{t.footer.title}</strong><span>{t.footer.line}</span></div>
      <a href="#top">{t.footer.top}<ArrowUpRight aria-hidden="true" /></a>
    </footer>
  );
}
