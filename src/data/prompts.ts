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
  {
    id: 'w1-002',
    task: 1,
    minWords: 60,
    maxWords: 120,
    prompt:
      'Votre voisin fait souvent du bruit tard le soir. Écrivez-lui un message poli pour lui expliquer le problème et proposer une solution.',
  },
  {
    id: 'w1-003',
    task: 1,
    minWords: 60,
    maxWords: 120,
    prompt:
      'Vous ne pouvez pas aller au cours de français de samedi. Écrivez un courriel à votre professeure pour vous excuser, expliquer pourquoi et demander ce que vous devez faire pour rattraper le cours.',
  },
  {
    id: 'w2-002',
    task: 2,
    minWords: 120,
    maxWords: 150,
    prompt:
      'Vous écrivez sur un forum pour les nouveaux arrivants. Racontez votre premier hiver au Canada : ce qui vous a surpris, les difficultés et vos conseils.',
  },
  {
    id: 'w2-003',
    task: 2,
    minWords: 120,
    maxWords: 150,
    prompt:
      'Un magazine demande à ses lecteurs de raconter une rencontre qui a changé leur vie. Écrivez votre témoignage.',
  },
  {
    id: 'w3-002',
    task: 3,
    minWords: 120,
    maxWords: 180,
    prompt:
      'Document 1 : « Les transports en commun gratuits réduiraient la pollution et aideraient les familles à faible revenu. » ' +
      'Document 2 : « La gratuité coûterait trop cher et il vaut mieux améliorer la fréquence du service. » ' +
      'Présentez brièvement les deux points de vue, puis donnez votre opinion argumentée.',
  },
  {
    id: 'w3-003',
    task: 3,
    minWords: 120,
    maxWords: 180,
    prompt:
      'Document 1 : « Apprendre une deuxième langue dès la maternelle aide les enfants à réussir. » ' +
      'Document 2 : « Les jeunes enfants doivent d’abord bien maîtriser leur langue maternelle. » ' +
      'Présentez brièvement les deux points de vue, puis donnez votre opinion argumentée.',
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
  {
    id: 's1-002',
    task: 1,
    seconds: 120,
    title: 'Entretien dirigé',
    prompt: 'Parlez de votre ville d’origine : où elle se trouve, ce qu’on peut y faire, ce qui vous manque et ce qui ne vous manque pas.',
  },
  {
    id: 's1-003',
    task: 1,
    seconds: 120,
    title: 'Entretien dirigé',
    prompt: 'Décrivez une journée typique pour vous : le matin, le travail ou les études, le soir. Qu’aimeriez-vous changer ?',
  },
  {
    id: 's2-002',
    task: 2,
    seconds: 330,
    title: 'Exercice en interaction',
    prompt:
      'Vous cherchez un appartement et vous appelez le propriétaire d’une annonce. Posez-lui des questions (prix, charges, quartier, date de disponibilité, animaux, visite).',
  },
  {
    id: 's2-003',
    task: 2,
    seconds: 330,
    title: 'Exercice en interaction',
    prompt:
      'Un ami québécois organise un voyage en Gaspésie et vous propose de venir. Posez-lui des questions pour décider (dates, transport, logement, budget, activités).',
  },
  {
    id: 's3-002',
    task: 3,
    seconds: 270,
    title: 'Expression d’un point de vue',
    prompt: '« Le télétravail devrait devenir la norme pour tous les emplois de bureau. » Qu’en pensez-vous ? Donnez des arguments et des exemples.',
  },
  {
    id: 's3-003',
    task: 3,
    seconds: 270,
    title: 'Expression d’un point de vue',
    prompt: '« Pour bien s’intégrer dans un nouveau pays, il faut parler la langue locale même à la maison. » Êtes-vous d’accord ?',
  },
];
