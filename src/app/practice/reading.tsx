import { ComprehensionSession } from '../../components/ComprehensionSession';
import { READING } from '../../data/comprehension';

export default function Reading() {
  return <ComprehensionSession skill="reading" items={READING} />;
}
