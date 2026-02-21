import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Download, Pencil, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Lists() {
  const navigate = useNavigate();
  const lists = useStore((s) => s.lists);
  const companies = useStore((s) => s.companies);
  const createList = useStore((s) => s.createList);
  const deleteList = useStore((s) => s.deleteList);
  const renameList = useStore((s) => s.renameList);
  const removeFromList = useStore((s) => s.removeFromList);
  const [newListName, setNewListName] = useState('');

  const handleCreate = () => {
    if (!newListName.trim()) return;
    createList(newListName.trim());
    setNewListName('');
  };

  const exportList = (listId: string, format: 'csv' | 'json') => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;
    const listCompanies = list.companyIds.map((id) => companies.find((c) => c.id === id)).filter(Boolean);

    let content: string;
    let mime: string;
    let ext: string;

    if (format === 'json') {
      content = JSON.stringify(listCompanies, null, 2);
      mime = 'application/json';
      ext = 'json';
    } else {
      const headers = ['Name', 'Sector', 'Stage', 'Location', 'Score', 'Website'];
      const rows = listCompanies.map((c) => [c!.name, c!.sector, c!.stage, c!.location, c!.score, c!.website].join(','));
      content = [headers.join(','), ...rows].join('\n');
      mime = 'text/csv';
      ext = 'csv';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${list.name}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight mb-6">Lists</h1>

      {/* Create */}
      <div className="card-elevated p-4 mb-6">
        <div className="flex gap-2">
          <Input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name..."
            className="h-9 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <Button size="sm" onClick={handleCreate} disabled={!newListName.trim()} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Create
          </Button>
        </div>
      </div>

      {/* Lists */}
      {lists.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <Building2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
          No lists yet. Create one above.
        </div>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => {
            const listCompanies = list.companyIds.map((id) => companies.find((c) => c.id === id)).filter(Boolean);
            return (
              <div key={list.id} className="card-elevated p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{list.name}</h3>
                    <Badge variant="secondary" className="text-[10px]">{list.companyIds.length}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => {
                      const name = prompt('Rename list:', list.name);
                      if (name) renameList(list.id, name);
                    }}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => exportList(list.id, 'csv')}>
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteList(list.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {listCompanies.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No companies in this list.</p>
                ) : (
                  <div className="space-y-1">
                    {listCompanies.map((c) => (
                      <div key={c!.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-secondary transition-colors">
                        <button onClick={() => navigate(`/companies/${c!.id}`)} className="flex items-center gap-2 text-left">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                            {c!.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium">{c!.name}</span>
                          <span className="text-xs text-muted-foreground">{c!.sector}</span>
                        </button>
                        <button onClick={() => removeFromList(list.id, c!.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => exportList(list.id, 'csv')}>
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => exportList(list.id, 'json')}>
                    Export JSON
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
