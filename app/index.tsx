import { Bubble } from "@/components/bubble";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAmenities, useFacilities } from "@/hooks/use-facilities";
import type { Facility } from "@/services/database";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function FacilityListScreen() {
  const colorScheme = useColorScheme();

  const {
    data: facilities,
    searchQuery,
    setSearchQuery,
    isLoading,
    isLoadingMore,
    isError,
    error,
    refetch,
    isRefetching,
    loadMore,
  } = useFacilities();

  const renderFacilityItem = useCallback(
    ({ item }: { item: Facility }) => (
      <TouchableOpacity
        style={[
          styles.facilityCard,
          {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        ]}
        onPress={() => router.push(`/${item.id}`)}
        activeOpacity={0.7}
      >
        <ThemedView style={styles.facilityContent}>
          <ThemedView style={styles.cardHeader}>
            <ThemedView
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    Colors[colorScheme ?? "light"].iconBackground,
                },
              ]}
            >
              <Ionicons
                name="business"
                size={24}
                color={Colors[colorScheme ?? "light"].tint}
              />
            </ThemedView>
            <ThemedView style={styles.facilityInfo}>
              <ThemedText type="subtitle" style={styles.facilityName}>
                {item.name}
              </ThemedText>
              <ThemedView style={styles.addressRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={Colors[colorScheme ?? "light"].tabIconDefault}
                />
                <ThemedText style={styles.facilityAddress} numberOfLines={2}>
                  {item.address}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
          {item.facilities.length > 0 && (
            <ThemedView style={styles.facilitiesPreview}>
              <ThemedView style={styles.facilitiesRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={Colors[colorScheme ?? "light"].tint}
                />
                <ThemedText style={styles.facilitiesCount}>
                  {item.facilities.length} amenities available
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}
        </ThemedView>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors[colorScheme ?? "light"].tabIconDefault}
          style={styles.chevron}
        />
      </TouchableOpacity>
    ),
    [colorScheme]
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;

    return (
      <ThemedView style={styles.footer}>
        <ActivityIndicator
          size="small"
          color={Colors[colorScheme ?? "light"].tint}
        />
        <ThemedText style={styles.loadingText}>Loading more...</ThemedText>
      </ThemedView>
    );
  }, [isLoadingMore, colorScheme]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme ?? "light"].tint}
          />
          <ThemedText style={styles.loadingText}>
            Loading facilities...
          </ThemedText>
        </ThemedView>
      );
    }

    if (isError) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>
            Error loading facilities
          </ThemedText>
          <ThemedText style={styles.errorDetail}>
            {error instanceof Error ? error.message : "Unknown error"}
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: Colors[colorScheme ?? "light"].tint },
            ]}
            onPress={() => refetch()}
          >
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );
    }

    if (searchQuery.trim() && facilities.length === 0) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.emptyText}>
            No facilities found matching &ldquo;{searchQuery}&rdquo;
          </ThemedText>
        </ThemedView>
      );
    }

    return null;
  }, [
    isLoading,
    isError,
    error,
    searchQuery,
    facilities.length,
    colorScheme,
    refetch,
  ]);

  const { amenities } = useAmenities();

  const renderBubbles = useCallback(() => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bubblesContainer}
      >
        {amenities.map((amenity) => (
          <Bubble
            key={amenity.id}
            amenity={amenity}
            onPress={(amenity) => setSearchQuery(amenity.name)}
          />
        ))}
      </ScrollView>
    );
  }, [amenities, setSearchQuery]);

  const renderSearchBar = useCallback(() => {
    return (
      <ThemedView style={styles.searchContainer}>
        <ThemedView
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: Colors[colorScheme ?? "light"].background,
              borderColor: Colors[colorScheme ?? "light"].tint,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={Colors[colorScheme ?? "light"].tabIconDefault}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              {
                color: Colors[colorScheme ?? "light"].text,
              },
            ]}
            placeholder="Search by facility name or amenity..."
            placeholderTextColor={Colors[colorScheme ?? "light"].tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors[colorScheme ?? "light"].tabIconDefault}
              />
            </TouchableOpacity>
          )}
        </ThemedView>
        {renderBubbles()}
      </ThemedView>
    );
  }, [colorScheme, renderBubbles, searchQuery, setSearchQuery]);

  return (
    <ThemedView style={styles.container}>
      {renderSearchBar()}
      <FlashList
        data={facilities}
        renderItem={renderFacilityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors[colorScheme ?? "light"].tint}
          />
        }
      />
      {!isLoading && !isError && facilities.length > 0 && (
        <ThemedView
          style={[
            styles.resultsContainer,
            {
              borderTopColor: Colors[colorScheme ?? "light"].border,
              backgroundColor: Colors[colorScheme ?? "light"].background,
            },
          ]}
        >
          <ThemedText style={styles.resultsText}>
            {searchQuery.trim()
              ? `Showing ${facilities.length} result${
                  facilities.length !== 1 ? "s" : ""
                }`
              : `Showing ${facilities.length} facilit${
                  facilities.length !== 1 ? "ies" : "y"
                }`}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  facilityCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  facilityContent: {
    flex: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  facilityInfo: {
    flex: 1,
    gap: 6,
  },
  facilityName: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  facilityAddress: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
    lineHeight: 20,
  },
  facilitiesPreview: {
    paddingLeft: 60,
  },
  facilitiesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  facilitiesCount: {
    fontSize: 13,
    opacity: 0.6,
    fontWeight: "500",
  },
  chevron: {
    opacity: 0.3,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
    gap: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    minHeight: 400,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.6,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#ff3b30",
  },
  errorDetail: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: "center",
  },
  resultsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  resultsText: {
    fontSize: 13,
    textAlign: "center",
    opacity: 0.6,
    fontWeight: "500",
  },
  bubblesContainer: {
    gap: 8,
    paddingVertical: 8,
  },
});
