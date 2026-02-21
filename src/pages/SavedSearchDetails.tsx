import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/ScoreBadge";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function SavedSearchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const savedSearch = useStore((s) =>
    s.savedSearches.find((ss) => ss.id === id)
  );

  const companies = useStore((s) => s.companies);

  if (!savedSearch) {
    return (
      <div className="p-8 text-muted-foreground">
        Saved search not found.
      </div>
    );
  }

  // 🔥 THIS IS THE MAGIC
  const resultCompanies = companies.filter((c) =>
    savedSearch.resultCompanyIds.includes(c.id)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 fade-in">

      <button
        onClick={() => navigate("/saved")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Saved Searches
      </button>

      <div className="card-elevated p-6">
        <h1 className="text-xl font-semibold">{savedSearch.name}</h1>

        <p className="text-xs text-muted-foreground mt-1">
          Created {new Date(savedSearch.createdAt).toLocaleDateString()}
        </p>

        <div className="mt-4 text-sm text-muted-foreground">
          {resultCompanies.length} companies captured in this search
        </div>
      </div>

      <div className="space-y-3">
        {resultCompanies.map((company) => (
          <div
            key={company.id}
            className="card-elevated p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{company.name}</h3>
              <p className="text-xs text-muted-foreground">
                {company.sector} • {company.stage}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <ScoreBadge score={company.score} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(company.website, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}