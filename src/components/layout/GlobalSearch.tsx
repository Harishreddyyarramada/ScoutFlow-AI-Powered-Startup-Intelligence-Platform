import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
// framer-motion removed

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const companies = useStore((s) => s.companies);

  const filtered = query.length > 0
    ? companies.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.sector.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [open]);

  const handleSelect = (id: string) => {
    setOpen(false);
    navigate(`/companies/${id}`);
  };

  return (
    <>
      {/* Trigger in header */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-secondary w-80"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search companies...</span>
        <kbd className="ml-auto rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
      </button>

      {/* Modal */}
      {open && (
          <>
            <div
              className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm fade-in"
              onClick={() => setOpen(false)}
            />
            <div
              className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-card shadow-xl fade-in"
            >
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search companies, sectors..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button onClick={() => setOpen(false)}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {filtered.length > 0 && (
                <div className="max-h-72 overflow-y-auto p-2">
                  {filtered.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(c.id)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.sector} · {c.stage} · {c.location}</p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{c.score}</span>
                    </button>
                  ))}
                </div>
              )}

              {query.length > 0 && filtered.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No companies found for "{query}"
                </div>
              )}

              {query.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Type to search companies...
                </div>
              )}
            </div>
          </>
        )}
    </>
  );
}
