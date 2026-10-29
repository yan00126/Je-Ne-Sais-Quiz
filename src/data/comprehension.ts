export type Question = {
  prompt: string;
  choices: string[];
  answer: number; // index into choices
};

export type ComprehensionItem = {
  id: string;
  level: 'A2' | 'B1' | 'B2';
  title: string;
  // Reading: the text shown on screen. Listening: the script read aloud by text-to-speech.
  text: string;
  questions: Question[];
};

export const READING: ComprehensionItem[] = [
  {
    id: 'r001',
    level: 'A2',
    title: 'Avis aux résidents',
    text:
      "Avis aux résidents de l'immeuble\n\nEn raison de travaux de plomberie, l'eau chaude sera coupée le mardi 14 de 9 h à 15 h. " +
      "Nous vous prions de ne pas utiliser le lave-linge pendant cette période. " +
      'Pour toute question, communiquez avec le concierge au poste 102.',
    questions: [
      {
        prompt: 'Pourquoi l’eau chaude sera-t-elle coupée ?',
        choices: ['À cause d’une panne d’électricité', 'Pour des travaux de plomberie', 'Pour économiser l’énergie', 'À cause du froid'],
        answer: 1,
      },
      {
        prompt: 'Que demande-t-on aux résidents ?',
        choices: ['De quitter l’immeuble', 'D’appeler la ville', 'De ne pas utiliser le lave-linge', 'De payer les travaux'],
        answer: 2,
      },
    ],
  },
  {
    id: 'r002',
    level: 'B1',
    title: 'Le télétravail après la pandémie',
    text:
      'Depuis 2020, de nombreuses entreprises canadiennes ont adopté le télétravail. Selon une enquête récente, ' +
      'six employés sur dix souhaitent continuer à travailler de la maison au moins deux jours par semaine. ' +
      'Ils citent surtout la réduction du temps de trajet et un meilleur équilibre entre vie professionnelle et vie privée. ' +
      'Cependant, certains gestionnaires craignent une baisse de la collaboration et un sentiment d’isolement chez les nouveaux employés. ' +
      'Beaucoup d’organisations optent donc pour un modèle hybride.',
    questions: [
      {
        prompt: 'Que souhaitent la majorité des employés interrogés ?',
        choices: [
          'Retourner au bureau à temps plein',
          'Travailler de la maison au moins deux jours par semaine',
          'Travailler uniquement de la maison',
          'Réduire leurs heures de travail',
        ],
        answer: 1,
      },
      {
        prompt: 'Quelle crainte les gestionnaires expriment-ils ?',
        choices: ['Une hausse des coûts', 'Une baisse de la productivité individuelle', 'L’isolement des nouveaux employés', 'Des problèmes informatiques'],
        answer: 2,
      },
      {
        prompt: 'Quelle solution beaucoup d’organisations choisissent-elles ?',
        choices: ['Le modèle hybride', 'La semaine de quatre jours', 'Le retour obligatoire au bureau', 'Le travail de nuit'],
        answer: 0,
      },
    ],
  },
  {
    id: 'r003',
    level: 'B2',
    title: 'Faut-il rendre les transports en commun gratuits ?',
    text:
      'Plusieurs villes européennes ont rendu leurs transports en commun gratuits, et l’idée fait son chemin au Québec. ' +
      'Ses partisans affirment que la gratuité inciterait les automobilistes à laisser leur voiture, réduisant ainsi la congestion et les émissions. ' +
      'Les sceptiques rappellent toutefois que le prix n’est pas le principal frein : la fréquence et la fiabilité du service comptent davantage. ' +
      'Selon eux, il vaudrait mieux investir dans de nouvelles lignes plutôt que de renoncer aux revenus des billets, ' +
      'qui financent une part importante de l’entretien du réseau.',
    questions: [
      {
        prompt: 'Selon les sceptiques, qu’est-ce qui freine surtout l’usage des transports en commun ?',
        choices: ['Le prix des billets', 'La qualité et la fréquence du service', 'Le manque de stationnement', 'La météo'],
        answer: 1,
      },
      {
        prompt: 'Pourquoi les sceptiques s’inquiètent-ils de la gratuité ?',
        choices: [
          'Elle augmenterait la pollution',
          'Elle priverait le réseau de revenus utiles à son entretien',
          'Elle attirerait trop de touristes',
          'Elle serait illégale',
        ],
        answer: 1,
      },
      {
        prompt: 'Quel est le ton général du texte ?',
        choices: ['Il présente les deux points de vue', 'Il défend uniquement la gratuité', 'Il est humoristique', 'Il rejette l’idée sans argument'],
        answer: 0,
      },
    ],
  },
];

