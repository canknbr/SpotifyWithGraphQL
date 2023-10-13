import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Text, View } from "../../components/Themed";
import TrackListItem from "../../components/TrackListItem";

import { FontAwesome } from "@expo/vector-icons";
import { gql, useQuery } from "@apollo/client";
const query = gql`
  query MyQuery($q: String!) {
    search(q: $q) {
      tracks {
        items {
          id
          name
          preview_url
          artists {
            id
            name
          }
          album {
            id
            name
            images {
              height
              url
              width
            }
          }
        }
      }
    }
  }
`;
export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const { data, loading, error } = useQuery(query, {
    variables: { q: search },
  });

  const tracks = data?.search?.tracks?.items || [];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="search" size={16} color="gray" />
        <TextInput
          value={search}
          placeholder="What do you want to listen to?"
          onChangeText={setSearch}
          style={styles.input}
        />
        <Pressable onPress={() => setSearch("")}>
          <Text>Cancel</Text>
        </Pressable>
      </View>
      {loading && <ActivityIndicator />}
      {search && error && (
        <Text>Failed to fetch recommendations. {error.message}</Text>
      )}
      <FlatList
        data={tracks}
        renderItem={({ item }) => <TrackListItem track={item} />}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#121314",
    color: "white",
    flex: 1,
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 5,
  },
});
