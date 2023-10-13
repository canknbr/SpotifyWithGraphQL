import { StyleSheet, FlatList } from "react-native";

import { Text, View } from "../../components/Themed";
import TrackListItem from "../../components/TrackListItem";
import { tracks } from "../../../assets/data/tracks";
export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={tracks}
        renderItem={({ item }) => <TrackListItem track={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
