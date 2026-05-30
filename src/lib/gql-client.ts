import { GraphQLClient } from "graphql-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Safely converts any HeadersInit variant to a plain Record so that
// spreading a Headers instance doesn't silently drop Content-Type etc.
function headersToObject(headers: RequestInit["headers"]): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const obj: Record<string, string> = {};
    headers.forEach((v, k) => { obj[k] = v; });
    return obj;
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return headers as Record<string, string>;
}

// Accepts an async getToken so Clerk refreshes the token on every request
// rather than relying on a cached string that goes stale after navigation.
export function createGqlClient(getToken: () => Promise<string | null> | string | null) {
  return new GraphQLClient(API_URL, {
    errorPolicy: "all",
    requestMiddleware: async (request) => {
      const token = await getToken();
      return {
        ...request,
        headers: {
          ...headersToObject(request.headers),
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
      };
    },
  });
}