export const LISTENING: ComprehensionItem[] = [
  {
    id: 'l001',
    level: 'A2',
    title: 'Message sur le répondeur',
    text:
      "Bonjour, ici Sophie de la clinique dentaire du Plateau. Je vous appelle pour confirmer votre rendez-vous de jeudi à 10 h 30. " +
      'Si vous ne pouvez pas venir, merci de nous rappeler au moins vingt-quatre heures à l’avance. Bonne journée !',
    questions: [
      {
        prompt: 'Pourquoi Sophie appelle-t-elle ?',
        choices: ['Pour annuler un rendez-vous', 'Pour confirmer un rendez-vous', 'Pour vendre un produit', 'Pour demander un paiement'],
        answer: 1,
      },
      {
        prompt: 'Que faut-il faire en cas d’empêchement ?',
        choices: ['Envoyer un courriel', 'Venir plus tard', 'Rappeler 24 heures à l’avance', 'Rien'],
        answer: 2,
      },
    ],
  },
  {
    id: 'l002',
    level: 'B1',
    title: 'Annonce à la radio',
    text:
      'La bibliothèque municipale organise samedi prochain une journée portes ouvertes. Au programme : des ateliers de conversation pour les nouveaux arrivants, ' +
      'une heure du conte pour les enfants et une présentation des ressources en ligne. L’entrée est gratuite, mais l’inscription aux ateliers est obligatoire sur le site de la ville.',
    questions: [
      {
        prompt: 'À qui s’adressent les ateliers de conversation ?',
        choices: ['Aux enfants', 'Aux nouveaux arrivants', 'Aux bibliothécaires', 'Aux retraités'],
        answer: 1,
      },
      {
        prompt: 'Qu’est-ce qui est obligatoire ?',
        choices: ['Payer l’entrée', 'S’inscrire aux ateliers', 'Avoir une carte de bibliothèque', 'Venir avec un enfant'],
        answer: 1,
      },
    ],
  },
  {
    id: 'l003',
    level: 'B2',
    title: 'Entrevue : l’alimentation locale',
    text:
      'Journaliste : Vous militez pour l’achat local. Pourquoi ? ' +
      'Agricultrice : D’abord pour l’environnement, évidemment, mais pas seulement. Quand on achète directement aux producteurs, l’argent reste dans la région. ' +
      'Cela dit, je ne suis pas naïve : en hiver, il est difficile de se nourrir uniquement de produits locaux au Québec. ' +
      'L’essentiel, c’est de privilégier le local quand c’est possible, sans culpabiliser le reste du temps.',
    questions: [
      {
        prompt: 'Quel argument l’agricultrice ajoute-t-elle à l’environnement ?',
        choices: ['La santé', 'L’économie régionale', 'Le goût des produits', 'Le prix plus bas'],
        answer: 1,
      },
      {
        prompt: 'Quelle est sa position finale ?',
        choices: [
          'Il faut manger uniquement local',
          'L’achat local est inutile',
          'Il faut privilégier le local quand c’est possible',
          'Il faut importer davantage',
        ],
        answer: 2,
      },
    ],
  },
];
