// Task formats follow the TCF Canada expression tests as we understand them;
// double-check word counts and timings against France Éducation international's official guide.

export type WritingTask = {
  id: string;
  task: 1 | 2 | 3;
  minWords: number;
  maxWords: number;
  prompt: string;
};

export type SpeakingTask = {
  id: string;
  task: 1 | 2 | 3;
  seconds: number;
  title: string;
  prompt: string;
};

export const WRITING_TASKS: WritingTask[] = [
  {
    id: 'w1-001',
    task: 1,
    minWords: 60,
    maxWords: 120,
    prompt:
      'Vous venez d’emménager dans un nouvel appartement. Écrivez un message à un ami pour l’inviter à votre pendaison de crémaillère. ' +
      'Précisez la date, l’heure, l’adresse et ce qu’il peut apporter.',
  },
  {
    id: 'w2-001',
    task: 2,
    minWords: 120,
    maxWords: 150,
    prompt:
      'Vous écrivez un article pour le blogue de votre quartier. Racontez une activité bénévole à laquelle vous avez participé ' +
      'et expliquez ce qu’elle vous a apporté.',
  },
  {
    id: 'w3-001',
    task: 3,
    minWords: 120,
    maxWords: 180,
    prompt:
      'Document 1 : « Le télétravail améliore la qualité de vie des employés. » ' +
      'Document 2 : « Le télétravail isole les travailleurs et nuit à l’esprit d’équipe. » ' +
      'Présentez brièvement les deux points de vue, puis donnez votre opinion argumentée sur le télétravail.',
  },
];

export const SPEAKING_TASKS: SpeakingTask[] = [
  {
    id: 's1-001',
    task: 1,
    seconds: 120,
    title: 'Entretien dirigé',
    prompt: 'Présentez-vous : votre parcours, votre travail ou vos études, vos loisirs et vos projets au Canada.',
  },
  {
    id: 's2-001',
    task: 2,
    seconds: 330,
    title: 'Exercice en interaction',
    prompt:
      'Vous voulez vous inscrire à un club de sport près de chez vous. Posez des questions à l’employé ' +
      '(horaires, prix, activités, conditions d’inscription). Enregistrez vos questions comme si vous parliez à l’employé.',
  },
  {
    id: 's3-001',
    task: 3,
    seconds: 270,
    title: 'Expression d’un point de vue',
    prompt: '« Les réseaux sociaux rapprochent les gens. » Êtes-vous d’accord ? Donnez votre opinion avec des arguments et des exemples.',
  },
];
