import type { ComprehensionItem } from '../comprehension.ts';

// B2 reading: opinion pieces and reports where questions ask for the author's view, an implied idea or the role of a sentence.
export const READING_B2: ComprehensionItem[] = [
  {
    id: 'r030',
    level: 'B2',
    title: 'La semaine de quatre jours',
    text:
      'Plusieurs entreprises québécoises testent la semaine de quatre jours, sans baisse de salaire. ' +
      'Les premiers résultats sont encourageants : moins d’absences, des employés plus motivés et une productivité stable, voire en hausse. ' +
      'Les syndicats y voient une avancée sociale majeure. ' +
      'Les économistes, eux, invitent à la prudence : ce modèle fonctionne bien dans les bureaux, mais il est difficile à appliquer dans les hôpitaux, ' +
      'les commerces ou les usines, où il faut une présence continue. ' +
      'Généraliser la mesure risquerait donc de creuser l’écart entre les travailleurs qui peuvent en profiter et les autres.',
    questions: [
      {
        prompt: 'Que montrent les premiers résultats ?',
        choices: [
          'La productivité a fortement baissé',
          'Les employés sont plus motivés et la productivité ne diminue pas',
          'Les salaires ont baissé',
          'Les absences ont augmenté',
        ],
        answer: 1,
        explanation: '« Une productivité stable, voire en hausse » : elle ne baisse pas. « Voire » = et même.',
      },
      {
        prompt: 'Quelle réserve les économistes expriment-ils ?',
        choices: [
          'La mesure coûte trop cher aux entreprises',
          'Les employés travailleront moins bien',
          'La mesure ne convient pas à tous les secteurs',
          'Les syndicats s’y opposent',
        ],
        answer: 2,
        explanation: 'Elle est « difficile à appliquer dans les hôpitaux, les commerces ou les usines ».',
      },
      {
        prompt: 'Selon les économistes, quel serait le risque d’une généralisation ?',
        choices: [
          'Une hausse du chômage',
          'Des inégalités plus grandes entre travailleurs',
          'La fermeture des usines',
          'Une baisse des salaires',
        ],
        answer: 1,
        explanation: '« Creuser l’écart entre les travailleurs qui peuvent en profiter et les autres » = augmenter les inégalités.',
      },
    ],
  },
  {
    id: 'r031',
    level: 'B2',
    title: 'Les écrans à l’école',
    text:
      'Après avoir massivement équipé les classes de tablettes, certains pays font marche arrière. ' +
      'La Suède, par exemple, a décidé de revenir aux manuels papier dans les premières années du primaire. ' +
      'Les chercheurs constatent que la lecture sur papier favorise une meilleure compréhension des textes longs. ' +
      'Il ne s’agit pas pour autant de bannir le numérique : bien utilisé, il permet d’adapter les exercices au rythme de chaque élève. ' +
      'Le véritable enjeu, concluent les spécialistes, n’est pas l’outil lui-même, mais la formation des enseignants qui l’utilisent.',
    questions: [
      {
        prompt: 'Que signifie « faire marche arrière » dans ce texte ?',
        choices: ['Accélérer une réforme', 'Revenir sur une décision', 'Acheter plus de tablettes', 'Fermer des écoles'],
        answer: 1,
        explanation: 'Les pays avaient équipé les classes de tablettes ; maintenant ils reviennent au papier : ils changent de direction.',
      },
      {
        prompt: 'Quelle est la position du texte sur le numérique ?',
        choices: ['Il faut l’interdire à l’école', 'Il est toujours meilleur que le papier', 'Il peut être utile s’il est bien utilisé', 'Il n’a aucun effet'],
        answer: 2,
        explanation: '« Il ne s’agit pas pour autant de bannir le numérique : bien utilisé, il permet… » Le texte est nuancé.',
      },
      {
        prompt: 'Selon les spécialistes, qu’est-ce qui compte le plus ?',
        choices: ['Le prix des tablettes', 'Le choix entre papier et écran', 'Le nombre d’heures de cours', 'La formation des enseignants'],
        answer: 3,
        explanation: '« Le véritable enjeu […] n’est pas l’outil lui-même, mais la formation des enseignants. »',
      },
    ],
  },
  {
    id: 'r032',
    level: 'B2',
    title: 'Pénurie de main-d’œuvre en région',
    text:
      'Dans plusieurs régions du Québec, les entreprises peinent à recruter. ' +
      'Les restaurants réduisent leurs heures d’ouverture, faute de cuisiniers, et des usines refusent des commandes. ' +
      'Pour attirer des travailleurs, certaines municipalités offrent désormais une aide au logement ou des places en garderie. ' +
      'L’immigration est souvent présentée comme la solution, mais les employeurs rappellent que les délais de traitement des dossiers ' +
      'peuvent dépasser un an. D’ici là, certains postes resteront vacants, et des entreprises pourraient tout simplement fermer.',
    questions: [
      {
        prompt: 'Quelle conséquence de la pénurie le texte mentionne-t-il ?',
        choices: ['Des salaires plus bas', 'Des restaurants qui ouvrent moins longtemps', 'Plus de touristes', 'Des loyers moins chers'],
        answer: 1,
        explanation: '« Les restaurants réduisent leurs heures d’ouverture, faute de cuisiniers. » « Faute de » = par manque de.',
      },
      {
        prompt: 'Que proposent certaines municipalités ?',
        choices: ['Des baisses d’impôts', 'Des formations gratuites', 'De l’aide pour le logement et la garde des enfants', 'Des voitures de fonction'],
        answer: 2,
        explanation: '« Une aide au logement ou des places en garderie. »',
      },
      {
        prompt: 'Pourquoi l’immigration ne règle-t-elle pas le problème rapidement ?',
        choices: [
          'Les immigrants ne veulent pas vivre en région',
          'Les dossiers prennent beaucoup de temps à être traités',
          'Les employeurs préfèrent les travailleurs locaux',
          'Le gouvernement a fermé les frontières',
        ],
        answer: 1,
        explanation: '« Les délais de traitement des dossiers peuvent dépasser un an. »',
      },
    ],
  },
  {
    id: 'r033',
    level: 'B2',
    title: 'Courrier des lecteurs : les voitures électriques',
    text:
      'On nous présente la voiture électrique comme la solution miracle au réchauffement climatique. Je n’y crois pas. ' +
      'Certes, elle n’émet rien en roulant, et c’est un progrès. Mais sa batterie exige des métaux dont l’extraction pollue, ' +
      'et une voiture, électrique ou non, occupe toujours autant de place sur la route. ' +
      'Remplacer chaque voiture à essence par une voiture électrique ne réglera ni la congestion ni l’étalement urbain. ' +
      'Ce dont nos villes ont besoin, c’est de moins de voitures, pas de voitures différentes.\n\nJean-François L., Sherbrooke',
    questions: [
      {
        prompt: 'Quelle est l’opinion de l’auteur ?',
        choices: [
          'La voiture électrique est la meilleure solution',
          'Il faut réduire le nombre de voitures',
          'Les voitures électriques sont trop chères',
          'Il faut interdire les voitures à essence',
        ],
        answer: 1,
        explanation: 'Dernière phrase : « moins de voitures, pas de voitures différentes ».',
      },
      {
        prompt: 'À quoi sert la phrase qui commence par « Certes » ?',
        choices: [
          'À reconnaître un avantage avant de le critiquer',
          'À donner un exemple',
          'À conclure le texte',
          'À changer complètement d’avis',
        ],
        answer: 0,
        explanation: '« Certes… Mais… » : on admet un point (pas d’émissions en roulant), puis on présente une objection.',
      },
      {
        prompt: 'Quel problème la voiture électrique ne règle pas, selon l’auteur ?',
        choices: ['Le bruit', 'Le prix de l’essence', 'La congestion', 'Les accidents'],
        answer: 2,
        explanation: '« Ne réglera ni la congestion ni l’étalement urbain. »',
      },
    ],
  },
  {
    id: 'r034',
    level: 'B2',
    title: 'Les aînés et le numérique',
    text:
      'Prendre un rendez-vous médical, payer une facture, renouveler un permis : presque tout se fait aujourd’hui en ligne. ' +
      'Pour beaucoup d’aînés, cette transformation est une source d’exclusion. ' +
      'Selon un sondage, près d’un quart des plus de 75 ans n’utilisent jamais Internet. ' +
      'Des bibliothèques offrent des ateliers d’initiation, et des jeunes bénévoles aident les aînés à se servir d’une tablette. ' +
      'Mais pour les associations, ces initiatives ne suffisent pas : elles réclament que les services publics conservent toujours une option par téléphone ou au comptoir.',
    questions: [
      {
        prompt: 'Pourquoi le numérique peut-il exclure les aînés ?',
        choices: [
          'Les services en ligne sont plus chers',
          'Beaucoup de services ne sont plus accessibles autrement qu’en ligne',
          'Les aînés n’aiment pas les jeunes bénévoles',
          'Les bibliothèques ferment',
        ],
        answer: 1,
        explanation: '« Presque tout se fait aujourd’hui en ligne » ; ceux qui n’utilisent pas Internet sont donc mis de côté.',
      },
      {
        prompt: 'Que demandent les associations ?',
        choices: [
          'Plus d’ateliers en bibliothèque',
          'Des tablettes gratuites pour les aînés',
          'Que les services publics restent accessibles sans Internet',
          'L’interdiction des services en ligne',
        ],
        answer: 2,
        explanation: '« Elles réclament que les services publics conservent toujours une option par téléphone ou au comptoir. »',
      },
      {
        prompt: 'Que pensent les associations des ateliers et de l’aide des bénévoles ?',
        choices: ['Qu’ils sont inutiles', 'Qu’ils sont utiles mais insuffisants', 'Qu’ils coûtent trop cher', 'Qu’ils doivent remplacer les services au comptoir'],
        answer: 1,
        explanation: '« Ces initiatives ne suffisent pas » : elles ne sont pas rejetées, mais il faut plus.',
      },
    ],
  },
  {
    id: 'r035',
    level: 'B2',
    title: 'Le gaspillage alimentaire',
    text:
      'Au Canada, près de la moitié des aliments produits finissent à la poubelle. ' +
      'Contrairement à ce que l’on pourrait penser, les ménages sont responsables d’une part importante de ce gaspillage, ' +
      'souvent parce qu’ils confondent la date « meilleur avant » avec une date limite de consommation. ' +
      'Or, un yogourt dont la date est dépassée de quelques jours peut généralement être mangé sans danger. ' +
      'Des applications permettent maintenant aux épiceries de vendre à bas prix leurs invendus en fin de journée, ' +
      'une initiative qui profite à la fois aux commerçants, aux consommateurs et à l’environnement.',
    questions: [
      {
        prompt: 'Quelle erreur font souvent les ménages ?',
        choices: [
          'Ils achètent des produits trop chers',
          'Ils croient qu’un aliment « meilleur avant » est dangereux après la date',
          'Ils ne lisent pas les étiquettes',
          'Ils congèlent trop d’aliments',
        ],
        answer: 1,
        explanation: 'Ils « confondent la date “meilleur avant” avec une date limite de consommation ».',
      },
      {
        prompt: 'Quel rôle joue le mot « Or » dans le texte ?',
        choices: ['Il introduit une conclusion', 'Il donne un exemple chiffré', 'Il présente un fait qui contredit cette croyance', 'Il ajoute un deuxième problème'],
        answer: 2,
        explanation: '« Or » introduit un élément qui va contre l’idée précédente : l’aliment est en réalité encore bon.',
      },
      {
        prompt: 'À qui profitent les applications d’invendus ?',
        choices: ['Seulement aux épiceries', 'Seulement aux clients', 'Aux agriculteurs', 'Aux commerçants, aux clients et à l’environnement'],
        answer: 3,
        explanation: '« Une initiative qui profite à la fois aux commerçants, aux consommateurs et à l’environnement. »',
      },
    ],
  },
  {
    id: 'r036',
    level: 'B2',
    title: 'Le français au travail',
    text:
      'Au Québec, la Charte de la langue française fait du français la langue normale du travail. ' +
      'Pourtant, dans la région de Montréal, de plus en plus d’offres d’emploi exigent la maîtrise de l’anglais, même pour des postes ' +
      'où les employés ne parlent qu’avec des clients locaux. ' +
      'Les entreprises invoquent la concurrence internationale. Les défenseurs du français, eux, estiment que cette exigence est souvent injustifiée ' +
      'et qu’elle pénalise les francophones unilingues ainsi que les immigrants qui ont fait l’effort d’apprendre le français.',
    questions: [
      {
        prompt: 'Que constate le texte à Montréal ?',
        choices: [
          'Les entreprises refusent d’engager des immigrants',
          'L’anglais est de plus en plus exigé à l’embauche',
          'Les francophones quittent la région',
          'Les offres d’emploi sont seulement en anglais',
        ],
        answer: 1,
        explanation: '« De plus en plus d’offres d’emploi exigent la maîtrise de l’anglais. »',
      },
      {
        prompt: 'Comment les entreprises justifient-elles cette exigence ?',
        choices: ['Par la loi', 'Par la concurrence internationale', 'Par la demande des employés', 'Par le manque de traducteurs'],
        answer: 1,
        explanation: '« Les entreprises invoquent la concurrence internationale. » Invoquer = donner comme raison.',
      },
      {
        prompt: 'Selon les défenseurs du français, qui est pénalisé ?',
        choices: [
          'Les clients anglophones',
          'Les entreprises internationales',
          'Les francophones qui ne parlent pas anglais et certains immigrants',
          'Les étudiants étrangers',
        ],
        answer: 2,
        explanation: '« Les francophones unilingues ainsi que les immigrants qui ont fait l’effort d’apprendre le français. »',
      },
    ],
  },
  {
    id: 'r037',
    level: 'B2',
    title: 'Les feux de forêt',
    text:
      'L’été dernier, les feux de forêt ont détruit une superficie record au Canada, forçant l’évacuation de dizaines de milliers de personnes. ' +
      'Si les incendies font partie du cycle naturel de la forêt boréale, leur fréquence et leur intensité augmentent avec la hausse des températures. ' +
      'Les experts recommandent d’investir davantage dans la prévention, notamment en éclaircissant les forêts autour des villages. ' +
      'Ils soulignent aussi un problème moins visible : la fumée, transportée sur des centaines de kilomètres, ' +
      'a dégradé la qualité de l’air jusque dans les grandes villes, avec des effets sur la santé respiratoire.',
    questions: [
      {
        prompt: 'Que dit le texte sur les incendies dans la forêt boréale ?',
        choices: [
          'Ils n’existaient pas avant',
          'Ils sont naturels, mais plus fréquents et intenses avec le réchauffement',
          'Ils sont tous causés par l’humain',
          'Ils diminuent depuis quelques années',
        ],
        answer: 1,
        explanation: '« Si les incendies font partie du cycle naturel […], leur fréquence et leur intensité augmentent. » « Si » a ici le sens de « même si ».',
      },
      {
        prompt: 'Quel « problème moins visible » est mentionné ?',
        choices: ['La perte d’emplois', 'Le coût des évacuations', 'La pollution de l’air causée par la fumée', 'La disparition des animaux'],
        answer: 2,
        explanation: '« La fumée […] a dégradé la qualité de l’air jusque dans les grandes villes. »',
      },
      {
        prompt: 'Que recommandent les experts ?',
        choices: ['Évacuer toutes les régions boisées', 'Investir davantage dans la prévention', 'Interdire les feux de camp', 'Planter plus d’arbres près des villages'],
        answer: 1,
        explanation: '« Investir davantage dans la prévention, notamment en éclaircissant les forêts autour des villages. » Éclaircir = enlever des arbres, pas en planter.',
      },
    ],
  },
  {
    id: 'r038',
    level: 'B2',
    title: 'Les plateformes de location touristique',
    text:
      'En quelques années, les plateformes de location de courte durée ont transformé certains quartiers centraux. ' +
      'Des propriétaires préfèrent louer leur logement aux touristes, plus rentables que des locataires permanents. ' +
      'Résultat : l’offre de logements à long terme diminue et les loyers grimpent. ' +
      'Plusieurs villes ont réagi en exigeant que l’hébergement touristique se fasse uniquement dans la résidence principale du propriétaire. ' +
      'Les plateformes dénoncent une mesure excessive ; les associations de locataires, elles, jugent qu’elle arrive trop tard.',
    questions: [
      {
        prompt: 'Pourquoi des propriétaires choisissent-ils la location touristique ?',
        choices: ['Elle est plus simple', 'Elle rapporte plus d’argent', 'Elle est obligatoire', 'Les locataires sont trop exigeants'],
        answer: 1,
        explanation: 'Les touristes sont « plus rentables que des locataires permanents ».',
      },
      {
        prompt: 'Quelle mesure plusieurs villes ont-elles adoptée ?',
        choices: [
          'Interdire complètement la location touristique',
          'Limiter la location touristique à la résidence principale',
          'Taxer les touristes',
          'Baisser les loyers par une loi',
        ],
        answer: 1,
        explanation: 'L’hébergement touristique est permis « uniquement dans la résidence principale du propriétaire ».',
      },
      {
        prompt: 'Que pensent les associations de locataires de cette mesure ?',
        choices: ['Qu’elle est excessive', 'Qu’elle est inutile', 'Qu’elle aurait dû être prise plus tôt', 'Qu’elle va faire augmenter les loyers'],
        answer: 2,
        explanation: 'Elles « jugent qu’elle arrive trop tard » : elles sont d’accord, mais trouvent qu’on a attendu trop longtemps.',
      },
    ],
  },
  {
    id: 'r039',
    level: 'B2',
    title: 'L’intelligence artificielle et la traduction',
    text:
      'Les outils de traduction automatique ont fait des progrès spectaculaires. ' +
      'Faut-il en conclure qu’il est devenu inutile d’apprendre une langue étrangère ? Rien n’est moins sûr. ' +
      'Une langue n’est pas seulement un code : elle donne accès à l’humour, aux sous-entendus, à une manière de voir le monde. ' +
      'Par ailleurs, la confiance se construit difficilement à travers une machine. ' +
      'Un nouvel arrivant qui parle avec ses collègues sans écran entre eux tisse des liens qu’aucune application ne peut remplacer.',
    questions: [
      {
        prompt: 'Quelle est la thèse de l’auteur ?',
        choices: [
          'La traduction automatique est inutile',
          'Apprendre une langue reste important malgré la traduction automatique',
          'Il faut interdire les applications de traduction',
          'Les machines traduisent mieux que les humains',
        ],
        answer: 1,
        explanation: '« Rien n’est moins sûr » répond à la question : il n’est pas inutile d’apprendre une langue.',
      },
      {
        prompt: 'Que signifie « Rien n’est moins sûr » ?',
        choices: ['C’est certain', 'C’est très douteux', 'C’est dangereux', 'C’est sans importance'],
        answer: 1,
        explanation: 'Expression idiomatique : « rien n’est moins sûr » = c’est loin d’être certain.',
      },
      {
        prompt: 'Quel argument l’auteur ajoute-t-il avec « Par ailleurs » ?',
        choices: [
          'Les applications coûtent cher',
          'Il est difficile de créer la confiance par une machine',
          'Les machines font des erreurs de grammaire',
          'Les langues changent trop vite',
        ],
        answer: 1,
        explanation: '« Par ailleurs » ajoute un deuxième argument : « la confiance se construit difficilement à travers une machine ».',
      },
    ],
  },
  {
    id: 'r040',
    level: 'B2',
    title: 'La gratuité des musées',
    text:
      'Depuis janvier, l’entrée des musées nationaux est gratuite le premier dimanche de chaque mois. ' +
      'La fréquentation a doublé ces jours-là, et la proportion de visiteurs qui n’étaient jamais venus a fortement augmenté. ' +
      'Les directeurs de musée nuancent toutefois ce succès : les salles bondées nuisent à l’expérience, ' +
      'et une bonne partie des nouveaux visiteurs ne revient pas les jours payants. ' +
      'Pour eux, la gratuité attire, mais ce sont la médiation culturelle et les activités pour les familles qui fidélisent le public.',
    questions: [
      {
        prompt: 'Quel effet positif de la gratuité le texte mentionne-t-il ?',
        choices: [
          'Les musées gagnent plus d’argent',
          'De nouveaux publics découvrent les musées',
          'Les salles sont plus calmes',
          'Les visiteurs reviennent tous les jours payants',
        ],
        answer: 1,
        explanation: '« La proportion de visiteurs qui n’étaient jamais venus a fortement augmenté. »',
      },
      {
        prompt: 'Selon les directeurs, qu’est-ce qui fait revenir les visiteurs ?',
        choices: ['La gratuité', 'Les grandes expositions internationales', 'Les activités et l’accompagnement du public', 'Les prix réduits pour les étudiants'],
        answer: 2,
        explanation: '« Ce sont la médiation culturelle et les activités pour les familles qui fidélisent le public. » Fidéliser = faire revenir.',
      },
      {
        prompt: 'Quel problème de la gratuité les directeurs soulignent-ils ?',
        choices: ['Les musées perdent trop d’argent', 'Il y a trop de monde, ce qui gâche la visite', 'Les œuvres sont abîmées', 'Les touristes ne viennent plus'],
        answer: 1,
        explanation: '« Les salles bondées nuisent à l’expérience. » Bondé = plein de monde.',
      },
    ],
  },
];
