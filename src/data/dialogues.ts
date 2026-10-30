// Guided dialogues on TCF Canada expression orale tasks, at a B1 level.
// The examiner's lines are read aloud; on each of your turns you see what to do, can ask for
// hints that reveal more each time, record yourself, then compare with a model answer.
// The model answers also feed the shadowing exercise (listen, repeat, compare).
//   Tâche 1, entretien dirigé: the examiner asks about you.
//   Tâche 2, exercice en interaction: you ask the questions, the examiner answers.
//   Tâche 3, expression d'un point de vue: you give and defend an opinion.
// Models for tâche 1 describe an invented person: adapt them to your own life when you answer.

export type Turn = {
  // What the examiner says before your turn.
  examiner?: string;
  // What you should do on this turn.
  goal: string;
  // From a nudge to almost the whole answer.
  hints: string[];
  model: string;
  // What the examiner answers after your turn (tâche 2).
  reply?: string;
};

export type Dialogue = {
  id: string;
  task: 1 | 2 | 3;
  title: string;
  situation: string;
  turns: Turn[];
};

export const DIALOGUES: Dialogue[] = [
  {
    id: 'd1-001',
    task: 1,
    title: 'Se présenter',
    situation: 'L’examinateur vous pose des questions sur vous. Répondez par des phrases complètes.',
    turns: [
      {
        examiner: 'Bonjour. Pouvez-vous vous présenter, s’il vous plaît ?',
        goal: 'Dites votre nom, d’où vous venez et où vous habitez.',
        hints: ['Je m’appelle… Je viens de…', 'Je m’appelle …, je viens de … et j’habite à … depuis …'],
        model: 'Je m’appelle Alex. Je viens de Shanghai, en Chine, et j’habite à Ottawa depuis deux ans.',
      },
      {
        examiner: 'Qu’est-ce que vous faites dans la vie ?',
        goal: 'Parlez de votre travail ou de vos études.',
        hints: ['Je travaille comme… / Je suis étudiant en…', 'Je travaille dans … depuis … C’est un travail qui me plaît parce que …'],
        model: 'Je travaille comme technicien en informatique dans une petite entreprise. C’est un travail qui me plaît parce que j’aide les gens à résoudre leurs problèmes.',
      },
      {
        examiner: 'Et pendant votre temps libre, qu’est-ce que vous aimez faire ?',
        goal: 'Décrivez deux loisirs et dites pourquoi vous les aimez.',
        hints: ['J’aime beaucoup… Le week-end, je…', 'J’aime beaucoup …, surtout … Le week-end, je … avec … parce que …'],
        model: 'J’aime beaucoup le sport, surtout la course à pied. Le week-end, je fais aussi de la randonnée avec des amis parce que ça me permet de découvrir la nature.',
      },
      {
        examiner: 'Pourquoi est-ce que vous apprenez le français ?',
        goal: 'Donnez deux raisons.',
        hints: ['D’abord… Ensuite…', 'D’abord, parce que … Ensuite, je voudrais …'],
        model: 'D’abord, parce que le français est très utile pour trouver un emploi au Canada. Ensuite, je voudrais mieux comprendre la culture québécoise et me faire des amis francophones.',
      },
      {
        examiner: 'Quels sont vos projets pour les prochaines années ?',
        goal: 'Parlez de vos projets avec le futur proche ou le futur simple.',
        hints: ['Dans … ans, je vais… / J’aimerais…', 'Dans deux ans, j’aimerais … Si possible, je vais aussi …'],
        model: 'Dans deux ans, j’aimerais obtenir la résidence permanente. Si possible, je vais aussi reprendre des études pour avoir un meilleur poste.',
      },
    ],
  },
  {
    id: 'd1-002',
    task: 1,
    title: 'Ma ville et mon quartier',
    situation: 'L’examinateur vous interroge sur l’endroit où vous vivez.',
    turns: [
      {
        examiner: 'Parlez-moi du quartier où vous habitez.',
        goal: 'Décrivez votre quartier : où il est, comment il est.',
        hints: ['J’habite dans un quartier… près de…', 'J’habite dans un quartier calme, près de … Il y a beaucoup de …'],
        model: 'J’habite dans un quartier calme, près du centre-ville. Il y a beaucoup de parcs, de petits commerces et une bibliothèque.',
      },
      {
        examiner: 'Qu’est-ce que vous aimez dans ce quartier ?',
        goal: 'Donnez deux choses que vous aimez, avec un exemple.',
        hints: ['Ce que j’aime, c’est…', 'Ce que j’aime surtout, c’est … Par exemple, …'],
        model: 'Ce que j’aime surtout, c’est qu’on peut tout faire à pied. Par exemple, l’épicerie et la pharmacie sont à cinq minutes de chez moi.',
      },
      {
        examiner: 'Et qu’est-ce qui pourrait être amélioré ?',
        goal: 'Parlez d’un problème et proposez une solution.',
        hints: ['Le problème, c’est que… Il faudrait…', 'Le seul problème, c’est que … À mon avis, il faudrait …'],
        model: 'Le seul problème, c’est que les autobus ne passent pas souvent le soir. À mon avis, il faudrait ajouter des départs après vingt heures.',
      },
      {
        examiner: 'Comment est-ce que vous vous déplacez au quotidien ?',
        goal: 'Expliquez vos moyens de transport et votre trajet.',
        hints: ['D’habitude, je prends… Mon trajet dure…', 'D’habitude, je prends … pour aller au travail. Mon trajet dure … En été, je …'],
        model: 'D’habitude, je prends l’autobus pour aller au travail. Mon trajet dure environ trente minutes. En été, je préfère y aller à vélo.',
      },
    ],
  },
  {
    id: 'd1-003',
    task: 1,
    title: 'Ma vie au Canada',
    situation: 'L’examinateur vous pose des questions sur votre installation au Canada.',
    turns: [
      {
        examiner: 'Depuis combien de temps êtes-vous au Canada ?',
        goal: 'Dites depuis quand vous êtes ici et pourquoi vous êtes venu.',
        hints: ['Je suis arrivé en… / Je suis ici depuis…', 'Je suis arrivé il y a … ans pour …'],
        model: 'Je suis arrivé il y a deux ans pour faire mes études. Ensuite, j’ai décidé de rester parce que j’ai trouvé un emploi.',
      },
      {
        examiner: 'Qu’est-ce qui vous a le plus surpris en arrivant ?',
        goal: 'Racontez une surprise au passé composé et à l’imparfait.',
        hints: ['Ce qui m’a surpris, c’est…', 'Ce qui m’a le plus surpris, c’est … Je ne savais pas que …'],
        model: 'Ce qui m’a le plus surpris, c’est l’hiver. Je ne savais pas qu’il pouvait faire moins trente degrés, et j’ai dû acheter de vrais vêtements chauds.',
      },
      {
        examiner: 'Qu’est-ce qui a été le plus difficile pour vous ?',
        goal: 'Parlez d’une difficulté et de comment vous l’avez surmontée.',
        hints: ['Au début, c’était difficile de… mais…', 'Au début, c’était difficile de … Mais petit à petit, …'],
        model: 'Au début, c’était difficile de me faire des amis, car je ne connaissais personne. Mais petit à petit, j’ai rencontré des gens grâce à un club de course.',
      },
      {
        examiner: 'Quel conseil donneriez-vous à un nouvel arrivant ?',
        goal: 'Donnez un conseil avec « je lui conseillerais de » ou « il faut ».',
        hints: ['Je lui conseillerais de…', 'Je lui conseillerais de … parce que … Il faut aussi …'],
        model: 'Je lui conseillerais de participer à des activités dans son quartier, parce que c’est la meilleure façon de pratiquer la langue. Il faut aussi être patient.',
      },
    ],
  },
  {
    id: 'd2-001',
    task: 2,
    title: 'S’inscrire à un club de sport',
    situation: 'Vous voulez vous inscrire à un club de sport. Posez vos questions à l’employé de l’accueil.',
    turns: [
      {
        examiner: 'Bonjour, bienvenue au Centre sportif du Parc. Je peux vous aider ?',
        goal: 'Saluez et demandez les horaires d’ouverture.',
        hints: ['Je voudrais savoir…', 'Bonjour, je voudrais savoir quels sont vos horaires d’ouverture.'],
        model: 'Bonjour, je voudrais savoir quels sont vos horaires d’ouverture, s’il vous plaît.',
        reply: 'Nous sommes ouverts de six heures à vingt-deux heures en semaine, et de huit heures à dix-huit heures le week-end.',
      },
      {
        goal: 'Demandez le prix de l’abonnement.',
        hints: ['Combien coûte… ?', 'Combien coûte l’abonnement par mois ? Est-ce qu’il y a un tarif …'],
        model: 'Combien coûte l’abonnement par mois ? Est-ce qu’il y a un tarif réduit pour les étudiants ?',
        reply: 'L’abonnement mensuel coûte cinquante dollars. Pour les étudiants, c’est trente-cinq dollars avec une carte valide.',
      },
      {
        goal: 'Demandez quelles activités sont proposées.',
        hints: ['Quelles activités… ?', 'Quelles activités est-ce que vous proposez ? Est-ce que les cours sont compris dans …'],
        model: 'Quelles activités est-ce que vous proposez ? Est-ce que les cours de groupe sont compris dans l’abonnement ?',
        reply: 'Il y a une salle de musculation, une piscine et des cours de yoga et de natation. Les cours de groupe sont compris, mais il faut réserver en ligne.',
      },
      {
        goal: 'Demandez comment s’inscrire et quels documents il faut.',
        hints: ['Qu’est-ce qu’il faut pour… ?', 'Qu’est-ce qu’il faut apporter pour s’inscrire ? Est-ce que je peux …'],
        model: 'Qu’est-ce qu’il faut apporter pour s’inscrire ? Est-ce que je peux le faire aujourd’hui ?',
        reply: 'Il faut une pièce d’identité et une preuve d’adresse. Oui, vous pouvez vous inscrire tout de suite à l’accueil.',
      },
      {
        goal: 'Demandez s’il est possible d’essayer avant de payer, puis remerciez.',
        hints: ['Est-ce qu’il est possible de… ?', 'Est-ce qu’il est possible de faire une séance d’essai ? Merci beaucoup pour …'],
        model: 'Est-ce qu’il est possible de faire une séance d’essai gratuite avant de m’inscrire ? Merci beaucoup pour ces informations.',
        reply: 'Bien sûr, la première visite est gratuite. Je vous en prie, bonne journée !',
      },
    ],
  },
  {
    id: 'd2-002',
    task: 2,
    title: 'Visiter un appartement',
    situation: 'Vous appelez le propriétaire d’un appartement à louer. Posez-lui des questions.',
    turns: [
      {
        examiner: 'Allô, oui, bonjour ?',
        goal: 'Présentez-vous et dites pourquoi vous appelez.',
        hints: ['J’appelle au sujet de…', 'Bonjour, j’appelle au sujet de l’annonce pour … Est-ce qu’il est toujours disponible ?'],
        model: 'Bonjour, j’appelle au sujet de l’annonce pour l’appartement de quatre pièces. Est-ce qu’il est toujours disponible ?',
        reply: 'Oui, il est toujours libre. Il est disponible à partir du premier juillet.',
      },
      {
        goal: 'Demandez le loyer et si le chauffage est compris.',
        hints: ['Quel est le loyer… ?', 'Quel est le montant du loyer ? Est-ce que le chauffage et l’électricité sont …'],
        model: 'Quel est le montant du loyer ? Est-ce que le chauffage et l’électricité sont compris ?',
        reply: 'Le loyer est de mille trois cents dollars par mois. Le chauffage est compris, mais l’électricité est à vos frais.',
      },
      {
        goal: 'Posez une question sur le quartier.',
        hints: ['Est-ce que le quartier… ? Y a-t-il… ?', 'Comment est le quartier ? Est-ce qu’il y a une station de métro ou une épicerie …'],
        model: 'Comment est le quartier ? Est-ce qu’il y a une station de métro ou une épicerie près de l’immeuble ?',
        reply: 'C’est un quartier tranquille. Il y a une épicerie au coin de la rue et le métro est à dix minutes à pied.',
      },
      {
        goal: 'Demandez si les animaux sont acceptés.',
        hints: ['Est-ce que les animaux… ?', 'J’ai un chat. Est-ce que les animaux sont acceptés dans …'],
        model: 'J’ai un petit chat. Est-ce que les animaux sont acceptés dans l’immeuble ?',
        reply: 'Les chats sont acceptés, mais pas les chiens.',
      },
      {
        goal: 'Proposez un moment pour visiter, puis remerciez.',
        hints: ['Est-ce que je pourrais… ?', 'Est-ce que je pourrais visiter l’appartement … ? Je suis libre …'],
        model: 'Est-ce que je pourrais visiter l’appartement cette semaine ? Je suis libre jeudi après dix-sept heures. Merci beaucoup.',
        reply: 'Jeudi à dix-huit heures, ça me convient. À jeudi !',
      },
    ],
  },
  {
    id: 'd2-003',
    task: 2,
    title: 'Préparer un voyage avec un ami',
    situation: 'Un ami vous propose un voyage en Gaspésie. Posez-lui des questions pour décider si vous venez.',
    turns: [
      {
        examiner: 'Salut ! Je pars en Gaspésie cet été avec deux amis. Ça te dirait de venir ?',
        goal: 'Montrez de l’intérêt et demandez les dates.',
        hints: ['Ça a l’air super ! Vous partez quand… ?', 'Ça a l’air super ! Vous partez quand, exactement, et pour combien de …'],
        model: 'Ça a l’air super ! Vous partez quand, exactement, et pour combien de temps ?',
        reply: 'On part le quinze juillet, pour une semaine.',
      },
      {
        goal: 'Demandez comment vous allez voyager.',
        hints: ['Comment est-ce qu’on va… ?', 'Comment est-ce qu’on va y aller ? On prend …'],
        model: 'Comment est-ce qu’on va y aller ? On prend la voiture ou l’autobus ?',
        reply: 'On y va en voiture. On partage l’essence, et on peut conduire chacun notre tour.',
      },
      {
        goal: 'Demandez où vous allez dormir.',
        hints: ['Où est-ce qu’on va… ?', 'Où est-ce qu’on va dormir ? Vous avez déjà réservé …'],
        model: 'Où est-ce qu’on va dormir ? Vous avez déjà réservé un hôtel ou un camping ?',
        reply: 'On a réservé un chalet près de Percé, avec trois chambres.',
      },
      {
        goal: 'Demandez le budget total.',
        hints: ['Combien est-ce que ça va… ?', 'Combien est-ce que ça va coûter au total, à peu près, par …'],
        model: 'Combien est-ce que ça va coûter au total, à peu près, par personne ?',
        reply: 'À peu près six cents dollars chacun, avec le chalet, l’essence et la nourriture.',
      },
      {
        goal: 'Demandez quelles activités sont prévues, puis donnez votre réponse.',
        hints: ['Qu’est-ce que vous avez prévu… ?', 'Qu’est-ce que vous avez prévu comme activités ? En tout cas, …'],
        model: 'Qu’est-ce que vous avez prévu comme activités ? En tout cas, je pense que je vais venir, ça me tente beaucoup !',
        reply: 'De la randonnée, une sortie en bateau pour voir les baleines et la visite du rocher Percé. Génial, je suis content que tu viennes !',
      },
    ],
  },
  {
    id: 'd3-001',
    task: 3,
    title: 'Les réseaux sociaux',
    situation: '« Les réseaux sociaux rapprochent les gens. » Donnez votre opinion et défendez-la.',
    turns: [
      {
        examiner: 'Selon vous, est-ce que les réseaux sociaux rapprochent les gens ?',
        goal: 'Donnez clairement votre opinion.',
        hints: ['À mon avis… / Je pense que…', 'À mon avis, les réseaux sociaux rapprochent les gens, mais seulement …'],
        model: 'À mon avis, les réseaux sociaux rapprochent les gens, mais seulement s’ils sont utilisés avec modération.',
      },
      {
        examiner: 'Pourquoi pensez-vous cela ?',
        goal: 'Donnez un argument avec un exemple personnel.',
        hints: ['D’abord… Par exemple…', 'D’abord, ils permettent de … Par exemple, moi, je …'],
        model: 'D’abord, ils permettent de garder le contact avec la famille qui vit loin. Par exemple, moi, je parle chaque semaine avec mes parents grâce à une application.',
      },
      {
        examiner: 'Pourtant, beaucoup de gens disent qu’ils se sentent plus seuls. Qu’en pensez-vous ?',
        goal: 'Reconnaissez l’autre point de vue, puis nuancez.',
        hints: ['C’est vrai que… Cependant…', 'C’est vrai que certaines personnes … Cependant, ce n’est pas …'],
        model: 'C’est vrai que certaines personnes passent trop de temps en ligne et se comparent aux autres. Cependant, ce n’est pas la faute des réseaux sociaux, c’est la façon de les utiliser.',
      },
      {
        examiner: 'Alors, que conseilleriez-vous ?',
        goal: 'Proposez une solution.',
        hints: ['Il faudrait… / Il vaudrait mieux…', 'Il faudrait limiter … et privilégier …'],
        model: 'Il faudrait limiter le temps passé sur son téléphone et privilégier les rencontres en personne, par exemple en organisant des activités entre amis.',
      },
      {
        examiner: 'Pour conclure ?',
        goal: 'Concluez en une ou deux phrases.',
        hints: ['En conclusion… / Pour résumer…', 'En conclusion, les réseaux sociaux sont … à condition de …'],
        model: 'En conclusion, les réseaux sociaux sont un outil utile pour se rapprocher, à condition de ne pas remplacer les vraies relations.',
      },
    ],
  },
  {
    id: 'd3-002',
    task: 3,
    title: 'Le télétravail',
    situation: '« Le télétravail devrait devenir la norme pour tous les emplois de bureau. » Qu’en pensez-vous ?',
    turns: [
      {
        examiner: 'Le télétravail devrait-il devenir la norme, d’après vous ?',
        goal: 'Donnez clairement votre opinion.',
        hints: ['Personnellement, je ne suis pas tout à fait d’accord…', 'Personnellement, je ne suis pas tout à fait d’accord. Je pense que la meilleure solution, c’est …'],
        model: 'Personnellement, je ne suis pas tout à fait d’accord. Je pense que la meilleure solution, c’est un mélange entre le bureau et la maison.',
      },
      {
        examiner: 'Quels sont les avantages du télétravail, selon vous ?',
        goal: 'Donnez deux avantages.',
        hints: ['D’un côté… De plus…', 'D’un côté, le télétravail permet de … De plus, on …'],
        model: 'D’un côté, le télétravail permet de gagner du temps, car on n’a pas de trajet. De plus, on est souvent plus concentré à la maison.',
      },
      {
        examiner: 'Et les inconvénients ?',
        goal: 'Donnez un inconvénient avec un exemple.',
        hints: ['D’un autre côté… Par exemple…', 'D’un autre côté, on peut se sentir … Par exemple, quand je …'],
        model: 'D’un autre côté, on peut se sentir isolé. Par exemple, quand je travaille seul toute la semaine, les discussions avec mes collègues me manquent.',
      },
      {
        examiner: 'Donc, que proposez-vous ?',
        goal: 'Proposez une solution concrète.',
        hints: ['Je propose que… / L’idéal serait de…', 'L’idéal serait de travailler … jours à la maison et … au bureau, pour …'],
        model: 'L’idéal serait de travailler trois jours à la maison et deux jours au bureau, pour garder le contact avec l’équipe.',
      },
      {
        examiner: 'Pour conclure ?',
        goal: 'Concluez.',
        hints: ['Bref… / En résumé…', 'Bref, le télétravail est une bonne chose, mais …'],
        model: 'Bref, le télétravail est une bonne chose, mais il ne doit pas devenir obligatoire pour tout le monde.',
      },
    ],
  },
  {
    id: 'd3-003',
    task: 3,
    title: 'Parler la langue locale à la maison',
    situation: '« Pour bien s’intégrer, il faut parler la langue locale même à la maison. » Êtes-vous d’accord ?',
    turns: [
      {
        examiner: 'Êtes-vous d’accord avec cette affirmation ?',
        goal: 'Donnez clairement votre opinion.',
        hints: ['Je suis plutôt en désaccord…', 'Je suis plutôt en désaccord avec cette idée. Selon moi, …'],
        model: 'Je suis plutôt en désaccord avec cette idée. Selon moi, on peut bien s’intégrer tout en gardant sa langue maternelle à la maison.',
      },
      {
        examiner: 'Pourquoi ?',
        goal: 'Donnez un argument sur la langue maternelle.',
        hints: ['Tout d’abord, la langue maternelle…', 'Tout d’abord, la langue maternelle fait partie de … Si les enfants …'],
        model: 'Tout d’abord, la langue maternelle fait partie de notre identité. Si les enfants la perdent, ils ne peuvent plus parler avec leurs grands-parents.',
      },
      {
        examiner: 'Mais comment apprendre le français si on ne le parle jamais chez soi ?',
        goal: 'Reconnaissez l’argument et proposez d’autres occasions de pratiquer.',
        hints: ['Il est vrai que… mais on peut aussi…', 'Il est vrai qu’il faut pratiquer beaucoup, mais on peut aussi …'],
        model: 'Il est vrai qu’il faut pratiquer beaucoup, mais on peut aussi parler français au travail, faire du bénévolat ou regarder des séries en français.',
      },
      {
        examiner: 'Avez-vous un exemple ?',
        goal: 'Donnez un exemple concret.',
        hints: ['Par exemple, je connais…', 'Par exemple, je connais une famille qui … Pourtant, …'],
        model: 'Par exemple, je connais une famille qui parle espagnol à la maison. Pourtant, les enfants parlent un excellent français grâce à l’école.',
      },
      {
        examiner: 'Pour terminer ?',
        goal: 'Concluez en reprenant votre opinion.',
        hints: ['Pour conclure… / En somme…', 'Pour conclure, l’essentiel, c’est de …'],
        model: 'Pour conclure, l’essentiel, c’est de pratiquer le français tous les jours, mais sans abandonner sa propre langue.',
      },
    ],
  },
];

// The model answers of a dialogue cut into sentences, for shadowing.
export function shadowingLines(d: Dialogue): string[] {
  return d.turns.flatMap((t) => t.model.split(/(?<=[.!?])\s+/));
}
