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
  Search, Filter, ChevronDown, ArrowUpDown, Bookmark, ExternalLink,
  Briefcase, TrendingUp, Globe, Calendar, ChevronLeft, ChevronRight, Save,
} from 'lucide-react';
// framer-motion removed

const SIGNAL_ICONS: Record<string, string> = {
  hiring: '👥', blog: '📝', funding: '💰', founder: '👤', product: '🚀', website: '🌐',
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
    <div className="flex gap-6 fade-in">
      {/* Filter Panel */}
      <div className="w-56 shrink-0 space-y-1">
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
                  <span className="text-muted-foreground">{opt}</span>
                </label>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search companies..."
              className="pl-9 h-9 text-sm"
            />
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length} results</span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto text-xs gap-1.5"
            onClick={() => {
              const name = prompt('Name this search:');
              if (name) saveSearch(name, filters, query);
            }}
          >
            <Save className="h-3 w-3" /> Save Search
          </Button>
        </div>

        {/* Table */}
        <div className="card-elevated overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="w-10 px-3 py-2.5">
                  <Checkbox
                    checked={selected.size === paged.length && paged.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="h-3.5 w-3.5"
                  />
                </th>
                <th className="px-3 py-2.5 text-left">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
                    Company <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sector</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stage</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Location</th>
                <th className="px-3 py-2.5 text-left">
                  <button onClick={() => toggleSort('score')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
                    Score <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Signals</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((company) => (
                <tr
                  key={company.id}
                  onClick={() => navigate(`/companies/${company.id}`)}
                  className="border-b border-border/50 cursor-pointer transition-colors hover:bg-secondary/30"
                >
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
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
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary shrink-0">
                        {company.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{company.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">{company.website}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="secondary" className="text-[11px] font-normal">{company.sector}</Badge>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground text-xs">{company.stage}</td>
                  <td className="px-3 py-3 text-muted-foreground text-xs">{company.location}</td>
                  <td className="px-3 py-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button><ScoreBadge score={company.score} /></button>
                      </PopoverTrigger>
                      <PopoverContent side="right" className="p-0 w-56">
                        <ScoreBreakdown breakdown={company.scoreBreakdown} />
                      </PopoverContent>
                    </Popover>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      {company.signals.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-sm cursor-default" title={s.label}>{SIGNAL_ICONS[s.type] || '📌'}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Bookmark className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => window.open(company.website, '_blank')}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-7 w-7 p-0">
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(i + 1)}
                className="h-7 w-7 p-0 text-xs"
              >
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="h-7 w-7 p-0">
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
