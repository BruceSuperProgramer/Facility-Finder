import { Pressable, StyleSheet } from "react-native";

import { Amenity } from "@/services/models/facility.types";
import { ThemedText } from "./themed-text";

export type BubbleProps = {
  amenity: Amenity;
  onPress: (amenity: Amenity) => void;
};

export function Bubble({ amenity, onPress }: BubbleProps) {
  return (
    <Pressable style={styles.container} onPress={() => onPress(amenity)}>
      <ThemedText>{amenity.name}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});
