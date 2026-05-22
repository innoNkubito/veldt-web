import { GraphQLClient } from "graphql-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function createGqlClient(getToken: () => string | null) {
  return new GraphQLClient(API_URL, {
    headers: (): Record<string, string> => {
      const token = getToken();
      if (!token) return {};
      return { authorization: `Bearer ${token}` };
    },
    errorPolicy: "all",
  });
}
