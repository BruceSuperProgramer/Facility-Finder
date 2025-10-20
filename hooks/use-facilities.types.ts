import type { Facility } from "@/services/models/facility.types";

export interface FacilitiesState {
  data: Facility[];
  searchQuery: string;
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefetching: boolean;
  isError: boolean;
  error: Error | null;
}

export type FacilitiesAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_MORE_START" }
  | { type: "REFETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Facility[] }
  | { type: "FETCH_MORE_SUCCESS"; payload: Facility[] }
  | { type: "FETCH_ERROR"; payload: Error }
  | { type: "SET_SEARCH_QUERY"; payload: string };

export interface FacilityState {
  data: Facility | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export type FacilityAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Facility | null }
  | { type: "FETCH_ERROR"; payload: Error };
