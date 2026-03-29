import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/i18n/LanguageContext";
import { Search, Download, ExternalLink, FileText, Video, Layout, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  category: "pdf" | "video" | "template" | "link";
  module?: string;
  url: string;
  size?: string;
}

const mockResources: Resource[] = [
  { id: "r1", title: "Guide cybersécurité pour débutants", category: "pdf", module: "M1", url: "#", size: "1.2 MB" },
  { id: "r2", title: "Détecter le phishing — Exercices", category: "pdf", module: "M1", url: "#", size: "850 KB" },
  { id: "r3", title: "Introduction à Google Drive", category: "video", module: "M2", url: "#" },
  { id: "r4", title: "Template Notion — Gestion de projet", category: "template", module: "M2", url: "#" },
  { id: "r5", title: "Guide des prompts IA", category: "pdf", module: "M3", url: "#", size: "2.1 MB" },
  { id: "r6", title: "Modèle de CV adapté", category: "template", module: "M4", url: "#" },
  { id: "r7", title: "Mini business plan — Template", category: "template", module: "M5", url: "#" },
  { id: "r8", title: "Ressources entrepreneuriat Niger", category: "link", url: "#" },
];

const categoryIcons = {
  pdf: FileText,
  video: Video,
  template: Layout,
  link: Link2,
};

export default function Resources() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = mockResources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || r.category === category;
    return matchSearch && matchCat;
  });

  const categories = Object.entries(t.resources.categories);

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">{t.resources.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t.resources.subtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t.resources.search} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap",
                category === key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card"><CardContent className="py-12 text-center text-muted-foreground">{t.resources.noResults}</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => {
            const Icon = categoryIcons[r.category];
            return (
              <Card key={r.id} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{r.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {r.module && <span className="text-xs font-bold text-primary">{r.module}</span>}
                      {r.size && <span className="text-xs text-muted-foreground">{r.size}</span>}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {r.category === "link" ? (
                      <><ExternalLink className="h-3 w-3 mr-1" />{t.resources.open}</>
                    ) : (
                      <><Download className="h-3 w-3 mr-1" />{t.resources.download}</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
