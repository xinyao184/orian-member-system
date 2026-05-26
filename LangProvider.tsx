"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { dict, type Lang, type Dict } from "./dict";

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: Dict; }
const LangContext = createContext<Ctx>({ lang: "zh", setLang: () => {}, t: dict.zh });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh"); // 默认中文
  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("orian_lang") as Lang | null) : null;
    if (saved === "zh" || saved === "en") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("orian_lang", l);
  };
  return <LangContext.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
