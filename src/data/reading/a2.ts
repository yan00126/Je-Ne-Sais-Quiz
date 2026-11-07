import type { ComprehensionItem } from '../comprehension.ts';

// A2 reading: short everyday documents (notices, ads, messages, schedules), like the first TCF questions.
export const READING_A2: ComprehensionItem[] = [
  {
    id: 'r013',
    level: 'A2',
    title: 'Message de la garderie',
    text:
      'Bonjour aux parents,\n\nLa garderie sera fermée le lundi 9 octobre pour l’Action de grâce. ' +
      'Le vendredi 6, nous organisons une petite fête avec les enfants : chaque enfant peut apporter un fruit à partager. ' +
      'Merci de ne pas envoyer de bonbons ni d’arachides, à cause des allergies.\n\nL’équipe de la garderie Les Petits Pas',
    questions: [
      {
        prompt: 'Pourquoi la garderie est-elle fermée le 9 octobre ?',
        choices: ['Pour des travaux', 'Pour un jour férié', 'Pour une fête avec les enfants', 'À cause d’une tempête'],
        answer: 1,
        explanation: 'L’Action de grâce est un jour férié au Canada. La fête avec les enfants a lieu le vendredi 6, pas le 9.',
      },
      {
        prompt: 'Qu’est-ce que les enfants peuvent apporter le vendredi ?',
        choices: ['Des bonbons', 'Un jouet', 'Un fruit', 'Des arachides'],
        answer: 2,
        explanation: '« Chaque enfant peut apporter un fruit à partager. » Les bonbons et les arachides sont interdits.',
      },
      {
        prompt: 'Qui a écrit ce message ?',
        choices: ['Un parent', 'L’équipe de la garderie', 'La ville', 'Un enfant'],
        answer: 1,
        explanation: 'Le message est signé « L’équipe de la garderie Les Petits Pas » et commence par « Bonjour aux parents ».',
      },
    ],
  },
  {
    id: 'r014',
    level: 'A2',
    title: 'Horaire de la bibliothèque',
    text:
      'Bibliothèque municipale – Horaire d’hiver\n\nLundi : fermé\nMardi au vendredi : 10 h à 20 h\nSamedi et dimanche : 10 h à 17 h\n\n' +
      'Le prêt de livres est gratuit pour les résidents de la ville. Il faut présenter une preuve d’adresse pour obtenir une carte. ' +
      'Vous pouvez emprunter dix documents pour trois semaines.',
    questions: [
      {
        prompt: 'Quel jour la bibliothèque est-elle fermée ?',
        choices: ['Le lundi', 'Le mardi', 'Le samedi', 'Le dimanche'],
        answer: 0,
        explanation: '« Lundi : fermé. »',
      },
      {
        prompt: 'Que faut-il pour obtenir une carte de bibliothèque ?',
        choices: ['Payer dix dollars', 'Une preuve d’adresse', 'Un passeport', 'Une photo'],
        answer: 1,
        explanation: '« Il faut présenter une preuve d’adresse pour obtenir une carte. » Le prêt est gratuit.',
      },
      {
        prompt: 'Combien de temps peut-on garder un livre ?',
        choices: ['Une semaine', 'Dix jours', 'Deux semaines', 'Trois semaines'],
        answer: 3,
        explanation: '« Dix documents pour trois semaines » : dix est le nombre de documents, pas la durée.',
      },
    ],
  },
  {
    id: 'r015',
    level: 'A2',
    title: 'Texto d’une amie',
    text:
      'Salut Léa ! Je suis désolée, je ne pourrai pas venir au cinéma ce soir. Mon fils a de la fièvre et je reste avec lui. ' +
      'Est-ce qu’on peut y aller samedi après-midi à la place ? Je t’invite au café après le film pour me faire pardonner. Bisous, Nadia',
    questions: [
      {
        prompt: 'Pourquoi Nadia annule-t-elle ?',
        choices: ['Elle doit travailler', 'Son fils est malade', 'Elle n’aime pas le film', 'Elle est fatiguée'],
        answer: 1,
        explanation: '« Mon fils a de la fièvre et je reste avec lui. » Avoir de la fièvre = être malade.',
      },
      {
        prompt: 'Que propose Nadia ?',
        choices: ['D’aller au cinéma samedi', 'De regarder un film chez elle', 'D’aller au restaurant ce soir', 'D’annuler le café'],
        answer: 0,
        explanation: '« Est-ce qu’on peut y aller samedi après-midi à la place ? » « Y » = au cinéma.',
      },
      {
        prompt: 'Que fera Nadia pour s’excuser ?',
        choices: ['Elle paiera le billet de cinéma', 'Elle invitera Léa au café', 'Elle préparera un souper', 'Elle offrira un cadeau'],
        answer: 1,
        explanation: '« Je t’invite au café après le film pour me faire pardonner. » Se faire pardonner = s’excuser.',
      },
    ],
  },
  {
    id: 'r016',
    level: 'A2',
    title: 'Avis de la ville : déneigement',
    text:
      'Opération de déneigement cette nuit\n\nLe déneigement de votre rue aura lieu cette nuit entre 19 h et 7 h. ' +
      'Il est interdit de stationner dans la rue pendant ces heures. Les voitures mal garées seront remorquées aux frais du propriétaire. ' +
      'Des places sont disponibles gratuitement dans le stationnement de l’aréna.',
    questions: [
      {
        prompt: 'Qu’est-ce qui est interdit cette nuit ?',
        choices: ['Marcher sur le trottoir', 'Stationner dans la rue', 'Sortir après 19 h', 'Utiliser l’aréna'],
        answer: 1,
        explanation: '« Il est interdit de stationner dans la rue pendant ces heures. »',
      },
      {
        prompt: 'Que se passe-t-il si une voiture reste dans la rue ?',
        choices: ['Elle sera déneigée', 'Le conducteur recevra un avertissement', 'Elle sera remorquée', 'Rien'],
        answer: 2,
        explanation: '« Remorquer » = emmener une voiture avec une dépanneuse. « Aux frais du propriétaire » : c’est lui qui paie.',
      },
      {
        prompt: 'Où peut-on laisser sa voiture ?',
        choices: ['Dans le stationnement de l’aréna', 'Devant sa maison', 'Dans une autre rue', 'Au garage municipal, en payant'],
        answer: 0,
        explanation: '« Des places sont disponibles gratuitement dans le stationnement de l’aréna. »',
      },
    ],
  },
  {
    id: 'r017',
    level: 'A2',
    title: 'Offre d’emploi : épicerie',
    text:
      'L’épicerie Chez Martin cherche un caissier ou une caissière à temps partiel. ' +
      'Horaire : jeudi et vendredi soir, et samedi toute la journée. Salaire : 17,50 $ de l’heure. ' +
      'Aucune expérience nécessaire, formation sur place. Vous devez parler français et un peu anglais. ' +
      'Déposez votre CV à la caisse ou envoyez-le à emplois@chezmartin.ca.',
    questions: [
      {
        prompt: 'Quel type de poste est offert ?',
        choices: ['Un poste à temps plein', 'Un poste de gérant', 'Un poste à temps partiel', 'Un stage non payé'],
        answer: 2,
        explanation: '« À temps partiel » : seulement quelques jours par semaine.',
      },
      {
        prompt: 'Qu’est-ce qui est demandé aux candidats ?',
        choices: ['De l’expérience en caisse', 'Un diplôme', 'Une voiture', 'De parler français'],
        answer: 3,
        explanation: '« Aucune expérience nécessaire », mais « vous devez parler français et un peu anglais ».',
      },
      {
        prompt: 'Comment peut-on postuler ?',
        choices: ['Par téléphone', 'En remettant son CV au magasin ou par courriel', 'En remplissant un formulaire en ligne', 'En se présentant à une entrevue samedi'],
        answer: 1,
        explanation: '« Déposez votre CV à la caisse ou envoyez-le à emplois@chezmartin.ca. » Postuler = poser sa candidature.',
      },
    ],
  },
  {
    id: 'r018',
    level: 'A2',
    title: 'Rappel de rendez-vous',
    text:
      'Clinique dentaire Sourire\n\nRappel : vous avez un rendez-vous le mercredi 15 novembre à 14 h 30 avec la Dre Tremblay. ' +
      'Merci d’arriver dix minutes à l’avance et d’apporter votre carte d’assurance. ' +
      'Pour annuler, appelez-nous au moins 24 heures avant, sinon des frais de 50 $ s’appliquent.',
    questions: [
      {
        prompt: 'À quelle heure faut-il arriver ?',
        choices: ['À 14 h', 'À 14 h 20', 'À 14 h 30', 'À 14 h 40'],
        answer: 1,
        explanation: 'Le rendez-vous est à 14 h 30 et il faut « arriver dix minutes à l’avance » : 14 h 20.',
      },
      {
        prompt: 'Que se passe-t-il si on annule le matin même ?',
        choices: ['On doit payer 50 $', 'On perd sa carte d’assurance', 'Le rendez-vous est déplacé', 'Rien, c’est gratuit'],
        answer: 0,
        explanation: 'Il faut annuler « au moins 24 heures avant, sinon des frais de 50 $ s’appliquent ».',
      },
      {
        prompt: 'Que faut-il apporter au rendez-vous ?',
        choices: ['Sa carte d’assurance', '50 $', 'Une pièce d’identité avec photo', 'Une ordonnance'],
        answer: 0,
        explanation: '« Merci […] d’apporter votre carte d’assurance. » Les 50 $ sont des frais d’annulation.',
      },
    ],
  },
  {
    id: 'r019',
    level: 'A2',
    title: 'Cours de français gratuits',
    text:
      'Le centre communautaire du quartier offre des cours de français gratuits pour les nouveaux arrivants. ' +
      'Les cours ont lieu le lundi et le mercredi, de 18 h 30 à 20 h 30. Un service de garde est offert pour les enfants de 3 à 10 ans. ' +
      'Inscription obligatoire avant le 30 août, en personne, avec une pièce d’identité.',
    questions: [
      {
        prompt: 'À qui s’adressent ces cours ?',
        choices: ['Aux enfants', 'Aux nouveaux arrivants', 'Aux enseignants', 'Aux touristes'],
        answer: 1,
        explanation: '« Des cours de français gratuits pour les nouveaux arrivants. »',
      },
      {
        prompt: 'Qu’est-ce qui est proposé aux parents ?',
        choices: ['Un repas', 'Un transport', 'Un service de garde', 'Un dictionnaire'],
        answer: 2,
        explanation: '« Un service de garde est offert pour les enfants » : quelqu’un s’occupe des enfants pendant le cours.',
      },
      {
        prompt: 'Comment s’inscrire ?',
        choices: ['En ligne', 'Par téléphone', 'Le premier jour du cours', 'Sur place, avec une pièce d’identité'],
        answer: 3,
        explanation: '« Inscription obligatoire avant le 30 août, en personne, avec une pièce d’identité. » En personne = sur place.',
      },
    ],
  },
  {
    id: 'r020',
    level: 'A2',
    title: 'Courriel d’un voisin',
    text:
      'Bonjour Madame Chen,\n\nJe pars en vacances au Mexique du 3 au 17 février. ' +
      'Pourriez-vous ramasser mon courrier et arroser mes plantes deux fois par semaine ? ' +
      'Je vous laisse ma clé dans votre boîte aux lettres. Je vous rapporterai un petit souvenir !\n\nMerci beaucoup,\nPaul, appartement 4',
    questions: [
      {
        prompt: 'Combien de temps Paul part-il ?',
        choices: ['Trois jours', 'Une semaine', 'Deux semaines', 'Un mois'],
        answer: 2,
        explanation: 'Du 3 au 17 février : quatorze jours, donc deux semaines.',
      },
      {
        prompt: 'Que demande Paul à Madame Chen ?',
        choices: ['De garder son chat', 'De s’occuper de son courrier et de ses plantes', 'De nettoyer son appartement', 'De l’amener à l’aéroport'],
        answer: 1,
        explanation: '« Ramasser mon courrier et arroser mes plantes. »',
      },
      {
        prompt: 'Comment Madame Chen pourra-t-elle entrer chez Paul ?',
        choices: ['Le concierge ouvrira la porte', 'Paul laissera la porte ouverte', 'La clé sera dans sa boîte aux lettres', 'Elle a déjà une clé'],
        answer: 2,
        explanation: '« Je vous laisse ma clé dans votre boîte aux lettres. » « Votre » = celle de Madame Chen.',
      },
    ],
  },
];
