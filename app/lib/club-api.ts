import { EP } from "./endpoints";
import { fetchJSON } from "./api";

export interface Club {
  _id: string;
  creator: string;
  name: string;
  vision?: string;
  conditions?: string;
  president?: string;
  coaches: string[];
  photo?: {
    path: string;
    originalName: string;
    mimeType: string;
    size: number;
  };
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  _id: string;
  owner: string;
  name: string;
  description?: string;
  clubId: string;
  clubName: string;
  photo?: {
    path: string;
    originalName: string;
    mimeType: string;
    size: number;
  };
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  perPage: number;
  pageNumber: number;
  totalPages: number;
}

export const getCreatedClubs = async (
  creatorId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Club>> => {
  return fetchJSON(EP.CLUB.getClub, {
    method: "POST",
    body: {
      creator: creatorId,
      pageNumber: page,
      perPage: limit,
    },
  });
};

export const getCreatedGroups = async (
  ownerId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Group>> => {
  return fetchJSON(EP.CLUB_GROUPS.getClubGroups, {
    method: "POST",
    body: {
      owner: ownerId,
      pageNumber: page,
      perPage: limit,
    },
  });
};
