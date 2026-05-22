import { create } from "zustand";
import { gql } from "graphql-request";
import { useClientStore } from "./clientStore";

// ─── Types ────────────────────────────────────────────────────
export interface Itinerary {
  id: string;
  proposalTitle: string;
  preparedFor: string | null;
  travelDates: string | null;
  status: string;
  builderMode: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Queries ──────────────────────────────────────────────────
const GET_ITINERARIES = gql`
  query GetItineraries($status: ItineraryStatus) {
    itineraries(status: $status) {
      id
      proposalTitle
      preparedFor
      travelDates
      status
      builderMode
      slug
      createdAt
      updatedAt
    }
  }
`;

const CREATE_ITINERARY = gql`
  mutation CreateItinerary($input: CreateItineraryInput!) {
    createItinerary(input: $input) {
      id
      proposalTitle
      status
      slug
      builderMode
    }
  }
`;

// ─── Store ────────────────────────────────────────────────────
interface ItineraryState {
  itineraries: Itinerary[];
  loading: boolean;
  error: string | null;

  fetchItineraries: (status?: string) => Promise<void>;
  createItinerary: (input: {
    proposalTitle: string;
    preparedFor?: string;
    travelDates?: string;
    assignedToId?: string;
  }) => Promise<Itinerary | null>;
}

export const useItineraryStore = create<ItineraryState>((set) => ({
  itineraries: [],
  loading: false,
  error: null,

  fetchItineraries: async (status) => {
    const client = useClientStore.getState().client;
    if (!client) return;

    set({ loading: true, error: null });
    try {
      const data = await client.request<{ itineraries: Itinerary[] }>(
        GET_ITINERARIES,
        { status },
      );
      set({ itineraries: data.itineraries, loading: false });
    } catch (err: any) {
      set({
        error:
          err?.response?.errors?.[0]?.message ?? "Failed to fetch itineraries",
        loading: false,
      });
    }
  },

  createItinerary: async (input) => {
    const client = useClientStore.getState().client;
    if (!client) return null;

    try {
      const data = await client.request<{ createItinerary: Itinerary }>(
        CREATE_ITINERARY,
        { input },
      );
      // Prepend new itinerary to the list
      set((state) => ({
        itineraries: [data.createItinerary, ...state.itineraries],
      }));
      return data.createItinerary;
    } catch (err: any) {
      set({
        error:
          err?.response?.errors?.[0]?.message ?? "Failed to create itinerary",
      });
      return null;
    }
  },
}));
