"use client";

import { EP } from "./endpoints";
import { apiFetch } from "./api";

export interface Facility {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  mainSport: string;
  membershipLevel?: "Gold" | "Platinum" | "Bronze" | "Silver";
  private?: boolean;
  photo?: {
    path: string;
    originalName: string;
    mimeType: string;
    size: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SportReference {
  _id: string;
  name: string;
  group: string;
  groupName: string;
}

export async function getSports(
  pageNumber: number = 1,
  perPage: number = 100,
  search: string = ""
) {
  const res = await apiFetch(EP.REFERENCE.sport, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pageNumber, perPage, search }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || `HTTP ${res.status}`);
  }
  return body?.data || [];
}

export async function getFacilities(
  pageNumber: number = 1,
  perPage: number = 10,
  search: string = ""
) {
  const res = await apiFetch(EP.FACILITY.getFacility, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pageNumber, perPage, search }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || `HTTP ${res.status}`);
  }
  return body?.data || [];
}

export async function createFacility(formData: FormData) {
  const res = await apiFetch(EP.FACILITY.createFacility, {
    method: "POST",
    body: formData,
    // Content-Type header is automatically set by browser for FormData
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || `HTTP ${res.status}`);
  }
  return body?.data;
}

export async function updateFacility(id: string, formData: FormData) {
  const res = await apiFetch(EP.FACILITY.editFacility(id), {
    method: "PUT",
    body: formData,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || `HTTP ${res.status}`);
  }
  return body?.data;
}

export async function deleteFacility(id: string) {
  const res = await apiFetch(EP.FACILITY.deleteFacility(id), {
    method: "DELETE",
  });

  if (res.status === 204) return true;

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || `HTTP ${res.status}`);
  }
  return true;
}
