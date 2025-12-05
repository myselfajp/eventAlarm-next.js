"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchJSON } from "../lib/api";
import { EP } from "../lib/endpoints";
import { useMe } from "./useAuth";

export type FavoriteKind = "coach" | "facility" | "event";

export const defaultFavorites = {
  coach: [],
  facility: [],
  event: [],
};

const endpointMap: Record<FavoriteKind, string> = {
  coach: EP.PARTICIPANT.favoriteCoach,
  facility: EP.PARTICIPANT.favoriteFacility,
  event: EP.PARTICIPANT.favoriteEvent,
};

const payloadKeyMap: Record<FavoriteKind, string> = {
  coach: "coachId",
  facility: "facilityId",
  event: "eventId",
};

const getFavoriteId = (item: any, type: FavoriteKind) => {
  if (!item) return null;
  if (typeof item === "string") return item;

  if (type === "coach") {
    return item.coach || item._id || item.id;
  }

  return item._id || item.id || item.event || item.facility;
};

const mergeFavorites = (
  previousData: any,
  serverData: any,
  type: FavoriteKind,
  id: string,
  entity?: any
) => {
  const base =
    serverData && typeof serverData === "object"
      ? serverData
      : previousData && typeof previousData === "object"
      ? previousData
      : defaultFavorites;

  const result: Record<FavoriteKind, any[]> = {
    coach: Array.isArray(base?.coach) ? [...base.coach] : [],
    facility: Array.isArray(base?.facility) ? [...base.facility] : [],
    event: Array.isArray(base?.event) ? [...base.event] : [],
  };

  const list = result[type] || [];
  const favoriteId = id;
  let found = false;

  const updatedList = list.map((entry) => {
    if (getFavoriteId(entry, type) === favoriteId) {
      found = true;
      return entity ?? entry;
    }
    return entry;
  });

  if (!found) {
    updatedList.unshift(entity ?? favoriteId);
  }

  result[type] = updatedList;
  return result;
};

export function useFavorites() {
  const { data: user } = useMe();

  return useQuery({
    queryKey: ["favorites", user?._id],
    queryFn: async () =>
      fetchJSON(EP.PARTICIPANT.getFavorites, { method: "GET" }),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddFavorite() {
  const { data: user } = useMe();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      type,
      id,
      entity,
    }: {
      type: FavoriteKind;
      id: string;
      entity?: any;
    }) => {
      const endpoint = endpointMap[type];
      const payloadKey = payloadKeyMap[type];

      if (!endpoint || !payloadKey) {
        throw new Error("Unknown favorite type");
      }

      const response = await fetchJSON(endpoint, {
        method: "POST",
        body: { [payloadKey]: id },
      });

      return { response, type, id, entity };
    },
    onMutate: async ({ type, id, entity }) => {
      const key = ["favorites", user?._id];
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData(key);
      const previousData = (previous as any)?.data ?? previous;
      const optimistic = mergeFavorites(previousData, null, type, id, entity);

      queryClient.setQueryData(key, (old: any) => ({
        ...(old || {}),
        data: optimistic,
      }));

      return { previous, key };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },
    onSuccess: ({ response, type, id, entity }) => {
      const key = ["favorites", user?._id];
      const previous = queryClient.getQueryData(key);
      const previousData = (previous as any)?.data ?? previous;
      const merged = mergeFavorites(
        previousData,
        response?.data,
        type,
        id,
        entity
      );

      queryClient.setQueryData(key, (old: any) => ({
        ...(old || {}),
        data: merged,
      }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", user?._id] });
    },
  });
}

export function isFavorited(
  favorites: any,
  type: FavoriteKind,
  id: string
): boolean {
  const data = favorites?.data ?? favorites ?? defaultFavorites;
  const list = Array.isArray(data?.[type]) ? data[type] : [];
  return list.some((item) => getFavoriteId(item, type) === id);
}
