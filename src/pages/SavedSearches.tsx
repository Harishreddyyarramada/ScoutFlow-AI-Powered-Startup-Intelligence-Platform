import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Play, Search, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SavedSearches() {
  const navigate = useNavigate();
  const savedSearches = useStore((s) => s.savedSearches);
  const deleteSavedSearch = useStore((s) => s.deleteSavedSearch);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight mb-6">Saved Searches</h1>

      {savedSearches.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <Bookmark className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
          No saved searches. Save a search from the Companies page.
        </div>
      ) : (
        <div className="space-y-3">
          {savedSearches.map((ss) => (
            <div key={ss.id} className="card-elevated p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm">{ss.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    {ss.query && (
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <Search className="h-2.5 w-2.5" /> {ss.query}
                      </Badge>
                    )}
                    {ss.filters.sectors.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                    {ss.filters.stages.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Created {new Date(ss.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={() => navigate('/companies')}>
                    <Play className="h-3 w-3" /> Run
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteSavedSearch(ss.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
