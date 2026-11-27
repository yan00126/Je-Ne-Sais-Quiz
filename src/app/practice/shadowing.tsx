import { Storage } from 'expo-sqlite/kv-store';
import { useState } from 'react';
import { View } from 'react-native';
import { DialogueShadowing } from '../../components/DialogueShadowing';
import { LevelShadowing } from '../../components/LevelShadowing';
import { Button } from '../../components/ui';

type Mode = 'level' | 'dialogues';
const MODE_KEY = 'shadowingMode';

function savedMode(): Mode {
  try {
    return Storage.getItemSync(MODE_KEY) === 'dialogues' ? 'dialogues' : 'level';
  } catch {
    return 'level';
  }
}

// Shadowing has two exercises: sentences by level, played normal, slow, then normal again, with pauses to repeat,
// and the TCF dialogues, sentence by sentence with a recording. The screen opens on the one used last.
export default function Shadowing() {
  const [mode, setMode] = useState<Mode>(savedMode);

  function choose(m: Mode) {
    setMode(m);
    try {
      Storage.setItemSync(MODE_KEY, m);
    } catch {}
  }

  const tabs = (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <View style={{ flex: 1 }}>
        <Button title="Par niveau" variant={mode === 'level' ? 'solid' : 'outline'} onPress={() => choose('level')} />
      </View>
      <View style={{ flex: 1 }}>
        <Button title="Dialogues" variant={mode === 'dialogues' ? 'solid' : 'outline'} onPress={() => choose('dialogues')} />
      </View>
    </View>
  );

  return mode === 'dialogues' ? <DialogueShadowing key="dialogues" header={tabs} /> : <LevelShadowing key="level" header={tabs} />;
}
