import { create } from "zustand";
import { GraphQLClient } from "graphql-request";
import { createGqlClient } from "@/lib/gql-client";

interface ClientState {
  client: GraphQLClient;
  // Called by TokenSync to hand Clerk's async getToken to the store.
  // The GQL client resolves it fresh on every request, so tokens are
  // always current after navigation without needing a page refresh.
  setGetToken: (fn: () => Promise<string | null>) => void;
}

// Module-level ref so the middleware closure always reads the latest fn.
let _getToken: () => Promise<string | null> = () => Promise.resolve(null);

const gqlClient = createGqlClient(() => _getToken());

export const useClientStore = create<ClientState>(() => ({
  client: gqlClient,

  setGetToken: (fn) => {
    _getToken = fn;
  },
}));
