import { View } from 'react-native';
import { Button } from './ui';
import { makeStyles } from '../theme/ThemeProvider';

// Tâche 1 / 2 / 3 switcher, with a tick on the tasks done today.
export function TaskTabs({ current, done, onPick }: { current: 1 | 2 | 3; done: (n: 1 | 2 | 3) => boolean; onPick: (n: 1 | 2 | 3) => void }) {
  const styles = useStyles();
  return (
    <View style={styles.tabs}>
      {([1, 2, 3] as const).map((n) => (
        <View key={n} style={{ flex: 1 }}>
          <Button title={`${done(n) ? '✓ ' : ''}Tâche ${n}`} variant={n === current ? 'solid' : 'outline'} onPress={() => onPick(n)} />
        </View>
      ))}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  tabs: { flexDirection: 'row', gap: 8 },
}));
