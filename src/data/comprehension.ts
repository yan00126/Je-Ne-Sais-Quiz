export type Question = {
  prompt: string;
  choices: string[];
  answer: number; // index into choices
  explanation?: string; // why the answer is right, shown after answering and in the mistake log
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
        explanation:
          'Le texte dit : « En raison de travaux de plomberie ». « En raison de » = à cause de.',
      },
      {
        prompt: 'Que demande-t-on aux résidents ?',
        choices: ['De quitter l’immeuble', 'D’appeler la ville', 'De ne pas utiliser le lave-linge', 'De payer les travaux'],
        answer: 2,
        explanation:
          '« Nous vous prions de ne pas utiliser le lave-linge » : « prier quelqu’un de » = demander poliment.',
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
        explanation:
          '« Six employés sur dix » = la majorité ; ils veulent le télétravail « au moins deux jours par semaine », pas tout le temps.',
      },
      {
        prompt: 'Quelle crainte les gestionnaires expriment-ils ?',
        choices: ['Une hausse des coûts', 'Une baisse de la productivité individuelle', 'L’isolement des nouveaux employés', 'Des problèmes informatiques'],
        answer: 2,
        explanation:
          '« Craindre » = avoir peur. Le texte cite « un sentiment d’isolement chez les nouveaux employés ».',
      },
      {
        prompt: 'Quelle solution beaucoup d’organisations choisissent-elles ?',
        choices: ['Le modèle hybride', 'La semaine de quatre jours', 'Le retour obligatoire au bureau', 'Le travail de nuit'],
        answer: 0,
        explanation:
          'Dernière phrase : « Beaucoup d’organisations optent donc pour un modèle hybride ». « Opter pour » = choisir.',
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
        explanation:
          '« Le prix n’est pas le principal frein : la fréquence et la fiabilité du service comptent davantage. » Attention au piège : le prix est cité, mais pour dire que ce n’est PAS l’essentiel.',
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
        explanation:
          'Les billets « financent une part importante de l’entretien du réseau ». Sans billets, moins d’argent pour l’entretien.',
      },
      {
        prompt: 'Quel est le ton général du texte ?',
        choices: ['Il présente les deux points de vue', 'Il défend uniquement la gratuité', 'Il est humoristique', 'Il rejette l’idée sans argument'],
        answer: 0,
        explanation:
          'Le texte donne l’avis des « partisans » puis des « sceptiques » (« toutefois ») : il présente les deux côtés.',
      },
    ],
  },
  {
    id: 'r004',
    level: 'A2',
    title: 'Petite annonce',
    text:
      'À louer : 4 et demie au deuxième étage, quartier Rosemont, près du métro. Chauffage et eau chaude inclus. ' +
      'Libre le 1er juillet. 1 450 $ par mois. Pas d’animaux. Visites le samedi seulement. Écrire à Marc : marc.r@courriel.ca',
    questions: [
      {
        prompt: 'Qu’est-ce qui est compris dans le loyer ?',
        choices: ['L’électricité', 'Le chauffage et l’eau chaude', 'Internet', 'Le stationnement'],
        answer: 1,
        explanation: '« Chauffage et eau chaude inclus » : « inclus » = compris dans le prix.',
      },
      {
        prompt: 'Quand peut-on visiter l’appartement ?',
        choices: ['Tous les jours', 'Le samedi', 'Le 1er juillet', 'En semaine le soir'],
        answer: 1,
        explanation: '« Visites le samedi seulement ». Le 1er juillet est la date où l’appartement est libre.',
      },
      {
        prompt: 'Que doit faire une personne intéressée ?',
        choices: ['Téléphoner à Marc', 'Aller sur place', 'Envoyer un courriel', 'Passer à l’agence'],
        answer: 2,
        explanation: '« Écrire à Marc » suivi d’une adresse courriel : il faut envoyer un courriel.',
      },
    ],
  },
  {
    id: 'r005',
    level: 'B1',
    title: 'Courriel de l’école de langues',
    text:
      'Bonjour à tous,\n\nEn raison de la tempête de neige annoncée pour demain, les cours du matin sont annulés. ' +
      'Les cours de l’après-midi auront lieu en ligne, aux heures habituelles ; vous recevrez le lien par courriel avant midi. ' +
      'Les examens prévus demain sont reportés à lundi prochain. La bibliothèque restera fermée toute la journée.\n\nLa direction',
    questions: [
      {
        prompt: 'Pourquoi l’école modifie-t-elle son horaire ?',
        choices: ['Une grève', 'Des travaux', 'Une tempête de neige', 'Un jour férié'],
        answer: 2,
        explanation: '« En raison de la tempête de neige annoncée pour demain ».',
      },
      {
        prompt: 'Que se passe-t-il pour les cours de l’après-midi ?',
        choices: ['Ils sont annulés', 'Ils ont lieu en ligne', 'Ils commencent plus tard', 'Ils sont déplacés à lundi'],
        answer: 1,
        explanation: '« Les cours de l’après-midi auront lieu en ligne, aux heures habituelles ». Ce sont les cours du matin qui sont annulés.',
      },
      {
        prompt: 'Que deviennent les examens ?',
        choices: ['Ils sont annulés', 'Ils se font en ligne', 'Ils sont reportés', 'Ils ont lieu à la bibliothèque'],
        answer: 2,
        explanation: '« Reportés à lundi prochain » : « reporter » = déplacer à une date plus tard.',
      },
      {
        prompt: 'Quand les étudiants recevront-ils le lien ?',
        choices: ['Ce soir', 'Avant midi', 'Lundi', 'Au début du cours'],
        answer: 1,
        explanation: '« Vous recevrez le lien par courriel avant midi ».',
      },
    ],
  },
  {
    id: 'r006',
    level: 'B1',
    title: 'Les jardins communautaires',
    text:
      'À Montréal, plus de 8 000 personnes cultivent un petit terrain dans l’un des jardins communautaires de la ville. ' +
      'Pour quelques dollars par an, chaque jardinier reçoit une parcelle où il fait pousser des légumes et des fleurs. ' +
      'Mais les places sont rares : dans certains quartiers, il faut attendre plus de trois ans. ' +
      'Les participants apprécient surtout les rencontres avec les voisins, souvent plus que la récolte elle-même. ' +
      'La ville prévoit d’ouvrir cinq nouveaux jardins d’ici 2028.',
    questions: [
      {
        prompt: 'Quel est le principal problème mentionné ?',
        choices: ['Le prix élevé', 'Le manque de places', 'Le mauvais climat', 'Le manque de bénévoles'],
        answer: 1,
        explanation: '« Les places sont rares : il faut attendre plus de trois ans ». Le prix, lui, est bas (« quelques dollars »).',
      },
      {
        prompt: 'Qu’est-ce que les jardiniers aiment le plus ?',
        choices: ['Manger leurs légumes', 'Économiser de l’argent', 'Rencontrer leurs voisins', 'Gagner des concours'],
        answer: 2,
        explanation: '« Les participants apprécient surtout les rencontres avec les voisins, souvent plus que la récolte elle-même. »',
      },
      {
        prompt: 'Que prévoit la ville ?',
        choices: ['Fermer des jardins', 'Augmenter les prix', 'Ouvrir de nouveaux jardins', 'Réduire l’attente à un an'],
        answer: 2,
        explanation: '« La ville prévoit d’ouvrir cinq nouveaux jardins d’ici 2028. » « D’ici » = avant cette date.',
      },
    ],
  },
  {
    id: 'r007',
    level: 'B1',
    title: 'Offre d’emploi',
    text:
      'La Coop Santé de l’Outaouais recherche un ou une adjoint(e) administratif(ve) bilingue. ' +
      'Tâches : accueil des patients, prise de rendez-vous, gestion des dossiers. ' +
      'Exigences : diplôme d’études collégiales, deux ans d’expérience, excellente maîtrise du français et de l’anglais. ' +
      'Poste permanent, 35 heures par semaine, du lundi au vendredi. Avantages : assurance collective, quatre semaines de vacances. ' +
      'Envoyez votre CV et une lettre de motivation avant le 15 novembre.',
    questions: [
      {
        prompt: 'Quelle compétence est indispensable ?',
        choices: ['Parler espagnol', 'Être infirmier', 'Parler français et anglais', 'Avoir un permis de conduire'],
        answer: 2,
        explanation: '« Bilingue » et « excellente maîtrise du français et de l’anglais » dans les exigences.',
      },
      {
        prompt: 'Quel est l’horaire de travail ?',
        choices: ['Les fins de semaine', 'Du lundi au vendredi', 'Le soir seulement', 'À temps partiel'],
        answer: 1,
        explanation: '« 35 heures par semaine, du lundi au vendredi ». 35 h = temps plein, pas temps partiel.',
      },
      {
        prompt: 'Que faut-il envoyer ?',
        choices: ['Un diplôme et une photo', 'Un CV et une lettre de motivation', 'Des références seulement', 'Un formulaire en ligne'],
        answer: 1,
        explanation: 'Dernière phrase : « Envoyez votre CV et une lettre de motivation ».',
      },
      {
        prompt: 'Lequel de ces avantages est offert ?',
        choices: ['Une voiture de fonction', 'Le télétravail', 'Une assurance collective', 'Un logement'],
        answer: 2,
        explanation: '« Avantages : assurance collective, quatre semaines de vacances ».',
      },
    ],
  },
  {
    id: 'r008',
    level: 'B2',
    title: 'Les écrans et le sommeil des adolescents',
    text:
      'Une étude menée auprès de 3 000 élèves québécois montre que ceux qui utilisent leur téléphone dans l’heure précédant le coucher dorment en moyenne 40 minutes de moins. ' +
      'Les chercheurs ne mettent pas seulement en cause la lumière bleue des écrans : selon eux, c’est surtout le contenu, ' +
      'conçu pour retenir l’attention, qui retarde l’endormissement. ' +
      'Ils recommandent donc moins d’interdire les appareils que d’aider les jeunes à fixer eux-mêmes leurs limites, ' +
      'une approche qui, d’après l’étude, donne de meilleurs résultats à long terme.',
    questions: [
      {
        prompt: 'Selon les chercheurs, quelle est la cause principale du problème ?',
        choices: ['La lumière bleue', 'Le contenu des applications', 'Le bruit des notifications', 'Les devoirs le soir'],
        answer: 1,
        explanation:
          '« Ne mettent pas seulement en cause la lumière bleue : c’est surtout le contenu ». Piège : la lumière bleue est citée, mais « pas seulement » et « surtout » montrent que le contenu compte davantage.',
      },
      {
        prompt: 'Que recommandent les chercheurs ?',
        choices: [
          'Interdire les téléphones le soir',
          'Aider les jeunes à se fixer leurs propres limites',
          'Utiliser des filtres de lumière bleue',
          'Retarder l’heure de l’école',
        ],
        answer: 1,
        explanation: '« Moins d’interdire… que d’aider les jeunes à fixer eux-mêmes leurs limites ». « Moins X que Y » = Y plutôt que X.',
      },
      {
        prompt: 'Combien de sommeil perdent les élèves concernés ?',
        choices: ['10 minutes', '40 minutes', 'Une heure', 'Deux heures'],
        answer: 1,
        explanation: '« Dorment en moyenne 40 minutes de moins ». « L’heure précédant le coucher » est le moment d’utilisation, pas la perte.',
      },
      {
        prompt: 'Que signifie « retarder l’endormissement » ?',
        choices: ['Se réveiller trop tôt', 'Mettre plus de temps à s’endormir', 'Mal dormir la nuit', 'Faire des cauchemars'],
        answer: 1,
        explanation: '« L’endormissement » = le moment où l’on s’endort ; « retarder » = faire arriver plus tard.',
      },
    ],
  },
  {
    id: 'r009',
    level: 'B2',
    title: 'Opinion : la semaine de quatre jours',
    text:
      'On présente souvent la semaine de quatre jours comme la solution miracle à l’épuisement professionnel. ' +
      'Je n’en suis pas si sûre. Dans bien des cas, les employés font en quatre jours le travail de cinq, avec des journées de dix heures. ' +
      'Le stress ne disparaît pas : il se concentre. Pour qu’une telle réforme ait un sens, il faudrait réduire réellement la charge de travail, ' +
      'et non simplement la réorganiser. Sinon, on aura changé le calendrier sans rien changer à la vie des gens.',
    questions: [
      {
        prompt: 'Quelle est l’opinion de l’auteure sur la semaine de quatre jours ?',
        choices: ['Elle y est totalement favorable', 'Elle est sceptique', 'Elle n’a pas d’avis', 'Elle veut une semaine de trois jours'],
        answer: 1,
        explanation: '« Je n’en suis pas si sûre » montre un doute : elle est sceptique, sans rejeter complètement l’idée.',
      },
      {
        prompt: 'Que veut dire « le stress se concentre » ici ?',
        choices: [
          'Le stress disparaît le vendredi',
          'Le même stress est réparti sur moins de jours',
          'Les employés se concentrent mieux',
          'Le stress augmente chaque semaine',
        ],
        answer: 1,
        explanation: 'Les employés font « en quatre jours le travail de cinq » : le stress est le même, mais sur moins de jours.',
      },
      {
        prompt: 'À quelle condition la réforme serait-elle utile selon l’auteure ?',
        choices: [
          'Si les salaires augmentent',
          'Si la charge de travail diminue vraiment',
          'Si tout le monde a congé le lundi',
          'Si les journées durent dix heures',
        ],
        answer: 1,
        explanation: '« Il faudrait réduire réellement la charge de travail, et non simplement la réorganiser. »',
      },
    ],
  },
  {
    id: 'r010',
    level: 'B1',
    title: 'Règlement de la piscine',
    text:
      'Piscine municipale – Règlement\n• Douche obligatoire avant la baignade.\n• Bonnet de bain obligatoire pour les cheveux longs.\n' +
      '• Les enfants de moins de 8 ans doivent être accompagnés d’un adulte dans l’eau.\n• Nourriture interdite sur le bord de la piscine.\n' +
      '• Les casiers sont gratuits ; apportez votre cadenas. La piscine n’est pas responsable des objets perdus.',
    questions: [
      {
        prompt: 'Qui doit porter un bonnet de bain ?',
        choices: ['Tout le monde', 'Les enfants', 'Les personnes aux cheveux longs', 'Les nageurs débutants'],
        answer: 2,
        explanation: '« Bonnet de bain obligatoire pour les cheveux longs ».',
      },
      {
        prompt: 'Un enfant de 6 ans peut-il nager seul ?',
        choices: ['Oui', 'Non, un adulte doit être dans l’eau avec lui', 'Oui, s’il porte un bonnet', 'Seulement le matin'],
        answer: 1,
        explanation: 'Moins de 8 ans = « accompagnés d’un adulte dans l’eau ».',
      },
      {
        prompt: 'Que faut-il apporter pour utiliser un casier ?',
        choices: ['De l’argent', 'Un cadenas', 'Une carte de membre', 'Rien'],
        answer: 1,
        explanation: '« Les casiers sont gratuits ; apportez votre cadenas. » Gratuit = pas d’argent, mais il faut un cadenas.',
      },
    ],
  },
  {
    id: 'r011',
    level: 'B2',
    title: 'Le français au travail',
    text:
      'Depuis l’adoption de nouvelles règles linguistiques, les entreprises québécoises de 25 employés et plus doivent démontrer que le français est la langue normale du travail. ' +
      'Pour les employeurs, l’enjeu est double : respecter la loi tout en attirant des talents venus de l’étranger, qui ne maîtrisent pas toujours la langue à leur arrivée. ' +
      'Plusieurs entreprises offrent désormais des cours de français pendant les heures de travail, une mesure qui favorise aussi la rétention du personnel, ' +
      'puisque les employés qui se sentent intégrés quittent moins souvent leur emploi.',
    questions: [
      {
        prompt: 'Quelles entreprises sont concernées par les règles ?',
        choices: ['Toutes les entreprises', 'Celles de 25 employés et plus', 'Seulement les entreprises publiques', 'Les entreprises étrangères'],
        answer: 1,
        explanation: '« Les entreprises québécoises de 25 employés et plus ».',
      },
      {
        prompt: 'Pourquoi l’enjeu est-il « double » ?',
        choices: [
          'Parce qu’il faut parler deux langues',
          'Parce qu’il faut respecter la loi et recruter à l’étranger',
          'Parce que les cours coûtent deux fois plus cher',
          'Parce que la loi change deux fois par an',
        ],
        answer: 1,
        explanation: '« Respecter la loi tout en attirant des talents venus de l’étranger » : deux objectifs à la fois.',
      },
      {
        prompt: 'Quel autre avantage les cours de français apportent-ils ?',
        choices: ['Des économies d’impôt', 'Les employés restent plus longtemps', 'Des clients étrangers', 'Moins d’heures de travail'],
        answer: 1,
        explanation: '« Favorise la rétention du personnel… quittent moins souvent leur emploi ». « Rétention » = garder les employés.',
      },
      {
        prompt: 'Que signifie « désormais » ?',
        choices: ['Autrefois', 'À partir de maintenant', 'Rarement', 'Malheureusement'],
        answer: 1,
        explanation: '« Désormais » = à partir de maintenant (synonyme : dorénavant).',
      },
    ],
  },
  {
    id: 'r012',
    level: 'B1',
    title: 'Message de la propriétaire',
    text:
      'Bonjour Monsieur Lin,\n\nJe vous informe que le technicien passera vérifier les détecteurs de fumée de l’immeuble mercredi entre 13 h et 16 h. ' +
      'Si vous êtes absent, il entrera avec la clé de secours, comme le permet votre bail. ' +
      'Si cet horaire ne vous convient pas, merci de me prévenir d’ici lundi afin que je puisse lui proposer une autre date.\n\nCordialement,\nMme Tremblay',
    questions: [
      {
        prompt: 'Pourquoi le technicien vient-il ?',
        choices: ['Réparer le chauffage', 'Vérifier les détecteurs de fumée', 'Changer les serrures', 'Repeindre l’appartement'],
        answer: 1,
        explanation: '« Le technicien passera vérifier les détecteurs de fumée ».',
      },
      {
        prompt: 'Que se passe-t-il si M. Lin n’est pas là ?',
        choices: ['La visite est annulée', 'Le technicien entre avec une clé', 'Il doit payer des frais', 'Le technicien revient le soir'],
        answer: 1,
        explanation: '« Si vous êtes absent, il entrera avec la clé de secours ».',
      },
      {
        prompt: 'Que doit faire M. Lin si l’horaire ne lui convient pas ?',
        choices: ['Appeler le technicien', 'Prévenir la propriétaire avant lundi', 'Laisser une note sur la porte', 'Changer la date en ligne'],
        answer: 1,
        explanation: '« Merci de me prévenir d’ici lundi » : « me » = la propriétaire ; « d’ici lundi » = avant lundi.',
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
        explanation:
          '« Je vous appelle pour confirmer votre rendez-vous ». Annuler serait le contraire.',
      },
      {
        prompt: 'Que faut-il faire en cas d’empêchement ?',
        choices: ['Envoyer un courriel', 'Venir plus tard', 'Rappeler 24 heures à l’avance', 'Rien'],
        answer: 2,
        explanation:
          '« Merci de nous rappeler au moins vingt-quatre heures à l’avance. » « Un empêchement » = quelque chose qui vous empêche de venir.',
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
        explanation:
          '« Des ateliers de conversation pour les nouveaux arrivants ». L’heure du conte, elle, est pour les enfants.',
      },
      {
        prompt: 'Qu’est-ce qui est obligatoire ?',
        choices: ['Payer l’entrée', 'S’inscrire aux ateliers', 'Avoir une carte de bibliothèque', 'Venir avec un enfant'],
        answer: 1,
        explanation:
          '« L’entrée est gratuite, mais l’inscription aux ateliers est obligatoire. » « Mais » introduit la condition importante.',
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
        explanation:
          '« Pas seulement… l’argent reste dans la région » : c’est l’argument de l’économie régionale.',
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
        explanation:
          '« L’essentiel, c’est de privilégier le local quand c’est possible ». « Cela dit, je ne suis pas naïve » montre qu’elle n’est pas extrême.',
      },
    ],
  },
  {
    id: 'l004',
    level: 'A2',
    title: 'Annonce dans le métro',
    text:
      'Mesdames et messieurs, en raison d’un incident technique, le service est interrompu sur la ligne orange entre les stations Jean-Talon et Montmorency. ' +
      'Des autobus remplacent le métro sur ce tronçon. Nous prévoyons une reprise du service vers dix-huit heures. Merci de votre compréhension.',
    questions: [
      {
        prompt: 'Quel est le problème ?',
        choices: ['Un accident de voiture', 'Un incident technique', 'Une grève', 'Une tempête'],
        answer: 1,
        explanation: '« En raison d’un incident technique ».',
      },
      {
        prompt: 'Comment les passagers peuvent-ils continuer leur trajet ?',
        choices: ['En taxi', 'En autobus', 'À pied', 'En train'],
        answer: 1,
        explanation: '« Des autobus remplacent le métro sur ce tronçon. »',
      },
      {
        prompt: 'Quand le service devrait-il reprendre ?',
        choices: ['Dans dix minutes', 'Vers 18 h', 'Demain matin', 'On ne sait pas'],
        answer: 1,
        explanation: '« Nous prévoyons une reprise du service vers dix-huit heures. »',
      },
    ],
  },
  {
    id: 'l005',
    level: 'A2',
    title: 'À la pharmacie',
    text:
      'Client : Bonjour, j’ai mal à la gorge depuis trois jours et je tousse beaucoup la nuit. ' +
      'Pharmacienne : Avez-vous de la fièvre ? Client : Non, pas de fièvre. ' +
      'Pharmacienne : Je vous conseille ce sirop, deux fois par jour. Si ça ne va pas mieux dans cinq jours, il faudra consulter un médecin.',
    questions: [
      {
        prompt: 'Depuis combien de temps le client est-il malade ?',
        choices: ['Un jour', 'Trois jours', 'Cinq jours', 'Une semaine'],
        answer: 1,
        explanation: '« Depuis trois jours ». « Cinq jours » est le délai avant de voir un médecin.',
      },
      {
        prompt: 'Que conseille la pharmacienne ?',
        choices: ['Des antibiotiques', 'Un sirop', 'Du repos seulement', 'D’aller à l’hôpital'],
        answer: 1,
        explanation: '« Je vous conseille ce sirop, deux fois par jour. »',
      },
      {
        prompt: 'Quand faut-il voir un médecin ?',
        choices: ['Tout de suite', 'S’il a de la fièvre ce soir', 'Si ça ne va pas mieux dans cinq jours', 'Jamais'],
        answer: 2,
        explanation: '« Si ça ne va pas mieux dans cinq jours, il faudra consulter un médecin. »',
      },
    ],
  },
  {
    id: 'l006',
    level: 'B1',
    title: 'Message d’un collègue',
    text:
      'Salut, c’est Karim. Écoute, la réunion avec le client est déplacée à jeudi, quatorze heures, au lieu de mercredi. ' +
      'Est-ce que tu pourrais préparer la présentation des résultats du trimestre ? Moi, je m’occupe du budget. ' +
      'Et pense à réserver la grande salle, la petite est déjà prise. Rappelle-moi si tu as un souci. Merci !',
    questions: [
      {
        prompt: 'Quand a lieu la réunion maintenant ?',
        choices: ['Mercredi à 14 h', 'Jeudi à 14 h', 'Jeudi à 10 h', 'Mercredi à 10 h'],
        answer: 1,
        explanation: '« Déplacée à jeudi, quatorze heures, au lieu de mercredi ». « Au lieu de » indique l’ancienne date.',
      },
      {
        prompt: 'Que doit préparer la personne qui écoute ?',
        choices: ['Le budget', 'La présentation des résultats', 'Le repas', 'Le contrat'],
        answer: 1,
        explanation: '« Est-ce que tu pourrais préparer la présentation des résultats ? Moi, je m’occupe du budget. »',
      },
      {
        prompt: 'Quelle salle faut-il réserver ?',
        choices: ['La petite salle', 'La grande salle', 'La salle du client', 'Aucune'],
        answer: 1,
        explanation: '« Pense à réserver la grande salle, la petite est déjà prise. »',
      },
    ],
  },
  {
    id: 'l007',
    level: 'B1',
    title: 'Bulletin météo',
    text:
      'Bonjour ! Ce matin, ciel nuageux avec un risque d’averses de neige en fin de matinée. ' +
      'Cet après-midi, les nuages laisseront place au soleil, mais le vent du nord fera chuter les températures : moins quinze degrés ressentis en soirée. ' +
      'Demain, journée ensoleillée et froide. Prudence sur les routes ce soir : la chaussée sera glissante.',
    questions: [
      {
        prompt: 'Quel temps fera-t-il cet après-midi ?',
        choices: ['De la neige', 'Du soleil', 'De la pluie', 'Du brouillard'],
        answer: 1,
        explanation: '« Les nuages laisseront place au soleil ». La neige est prévue en fin de matinée.',
      },
      {
        prompt: 'Pourquoi les températures vont-elles baisser ?',
        choices: ['À cause de la neige', 'À cause du vent du nord', 'À cause des nuages', 'À cause de la nuit'],
        answer: 1,
        explanation: '« Le vent du nord fera chuter les températures ». « Chuter » = baisser fortement.',
      },
      {
        prompt: 'Quel conseil donne-t-on ?',
        choices: ['Rester à la maison demain', 'Faire attention sur les routes ce soir', 'Prendre un parapluie', 'Sortir le matin'],
        answer: 1,
        explanation: '« Prudence sur les routes ce soir : la chaussée sera glissante. »',
      },
    ],
  },
  {
    id: 'l008',
    level: 'B1',
    title: 'Inscription au cégep',
    text:
      'Employé : Pour vous inscrire, il nous faut votre relevé de notes, une preuve de résidence au Québec et une pièce d’identité. ' +
      'Étudiante : Mes relevés sont en chinois, est-ce que c’est un problème ? ' +
      'Employé : Oui, il faut une traduction officielle, faite par un traducteur agréé. La date limite est le premier mars, mais je vous conseille de ne pas attendre, la traduction prend souvent deux ou trois semaines.',
    questions: [
      {
        prompt: 'Quel document pose un problème à l’étudiante ?',
        choices: ['Sa pièce d’identité', 'Sa preuve de résidence', 'Son relevé de notes', 'Son passeport'],
        answer: 2,
        explanation: '« Mes relevés sont en chinois » : le relevé de notes doit être traduit.',
      },
      {
        prompt: 'Qui doit faire la traduction ?',
        choices: ['L’étudiante elle-même', 'Un ami bilingue', 'Un traducteur agréé', 'Le cégep'],
        answer: 2,
        explanation: '« Une traduction officielle, faite par un traducteur agréé ». « Agréé » = reconnu officiellement.',
      },
      {
        prompt: 'Pourquoi l’employé conseille-t-il de ne pas attendre ?',
        choices: [
          'Parce que les places sont limitées',
          'Parce que la traduction prend du temps',
          'Parce que les prix augmentent',
          'Parce que le bureau ferme',
        ],
        answer: 1,
        explanation: '« La traduction prend souvent deux ou trois semaines. »',
      },
    ],
  },
  {
    id: 'l009',
    level: 'B2',
    title: 'Chronique radio : le bénévolat',
    text:
      'On croit souvent que les bénévoles sont surtout des retraités. Or, les chiffres les plus récents montrent que ce sont les 15 à 24 ans qui s’engagent le plus, ' +
      'même si c’est souvent pour de courtes périodes. Ce qui a changé, c’est la manière de s’impliquer : les jeunes préfèrent des missions ponctuelles, ' +
      'qu’ils trouvent en ligne, plutôt qu’un engagement chaque semaine dans le même organisme. ' +
      'Pour les associations, le défi n’est donc pas de trouver des bénévoles, mais de les garder.',
    questions: [
      {
        prompt: 'Quelle idée reçue la chroniqueuse corrige-t-elle ?',
        choices: [
          'Que les jeunes ne font pas de bénévolat',
          'Que les bénévoles sont surtout des retraités',
          'Que le bénévolat est payé',
          'Que les associations ont trop de bénévoles',
        ],
        answer: 1,
        explanation: '« On croit souvent que… Or, les chiffres montrent… » : « or » introduit la correction de l’idée reçue.',
      },
      {
        prompt: 'Comment les jeunes préfèrent-ils s’engager ?',
        choices: ['Chaque semaine au même endroit', 'Par des missions courtes trouvées en ligne', 'Uniquement l’été', 'Avec leur école'],
        answer: 1,
        explanation: '« Des missions ponctuelles, qu’ils trouvent en ligne ». « Ponctuel » = de temps en temps, pas régulier.',
      },
      {
        prompt: 'Quel est le vrai défi des associations ?',
        choices: ['Trouver des bénévoles', 'Garder les bénévoles', 'Trouver de l’argent', 'Former les retraités'],
        answer: 1,
        explanation: '« Le défi n’est donc pas de trouver des bénévoles, mais de les garder. » « Ne… pas X, mais Y » : la réponse est Y.',
      },
    ],
  },
  {
    id: 'l010',
    level: 'B2',
    title: 'Entrevue : vivre en région',
    text:
      'Journaliste : Vous avez quitté Montréal pour Rimouski il y a deux ans. Des regrets ? ' +
      'Femme : Franchement, non. Mon loyer a baissé de moitié et je mets dix minutes pour aller au travail. ' +
      'Ce qui me manque, c’est l’offre culturelle : les concerts, les restaurants du monde entier. ' +
      'Mais j’ai découvert une vie de quartier que je n’avais pas en ville. Ici, tout le monde se connaît, pour le meilleur et pour le pire !',
    questions: [
      {
        prompt: 'La femme regrette-t-elle son déménagement ?',
        choices: ['Oui, beaucoup', 'Non', 'Elle veut retourner à Montréal', 'Elle ne sait pas encore'],
        answer: 1,
        explanation: '« Des regrets ? – Franchement, non. »',
      },
      {
        prompt: 'Qu’est-ce qui lui manque ?',
        choices: ['Sa famille', 'Les activités culturelles', 'Son ancien travail', 'Les transports en commun'],
        answer: 1,
        explanation: '« Ce qui me manque, c’est l’offre culturelle : les concerts, les restaurants ».',
      },
      {
        prompt: 'Que veut dire « pour le meilleur et pour le pire » ici ?',
        choices: [
          'Que c’est toujours positif',
          'Que cela a des bons et des mauvais côtés',
          'Qu’elle va se marier',
          'Que la ville est dangereuse',
        ],
        answer: 1,
        explanation: 'Expression : quelque chose a des avantages et des inconvénients. Tout le monde se connaît : c’est chaleureux, mais il y a peu d’intimité.',
      },
    ],
  },
  {
    id: 'l011',
    level: 'B1',
    title: 'Message de la garderie',
    text:
      'Bonjour, ici Nadia de la garderie Les Petits Pas. Votre fille Léa a un peu de fièvre depuis la sieste, trente-huit et demi. ' +
      'Selon notre politique, nous ne pouvons pas la garder avec de la fièvre. Pourriez-vous venir la chercher d’ici une heure ? ' +
      'Elle pourra revenir quand elle n’aura plus de fièvre depuis vingt-quatre heures.',
    questions: [
      {
        prompt: 'Pourquoi la garderie appelle-t-elle ?',
        choices: ['Léa est tombée', 'Léa a de la fièvre', 'La garderie ferme', 'Il manque un document'],
        answer: 1,
        explanation: '« Votre fille Léa a un peu de fièvre depuis la sieste ».',
      },
      {
        prompt: 'Que doit faire le parent ?',
        choices: ['Envoyer des médicaments', 'Venir chercher Léa d’ici une heure', 'Appeler un médecin', 'Rappeler demain'],
        answer: 1,
        explanation: '« Pourriez-vous venir la chercher d’ici une heure ? »',
      },
      {
        prompt: 'Quand Léa peut-elle revenir ?',
        choices: ['Demain matin', 'Après 24 heures sans fièvre', 'Dans une semaine', 'Avec un certificat médical'],
        answer: 1,
        explanation: '« Quand elle n’aura plus de fièvre depuis vingt-quatre heures. »',
      },
    ],
  },
  {
    id: 'l012',
    level: 'B2',
    title: 'Débat : l’intelligence artificielle à l’école',
    text:
      'Enseignant : Interdire l’intelligence artificielle en classe, c’est un combat perdu d’avance. Les élèves l’utilisent déjà. ' +
      'Je préfère leur apprendre à s’en servir de façon critique : vérifier les sources, repérer les erreurs. ' +
      'Parent : Je comprends, mais j’ai peur qu’ils perdent l’habitude de réfléchir par eux-mêmes. ' +
      'Enseignant : C’est justement pour ça qu’on fait encore beaucoup d’évaluations à la main, en classe.',
    questions: [
      {
        prompt: 'Quelle est la position de l’enseignant ?',
        choices: [
          'Il faut interdire l’IA',
          'Il faut apprendre aux élèves à l’utiliser de façon critique',
          'L’IA doit remplacer les enseignants',
          'L’IA n’a pas d’importance',
        ],
        answer: 1,
        explanation: '« Interdire… c’est un combat perdu d’avance… Je préfère leur apprendre à s’en servir de façon critique ».',
      },
      {
        prompt: 'De quoi le parent a-t-il peur ?',
        choices: [
          'Que l’IA coûte cher',
          'Que les élèves ne réfléchissent plus seuls',
          'Que les enseignants perdent leur emploi',
          'Que les notes baissent',
        ],
        answer: 1,
        explanation: '« Qu’ils perdent l’habitude de réfléchir par eux-mêmes ».',
      },
      {
        prompt: 'Comment l’enseignant répond-il à cette crainte ?',
        choices: ['Il interdit les téléphones', 'Il garde des évaluations à la main en classe', 'Il donne plus de devoirs', 'Il utilise un logiciel de détection'],
        answer: 1,
        explanation: '« C’est justement pour ça qu’on fait encore beaucoup d’évaluations à la main, en classe. »',
      },
    ],
  },
];
