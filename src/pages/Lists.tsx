import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Download,
  Pencil,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Lists() {
  const navigate = useNavigate();

  const lists = useStore((s) => s.lists);
  const companies = useStore((s) => s.companies);

  const createList = useStore((s) => s.createList);
  const deleteList = useStore((s) => s.deleteList);
  const renameList = useStore((s) => s.renameList);
  const removeFromList = useStore((s) => s.removeFromList);

  const [newListName, setNewListName] = useState("");

  /* ===============================
     CREATE LIST
  =============================== */
  const handleCreate = () => {
    if (!newListName.trim()) return;
    createList(newListName.trim());
    setNewListName("");
  };

  /* ===============================
     EXPORT FUNCTION
  =============================== */
  const exportList = (listId: string, format: "csv" | "json") => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;

    const listCompanies = list.companyIds
      .map((id) => companies.find((c) => c.id === id))
      .filter(Boolean);

    if (listCompanies.length === 0) return;

    let content = "";
    let mimeType = "";
    let fileExtension = "";

    if (format === "json") {
      content = JSON.stringify(listCompanies, null, 2);
      mimeType = "application/json";
      fileExtension = "json";
    } else {
      const headers = [
        "Name",
        "Sector",
        "Stage",
        "Location",
        "Score",
        "Website",
      ];

      const rows = listCompanies.map((c) =>
        [
          c!.name,
          c!.sector,
          c!.stage,
          c!.location,
          c!.score,
          c!.website,
        ].join(",")
      );

      content = [headers.join(","), ...rows].join("\n");
      mimeType = "text/csv";
      fileExtension = "csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${list.name}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl"
    >
      <h1 className="text-xl font-semibold mb-6">Lists</h1>

      {/* Create List */}
      <div className="card-elevated p-4 mb-6">
        <div className="flex gap-2">
          <Input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name..."
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button onClick={handleCreate} disabled={!newListName.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>
        </div>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="h-8 w-8 mx-auto mb-2" />
          No lists yet.
        </div>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => {
            const listCompanies = list.companyIds
              .map((id) => companies.find((c) => c.id === id))
              .filter(Boolean);

            return (
              <div key={list.id} className="card-elevated p-4">
                {/* Header */}
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{list.name}</h3>
                    <Badge>{list.companyIds.length}</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Rename */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const name = prompt(
                          "Rename list:",
                          list.name
                        );
                        if (name) renameList(list.id, name);
                      }}
                    >
                      <Pencil size={14} />
                    </Button>

                    {/* Delete List */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteList(list.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                {/* Companies */}
                {listCompanies.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No companies in this list.
                  </p>
                ) : (
                  <div className="space-y-2 mb-3">
                    {listCompanies.map((c) => (
                      <div
                        key={c!.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span
                          className="cursor-pointer font-medium"
                          onClick={() =>
                            navigate(`/companies/${c!.id}`)
                          }
                        >
                          {c!.name}
                        </span>

                        <button
                          onClick={() =>
                            removeFromList(list.id, c!.id)
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Export Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      exportList(list.id, "csv")
                    }
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export CSV
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      exportList(list.id, "json")
                    }
                  >
                    <Download className="h-4 w-4 mr-1" />
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