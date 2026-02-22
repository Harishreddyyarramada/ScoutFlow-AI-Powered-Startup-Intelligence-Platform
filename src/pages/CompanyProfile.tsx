import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ExternalLink,
  Zap,
  CheckCircle2,
  XCircle,
  Link2,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { EnrichmentData } from "@/data/mockCompanies";

export default function CompanyProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const company = useStore((s) =>
    s.companies.find((c) => c.id === id)
  );

  const enrichCompany = useStore((s) => s.enrichCompany);

  const [enriching, setEnriching] = useState(false);
  const [banner, setBanner] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Company not found</p>
      </div>
    );
  }

  /* ==============================
     ENRICH FUNCTION
  ============================== */

  const handleEnrich = async () => {
    if (!company.website || !company.website.startsWith("http")) {
      setBanner({
        type: "error",
        message:
          "Invalid website URL. Please verify the company website.",
      });

      setTimeout(
        () => setBanner({ type: null, message: "" }),
        2000
      );
      return;
    }

    setEnriching(true);

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
        throw new Error("Enrichment failed");
      }

      const realData: EnrichmentData =
        await response.json();

      enrichCompany(company.id, realData);

      setBanner({
        type: "success",
        message: `🚀 ${company.name} enriched with latest intelligence`,
      });
    } catch (error) {
      setBanner({
        type: "error",
        message:
          "Enrichment failed. Website unreachable or invalid.",
      });
    } finally {
      setEnriching(false);
      setTimeout(
        () => setBanner({ type: null, message: "" }),
        2000
      );
    }
  };

  /* ==============================
     SHIMMER COMPONENT
  ============================== */

  const ShimmerLine = ({ width = "100%" }) => (
    <div
      className="h-4 rounded bg-gradient-to-r from-muted via-muted/40 to-muted bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"
      style={{ width }}
    />
  );

  /* ==============================
     RENDER
  ============================== */

  return (
    <>
      {/* BANNER */}
      {banner.type && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top fade-in duration-300">
          <div
            className={`flex items-center gap-3 rounded-xl px-6 py-3 shadow-2xl backdrop-blur-xl border ${
              banner.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-destructive/10 border-destructive/20"
            }`}
          >
            {banner.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}

            <p
              className={`text-sm font-medium ${
                banner.type === "success"
                  ? "text-emerald-700"
                  : "text-destructive"
              }`}
            >
              {banner.message}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 fade-in">
        <button
          onClick={() => navigate("/companies")}
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* HEADER */}
        <div className="card-elevated p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">
                {company.name}
              </h1>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary flex items-center gap-1"
              >
                {company.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div
              className={
                enriching
                  ? "animate-pulse scale-105 transition-all"
                  : ""
              }
            >
              <ScoreBadge score={company.score} />
            </div>
          </div>

          <Button
            className="mt-4 gap-2"
            onClick={handleEnrich}
            disabled={enriching}
          >
            {enriching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {enriching ? "Enriching..." : "Enrich"}
          </Button>
        </div>

        {/* ==============================
            ENRICHMENT SECTION (ALWAYS VISIBLE)
        ============================== */}

        <div className="space-y-6">
          {/* SUMMARY */}
          <div className="card-elevated p-6">
            <h2 className="text-sm font-semibold mb-3">
              Summary
            </h2>

            {enriching ? (
              <div className="space-y-2">
                <ShimmerLine />
                <ShimmerLine width="80%" />
                <ShimmerLine width="60%" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {company.enrichmentData?.summary ||
                  company.description}
              </p>
            )}
          </div>

          {/* WHAT THEY DO */}
          <div className="card-elevated p-6">
            <h2 className="text-sm font-semibold mb-3">
              What They Do
            </h2>

            {enriching ? (
              <div className="space-y-2">
                <ShimmerLine width="90%" />
                <ShimmerLine width="70%" />
                <ShimmerLine width="85%" />
              </div>
            ) : (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {(company.enrichmentData?.bullets || [
                  `Operates in ${company.sector}`,
                  `Stage: ${company.stage}`,
                  `Founded in ${company.foundedYear}`,
                ]).map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
            )}
          </div>

          {/* KEYWORDS */}
          <div className="card-elevated p-6">
            <h2 className="text-sm font-semibold mb-3">
              Keywords
            </h2>

            {enriching ? (
              <div className="flex gap-2">
                <ShimmerLine width="60px" />
                <ShimmerLine width="80px" />
                <ShimmerLine width="70px" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(company.enrichmentData?.keywords ||
                  company.tags ||
                  []
                ).map((kw, i) => (
                  <Badge key={`${kw}-${i}`}>
                    {kw}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* DERIVED SIGNALS */}
          <div className="card-elevated p-6">
            <h2 className="text-sm font-semibold mb-3">
              Derived Signals
            </h2>

            {enriching ? (
              <div className="space-y-2">
                <ShimmerLine width="70%" />
                <ShimmerLine width="60%" />
              </div>
            ) : (
              <div className="space-y-2">
                {(company.enrichmentData?.signals ||
                  company.signals.map((s) => ({
                    label: s.label,
                    detected: true,
                  }))
                ).map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm"
                  >
                    {s.detected ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    {s.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SOURCES */}
          <div className="card-elevated p-6">
            <h2 className="text-sm font-semibold mb-3">
              Sources
            </h2>

            {enriching ? (
              <ShimmerLine width="70%" />
            ) : (
              <div className="space-y-2">
                {(company.enrichmentData?.sources || [
                  { url: company.website },
                ]).map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-sm flex items-center gap-1"
                  >
                    <Link2 className="h-3 w-3" />
                    {src.url}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SHIMMER KEYFRAME */}
      <style>
        {`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}
      </style>
    </>
  );
}