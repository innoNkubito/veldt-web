import { GraphQLClient } from "graphql-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Accepts an async getToken so Clerk can refresh the token on every request
// rather than relying on a cached string that may be stale after navigation.
export function createGqlClient(getToken: () => Promise<string | null> | string | null) {
  return new GraphQLClient(API_URL, {
    errorPolicy: "all",
    requestMiddleware: async (request) => {
      const token = await getToken();
      return {
        ...request,
        headers: {
          ...request.headers,
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
      };
    },
  });
}
