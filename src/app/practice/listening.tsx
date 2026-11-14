import { Storage } from 'expo-sqlite/kv-store';
import { useState } from 'react';
import { View } from 'react-native';
import { ComprehensionSession } from '../../components/ComprehensionSession';
import { NumberDictation } from '../../components/NumberDictation';
import { Button } from '../../components/ui';
import { LISTENING } from '../../data/comprehension';

type Mode = 'documents' | 'numbers';
const MODE_KEY = 'listeningMode';

function savedMode(): Mode {
  try {
    return Storage.getItemSync(MODE_KEY) === 'numbers' ? 'numbers' : 'documents';
  } catch {
    return 'documents';
  }
}

// Listening has two exercises: TCF-style documents with questions, and number dictation.
// The screen opens on the one used last.
export default function Listening() {
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
        <Button title="Documents" variant={mode === 'documents' ? 'solid' : 'outline'} onPress={() => choose('documents')} />
      </View>
      <View style={{ flex: 1 }}>
        <Button title="Nombres" variant={mode === 'numbers' ? 'solid' : 'outline'} onPress={() => choose('numbers')} />
      </View>
    </View>
  );

  return mode === 'numbers' ? (
    <NumberDictation key="numbers" header={tabs} />
  ) : (
    <ComprehensionSession key="documents" skill="listening" items={LISTENING} header={tabs} />
  );
}
