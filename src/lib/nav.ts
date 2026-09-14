"use client";

import { create } from "zustand";

type View =
  | { type: "home" }
  | { type: "category"; slug: string }
  | { type: "article"; slug: string }
  | { type: "about" }
  | { type: "privacy" }
  | { type: "contact" };

type NavState = {
  view: View;
  goHome: () => void;
  goCategory: (slug: string) => void;
  goArticle: (slug: string) => void;
  goAbout: () => void;
  goPrivacy: () => void;
  goContact: () => void;
};

export const useNav = create<NavState>((set) => ({
  view: { type: "home" },
  goHome: () => {
    set({ view: { type: "home" } });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  goCategory: (slug) => {
    set({ view: { type: "category", slug } });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  goArticle: (slug) => {
    set({ view: { type: "article", slug } });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  },
  goAbout: () => {
    set({ view: { type: "about" } });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  goPrivacy: () => {
    set({ view: { type: "privacy" } });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  goContact: () => {
    set({ view: { type: "contact" } });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
}));
