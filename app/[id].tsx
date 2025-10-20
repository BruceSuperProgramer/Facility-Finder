import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFacility } from "@/hooks/use-facilities";

export default function FacilityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();

  const {
    data: facility,
    isLoading,
    isError,
    error,
    refetch,
  } = useFacility(id || "");

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
        <ThemedText style={styles.loadingText}>
          Loading facility details...
        </ThemedText>
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>Error loading facility</ThemedText>
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

  if (!facility) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>Facility not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.content}>
        {/* Hero Section */}
        <ThemedView
          style={[
            styles.heroSection,
            {
              backgroundColor: Colors[colorScheme ?? "light"].heroBackground,
            },
          ]}
        >
          <ThemedView
            style={[
              styles.heroIcon,
              {
                backgroundColor: Colors[colorScheme ?? "light"].iconBackground,
              },
            ]}
          >
            <Ionicons name="business" size={40} color="#fff" />
          </ThemedView>
          <ThemedText style={styles.heroTitle}>{facility.name}</ThemedText>
        </ThemedView>

        {/* Address Card */}
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: Colors[colorScheme ?? "light"].background },
          ]}
        >
          <ThemedView style={styles.cardHeader}>
            <ThemedView
              style={[
                styles.cardIconContainer,
                {
                  backgroundColor:
                    Colors[colorScheme ?? "light"].iconBackground,
                },
              ]}
            >
              <Ionicons
                name="location"
                size={24}
                color={Colors[colorScheme ?? "light"].tint}
              />
            </ThemedView>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Address
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.cardContent}>
            <ThemedText style={styles.addressText}>
              {facility.address}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Location Card */}
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: Colors[colorScheme ?? "light"].background },
          ]}
        >
          <ThemedView style={styles.cardHeader}>
            <ThemedView
              style={[
                styles.cardIconContainer,
                {
                  backgroundColor:
                    Colors[colorScheme ?? "light"].iconBackground,
                },
              ]}
            >
              <Ionicons
                name="navigate"
                size={24}
                color={Colors[colorScheme ?? "light"].tint}
              />
            </ThemedView>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Coordinates
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.cardContent}>
            <ThemedView style={styles.coordinateRow}>
              <ThemedView style={styles.coordinateItem}>
                <ThemedText style={styles.coordinateLabel}>Latitude</ThemedText>
                <ThemedText style={styles.coordinateValue}>
                  {facility.location.latitude.toFixed(6)}
                </ThemedText>
              </ThemedView>
              <ThemedView
                style={[
                  styles.coordinateDivider,
                  {
                    backgroundColor: Colors[colorScheme ?? "light"].border,
                  },
                ]}
              />
              <ThemedView style={styles.coordinateItem}>
                <ThemedText style={styles.coordinateLabel}>
                  Longitude
                </ThemedText>
                <ThemedText style={styles.coordinateValue}>
                  {facility.location.longitude.toFixed(6)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Amenities Card */}
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: Colors[colorScheme ?? "light"].background },
          ]}
        >
          <ThemedView style={styles.cardHeader}>
            <ThemedView
              style={[
                styles.cardIconContainer,
                {
                  backgroundColor:
                    Colors[colorScheme ?? "light"].iconBackground,
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={Colors[colorScheme ?? "light"].tint}
              />
            </ThemedView>
            <ThemedView style={styles.amenitiesHeader}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Amenities
              </ThemedText>
              <ThemedView
                style={[
                  styles.amenitiesCount,
                  {
                    backgroundColor:
                      Colors[colorScheme ?? "light"].heroBackground,
                  },
                ]}
              >
                <ThemedText style={styles.amenitiesCountText}>
                  {facility.facilities.length}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.cardContent}>
            <ThemedView style={styles.facilitiesGrid}>
              {facility.facilities.map((facilityItem, index) => (
                <ThemedView
                  key={index}
                  style={[
                    styles.facilityBadge,
                    {
                      backgroundColor:
                        Colors[colorScheme ?? "light"].badgeBackground,
                      borderColor: Colors[colorScheme ?? "light"].badgeBorder,
                    },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={Colors[colorScheme ?? "light"].tint}
                  />
                  <ThemedText style={styles.facilityBadgeText}>
                    {facilityItem}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  heroSection: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 180,
    marginBottom: -20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    lineHeight: 36,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardContent: {
    paddingLeft: 60,
  },
  addressText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  coordinateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  coordinateItem: {
    flex: 1,
    gap: 6,
  },
  coordinateLabel: {
    fontSize: 13,
    opacity: 0.6,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  coordinateValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  coordinateDivider: {
    width: 1,
    height: 40,
  },
  amenitiesHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  amenitiesCount: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  amenitiesCountText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  facilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1.5,
  },
  facilityBadgeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
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
});
