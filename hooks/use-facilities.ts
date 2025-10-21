import { useReducer, useEffect, useCallback, useRef } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useDebounce } from "@/hooks/use-debounce";
import {
  getFacilitiesPaginated,
  getFacilityById,
  logDatabaseLocation,
} from "@/services/database";
import type {
  FacilitiesState,
  FacilitiesAction,
  FacilityState,
  FacilityAction,
} from "@/hooks/use-facilities.types";

const PAGE_SIZE = 20;

const initialState: FacilitiesState = {
  data: [],
  searchQuery: "",
  isLoading: true,
  isLoadingMore: false,
  isRefetching: false,
  isError: false,
  error: null,
};

const facilitiesReducer = (
  state: FacilitiesState,
  action: FacilitiesAction
): FacilitiesState => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        isLoading: true,
        isError: false,
        error: null,
      };
    case "FETCH_MORE_START":
      return {
        ...state,
        isLoadingMore: true,
        isError: false,
        error: null,
      };
    case "REFETCH_START":
      return {
        ...state,
        isRefetching: true,
        isError: false,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isRefetching: false,
        isError: false,
        error: null,
      };
    case "FETCH_MORE_SUCCESS":
      return {
        ...state,
        data: [...state.data, ...action.payload],
        isLoadingMore: false,
        isError: false,
        error: null,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        isLoadingMore: false,
        isRefetching: false,
        isError: true,
        error: action.payload,
      };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      };
    default:
      return state;
  }
};

export const useFacilities = () => {
  const db = useSQLiteContext();
  const [state, dispatch] = useReducer(facilitiesReducer, initialState);

  const offsetRef = useRef(0);
  const hasMoreRef = useRef(true);

  useEffect(() => {
    logDatabaseLocation();
  }, []);

  // Unified fetch function - used for initial, search, pagination, and refresh
  const fetchFacilities = useCallback(
    async (offset: number, append: boolean, searchQuery: string) => {
      try {
        const facilities = await getFacilitiesPaginated(
          db,
          PAGE_SIZE,
          offset,
          searchQuery
        );

        // Update pagination state
        hasMoreRef.current = facilities.length === PAGE_SIZE;
        offsetRef.current = offset + facilities.length;

        if (append) {
          dispatch({ type: "FETCH_MORE_SUCCESS", payload: facilities });
        } else {
          dispatch({ type: "FETCH_SUCCESS", payload: facilities });
        }
      } catch (err) {
        dispatch({
          type: "FETCH_ERROR",
          payload: err instanceof Error ? err : new Error("Unknown error"),
        });
      }
    },
    [db]
  );

  // Debounced search handler
  const debouncedSearch = useDebounce(() => {
    dispatch({ type: "FETCH_START" });
    offsetRef.current = 0;
    hasMoreRef.current = true;
    fetchFacilities(0, false, state.searchQuery);
  }, 300);

  // Handle search query changes
  useEffect(() => {
    // If search query is empty, fetch immediately without debounce
    if (state.searchQuery === "") {
      dispatch({ type: "FETCH_START" });
      offsetRef.current = 0;
      hasMoreRef.current = true;
      fetchFacilities(0, false, "");
    } else {
      // Otherwise debounce the search
      debouncedSearch();
    }
  }, [state.searchQuery, debouncedSearch, fetchFacilities]);

  // Load more handler
  const loadMore = useCallback(async () => {
    if (!hasMoreRef.current || state.isLoadingMore || state.isLoading) {
      return;
    }

    dispatch({ type: "FETCH_MORE_START" });
    await fetchFacilities(offsetRef.current, true, state.searchQuery);
  }, [
    state.isLoadingMore,
    state.isLoading,
    state.searchQuery,
    fetchFacilities,
  ]);

  // Refresh handler
  const refetch = useCallback(async () => {
    if (state.isLoading) return;

    dispatch({ type: "REFETCH_START" });
    offsetRef.current = 0;
    hasMoreRef.current = true;
    await fetchFacilities(0, false, state.searchQuery);
  }, [state.isLoading, state.searchQuery, fetchFacilities]);

  // Search query setter
  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  }, []);

  return {
    data: state.data,
    searchQuery: state.searchQuery,
    setSearchQuery,
    isLoading: state.isLoading,
    isLoadingMore: state.isLoadingMore,
    isError: state.isError,
    error: state.error,
    refetch,
    isRefetching: state.isRefetching,
    loadMore,
  };
};

const initialFacilityState: FacilityState = {
  data: null,
  isLoading: true,
  isError: false,
  error: null,
};

const facilityReducer = (
  state: FacilityState,
  action: FacilityAction
): FacilityState => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        isLoading: true,
        isError: false,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isError: false,
        error: null,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useFacility = (id: string) => {
  const db = useSQLiteContext();
  const [state, dispatch] = useReducer(facilityReducer, initialFacilityState);

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      dispatch({ type: "FETCH_START" });
      const facility = await getFacilityById(db, id);
      dispatch({ type: "FETCH_SUCCESS", payload: facility });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err instanceof Error ? err : new Error("Unknown error"),
      });
    }
  }, [db, id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  const refetch = useCallback(async () => {
    if (!id) return;
    await fetchData();
  }, [id, fetchData]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    isError: state.isError,
    error: state.error,
    refetch,
  };
};
