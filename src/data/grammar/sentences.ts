import type { GrammarRule } from './types.ts';

// Prepositions, negation, questions, relatives, connectors, complex sentences.
export const SENTENCE_RULES: GrammarRule[] = [
  // Prépositions
  {
    id: 'G-PREP-01', topic: 'Prépositions', level: 'B1', title: 'Verbes suivis de « de » ou « à »',
    rule: 'Many verbs need a preposition before a noun or infinitive. Learn it with the verb: dépendre de, profiter de, avoir besoin de, s’occuper de; penser à, participer à, s’intéresser à, consister à + infinitive (consister en + noun).',
    examples: [{ fr: 'Tout dépend de la météo.', en: 'It all depends on the weather.' }, { fr: 'Elle participe à un atelier.', en: 'She takes part in a workshop.' }],
    pitfall: 'French has no preposition where English has one: "attendre le bus" (wait for), "chercher un emploi" (look for), "écouter la radio" (listen to), "regarder la télé" (watch), "payer le loyer" (pay for).',
    keywords: ['préposition', 'de', 'à', 'verbe', 'dépendre', 'profiter', 'penser à'],
  },
  {
    id: 'G-PREP-02', topic: 'Prépositions', level: 'B1', title: 'Verbe + infinitif : avec ou sans préposition',
    rule: 'No preposition after aimer, vouloir, pouvoir, devoir, savoir, aller, préférer. De after décider, essayer, éviter, oublier, refuser, accepter. À after commencer, continuer (or de), réussir, apprendre, hésiter.',
    examples: [{ fr: 'J’ai décidé de rester.', en: 'I decided to stay.' }, { fr: 'Il a réussi à obtenir son permis.', en: 'He managed to get his licence.' }],
    keywords: ['infinitif', 'préposition', 'décider de', 'réussir à', 'essayer de'],
  },
  {
    id: 'G-PREP-03', topic: 'Prépositions', level: 'A2', title: 'Moyens de transport',
    rule: 'En for vehicles you sit inside (en voiture, en bus, en train, en avion). À for those you sit on, and on foot: à vélo, à pied.',
    examples: [{ fr: 'Je vais au travail à pied, puis en métro.', en: 'I walk to work, then take the metro.' }],
    keywords: ['transport', 'en', 'à pied', 'à vélo', 'en bus'],
  },
  {
    id: 'G-PREP-04', topic: 'Prépositions', level: 'A2', title: 'Prépositions de temps',
    rule: 'À + hour; en + month, year, and en été / en automne / en hiver but au printemps; le + date; dans + delay from now; en + time taken.',
    examples: [{ fr: 'Je pars dans une semaine.', en: 'I leave in a week (from now).' }, { fr: 'J’ai fini en une heure.', en: 'I finished in (within) an hour.' }],
    keywords: ['temps', 'dans', 'en', 'à', 'date', 'heure'],
  },
  {
    id: 'G-PREP-05', topic: 'Prépositions', level: 'B1', title: 'Chez, dans, sur, par',
    rule: 'Chez + a person or a business name (chez le médecin, chez IKEA), but à la banque, à la pharmacie. Dans + inside a place or a newspaper. Sur + a website or a named channel (sur Internet, sur Radio-Canada), but à la radio, à la télé. Par + how often (deux fois par semaine).',
    examples: [{ fr: 'Je l’ai lu dans le journal et sur Internet.', en: 'I read it in the paper and online.' }, { fr: 'Je vais chez le dentiste.', en: 'I’m going to the dentist’s.' }],
    keywords: ['chez', 'dans', 'sur', 'par', 'préposition'],
  },

  // Négation et questions
  {
    id: 'G-NEG-01', topic: 'Négation et questions', level: 'A2', title: 'La négation',
    rule: 'Ne … pas around the conjugated verb. In compound tenses: around avoir/être. Before an infinitive: ne pas together.',
    examples: [{ fr: 'Je n’ai pas reçu la lettre.', en: 'I didn’t receive the letter.' }, { fr: 'Il est conseillé de ne pas sortir.', en: 'It is advised not to go out.' }],
    keywords: ['négation', 'ne pas', 'pas', 'negative'],
  },
  {
    id: 'G-NEG-02', topic: 'Négation et questions', level: 'B1', title: 'Les autres négations',
    rule: 'Ne … jamais (never), plus (no longer), rien (nothing), personne (nobody), aucun(e) (none), que (only), ni … ni (neither … nor).',
    examples: [{ fr: 'Je ne fume plus.', en: 'I no longer smoke.' }, { fr: 'Il n’y a aucune place.', en: 'There is no seat at all.' }],
    pitfall: 'Personne, aucun and nulle part go after the participle: "Je n’ai vu personne." But rien goes before: "Je n’ai rien vu."',
    keywords: ['jamais', 'plus', 'rien', 'personne', 'aucun', 'ne que'],
  },
  {
    id: 'G-QUEST-01', topic: 'Négation et questions', level: 'A2', title: 'Poser une question',
    rule: 'Three registers: intonation (Tu viens ?), est-ce que (Est-ce que tu viens ?), inversion, more formal (Viens-tu ?). Add -t- between two vowels: a-t-il.',
    examples: [{ fr: 'Quand est-ce que le cours commence ?', en: 'When does the class start?' }, { fr: 'Pourriez-vous m’aider ?', en: 'Could you help me?' }],
    keywords: ['question', 'est-ce que', 'inversion', 'interrogation'],
  },
  {
    id: 'G-QUEST-02', topic: 'Négation et questions', level: 'B1', title: 'Quel, lequel, qu’est-ce que',
    rule: 'Quel/quelle/quels/quelles + noun or + être. Lequel/laquelle replaces quel + noun. Qu’est-ce que = what (object); qu’est-ce qui = what (subject).',
    examples: [{ fr: 'Quelle est votre adresse ?', en: 'What is your address?' }, { fr: 'Qu’est-ce qui se passe ?', en: 'What is happening?' }],
    keywords: ['quel', 'lequel', 'qu’est-ce que', 'qu’est-ce qui'],
  },

  // Relatifs
  {
    id: 'G-REL-01', topic: 'Relatifs', level: 'B1', title: 'Qui et que',
    rule: 'Qui is the subject of the next verb. Que (qu’) is its direct object.',
    examples: [{ fr: 'La femme qui parle est ma voisine.', en: 'The woman who is talking is my neighbour.' }, { fr: 'Le livre que je lis est long.', en: 'The book (that) I’m reading is long.' }],
    pitfall: 'Que never drops in French, even when "that" drops in English.',
    keywords: ['relatif', 'qui', 'que', 'pronom relatif'],
  },
  {
    id: 'G-REL-02', topic: 'Relatifs', level: 'B1', title: 'Dont et où',
    rule: 'Dont replaces de + noun (parler de, avoir besoin de, être fier de). Où is for place and time.',
    examples: [{ fr: 'Le logement dont je rêve.', en: 'The home I dream of.' }, { fr: 'Le jour où je suis arrivé.', en: 'The day (when) I arrived.' }],
    keywords: ['dont', 'où', 'relatif', 'de'],
  },
  {
    id: 'G-REL-03', topic: 'Relatifs', level: 'B2', title: 'Lequel, auquel, duquel',
    rule: 'After a preposition, use lequel/laquelle/lesquels/lesquelles for things (avec lequel, pour laquelle); for people, usually qui (avec qui). À + lequel = auquel; de + lequel after a compound preposition (près de, à côté de) = duquel.',
    examples: [{ fr: 'Le projet auquel je participe.', en: 'The project I’m taking part in.' }, { fr: 'La raison pour laquelle je suis venu.', en: 'The reason why I came.' }],
    keywords: ['lequel', 'auquel', 'duquel', 'laquelle', 'relatif'],
  },
  {
    id: 'G-REL-04', topic: 'Relatifs', level: 'B1', title: 'Ce qui, ce que, ce dont',
    rule: 'Mean "what" (the thing that) or "which" (referring back to a whole idea): ce qui (subject), ce que (object), ce dont (verbs with de).',
    examples: [{ fr: 'Ce qui m’intéresse, c’est le salaire.', en: 'What interests me is the salary.' }, { fr: 'Dis-moi ce dont tu as besoin.', en: 'Tell me what you need.' }],
    keywords: ['ce qui', 'ce que', 'ce dont', 'what'],
  },

  // Connecteurs
  {
    id: 'G-CONN-01', topic: 'Connecteurs', level: 'B1', title: 'Exprimer la cause',
    rule: 'Parce que (answers pourquoi), car (written), puisque (the cause is known), comme (at the start), grâce à (good cause), à cause de (bad cause), en raison de (formal).',
    examples: [{ fr: 'Comme il pleuvait, nous sommes restés.', en: 'As it was raining, we stayed.' }, { fr: 'Grâce à ce cours, j’ai progressé.', en: 'Thanks to this course I improved.' }],
    keywords: ['cause', 'parce que', 'car', 'puisque', 'grâce à', 'à cause de'],
  },
  {
    id: 'G-CONN-02', topic: 'Connecteurs', level: 'B1', title: 'Exprimer la conséquence',
    rule: 'Donc, alors, c’est pourquoi, par conséquent (formal), si bien que, tellement … que.',
    examples: [{ fr: 'Le loyer est trop cher, c’est pourquoi je déménage.', en: 'The rent is too high, which is why I’m moving.' }],
    keywords: ['conséquence', 'donc', 'par conséquent', 'c’est pourquoi', 'si bien que'],
  },
  {
    id: 'G-CONN-03', topic: 'Connecteurs', level: 'B1', title: 'Opposition et concession',
    rule: 'Mais, pourtant, cependant, toutefois (however), alors que, tandis que (whereas), bien que + subjonctif, malgré + noun, même si + indicatif.',
    examples: [{ fr: 'Malgré la pluie, la fête a eu lieu.', en: 'Despite the rain, the party took place.' }, { fr: 'Même s’il est tard, je t’appelle.', en: 'Even if it’s late, I’ll call you.' }],
    pitfall: 'Malgré + noun, never malgré que in the exam. Même si is never followed by the subjunctive.',
    keywords: ['opposition', 'concession', 'malgré', 'bien que', 'pourtant', 'cependant', 'même si', 'alors que'],
  },
  {
    id: 'G-CONN-04', topic: 'Connecteurs', level: 'B1', title: 'Organiser un texte',
    rule: 'D’abord, ensuite, puis, enfin. D’une part … d’autre part. De plus, en outre (adding). En conclusion, pour conclure.',
    examples: [{ fr: 'D’une part, c’est pratique ; d’autre part, c’est cher.', en: 'On the one hand it’s handy; on the other, it’s expensive.' }],
    keywords: ['organiser', 'd’abord', 'ensuite', 'enfin', 'd’une part', 'de plus', 'conclusion'],
  },
  {
    id: 'G-CONN-05', topic: 'Connecteurs', level: 'B1', title: 'Exprimer le but',
    rule: 'Pour / afin de + infinitive (same subject), pour que / afin que + subjonctif (different subject).',
    examples: [{ fr: 'J’étudie pour réussir le TCF.', en: 'I study to pass the TCF.' }, { fr: 'Je parle lentement pour que tu comprennes.', en: 'I speak slowly so you understand.' }],
    keywords: ['but', 'pour', 'afin de', 'pour que', 'afin que'],
  },
  {
    id: 'G-CONN-06', topic: 'Connecteurs', level: 'B2', title: 'Exprimer la condition',
    rule: 'Si, à condition que + subjonctif, au cas où + conditionnel, en cas de + noun, sinon.',
    examples: [{ fr: 'Au cas où il pleuvrait, prends un parapluie.', en: 'In case it rains, take an umbrella.' }, { fr: 'En cas d’urgence, appelez le 911.', en: 'In an emergency, call 911.' }],
    keywords: ['condition', 'au cas où', 'en cas de', 'à condition que', 'sinon'],
  },

  // Phrases complexes
  {
    id: 'G-OPINION-01', topic: 'Phrases complexes', level: 'B1', title: 'Donner son opinion',
    rule: 'À mon avis, selon moi, je trouve que, je pense que, il me semble que (indicative). Je ne pense pas que + subjonctif.',
    examples: [{ fr: 'À mon avis, le télétravail présente plus d’avantages.', en: 'In my view, remote work has more advantages.' }],
    pitfall: '"Selon moi" or "à mon avis", never "à mon opinion". "Il me semble que" + indicative, but "il semble que" usually + subjunctive.',
    keywords: ['opinion', 'à mon avis', 'je pense que', 'selon moi', 'il me semble'],
  },
  {
    id: 'G-CEST-01', topic: 'Phrases complexes', level: 'B1', title: 'C’est ou il est',
    rule: 'C’est + determiner + noun, or + adjective about a whole idea. Il/elle est + adjective about a person or thing, or + profession without article.',
    examples: [{ fr: 'C’est un bon médecin. Il est médecin.', en: 'He’s a good doctor. He’s a doctor.' }, { fr: 'Apprendre une langue, c’est difficile.', en: 'Learning a language is hard.' }],
    keywords: ['c’est', 'il est', 'profession', 'ce'],
  },
  {
    id: 'G-MISE-01', topic: 'Phrases complexes', level: 'B2', title: 'La mise en relief',
    rule: 'C’est … qui / c’est … que highlights one part of the sentence. Ce qui …, c’est … also does.',
    examples: [{ fr: 'C’est le prix qui me dérange.', en: 'It’s the price that bothers me.' }, { fr: 'Ce que je préfère, c’est la nature.', en: 'What I prefer is nature.' }],
    keywords: ['mise en relief', 'c’est qui', 'c’est que', 'emphase'],
  },
  {
    id: 'G-NOMIN-01', topic: 'Phrases complexes', level: 'B2', title: 'La nominalisation',
    rule: 'Turn a verb into a noun for titles and formal writing: augmenter → l’augmentation, réduire → la réduction, décider → la décision.',
    examples: [{ fr: 'Les prix augmentent → L’augmentation des prix', en: 'Prices are rising → The rise in prices' }],
    keywords: ['nominalisation', 'nom', 'titre', 'formel'],
  },
  {
    id: 'G-REGISTRE-01', topic: 'Phrases complexes', level: 'B1', title: 'Tu ou vous, registre',
    rule: 'Vous for strangers, officials, clients and any formal letter; tu for friends and family. Vous is also the plural for several friends. In Quebec tu is common among colleagues, but use vous in the exam’s formal tasks. Keep the same one throughout a text.',
    examples: [{ fr: 'Madame, je vous écris pour…', en: 'Madam, I am writing to you to…' }, { fr: 'Salut Marc, tu viens samedi ?', en: 'Hi Marc, are you coming on Saturday?' }],
    pitfall: 'Mixing tu and vous in one email loses marks in Tâche 1.',
    keywords: ['tu', 'vous', 'registre', 'formel', 'lettre', 'courriel'],
  },
];
