"use client";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HomeView } from "@/components/site/HomeView";
import { CategoryView } from "@/components/site/CategoryView";
import { ArticleView } from "@/components/site/ArticleView";
import { StaticPage } from "@/components/site/StaticPage";
import { CookieBanner } from "@/components/site/CookieBanner";
import { useNav } from "@/lib/nav";

export default function Home() {
  const view = useNav((s) => s.view);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {view.type === "home" && <HomeView />}
        {view.type === "category" && <CategoryView slug={view.slug} />}
        {view.type === "article" && <ArticleView slug={view.slug} />}
        {view.type === "about" && <StaticPage type="about" />}
        {view.type === "privacy" && <StaticPage type="privacy" />}
        {view.type === "cookies" && <StaticPage type="cookies" />}
        {view.type === "legal" && <StaticPage type="legal" />}
        {view.type === "dmca" && <StaticPage type="dmca" />}
        {view.type === "contact" && <StaticPage type="contact" />}
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
