import type { GrammarRule } from './types.ts';

// Tenses and moods.
export const VERB_RULES: GrammarRule[] = [
  // Le passé
  {
    id: 'G-PASSE-01', topic: 'Le passé', level: 'A2', title: 'Le passé composé',
    rule: 'Avoir or être in the present + past participle. It tells a completed action or event at a given moment.',
    examples: [{ fr: 'J’ai trouvé un emploi en mars.', en: 'I found a job in March.' }, { fr: 'Nous sommes partis à 8 h.', en: 'We left at 8.' }],
    keywords: ['passé composé', 'avoir', 'être', 'participe', 'past'],
  },
  {
    id: 'G-PASSE-02', topic: 'Le passé', level: 'A2', title: 'Être ou avoir au passé composé',
    rule: 'Être with pronominal verbs and with this list (mostly movement or change of state): aller, venir, arriver, partir, entrer, sortir, monter, descendre, passer, naître, mourir, rester, tomber, retourner, devenir (and re- forms: revenir, rentrer…). Other movement verbs take avoir: j’ai marché, j’ai couru, j’ai voyagé.',
    examples: [{ fr: 'Elle est née à Lyon.', en: 'She was born in Lyon.' }, { fr: 'Je suis resté chez moi.', en: 'I stayed home.' }],
    pitfall: 'With a direct object, sortir, monter, descendre, passer, rentrer and retourner take avoir: "J’ai sorti les poubelles."',
    keywords: ['être', 'avoir', 'auxiliaire', 'passé composé', 'aller', 'venir'],
  },
  {
    id: 'G-PASSE-03', topic: 'Le passé', level: 'B1', title: 'Passé composé ou imparfait',
    rule: 'Imparfait: the background, a description, a habit, an action in progress. Passé composé: the events that move the story forward, with a beginning or end.',
    examples: [{ fr: 'Il pleuvait quand je suis sorti.', en: 'It was raining when I went out.' }, { fr: 'Avant, je prenais le bus. Un jour, j’ai acheté un vélo.', en: 'I used to take the bus. One day I bought a bike.' }],
    pitfall: 'Durations that are over use passé composé: "J’ai habité dix ans à Paris."',
    keywords: ['imparfait', 'passé composé', 'description', 'habitude', 'quand'],
  },
  {
    id: 'G-PASSE-04', topic: 'Le passé', level: 'A2', title: 'Former l’imparfait',
    rule: 'Take the nous form of the present, drop -ons, add -ais, -ais, -ait, -ions, -iez, -aient. Only être is irregular: j’étais.',
    examples: [{ fr: 'nous finissons → je finissais', en: 'I was finishing / used to finish' }, { fr: 'nous prenons → ils prenaient', en: 'they were taking' }],
    keywords: ['imparfait', 'terminaison', 'ais', 'ait', 'aient'],
  },
  {
    id: 'G-PASSE-05', topic: 'Le passé', level: 'B1', title: 'Le plus-que-parfait',
    rule: 'Avoir or être in the imparfait + past participle: an action before another past action.',
    examples: [{ fr: 'Quand je suis arrivé, le film avait commencé.', en: 'When I arrived, the film had started.' }],
    keywords: ['plus-que-parfait', 'avait', 'était', 'antériorité'],
  },
  {
    id: 'G-PASSE-06', topic: 'Le passé', level: 'B1', title: 'Venir de, être en train de, aller',
    rule: 'Venir de + infinitive: just happened. Être en train de: happening now. Aller + infinitive: going to happen (futur proche).',
    examples: [{ fr: 'Je viens de recevoir ma carte.', en: 'I have just received my card.' }, { fr: 'Je vais déménager.', en: 'I’m going to move.' }],
    keywords: ['venir de', 'en train de', 'futur proche', 'aller'],
  },
  {
    id: 'G-PASSE-07', topic: 'Le passé', level: 'B1', title: 'Depuis, il y a, pendant',
    rule: 'Depuis + present: started in the past and still going. Il y a + past: how long ago. Pendant: a duration.',
    examples: [{ fr: 'J’habite ici depuis deux ans.', en: 'I have lived here for two years.' }, { fr: 'Je suis arrivé il y a deux ans.', en: 'I arrived two years ago.' }],
    pitfall: 'Not the passé composé with depuis for a situation still true: "J’habite ici depuis deux ans", not "j’ai habité ici depuis". But in the negative the passé composé is normal: "Je ne l’ai pas vu depuis deux ans."',
    keywords: ['depuis', 'il y a', 'pendant', 'durée', 'ago'],
  },
  {
    id: 'G-PASSE-08', topic: 'Le passé', level: 'B2', title: 'Le passé simple (à reconnaître)',
    rule: 'A literary past tense, used in novels and some articles in place of the passé composé. You need to recognise it, not write it.',
    examples: [{ fr: 'Il fut, elle eut, ils firent, elle vint', en: 'he was, she had, they did, she came' }],
    keywords: ['passé simple', 'fut', 'eut', 'fit', 'littéraire'],
  },

  // Futur et conditionnel
  {
    id: 'G-FUTUR-01', topic: 'Futur et conditionnel', level: 'A2', title: 'Le futur simple',
    rule: 'Infinitive (drop the final -e of -re) + -ai, -as, -a, -ons, -ez, -ont. Irregular stems: ser-, aur-, ir-, fer-, pourr-, devr-, viendr-, tiendr-, verr-, enverr-, saur-, voudr-, recevr-, courr-, faudr-. Spelling changes: j’achèterai, j’appellerai, je paierai.',
    examples: [{ fr: 'La réunion aura lieu jeudi.', en: 'The meeting will take place on Thursday.' }, { fr: 'Je vous enverrai le document.', en: 'I will send you the document.' }],
    keywords: ['futur', 'futur simple', 'aura', 'sera', 'ira', 'future'],
  },
  {
    id: 'G-FUTUR-02', topic: 'Futur et conditionnel', level: 'B1', title: 'Quand + futur',
    rule: 'After quand, lorsque, dès que, aussitôt que, use the future when the main clause is in the future or the imperative (English uses the present): "Quand tu arriveras, appelle-moi."',
    examples: [{ fr: 'Quand j’aurai mon diplôme, je chercherai un emploi.', en: 'When I have my degree, I’ll look for a job.' }],
    keywords: ['quand', 'lorsque', 'dès que', 'futur'],
  },
  {
    id: 'G-COND-01', topic: 'Futur et conditionnel', level: 'B1', title: 'Le conditionnel présent',
    rule: 'Future stem + imparfait endings (-ais, -ait, -ions…). Used for politeness, wishes, advice, and unconfirmed news.',
    examples: [{ fr: 'Je voudrais un rendez-vous.', en: 'I would like an appointment.' }, { fr: 'Vous devriez réserver tôt.', en: 'You should book early.' }],
    keywords: ['conditionnel', 'voudrais', 'pourrais', 'devriez', 'politesse'],
  },
  {
    id: 'G-COND-02', topic: 'Futur et conditionnel', level: 'B1', title: 'Les phrases avec « si »',
    rule: 'Si + present → present/future. Si + imparfait → conditionnel. Si + plus-que-parfait → conditionnel passé.',
    examples: [{ fr: 'S’il fait beau, on ira au parc.', en: 'If it’s nice, we’ll go to the park.' }, { fr: 'Si j’avais le temps, je ferais du bénévolat.', en: 'If I had time, I would volunteer.' }],
    pitfall: 'In an "if" condition, never the future or conditional right after si: "si j’aurais" is wrong. When si means "whether", the future is fine: "Je ne sais pas s’il viendra."',
    keywords: ['si', 'hypothèse', 'condition', 'conditionnel', 'imparfait', 'if'],
  },
  {
    id: 'G-COND-03', topic: 'Futur et conditionnel', level: 'B2', title: 'Le conditionnel passé',
    rule: 'Avoir or être in the conditionnel + participle: a regret, a reproach, or an unreal past.',
    examples: [{ fr: 'J’aurais dû réserver.', en: 'I should have booked.' }, { fr: 'Si j’avais su, je serais venu.', en: 'Had I known, I would have come.' }],
    keywords: ['conditionnel passé', 'aurais dû', 'regret', 'reproche'],
  },
  {
    id: 'G-COND-04', topic: 'Futur et conditionnel', level: 'B2', title: 'Le conditionnel de l’information non confirmée',
    rule: 'News reports use the conditional for facts that are not confirmed.',
    examples: [{ fr: 'L’incendie aurait fait deux blessés.', en: 'The fire reportedly injured two people.' }],
    keywords: ['conditionnel', 'information', 'journalisme', 'non confirmé'],
  },

  // Subjonctif
  {
    id: 'G-SUBJ-01', topic: 'Subjonctif', level: 'B1', title: 'Quand utiliser le subjonctif',
    rule: 'After que when the main verb expresses necessity, wish, emotion, doubt or a judgement, with a different subject in each part.',
    examples: [{ fr: 'Il faut que tu remplisses ce formulaire.', en: 'You have to fill in this form.' }, { fr: 'Je suis content que vous soyez là.', en: 'I’m glad you are here.' }],
    pitfall: 'Same subject: infinitive instead. "Je veux partir", not "je veux que je parte".',
    keywords: ['subjonctif', 'il faut que', 'vouloir que', 'que', 'subjunctive'],
  },
  {
    id: 'G-SUBJ-02', topic: 'Subjonctif', level: 'B1', title: 'Former le subjonctif',
    rule: 'For je, tu, il, ils: take the ils form of the present, drop -ent, add -e, -es, -e, -ent. For nous and vous: use the imparfait forms (-ions, -iez). Irregular: être (sois), avoir (aie), aller (aille), faire (fasse), pouvoir (puisse), savoir (sache), vouloir (veuille).',
    examples: [{ fr: 'ils finissent → que je finisse', en: 'that I finish' }, { fr: 'ils prennent → que je prenne, but nous prenions → que nous prenions', en: 'that I take, that we take' }],
    keywords: ['subjonctif', 'formation', 'sois', 'fasse', 'puisse', 'aille'],
  },
  {
    id: 'G-SUBJ-03', topic: 'Subjonctif', level: 'B1', title: 'Verbes et expressions + subjonctif',
    rule: 'Necessity (il faut que, il est nécessaire que), will (vouloir, souhaiter, exiger que), emotion (être content, avoir peur, regretter que), judgement (il est important, normal, dommage que).',
    examples: [{ fr: 'Il est important que chacun vote.', en: 'It is important that everyone votes.' }, { fr: 'Je souhaite que tu réussisses.', en: 'I hope you succeed.' }],
    pitfall: 'Espérer que takes the indicative: "J’espère que tu viendras."',
    keywords: ['subjonctif', 'il est important que', 'souhaiter', 'regretter', 'espérer'],
  },
  {
    id: 'G-SUBJ-04', topic: 'Subjonctif', level: 'B2', title: 'Doute et opinion négative',
    rule: 'Douter que, ne pas penser que, ne pas croire que, il est possible que take the subjunctive. Penser que, croire que, il est probable que, je suis sûr que take the indicative.',
    examples: [{ fr: 'Je ne pense pas qu’il vienne.', en: 'I don’t think he’ll come.' }, { fr: 'Je pense qu’il viendra.', en: 'I think he will come.' }],
    keywords: ['subjonctif', 'doute', 'penser que', 'croire que', 'possible', 'probable'],
  },
  {
    id: 'G-SUBJ-05', topic: 'Subjonctif', level: 'B2', title: 'Conjonctions + subjonctif',
    rule: 'Bien que, quoique, pour que, afin que, avant que, à condition que, sans que, jusqu’à ce que, à moins que are followed by the subjunctive.',
    examples: [{ fr: 'Bien qu’il soit tard, je continue.', en: 'Although it is late, I keep going.' }, { fr: 'Je t’explique pour que tu comprennes.', en: 'I’m explaining so that you understand.' }],
    pitfall: 'Après que takes the indicative: "après qu’il est parti".',
    keywords: ['subjonctif', 'bien que', 'pour que', 'avant que', 'afin que', 'conjonction'],
  },
  {
    id: 'G-SUBJ-06', topic: 'Subjonctif', level: 'B2', title: 'Subjonctif ou infinitif',
    rule: 'When both parts have the same subject, use de/pour/avant de + infinitive instead of que + subjunctive.',
    examples: [{ fr: 'Je suis content de partir.', en: 'I’m glad to leave.' }, { fr: 'Lis avant de signer.', en: 'Read before signing.' }],
    keywords: ['infinitif', 'subjonctif', 'même sujet', 'avant de', 'pour'],
  },

  // Passive and reported speech belong with complex sentences but are verb forms.
  {
    id: 'G-PASSIF-01', topic: 'Phrases complexes', level: 'B1', title: 'La voix passive',
    rule: 'Être (in the needed tense) + past participle, agreeing with the subject; the doer comes after par. Often replaced by on.',
    examples: [{ fr: 'La loi a été adoptée par le Parlement.', en: 'The law was passed by Parliament.' }, { fr: 'On a fermé la route.', en: 'The road was closed.' }],
    keywords: ['passif', 'voix passive', 'par', 'été', 'on'],
  },
  {
    id: 'G-INDIRECT-01', topic: 'Phrases complexes', level: 'B2', title: 'Le discours indirect au passé',
    rule: 'After a past verb (il a dit que), the present becomes imparfait, passé composé becomes plus-que-parfait, future becomes conditionnel.',
    examples: [{ fr: '« Je viendrai. » → Il a dit qu’il viendrait.', en: 'He said he would come.' }],
    keywords: ['discours indirect', 'concordance', 'il a dit que', 'rapporté'],
  },
  {
    id: 'G-GERONDIF-01', topic: 'Phrases complexes', level: 'B1', title: 'Le gérondif',
    rule: 'En + present participle (-ant): two actions by the same person at the same time, or how something is done.',
    examples: [{ fr: 'J’écoute des podcasts en conduisant.', en: 'I listen to podcasts while driving.' }, { fr: 'C’est en pratiquant qu’on progresse.', en: 'You improve by practising.' }],
    keywords: ['gérondif', 'en', 'ant', 'participe présent'],
  },
  {
    id: 'G-IMPER-01', topic: 'Phrases complexes', level: 'A2', title: 'L’impératif',
    rule: 'The tu, nous, vous forms without a subject. -er verbs (and aller, ouvrir, offrir) drop the -s at tu: parle, va, ouvre, but vas-y, parles-en. Irregular: sois, aie, sache, veuille. In the affirmative, pronouns go after with hyphens, and me/te become moi/toi.',
    examples: [{ fr: 'Remplis le formulaire. Envoie-le-moi.', en: 'Fill in the form. Send it to me.' }, { fr: 'Ne le perds pas.', en: 'Don’t lose it.' }],
    keywords: ['impératif', 'ordre', 'consigne'],
  },
];
