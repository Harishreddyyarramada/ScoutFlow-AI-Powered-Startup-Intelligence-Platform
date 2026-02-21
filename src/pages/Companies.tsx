import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, FilterState } from '@/store/useStore';
import { SECTORS, STAGES, LOCATIONS } from '@/data/mockCompanies';
import { ScoreBadge, ScoreBreakdown } from '@/components/ScoreBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Search, Filter, ChevronDown, ArrowUpDown, Bookmark,
  ExternalLink, ChevronLeft, ChevronRight, Save, Home
} from 'lucide-react';

const SIGNAL_ICONS: Record<string, string> = {
  hiring: '👥', blog: '📝', funding: '💰',
  founder: '👤', product: '🚀', website: '🌐',
};

export default function Companies() {
  const navigate = useNavigate();
  const companies = useStore((s) => s.companies);
  const saveSearch = useStore((s) => s.saveSearch);

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    sectors: [], stages: [], locations: [], hiring: null, scoreRange: [0, 100],
  });
  const [sortKey, setSortKey] = useState<'score' | 'name' | 'foundedYear'>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const perPage = 10;

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let result = companies.filter((c) => {
      if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.sector.toLowerCase().includes(query.toLowerCase())) return false;
      if (filters.sectors.length && !filters.sectors.includes(c.sector)) return false;
      if (filters.stages.length && !filters.stages.includes(c.stage)) return false;
      if (filters.locations.length && !filters.locations.includes(c.location)) return false;
      if (c.score < filters.scoreRange[0] || c.score > filters.scoreRange[1]) return false;
      return true;
    });
    result.sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'score') return (a.score - b.score) * mul;
      if (sortKey === 'name') return a.name.localeCompare(b.name) * mul;
      return (a.foundedYear - b.foundedYear) * mul;
    });
    return result;
  }, [companies, query, filters, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleFilter = (key: 'sectors' | 'stages' | 'locations', value: string) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
    setPage(1);
  };

  const activeFilterCount = filters.sectors.length + filters.stages.length + filters.locations.length;

  const toggleSelectAll = () => {
    if (selected.size === paged.length) setSelected(new Set());
    else setSelected(new Set(paged.map(c => c.id)));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 fade-in px-4 sm:px-0">
      {/* Desktop Filter Panel */}
      <div className="hidden lg:block w-56 shrink-0 space-y-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <Filter className="h-3 w-3" /> Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">{activeFilterCount}</Badge>
            )}
          </h3>
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters({ sectors: [], stages: [], locations: [], hiring: null, scoreRange: [0, 100] })}
              className="text-[10px] text-primary hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {[
          { label: 'Sector', key: 'sectors' as const, options: SECTORS },
          { label: 'Stage', key: 'stages' as const, options: STAGES },
          { label: 'Location', key: 'locations' as const, options: LOCATIONS },
        ].map((group) => (
          <Collapsible key={group.key} defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
              {group.label}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-0.5 px-2 pb-2">
              {group.options.map((opt) => (
                <label key={opt} className="flex items-center gap-2 rounded px-1 py-1 text-xs cursor-pointer hover:bg-secondary transition-colors">
                  <Checkbox
                    checked={filters[group.key].includes(opt)}
                    onCheckedChange={() => toggleFilter(group.key, opt)}
                    className="h-3.5 w-3.5"
                  />
                  <span className="text-muted-foreground text-[12px]">{opt}</span>
                </label>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 w-full">
        {/* Mobile Filters Collapsible */}
        <div className="lg:hidden mb-4">
          <Collapsible open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-secondary/30 px-3 py-2.5 text-sm font-medium hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </div>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && <Badge variant="secondary" className="h-5 px-2 text-[11px]">{activeFilterCount}</Badge>}
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2 px-2 pb-2">
              {[
                { label: 'Sector', key: 'sectors' as const, options: SECTORS },
                { label: 'Stage', key: 'stages' as const, options: STAGES },
                { label: 'Location', key: 'locations' as const, options: LOCATIONS },
              ].map((group) => (
                <div key={`m-${group.key}`} className="rounded-lg bg-background/50 border border-border/30 p-2.5">
                  <h4 className="text-xs font-medium mb-2 text-foreground">{group.label}</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {group.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 rounded px-2 py-1.5 text-xs cursor-pointer hover:bg-secondary transition-colors">
                        <Checkbox
                          checked={filters[group.key].includes(opt)}
                          onCheckedChange={() => toggleFilter(group.key, opt)}
                          className="h-3.5 w-3.5"
                        />
                        <span className="text-muted-foreground text-[12px]">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => setFilters({ sectors: [], stages: [], locations: [], hiring: null, scoreRange: [0, 100] })}
                  className="w-full text-xs text-primary hover:underline py-2 mt-2"
                >
                  Reset Filters
                </button>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Top bar - Search & Actions */}
        <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search companies..."
              className="pl-9 h-9 text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">{filtered.length} results</span>
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 h-9 px-2 flex-shrink-0"
              onClick={() => {
                const name = prompt('Name this search:');
                if (name) saveSearch(name, filters, query);
              }}
            >
              <Save className="h-3 w-3" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block card-elevated overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="w-10 px-2 sm:px-3 py-2.5">
                  <Checkbox
                    checked={selected.size === paged.length && paged.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="h-3.5 w-3.5"
                  />
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-left">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
                    Company <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="hidden sm:table-cell px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sector</th>
                <th className="hidden sm:table-cell px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stage</th>
                <th className="hidden lg:table-cell px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Location</th>
                <th className="px-2 sm:px-3 py-2.5 text-left">
                  <button onClick={() => toggleSort('score')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
                    Score <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="hidden sm:table-cell px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Signals</th>
                <th className="px-2 sm:px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((company) => (
                <tr
                  key={company.id}
                  onClick={() => navigate(`/companies/${company.id}`)}
                  className="border-b border-border/50 cursor-pointer transition-colors hover:bg-secondary/30"
                >
                  <td className="px-2 sm:px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(company.id)}
                      onCheckedChange={() => {
                        const next = new Set(selected);
                        next.has(company.id) ? next.delete(company.id) : next.add(company.id);
                        setSelected(next);
                      }}
                      className="h-3.5 w-3.5"
                    />
                  </td>
                  <td className="px-2 sm:px-3 py-3 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary shrink-0">
                        {company.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{company.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{company.website}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-2 sm:px-3 py-3">
                    <Badge variant="secondary" className="text-[11px] font-normal">{company.sector}</Badge>
                  </td>
                  <td className="hidden sm:table-cell px-2 sm:px-3 py-3 text-muted-foreground text-xs">{company.stage}</td>
                  <td className="hidden lg:table-cell px-2 sm:px-3 py-3 text-muted-foreground text-xs">{company.location}</td>
                  <td className="px-2 sm:px-3 py-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button><ScoreBadge score={company.score} /></button>
                      </PopoverTrigger>
                      <PopoverContent side="left" className="p-0 w-48 sm:w-56">
                        <ScoreBreakdown breakdown={company.scoreBreakdown} />
                      </PopoverContent>
                    </Popover>
                  </td>
                  <td className="hidden sm:table-cell px-2 sm:px-3 py-3">
                    <div className="flex gap-1">
                      {company.signals.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-sm cursor-default" title={s.label}>{SIGNAL_ICONS[s.type] || '📌'}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-primary">
                        <Bookmark className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-primary" onClick={() => window.open(company.website, '_blank')}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-3">
          {paged.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No companies found</p>
            </div>
          ) : (
            paged.map((company) => (
              <div
                key={`m-${company.id}`}
                onClick={() => navigate(`/companies/${company.id}`)}
                className="rounded-lg border border-border/40 bg-card p-3 cursor-pointer transition-shadow hover:shadow-md active:shadow-sm"
              >
                {/* Header Row */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary shrink-0">
                    {company.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{company.name}</p>
                    <a href={company.website} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[11px] text-primary hover:underline truncate block">
                      {company.website}
                    </a>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <div className="shrink-0"><ScoreBadge score={company.score} /></div>
                    </PopoverTrigger>
                    <PopoverContent side="left" className="p-0 w-48">
                      <ScoreBreakdown breakdown={company.scoreBreakdown} />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Details Row */}
                <div className="flex flex-wrap items-center gap-2 text-[12px] mb-2">
                  <Badge variant="secondary" className="text-[10px] font-normal">{company.sector}</Badge>
                  <span className="text-muted-foreground">{company.stage}</span>
                  <span className="text-muted-foreground">{company.location}</span>
                </div>

                {/* Signals & Actions Row */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {company.signals.slice(0, 4).map((s, i) => (
                      <span key={i} className="text-base cursor-default" title={s.label}>{SIGNAL_ICONS[s.type] || '📌'}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-primary">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-primary" onClick={() => window.open(company.website, '_blank')}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left order-2 sm:order-1">
            Showing {paged.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-7 w-7 p-0">
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = page > 3 ? page - 2 + i : i + 1;
              if (pageNum > totalPages) return null;
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className="h-7 w-7 p-0 text-xs"
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && page < totalPages - 2 && <span className="text-xs text-muted-foreground px-2">...</span>}
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="h-7 w-7 p-0">
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}