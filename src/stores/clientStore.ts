import { create } from "zustand";
import { GraphQLClient } from "graphql-request";
import { createGqlClient } from "@/lib/gql-client";

interface ClientState {
  client: GraphQLClient | null;
  token: string | null;
  setToken: (token: string | null) => void;
}

const lazyClient = createGqlClient(() => useClientStore.getState().token);

export const useClientStore = create<ClientState>((set) => ({
  client: null,
  token: null,

  setToken: (token) => {
    set({
      token,
      client: token ? lazyClient : null,
    });
  },
}));
