import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Company, EnrichmentData, mockCompanies } from "@/data/mockCompanies";

export interface CompanyList {
  id: string;
  name: string;
  companyIds: string[];
  createdAt: string;
}

export interface CompanyNote {
  id: string;
  companyId: string;
  content: string;
  createdAt: string;
}

interface AppState {
  companies: Company[];
  lists: CompanyList[];
  notes: CompanyNote[];

  // Company
  enrichCompany: (id: string, data: EnrichmentData) => void;

  // Lists
  createList: (name: string) => void;
  deleteList: (id: string) => void;
  renameList: (id: string, name: string) => void;
  addToList: (listId: string, companyId: string) => void;
  removeFromList: (listId: string, companyId: string) => void;

  // Notes
  addNote: (companyId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
}

const genId = () => Math.random().toString(36).slice(2, 10);

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      companies: mockCompanies,
      lists: [],
      notes: [],

      /* ==============================
         ENRICH COMPANY
      ============================== */
      enrichCompany: (id, data) =>
        set((state) => ({
          companies: state.companies.map((company) =>
            company.id === id
              ? {
                  ...company,
                  enriched: true,
                  enrichmentData: data,
                  description: data.summary || company.description,
                  tags: data.keywords?.slice(0, 6) || company.tags,
                  score: Math.min(
                    100,
                    company.score +
                      (data.signals?.filter((s) => s.detected).length || 0)
                  ),
                }
              : company
          ),
        })),

      /* ==============================
         LIST FUNCTIONS
      ============================== */

      createList: (name) =>
        set((state) => ({
          lists: [
            ...state.lists,
            {
              id: genId(),
              name,
              companyIds: [],
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteList: (id) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
        })),

      renameList: (id, name) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id ? { ...list, name } : list
          ),
        })),

      addToList: (listId, companyId) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId &&
            !list.companyIds.includes(companyId)
              ? {
                  ...list,
                  companyIds: [...list.companyIds, companyId],
                }
              : list
          ),
        })),

      removeFromList: (listId, companyId) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  companyIds: list.companyIds.filter(
                    (id) => id !== companyId
                  ),
                }
              : list
          ),
        })),

      /* ==============================
         NOTES
      ============================== */

      addNote: (companyId, content) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              id: genId(),
              companyId,
              content,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteNote: (noteId) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== noteId),
        })),
    }),
    {
      name: "scoutflow-storage",
    }
  )
);