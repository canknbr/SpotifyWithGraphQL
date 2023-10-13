import { View, Text } from "react-native";
import React, {
  useState,
  useContext,
  createContext,
  PropsWithChildren,
} from "react";
import { Track } from "../types";
type PlayerContextType = {
  track?: Track;
  setTrack: (track: Track) => void;
};

const PlayerContext = createContext<PlayerContextType>({
  track: undefined,
  setTrack: () => {},
});
const PlayerProvider = ({ children }: PropsWithChildren) => {
  const [track, setTrack] = useState<Track>();
  return (
    <PlayerContext.Provider value={{ track, setTrack }}>
      {children}
    </PlayerContext.Provider>
  );
};
export const usePlayerContext = () => useContext(PlayerContext);
export default PlayerProvider;
