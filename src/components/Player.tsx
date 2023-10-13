import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AVPlaybackStatus, Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import { gql, useMutation, useQuery } from "@apollo/client";

import { usePlayerContext } from "../providers/PlayerProvider";
import { useState, useEffect } from "react";
const insertFavoriteMutation = gql`
  mutation MyMutation($trackid: String!, $userid: String!) {
    insertFavorites(trackid: $trackid, userid: $userid) {
      id
      trackid
      userid
    }
  }
`;
const removeFavoriteMutation = gql`
  mutation MyMutation($trackid: String!, $userid: String!) {
    deleteFavorites(trackid: $trackid, userid: $userid) {
      id
    }
  }
`;

const isFavoriteQuery = gql`
  query MyQuery($trackid: String!, $userid: String!) {
    favoritesByTrackidAndUserid(trackid: $trackid, userid: $userid) {
      id
      trackid
      userid
    }
  }
`;

const Player = () => {
  const [sound, setSound] = useState<Sound>();
  const [isPlaying, setIsPlaying] = useState(false);

  const { track } = usePlayerContext();
  const [insertFavorite] = useMutation(insertFavoriteMutation);
  const [removeFavorite] = useMutation(removeFavoriteMutation);
  const { data, refetch } = useQuery(isFavoriteQuery, {
    variables: { userid: "can", trackid: track?.id || "" },
  });

  const isLiked = data?.favoritesByTrackidAndUserid.length > 0;

  useEffect(() => {
    playTrack();
  }, [track]);
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
    }

    if (!track?.preview_url) {
      return;
    }
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: track.preview_url,
    });

    setSound(newSound);
    newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    await newSound.playAsync();
  };
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      return;
    }

    setIsPlaying(status.isPlaying);
  };

  const onPlayPause = async () => {
    if (!sound) {
      return;
    }
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };
  const onLike = async () => {
    if (!track) {
      return;
    }
    if (isLiked) {
      await removeFavorite({
        variables: { trackid: track.id, userid: "can" },
      });
    } else {
      await insertFavorite({
        variables: { userid: "can", trackid: track?.id },
      });
    }
    refetch();
  };
  if (!track) {
    return null;
  }
  const image = track?.album.images?.[0];

  return (
    <View style={styles.container}>
      <View style={styles.player}>
        {image && <Image source={{ uri: image.url }} style={styles.image} />}

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{track?.name}</Text>
          <Text style={styles.subtitle}>{track?.artists[0]?.name}</Text>
        </View>

        <Ionicons
          onPress={() => onLike()}
          name={isLiked ? "heart" : "heart-outline"}
          size={20}
          color={"white"}
          style={{ marginHorizontal: 10 }}
        />
        <Ionicons
          onPress={onPlayPause}
          disabled={!track?.preview_url}
          name={isPlaying ? "pause" : "play"}
          size={22}
          color={track?.preview_url ? "white" : "gray"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    top: -75,
    height: 75,
    padding: 10,
  },
  player: {
    backgroundColor: "#286660",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    padding: 3,
    paddingRight: 15,
  },
  title: {
    color: "white",
  },
  subtitle: {
    color: "lightgray",
    fontSize: 12,
  },
  image: {
    height: "100%",
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 5,
  },
});

export default Player;
