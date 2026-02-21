import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { ScoreBadge, ScoreBreakdown } from "@/components/ScoreBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ExternalLink,
  Bookmark,
  Zap,
  Building2,
  Calendar,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Link2,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { EnrichmentData } from "@/data/mockCompanies";

const SIGNAL_ICONS: Record<string, typeof Building2> = {
  hiring: Users,
  blog: Clock,
  funding: Zap,
  founder: Users,
  product: Zap,
  website: Link2,
};

export default function CompanyProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const company = useStore((s) => s.companies.find((c) => c.id === id));
  const enrichCompany = useStore((s) => s.enrichCompany);
  const lists = useStore((s) => s.lists);
  const addToList = useStore((s) => s.addToList);
  const notes = useStore((s) => s.notes.filter((n) => n.companyId === id));
  const addNote = useStore((s) => s.addNote);
  const deleteNote = useStore((s) => s.deleteNote);
  const [enriching, setEnriching] = useState(false);
  const [noteText, setNoteText] = useState("");

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <p className="text-muted-foreground">Company not found</p>
      </div>
    );
  }

  const handleEnrich = async () => {
    setEnriching(true);

    const mockData: EnrichmentData = {
      summary: `${company.name} is ${company.description.toLowerCase()} Founded in ${company.foundedYear}, the company operates in the ${company.sector} space targeting ${company.stage}-stage growth.`,
      bullets: [
        `Core product focused on ${company.sector.toLowerCase()} innovation`,
        `Headquartered in ${company.location} with ${company.employees} employees`,
        "Strong technical team with domain expertise",
        "Active product development cycle with recent releases",
        "Growing customer base across target verticals",
      ],
      keywords: [
        ...company.tags,
        company.sector,
        "startup",
        "innovation",
        "growth",
      ],
      signals: [
        {
          label: "Careers page exists",
          detected: company.signals.some((s) => s.type === "hiring"),
        },
        {
          label: "Blog updated recently",
          detected: company.signals.some((s) => s.type === "blog"),
        },
        { label: "Changelog detected", detected: Math.random() > 0.4 },
        {
          label: "API documentation found",
          detected: company.sector === "DevTools" || company.sector === "SaaS",
        },
      ],
      sources: [{ url: company.website, fetchedAt: new Date().toISOString() }],
      fetchedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/enrich", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteUrl: company.website,
        }),
      });

      if (!response.ok) {
        throw new Error("API failed");
      }

      const realData = await response.json();
      enrichCompany(company.id, realData);
    } catch (error) {
      console.warn("Using mock data due to API failure:", error);
      enrichCompany(company.id, mockData);
    } finally {
      setEnriching(false);
    }
  };

  const handleAddNote = () => {
    if (!noteText.trim() || !id) return;
    addNote(id, noteText.trim());
    setNoteText("");
  };
  const [listBanner, setListBanner] = useState<{
    visible: boolean;
    listName: string;
  }>({
    visible: false,
    listName: "",
  });

  return (
    <>
    {listBanner.visible && (
  <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top fade-in duration-300">
    <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-background/70 backdrop-blur-xl px-6 py-3 shadow-2xl">

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-5 w-5 text-primary" />
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">
          Added to "{listBanner.listName}"
        </p>
        <p className="text-xs text-muted-foreground">
          {company.name} successfully added
        </p>
      </div>
    </div>
  </div>
)}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate("/companies")}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to companies
      </button>

      <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-8">
        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-6 w-full">
          {/* Header Card */}
          <div className="card-elevated p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                {company.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">
                    {company.name}
                  </h1>
                  <ScoreBadge score={company.score} size="md" showLabel />
                </div>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1 truncate"
                >
                  {company.website}{" "}
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
              </div>
              <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 flex-1 sm:flex-none"
                >
                  <Bookmark className="h-3.5 w-3.5" />{" "}
                  <span className="hidden sm:inline">Save</span>
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 flex-1 sm:flex-none"
                  onClick={handleEnrich}
                  disabled={enriching}
                >
                  {enriching ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Zap className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {enriching
                      ? "Enriching..."
                      : company.enriched
                        ? "Re-Enrich"
                        : "Enrich"}
                  </span>
                  <span className="sm:hidden text-xs">
                    {enriching ? "..." : "Enrich"}
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Overview Card */}
          <div className="card-elevated p-4 sm:p-6">
            <h2 className="text-sm font-semibold mb-4">Overview</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {company.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="font-medium text-foreground">
                  {company.sector}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="font-medium text-foreground">
                  {company.stage}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="font-medium text-foreground">
                  {company.location}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="font-medium text-foreground">
                  Founded {company.foundedYear}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="font-medium text-foreground">
                  {company.employees} employees
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {company.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[11px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Signals Timeline */}
          <div className="card-elevated p-4 sm:p-6">
            <h2 className="text-sm font-semibold mb-4">Signals Timeline</h2>
            <div className="space-y-4">
              {company.signals.map((signal, i) => {
                const Icon = SIGNAL_ICONS[signal.type] || Zap;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      {i < company.signals.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="pb-4 min-w-0">
                      <p className="text-sm font-medium">{signal.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(signal.timestamp).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enrichment Loading Skeleton */}
          {enriching && (
            <div className="card-elevated p-4 sm:p-6 space-y-3">
              <h2 className="text-sm font-semibold">Enrichment</h2>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 rounded bg-secondary animate-shimmer"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, hsl(var(--secondary)) 0%, hsl(var(--muted)) 50%, hsl(var(--secondary)) 100%)",
                    backgroundSize: "200% 100%",
                    width: `${80 - i * 10}%`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Enrichment Data */}
          {company.enriched && company.enrichmentData && (
            <div className="space-y-6 slide-up">
              <div className="card-elevated p-4 sm:p-6">
                <h2 className="text-sm font-semibold mb-3">Summary</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {company.enrichmentData.summary}
                </p>
              </div>

              <div className="card-elevated p-4 sm:p-6">
                <h2 className="text-sm font-semibold mb-3">What They Do</h2>
                <ul className="space-y-2">
                  {company.enrichmentData.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-elevated p-4 sm:p-6">
                <h2 className="text-sm font-semibold mb-3">Keywords</h2>
                <div className="flex flex-wrap gap-1.5">
                  {company.enrichmentData.keywords.map((kw) => (
                    <Badge key={kw} variant="secondary" className="text-[11px]">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="card-elevated p-4 sm:p-6">
                <h2 className="text-sm font-semibold mb-3">Derived Signals</h2>
                <div className="space-y-2">
                  {company.enrichmentData.signals.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {s.detected ? (
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span
                        className={
                          s.detected
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-elevated p-4 sm:p-6">
                <h2 className="text-sm font-semibold mb-3">Sources</h2>
                <div className="space-y-2">
                  {company.enrichmentData.sources.map((src, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm"
                    >
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 truncate"
                      >
                        <Link2 className="h-3 w-3 flex-shrink-0" />{" "}
                        <span className="truncate">{src.url}</span>
                      </a>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {new Date(src.fetchedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="card-elevated p-4 sm:p-6">
            <h2 className="text-sm font-semibold mb-3">Notes</h2>
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {notes.length === 0 && (
                <p className="text-xs text-muted-foreground">No notes yet.</p>
              )}
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start justify-between gap-2 rounded-lg bg-secondary p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm break-words">{note.content}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0 mt-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                className="text-sm min-h-[60px] w-full resize-none"
              />
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="w-full sm:w-auto sm:self-end flex-shrink-0"
              >
                Add
              </Button>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4">
          {/* Add to List Card */}
          <div className="card-elevated p-4 lg:sticky lg:top-20">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Add to List
            </h3>
            {lists.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No lists yet. Create one on the Lists page.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 lg:max-h-none overflow-y-auto lg:overflow-visible">
                {lists.map((list) => {
                  const inList = list.companyIds.includes(company.id);
                  return (
                    <button
                      key={list.id}
                      onClick={() => {
                        if (inList) return;

                        addToList(list.id, company.id);

                        setListBanner({
                          visible: true,
                          listName: list.name,
                        });

                        setTimeout(() => {
                          setListBanner({ visible: false, listName: "" });
                        }, 3000);
                      }}
                      className={`w-full text-left rounded-lg px-3 py-2 text-xs transition-colors truncate ${
                        inList
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary text-muted-foreground"
                      }`}
                      title={list.name}
                    >
                      {inList ? "✓ " : "+ "}
                      {list.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Score Breakdown Card */}
          <div className="card-elevated p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Score Breakdown
            </h3>
            <ScoreBreakdown breakdown={company.scoreBreakdown} />
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}
