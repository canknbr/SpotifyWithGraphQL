import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { Text, View } from "../../components/Themed";
import TrackListItem from "../../components/TrackListItem";

const query = gql`
  query MyQuery($genres: String!) {
    recommendations(seed_genres: $genres) {
      tracks {
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
            url
            height
            width
          }
        }
      }
    }
  }
`;
export default function HomeScreen() {
  const { data, loading, error } = useQuery(query, {
    variables: { genres: "rock" },
  });

  if (loading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch recommendations. {error.message}</Text>;
  }
  const tracks = data?.recommendations?.tracks || [];
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
