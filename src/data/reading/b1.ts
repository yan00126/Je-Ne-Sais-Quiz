import type { ComprehensionItem } from '../comprehension.ts';

// B1 reading: short articles, letters and practical guides where the answer needs a sentence understood, not a word spotted.
export const READING_B1: ComprehensionItem[] = [
  {
    id: 'r021',
    level: 'B1',
    title: 'Les jardins communautaires',
    text:
      'De plus en plus de citadins cultivent leurs propres légumes dans des jardins communautaires. ' +
      'Pour une vingtaine de dollars par saison, la ville loue une petite parcelle de terre aux résidents. ' +
      'Les jardiniers apprécient surtout le contact avec la nature et les rencontres avec leurs voisins. ' +
      'Le problème, c’est la demande : dans certains quartiers, il faut attendre plus de trois ans avant d’obtenir une place. ' +
      'La ville promet d’ouvrir cinq nouveaux jardins d’ici deux ans.',
    questions: [
      {
        prompt: 'Selon le texte, qu’est-ce que les jardiniers aiment le plus ?',
        choices: ['Économiser de l’argent', 'Vendre leurs légumes', 'La nature et les relations avec les voisins', 'Faire du sport'],
        answer: 2,
        explanation: '« Les jardiniers apprécient surtout le contact avec la nature et les rencontres avec leurs voisins. »',
      },
      {
        prompt: 'Quel est le principal problème ?',
        choices: ['Le prix trop élevé', 'Il n’y a pas assez de places', 'Le mauvais climat', 'Le manque d’eau'],
        answer: 1,
        explanation: 'Il faut parfois « attendre plus de trois ans » : la demande est plus forte que le nombre de places.',
      },
      {
        prompt: 'Que va faire la ville ?',
        choices: ['Augmenter le prix', 'Fermer certains jardins', 'Créer de nouveaux jardins', 'Vendre les terrains'],
        answer: 2,
        explanation: '« La ville promet d’ouvrir cinq nouveaux jardins d’ici deux ans. »',
      },
    ],
  },
  {
    id: 'r022',
    level: 'B1',
    title: 'Lettre de plainte',
    text:
      'Madame, Monsieur,\n\nLe 2 mars, j’ai commandé un manteau d’hiver sur votre site. ' +
      'J’ai reçu le colis avec dix jours de retard, et le manteau était de la mauvaise taille. ' +
      'J’ai appelé votre service à la clientèle trois fois, sans obtenir de réponse. ' +
      'Je vous demande donc de me rembourser la totalité de mon achat, y compris les frais de livraison. ' +
      'Sans réponse de votre part d’ici quinze jours, je m’adresserai à l’Office de la protection du consommateur.\n\nSophie Gagnon',
    questions: [
      {
        prompt: 'Quels problèmes Sophie a-t-elle eus ?',
        choices: [
          'Le manteau était abîmé et trop cher',
          'Le colis est arrivé en retard et la taille était mauvaise',
          'Le colis n’est jamais arrivé',
          'Elle a reçu deux manteaux',
        ],
        answer: 1,
        explanation: '« Avec dix jours de retard » et « de la mauvaise taille ».',
      },
      {
        prompt: 'Que demande Sophie ?',
        choices: ['Un échange', 'Un bon d’achat', 'Un remboursement complet', 'Des excuses seulement'],
        answer: 2,
        explanation: '« Me rembourser la totalité de mon achat, y compris les frais de livraison. » La totalité = tout.',
      },
      {
        prompt: 'Que fera-t-elle si l’entreprise ne répond pas ?',
        choices: ['Elle écrira un avis en ligne', 'Elle commandera un autre manteau', 'Elle ira au magasin', 'Elle contactera un organisme de protection du consommateur'],
        answer: 3,
        explanation: '« Je m’adresserai à l’Office de la protection du consommateur. » S’adresser à = contacter.',
      },
    ],
  },
  {
    id: 'r023',
    level: 'B1',
    title: 'Bien dormir',
    text:
      'Un adulte a besoin de sept à neuf heures de sommeil par nuit. Pourtant, un Canadien sur trois dort moins que ça. ' +
      'Les spécialistes conseillent d’éviter les écrans une heure avant le coucher, car leur lumière retarde l’endormissement. ' +
      'Il vaut mieux aussi se coucher et se lever à la même heure, même la fin de semaine. ' +
      'Contrairement à une idée reçue, l’alcool n’aide pas à bien dormir : il fait s’endormir plus vite, mais le sommeil est moins profond.',
    questions: [
      {
        prompt: 'Pourquoi faut-il éviter les écrans le soir ?',
        choices: ['Ils fatiguent les yeux', 'Leur lumière empêche de s’endormir rapidement', 'Ils donnent mal à la tête', 'Ils coûtent cher en électricité'],
        answer: 1,
        explanation: '« Leur lumière retarde l’endormissement » : on met plus de temps à s’endormir.',
      },
      {
        prompt: 'Que dit le texte sur l’alcool ?',
        choices: [
          'Il aide à mieux dormir',
          'Il empêche de s’endormir',
          'Il fait s’endormir vite, mais le sommeil est de moins bonne qualité',
          'Il n’a aucun effet',
        ],
        answer: 2,
        explanation: '« Contrairement à une idée reçue » annonce que l’opinion courante est fausse : le sommeil est « moins profond ».',
      },
      {
        prompt: 'Que conseillent les spécialistes pour la fin de semaine ?',
        choices: ['Dormir plus longtemps pour récupérer', 'Garder les mêmes heures de coucher et de lever', 'Faire une sieste', 'Se coucher plus tard'],
        answer: 1,
        explanation: '« Se coucher et se lever à la même heure, même la fin de semaine. »',
      },
    ],
  },
  {
    id: 'r024',
    level: 'B1',
    title: 'Le covoiturage',
    text:
      'Pour aller au travail, Karim partage sa voiture avec trois collègues depuis un an. ' +
      'Chacun paie sa part de l’essence et du stationnement, ce qui lui fait économiser près de 200 $ par mois. ' +
      '« Au début, je craignais de perdre ma liberté », raconte-t-il. « Mais on s’organise bien, et le trajet passe plus vite quand on discute. » ' +
      'Seul inconvénient : quand un collègue est en retard, tout le monde attend.',
    questions: [
      {
        prompt: 'Quel avantage Karim cite-t-il en premier ?',
        choices: ['Il pollue moins', 'Il économise de l’argent', 'Il arrive plus tôt', 'Il n’a plus besoin de voiture'],
        answer: 1,
        explanation: '« Ce qui lui fait économiser près de 200 $ par mois. »',
      },
      {
        prompt: 'Que pensait Karim avant de commencer ?',
        choices: ['Que ce serait moins libre', 'Que ce serait plus cher', 'Que ses collègues seraient désagréables', 'Que ce serait dangereux'],
        answer: 0,
        explanation: '« Je craignais de perdre ma liberté. » Craindre = avoir peur.',
      },
      {
        prompt: 'Quel est l’inconvénient du covoiturage pour lui ?',
        choices: ['Le prix de l’essence', 'Les discussions', 'Attendre les collègues en retard', 'Le manque de stationnement'],
        answer: 2,
        explanation: '« Quand un collègue est en retard, tout le monde attend. »',
      },
    ],
  },
  {
    id: 'r025',
    level: 'B1',
    title: 'Guide : ouvrir un compte bancaire',
    text:
      'Les nouveaux arrivants peuvent ouvrir un compte bancaire au Canada même sans emploi ni historique de crédit. ' +
      'Il suffit de présenter deux pièces d’identité, par exemple un passeport et une carte de résident permanent. ' +
      'Plusieurs banques offrent des forfaits sans frais pendant la première année. ' +
      'Attention : comparez bien les offres, car après cette période, les frais mensuels peuvent dépasser 15 $.',
    questions: [
      {
        prompt: 'Que faut-il pour ouvrir un compte ?',
        choices: ['Un emploi', 'Deux pièces d’identité', 'Un historique de crédit', 'Une adresse depuis un an'],
        answer: 1,
        explanation: '« Il suffit de présenter deux pièces d’identité. » « Même sans emploi ni historique de crédit. »',
      },
      {
        prompt: 'Pourquoi le texte conseille-t-il de comparer les offres ?',
        choices: [
          'Certaines banques refusent les nouveaux arrivants',
          'Les frais peuvent devenir élevés après la première année',
          'Les taux d’intérêt changent chaque mois',
          'Certaines banques ferment',
        ],
        answer: 1,
        explanation: '« Après cette période, les frais mensuels peuvent dépasser 15 $. » « Cette période » = la première année.',
      },
      {
        prompt: 'Que proposent plusieurs banques aux nouveaux arrivants ?',
        choices: ['Une carte de crédit sans limite', 'Un prêt pour acheter une maison', 'Un forfait sans frais la première année', 'Un conseiller qui parle leur langue'],
        answer: 2,
        explanation: '« Plusieurs banques offrent des forfaits sans frais pendant la première année. »',
      },
    ],
  },
  {
    id: 'r026',
    level: 'B1',
    title: 'Un festival qui change de date',
    text:
      'Le festival de musique de la Baie, qui avait lieu chaque année en août, se déroulera désormais à la fin de juin. ' +
      'Les organisateurs expliquent ce choix par les fortes chaleurs des derniers étés, qui ont causé plusieurs malaises chez les spectateurs. ' +
      'Certains commerçants s’inquiètent : fin juin, les touristes sont moins nombreux. ' +
      'La municipalité, elle, se dit favorable au changement et promet une campagne de publicité plus importante.',
    questions: [
      {
        prompt: 'Pourquoi le festival change-t-il de date ?',
        choices: ['À cause du manque de touristes', 'À cause de la chaleur en août', 'Pour économiser de l’argent', 'À la demande des commerçants'],
        answer: 1,
        explanation: '« Les fortes chaleurs des derniers étés, qui ont causé plusieurs malaises. »',
      },
      {
        prompt: 'Quelle est la position des commerçants ?',
        choices: ['Ils sont inquiets', 'Ils sont ravis', 'Ils sont indifférents', 'Ils veulent annuler le festival'],
        answer: 0,
        explanation: '« Certains commerçants s’inquiètent » : ils craignent d’avoir moins de clients.',
      },
      {
        prompt: 'Que va faire la municipalité ?',
        choices: ['Réduire le budget du festival', 'Remettre le festival en août', 'Faire plus de publicité', 'Ouvrir de nouveaux commerces'],
        answer: 2,
        explanation: '« Elle promet une campagne de publicité plus importante. »',
      },
    ],
  },
  {
    id: 'r027',
    level: 'B1',
    title: 'Règlement de l’immeuble',
    text:
      'Rappel du règlement de l’immeuble\n\n' +
      '– Le bruit est interdit entre 22 h et 7 h, y compris la musique et les travaux.\n' +
      '– Les vélos doivent être rangés au sous-sol, et non dans les couloirs.\n' +
      '– Le recyclage est ramassé le mercredi ; les bacs doivent être sortis la veille au soir, pas avant.\n' +
      '– Tout animal doit être déclaré au gestionnaire.\n\nEn cas de non-respect, un avertissement écrit sera envoyé.',
    questions: [
      {
        prompt: 'Quand faut-il sortir le bac de recyclage ?',
        choices: ['Le lundi soir', 'Le mardi soir', 'Le mercredi soir', 'N’importe quand'],
        answer: 1,
        explanation: 'Le ramassage est le mercredi et il faut sortir les bacs « la veille au soir » : le mardi soir.',
      },
      {
        prompt: 'Où doit-on laisser son vélo ?',
        choices: ['Dans le couloir', 'Devant l’immeuble', 'Dans son appartement', 'Au sous-sol'],
        answer: 3,
        explanation: '« Les vélos doivent être rangés au sous-sol, et non dans les couloirs. »',
      },
      {
        prompt: 'Que se passe-t-il si un résident ne respecte pas le règlement ?',
        choices: ['Il doit payer une amende', 'Il reçoit un avertissement écrit', 'Il doit quitter l’immeuble', 'Le gestionnaire appelle la police'],
        answer: 1,
        explanation: '« Un avertissement écrit sera envoyé. »',
      },
    ],
  },
  {
    id: 'r028',
    level: 'B1',
    title: 'Le bénévolat',
    text:
      'Faire du bénévolat est une excellente façon de s’intégrer quand on arrive dans un nouveau pays. ' +
      'Amina, arrivée de Tunisie il y a deux ans, aide chaque samedi à la banque alimentaire de son quartier. ' +
      '« J’ai amélioré mon français, j’ai rencontré des gens et j’ai même trouvé un emploi grâce à une autre bénévole », dit-elle. ' +
      'Selon un organisme d’aide, l’expérience bénévole est appréciée par les employeurs canadiens, surtout quand on n’a pas encore d’expérience locale.',
    questions: [
      {
        prompt: 'Comment Amina a-t-elle trouvé son emploi ?',
        choices: ['Par une annonce', 'Grâce à une personne rencontrée en faisant du bénévolat', 'Par la banque alimentaire', 'Par un organisme d’aide'],
        answer: 1,
        explanation: '« J’ai même trouvé un emploi grâce à une autre bénévole. »',
      },
      {
        prompt: 'Pourquoi le bénévolat aide-t-il à trouver un emploi, selon l’organisme ?',
        choices: [
          'Il remplace un diplôme',
          'Il est payé',
          'Les employeurs l’apprécient quand on n’a pas d’expérience au Canada',
          'Il est obligatoire pour les nouveaux arrivants',
        ],
        answer: 2,
        explanation: '« L’expérience bénévole est appréciée par les employeurs canadiens, surtout quand on n’a pas encore d’expérience locale. »',
      },
      {
        prompt: 'Quel est le but principal de ce texte ?',
        choices: ['Présenter le bénévolat comme un moyen de s’intégrer', 'Critiquer les banques alimentaires', 'Expliquer comment immigrer au Canada', 'Recruter des employés'],
        answer: 0,
        explanation: 'La première phrase donne l’idée principale ; l’exemple d’Amina et l’avis de l’organisme la soutiennent.',
      },
    ],
  },
  {
    id: 'r029',
    level: 'B1',
    title: 'Fermeture d’une piscine',
    text:
      'La piscine municipale du parc Lafontaine fermera ses portes pendant tout l’été pour des travaux de rénovation. ' +
      'Le toit et le système de filtration, vieux de quarante ans, doivent être remplacés. ' +
      'Les cours de natation seront déplacés au centre sportif Saint-Denis, à quinze minutes en autobus. ' +
      'Les personnes déjà inscrites n’ont rien à faire : leur inscription sera transférée automatiquement. Réouverture prévue en septembre.',
    questions: [
      {
        prompt: 'Pourquoi la piscine ferme-t-elle ?',
        choices: ['Par manque de personnel', 'Pour des rénovations', 'Parce qu’elle n’est pas assez utilisée', 'À cause d’un accident'],
        answer: 1,
        explanation: '« Pour des travaux de rénovation » : le toit et la filtration sont trop vieux.',
      },
      {
        prompt: 'Que doivent faire les personnes déjà inscrites aux cours ?',
        choices: ['Se réinscrire au centre Saint-Denis', 'Demander un remboursement', 'Attendre septembre', 'Rien, l’inscription est transférée'],
        answer: 3,
        explanation: '« Les personnes déjà inscrites n’ont rien à faire : leur inscription sera transférée automatiquement. »',
      },
      {
        prompt: 'Où auront lieu les cours de natation cet été ?',
        choices: ['Au parc Lafontaine', 'Dans une piscine extérieure', 'Au centre sportif Saint-Denis', 'Ils sont annulés'],
        answer: 2,
        explanation: '« Les cours de natation seront déplacés au centre sportif Saint-Denis. »',
      },
    ],
  },
];
