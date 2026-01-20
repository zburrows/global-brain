import { create } from "zustand";

export interface InputState {
    authors: string;
    title: string;
    link: string;
    author1: string;
    author2: string;
    organization: string;
    year: number;
    journal: string;
    keyFindings: string;
    metaDescription: string;
    onePageSummary: string;
    updateAuthors: (authors: string) => void;
    updateTitle: (title: string) => void;
    updateLink: (link: string) => void;
    updateAuthor1: (author1: string) => void;
    updateAuthor2: (author2: string) => void;
    updateOrganization: (organization: string) => void;
    updateYear: (year: number) => void;
    updateJournal: (journal: string) => void;
    updateKeyFindings: (keyFindings: string) => void;
    updateMetaDescription: (metaDescription: string) => void;
    updateOnePageSummary: (onePageSummary: string) => void;
    updateStore: (json: Partial<InputState>) => void;
    reset: () => void;
}

export const useInputStore = create<InputState>((set, get, store) => ({
    authors: "",
    title: "",
    link: "",
    author1: "",
    author2: "",
    organization: "",
    year: 0,
    journal: "",
    keyFindings: "",
    metaDescription: "",
    onePageSummary: "",
    updateAuthors: (authors) => set({ authors: authors }),
    updateTitle: (title) => set({ title: title }),
    updateLink: (link) => set({ link: link }),
    updateAuthor1: (author1) => set({ author1: author1 }),
    updateAuthor2: (author2) => set({ author2: author2 }),
    updateOrganization: (organization) => set({ organization: organization }),
    updateYear: (year) => set({ year: year }),
    updateJournal: (journal) => set({ journal: journal }),
    updateKeyFindings: (keyFindings) => set({ keyFindings: keyFindings }),
    updateMetaDescription: (metaDescription) => set({ metaDescription: metaDescription }),
    updateOnePageSummary: (onePageSummary) => set({ onePageSummary: onePageSummary }),
    updateStore: (json) => set({
        authors: json.authors,
        title: json.title,
        link: json.link,
        author1: json.author1,
        author2: json.author2,
        organization: json.organization,
        year: json.year,
        journal: json.journal,
        keyFindings: json.keyFindings,
        metaDescription: json.metaDescription,
        onePageSummary: json.onePageSummary
    }),
    reset: () => { set(store.getInitialState()) }
}));