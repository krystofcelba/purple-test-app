import React, { memo, useCallback } from "react";
import { Cell } from "react-native-tableview-simple";

import { SwapiCharacter } from "../../state";

type Props = {
  character: SwapiCharacter;
  isParticipant: boolean;
  onPress?: (character: SwapiCharacter) => void;
};

const CharacterItem = ({
  character,
  onPress = () => {},
  isParticipant,
}: Props) => {
  const onPressCallback = useCallback(
    () => onPress(character),
    [character, onPress]
  );

  return (
    <Cell
      title={character.name}
      accessory={isParticipant && "Checkmark"}
      onPress={onPressCallback}
    />
  );
};

export default memo(CharacterItem);
