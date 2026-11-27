import type { GrammarRule } from './types.ts';

// Nouns, articles, agreement, pronouns, spelling.
export const BASICS: GrammarRule[] = [
  // Noms et articles
  {
    id: 'G-GENRE-01', topic: 'Noms et articles', level: 'A2', title: 'Le genre des noms',
    rule: 'Every noun is masculine or feminine, and the article shows it: un/le for masculine, une/la for feminine. Learn each noun with its article.',
    examples: [{ fr: 'un logement, une maison', en: 'a dwelling (m), a house (f)' }, { fr: 'le problème, la solution', en: 'the problem (m), the solution (f)' }],
    pitfall: 'Learning the bare word ("logement") and guessing the gender later.',
    keywords: ['genre', 'masculin', 'féminin', 'un', 'une', 'le', 'la', 'gender'],
  },
  {
    id: 'G-GENRE-02', topic: 'Noms et articles', level: 'B1', title: 'Terminaisons qui indiquent le genre',
    rule: 'Some endings are a good guide. Usually feminine: -tion, -sion, -té, -ure, -ence, -ance, -ette. Usually masculine: -ment, -age, -isme, -eau, -oir.',
    examples: [{ fr: 'une augmentation, la santé, une culture', en: 'feminine endings' }, { fr: 'un logement, le chômage, le tourisme', en: 'masculine endings' }],
    pitfall: 'Exceptions exist: une plage, une image, la page, l’eau (f), la peau (f); le silence, l’été (m), le côté, le comité.',
    keywords: ['genre', 'terminaison', 'tion', 'ment', 'age', 'ending'],
  },
  {
    id: 'G-ARTICLE-01', topic: 'Noms et articles', level: 'A2', title: 'Article défini ou indéfini',
    rule: 'Le/la/les talk about something known or in general (likes, dislikes, categories). Un/une/des introduce one or some not yet identified.',
    examples: [{ fr: 'J’aime le café.', en: 'I like coffee (in general).' }, { fr: 'Je bois un café.', en: 'I am having a coffee.' }],
    pitfall: 'After aimer, adorer, détester, préférer: the definite article, never du/de la.',
    keywords: ['article', 'le', 'un', 'défini', 'indéfini', 'aimer'],
  },
  {
    id: 'G-ARTICLE-02', topic: 'Noms et articles', level: 'A2', title: 'L’article partitif',
    rule: 'Du, de la, de l’ mean "some" for things you cannot count: food, drink, qualities, abstract nouns.',
    examples: [{ fr: 'Il faut du courage.', en: 'It takes courage.' }, { fr: 'Je prends de l’eau.', en: 'I’ll have some water.' }],
    keywords: ['partitif', 'du', 'de la', 'de l', 'some'],
  },
  {
    id: 'G-ARTICLE-03', topic: 'Noms et articles', level: 'A2', title: '« De » après la négation et les quantités',
    rule: 'After a negation, un/une/des/du/de la become de (d’). After a quantity (beaucoup, peu, trop, assez, un kilo), use de alone.',
    examples: [{ fr: 'Je n’ai pas de voiture.', en: 'I don’t have a car.' }, { fr: 'Il y a beaucoup de bruit.', en: 'There is a lot of noise.' }],
    pitfall: 'Not with être: "Ce n’est pas un problème." keeps un.',
    keywords: ['négation', 'pas de', 'beaucoup de', 'quantité', 'de'],
  },
  {
    id: 'G-ARTICLE-04', topic: 'Noms et articles', level: 'A2', title: 'Articles contractés',
    rule: 'À + le = au, à + les = aux, de + le = du, de + les = des. À la, à l’, de la, de l’ do not change.',
    examples: [{ fr: 'Je vais au travail.', en: 'I go to work.' }, { fr: 'Il parle des problèmes du quartier.', en: 'He talks about the neighbourhood’s problems.' }],
    keywords: ['au', 'aux', 'du', 'des', 'contraction', 'à le', 'de le'],
  },
  {
    id: 'G-ARTICLE-05', topic: 'Noms et articles', level: 'A2', title: 'Pays, villes et provinces',
    rule: 'Cities: à (à Montréal). Feminine countries and provinces, and masculine ones starting with a vowel: en (en France, en Alberta, en Ontario, en Iran). Other masculine: au (au Canada, au Manitoba, au Nouveau-Brunswick). Plural: aux.',
    examples: [{ fr: 'en France, en Ontario, au Canada, au Québec, aux États-Unis', en: 'in France, Ontario, Canada, Quebec, the USA' }],
    pitfall: 'Most names ending in -e are feminine, but le Mexique → au Mexique. Le Québec (province) → au Québec; Québec (city) → à Québec. Islands: à Terre-Neuve, à l’Île-du-Prince-Édouard.',
    keywords: ['pays', 'ville', 'en', 'au', 'aux', 'Québec', 'Canada'],
  },
  {
    id: 'G-PLURIEL-01', topic: 'Noms et articles', level: 'A2', title: 'Le pluriel des noms',
    rule: 'Add -s. Nouns in -s, -x, -z do not change. -eau, -au and -eu take -x. Most -al become -aux; some -ail too (travail → travaux).',
    examples: [{ fr: 'un journal → des journaux', en: 'newspapers' }, { fr: 'un bureau → des bureaux', en: 'offices' }],
    pitfall: 'Exceptions: des festivals, des carnavals, des pneus. Seven -ou nouns take -x: bijoux, cailloux, choux, genoux, hiboux, joujoux, poux.',
    keywords: ['pluriel', 'aux', 'eaux', 'plural'],
  },

  // Accords
  {
    id: 'G-ACCORD-01', topic: 'Accords', level: 'A2', title: 'L’accord de l’adjectif',
    rule: 'An adjective takes the gender and number of its noun: add -e for feminine, -s for plural, -es for both.',
    examples: [{ fr: 'un quartier calme, des rues calmes', en: 'a quiet area, quiet streets' }, { fr: 'un loyer élevé, des charges élevées', en: 'a high rent, high service charges' }],
    pitfall: 'Irregular feminines: nouveau → nouvelle, public → publique, sec → sèche, cher → chère, actif → active.',
    keywords: ['accord', 'adjectif', 'féminin', 'pluriel', 'agreement'],
  },
  {
    id: 'G-ACCORD-02', topic: 'Accords', level: 'B1', title: 'Accord du participe passé avec être',
    rule: 'With être, the past participle agrees with the subject: elle est arrivée. Most pronominal verbs agree too (elle s’est levée), but not when se is an indirect object (ils se sont parlé, elles se sont téléphoné) or when a direct object follows (elle s’est lavé les mains).',
    examples: [{ fr: 'Elle est arrivée hier.', en: 'She arrived yesterday.' }, { fr: 'Nous nous sommes inscrits.', en: 'We signed up.' }],
    keywords: ['participe passé', 'être', 'accord', 'arrivée', 'agreement'],
  },
  {
    id: 'G-ACCORD-03', topic: 'Accords', level: 'B2', title: 'Accord du participe passé avec avoir',
    rule: 'With avoir, the participle does not agree with the subject. It agrees with the direct object only when that object comes before the verb (la, les, que…).',
    examples: [{ fr: 'Les lettres que j’ai écrites.', en: 'The letters (that) I wrote.' }, { fr: 'La neige nous a empêchés de partir.', en: 'The snow prevented us from leaving.' }],
    pitfall: '"Elle a mangé une pomme": no agreement (the object comes after). But "La pomme ? Elle l’a mangée." No agreement with en: "Des pommes, j’en ai mangé."',
    keywords: ['participe passé', 'avoir', 'COD', 'accord', 'que'],
  },
  {
    id: 'G-ACCORD-04', topic: 'Accords', level: 'B1', title: 'Place de l’adjectif',
    rule: 'Most adjectives go after the noun. A few short common ones go before: beau, bon, grand, petit, jeune, vieux, nouveau, mauvais, joli, gros.',
    examples: [{ fr: 'un nouveau logement moderne', en: 'a new modern dwelling' }, { fr: 'une grande ville canadienne', en: 'a big Canadian city' }],
    pitfall: 'Some change meaning: un ancien collègue (former) / un bâtiment ancien (old).',
    keywords: ['place', 'adjectif', 'avant', 'après', 'position'],
  },
  {
    id: 'G-ACCORD-05', topic: 'Accords', level: 'B1', title: 'Le comparatif et le superlatif',
    rule: 'Plus / moins / aussi + adjective + que. Superlative: le/la/les plus + adjective; after the noun, repeat the article: la solution la plus simple. Bon → meilleur, bien → mieux.',
    examples: [{ fr: 'Ce quartier est moins cher que le centre.', en: 'This area is cheaper than downtown.' }, { fr: 'C’est la meilleure solution.', en: 'It’s the best solution.' }],
    pitfall: 'Never "plus bon": meilleur. Never "plus bien": mieux.',
    keywords: ['comparatif', 'superlatif', 'plus', 'moins', 'meilleur', 'mieux'],
  },

  // Pronoms
  {
    id: 'G-PRON-01', topic: 'Pronoms', level: 'A2', title: 'Pronoms COD : le, la, les',
    rule: 'Le, la, l’, les replace a direct object (no preposition). They go before the conjugated verb, or before the infinitive when there is one.',
    examples: [{ fr: 'Ce formulaire ? Je le remplis ce soir.', en: 'This form? I’ll fill it in tonight.' }, { fr: 'Je vais la contacter.', en: 'I’m going to contact her.' }],
    keywords: ['pronom', 'COD', 'le', 'la', 'les', 'direct object'],
  },
  {
    id: 'G-PRON-02', topic: 'Pronoms', level: 'A2', title: 'Pronoms COI : lui, leur',
    rule: 'Lui (one person) and leur (several) replace à + a person. Verbs like parler à, téléphoner à, demander à, répondre à, conseiller à.',
    examples: [{ fr: 'Je lui ai téléphoné.', en: 'I phoned him/her.' }, { fr: 'Je leur réponds demain.', en: 'I’ll answer them tomorrow.' }],
    pitfall: 'Leur (pronoun) never takes -s; leurs is the possessive "their".',
    keywords: ['lui', 'leur', 'COI', 'à', 'indirect object'],
  },
  {
    id: 'G-PRON-03', topic: 'Pronoms', level: 'B1', title: 'Le pronom « y »',
    rule: 'Y replaces à + a thing or idea, or a place (à, en, chez, dans…).',
    examples: [{ fr: 'Tu penses à ton entrevue ? Oui, j’y pense.', en: 'I’m thinking about it.' }, { fr: 'Je vais à Québec. J’y vais en train.', en: 'I’m going there by train.' }],
    pitfall: 'For people after penser à, s’intéresser à, faire attention à, use à + tonic pronoun: "Je pense à elle", not "j’y pense". With most other verbs use lui/leur: "Je lui parle."',
    keywords: ['y', 'pronom', 'à', 'lieu'],
  },
  {
    id: 'G-PRON-04', topic: 'Pronoms', level: 'B1', title: 'Le pronom « en »',
    rule: 'En replaces de + a thing (parler de, avoir besoin de), and a noun after a quantity or du/de la/des. Keep the number: j’en ai deux.',
    examples: [{ fr: 'Tu as besoin d’aide ? Oui, j’en ai besoin.', en: 'Yes, I need it.' }, { fr: 'Des enfants ? Ils en ont trois.', en: 'They have three.' }],
    keywords: ['en', 'pronom', 'de', 'quantité'],
  },
  {
    id: 'G-PRON-05', topic: 'Pronoms', level: 'B2', title: 'L’ordre des pronoms',
    rule: 'Before the verb: me/te/se/nous/vous, then le/la/les, then lui/leur, then y, then en.',
    examples: [{ fr: 'Je te l’envoie.', en: 'I’ll send it to you.' }, { fr: 'Je le lui ai dit.', en: 'I told him/her.' }, { fr: 'Il y en a.', en: 'There are some.' }],
    keywords: ['ordre', 'pronoms', 'double', 'le lui', 'y en'],
  },
  {
    id: 'G-PRON-06', topic: 'Pronoms', level: 'B1', title: 'Pronoms toniques',
    rule: 'Moi, toi, lui, elle, nous, vous, eux, elles: after a preposition, for emphasis, after c’est, and in comparisons.',
    examples: [{ fr: 'Je travaille avec eux.', en: 'I work with them.' }, { fr: 'Moi, je préfère le bus.', en: 'Me, I prefer the bus.' }],
    keywords: ['tonique', 'moi', 'eux', 'avec', 'chez'],
  },
  {
    id: 'G-PRON-07', topic: 'Pronoms', level: 'B1', title: 'Les verbes pronominaux',
    rule: 'Pronominal verbs take a reflexive pronoun matching the subject (me, te, se, nous, vous, se) and use être in compound tenses.',
    examples: [{ fr: 'Je me rends au bureau à pied.', en: 'I walk to the office.' }, { fr: 'L’accident s’est produit vers minuit.', en: 'The accident happened around midnight.' }],
    pitfall: 'Keep the pronoun in the infinitive: "Je vais me renseigner", not "je vais se renseigner".',
    keywords: ['pronominal', 'se', 'me', 'réfléchi', 'reflexive'],
  },
  {
    id: 'G-PRON-08', topic: 'Pronoms', level: 'B1', title: 'Les possessifs',
    rule: 'Mon/ma/mes, ton/ta/tes, son/sa/ses agree with the thing owned, not the owner. Notre/votre/leur (pl. nos/vos/leurs).',
    examples: [{ fr: 'Paul et sa femme', en: 'Paul and his wife' }, { fr: 'mon adresse', en: 'my address (mon before a vowel)' }],
    pitfall: 'Sa/son means his OR her: the owner’s gender does not matter.',
    keywords: ['possessif', 'son', 'sa', 'ses', 'leur', 'mon'],
  },

  // Orthographe
  {
    id: 'G-ACCENT-01', topic: 'Orthographe', level: 'A2', title: 'Les accents',
    rule: 'Accents are part of the spelling and can change the word: a (has) / à (to), ou (or) / où (where), du / dû. In the exam a missing accent is a spelling mistake.',
    examples: [{ fr: 'Il a un rendez-vous à midi.', en: 'He has an appointment at noon.' }, { fr: 'Où habites-tu ? Ici ou là ?', en: 'Where do you live? Here or there?' }],
    pitfall: 'É at the start of many words: étudiant, état, école. È when the next syllable has a silent e: père, problème, il lève.',
    keywords: ['accent', 'aigu', 'grave', 'circonflexe', 'à', 'où', 'é'],
  },
  {
    id: 'G-ORTHO-01', topic: 'Orthographe', level: 'B1', title: 'Homophones : a/à, et/est, son/sont, on/ont',
    rule: 'Swap test: a can become avait (verb); est can become était; sont can become étaient; ont can become avaient. If it cannot, write à, et, son, on.',
    examples: [{ fr: 'Elle est partie et elle a pris le bus.', en: 'She left and took the bus.' }, { fr: 'Ils ont dit qu’on partait demain.', en: 'They said we were leaving tomorrow.' }],
    keywords: ['homophone', 'a', 'à', 'et', 'est', 'son', 'sont', 'on', 'ont'],
  },
  {
    id: 'G-ORTHO-02', topic: 'Orthographe', level: 'B1', title: '-er, -é ou -ez ?',
    rule: 'After a preposition or a second verb, the infinitive (-er). After avoir/être, the participle (-é). Test with vendre: vendre → -er, vendu → -é. -ez is the vous form: vous réservez.',
    examples: [{ fr: 'Je vais réserver. J’ai réservé.', en: 'I’m going to book. I booked.' }],
    keywords: ['infinitif', 'participe', 'er', 'é', 'ez'],
  },
  {
    id: 'G-ORTHO-03', topic: 'Orthographe', level: 'A2', title: 'L’élision',
    rule: 'Le, la, je, me, te, se, ce, de, ne, que, jusque, and si (before il/ils only) drop their vowel before a vowel or silent h.',
    examples: [{ fr: 'l’hôpital, j’habite, qu’il, s’il', en: 'the hospital, I live, that he, if he' }],
    pitfall: 'Not before an aspirated h: le haricot, la Hollande, le hockey.',
    keywords: ['élision', 'apostrophe', 'l’', 'j’', 'qu’'],
  },
];
