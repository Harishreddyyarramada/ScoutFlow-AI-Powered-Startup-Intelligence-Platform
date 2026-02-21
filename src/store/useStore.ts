import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Company,
  EnrichmentData,
  mockCompanies,
} from "@/data/mockCompanies";

/* ==============================
   TYPES
============================== */

export interface FilterState {
  sectors: string[];
  stages: string[];
  locations: string[];
  hiring: boolean | null;
  scoreRange: [number, number];
}

export interface CompanyList {
  id: string;
  name: string;
  companyIds: string[];
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: FilterState;
  query: string;
  resultCompanyIds: string[];
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
  savedSearches: SavedSearch[];
  filteredCompanyIds: string[] | null;

  /* COMPANY */
  enrichCompany: (id: string, data: EnrichmentData) => void;

  /* LISTS */
  createList: (name: string) => void;
  deleteList: (id: string) => void;
  renameList: (id: string, name: string) => void;
  addToList: (listId: string, companyId: string) => void;
  removeFromList: (listId: string, companyId: string) => void;

  /* SAVED SEARCH */
  saveSearch: (
    name: string,
    filters: FilterState,
    query: string
  ) => void;
  runSavedSearch: (searchId: string) => void;
  clearFilteredResults: () => void;
  deleteSavedSearch: (id: string) => void;

  /* NOTES */
  addNote: (companyId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
}

const genId = () => Math.random().toString(36).slice(2, 10);

/* ==============================
   STORE
============================== */

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      companies: mockCompanies,
      lists: [],
      notes: [],
      savedSearches: [],
      filteredCompanyIds: null,

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
                      (data.signals?.filter((s) => s.detected)
                        .length || 0)
                  ),
                }
              : company
          ),
        })),

      /* ==============================
         LISTS
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
         SAVE SEARCH
      ============================== */
      saveSearch: (name, filters, query) => {
        const companies = get().companies;

        const results = companies.filter((company) => {
          const matchesQuery =
            !query ||
            company.name
              .toLowerCase()
              .includes(query.toLowerCase());

          const matchesSector =
            filters.sectors.length === 0 ||
            filters.sectors.includes(company.sector);

          const matchesStage =
            filters.stages.length === 0 ||
            filters.stages.includes(company.stage);

          const matchesLocation =
            filters.locations.length === 0 ||
            filters.locations.includes(company.location);

          const matchesScore =
            company.score >= filters.scoreRange[0] &&
            company.score <= filters.scoreRange[1];

          return (
            matchesQuery &&
            matchesSector &&
            matchesStage &&
            matchesLocation &&
            matchesScore
          );
        });

        set((state) => ({
          savedSearches: [
            ...state.savedSearches,
            {
              id: genId(),
              name,
              filters,
              query,
              resultCompanyIds: results.map((c) => c.id),
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      /* ==============================
         RUN SAVED SEARCH
      ============================== */
      runSavedSearch: (searchId) => {
        const search = get().savedSearches.find(
          (s) => s.id === searchId
        );
        if (!search) return;

        set({
          filteredCompanyIds: search.resultCompanyIds,
        });
      },

      clearFilteredResults: () =>
        set({ filteredCompanyIds: null }),

      deleteSavedSearch: (id) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter(
            (s) => s.id !== id
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
          notes: state.notes.filter(
            (n) => n.id !== noteId
          ),
        })),
    }),
    {
      name: "scoutflow-storage",
    }
  )
);