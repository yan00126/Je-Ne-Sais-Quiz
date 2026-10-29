import { ComprehensionSession } from '../../components/ComprehensionSession';
import { LISTENING } from '../../data/comprehension';

export default function Listening() {
  return <ComprehensionSession skill="listening" items={LISTENING} />;
}
