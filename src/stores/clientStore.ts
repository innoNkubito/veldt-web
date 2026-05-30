import { create } from "zustand";
import { GraphQLClient } from "graphql-request";
import { createGqlClient } from "@/lib/gql-client";

interface ClientState {
  client: GraphQLClient | null;
  // Called by TokenSync once Clerk is loaded and signed in.
  // Flips client from null → instance, unblocking all useEffect guards.
  setGetToken: (fn: () => Promise<string | null>) => void;
  clearClient: () => void;
}

// Module-level ref so the middleware closure always reads the latest fn.
let _getToken: () => Promise<string | null> = () => Promise.resolve(null);

const gqlClient = createGqlClient(() => _getToken());

export const useClientStore = create<ClientState>((set) => ({
  client: null,

  setGetToken: (fn) => {
    _getToken = fn;
    set({ client: gqlClient });
  },

  clearClient: () => {
    _getToken = () => Promise.resolve(null);
    set({ client: null });
  },
}));
