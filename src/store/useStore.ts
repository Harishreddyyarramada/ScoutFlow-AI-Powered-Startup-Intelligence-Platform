import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Company,
  EnrichmentData,
  mockCompanies,
} from "@/data/mockCompanies";

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

  enrichCompany: (id: string, data: EnrichmentData) => void;

  createList: (name: string) => void;
  addToList: (listId: string, companyId: string) => void;

  addNote: (companyId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
}

const genId = () => Math.random().toString(36).slice(2, 10);

// Remove duplicates helper
const unique = (arr: string[]) =>
  Array.from(new Set(arr.map((v) => v.trim().toLowerCase())));

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      companies: mockCompanies,
      lists: [],
      notes: [],

      /* =====================================================
         🔥 ENRICH COMPANY (FULL SAFE UPDATE)
      ===================================================== */
      enrichCompany: (id, data) =>
        set((state) => ({
          companies: state.companies.map((company) => {
            if (company.id !== id) return company;

            const cleanedKeywords = data.keywords
              ? unique(data.keywords).slice(0, 6)
              : company.tags;

            const detectedSignals =
              data.signals?.filter((s) => s.detected).length || 0;

            const newScore = Math.min(
              100,
              company.score + detectedSignals * 2
            );

            return {
              ...company,

              enriched: true,
              enrichmentData: data,

              // 🔥 Replace fields
              description: data.summary || company.description,
              tags: cleanedKeywords,

              signals:
                data.signals?.map((s, index) => ({
                  type: "website",
                  label: s.label,
                  timestamp: new Date().toISOString(),
                })) || company.signals,

              score: newScore,
            };
          }),
        })),

      /* =====================================================
         LISTS
      ===================================================== */
      createList: (name) =>
        set((s) => ({
          lists: [
            ...s.lists,
            {
              id: genId(),
              name,
              companyIds: [],
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      addToList: (listId, companyId) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === listId && !l.companyIds.includes(companyId)
              ? {
                  ...l,
                  companyIds: [...l.companyIds, companyId],
                }
              : l
          ),
        })),

      /* =====================================================
         NOTES
      ===================================================== */
      addNote: (companyId, content) =>
        set((s) => ({
          notes: [
            ...s.notes,
            {
              id: genId(),
              companyId,
              content,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteNote: (noteId) =>
        set((s) => ({
          notes: s.notes.filter((n) => n.id !== noteId),
        })),
    }),
    {
      name: "scoutflow-storage",
    }
  )
);