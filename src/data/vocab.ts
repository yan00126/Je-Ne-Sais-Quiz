export type VocabItem = {
  id: string;
  fr: string;
  en: string;
  example: string;
};

// Starter deck of B1/B2 words that come up often in TCF reading, listening and writing tasks.
// Ids are stable: changing one resets that card's review history.
export const STARTER_VOCAB: VocabItem[] = [
  { id: 'v001', fr: 'un logement', en: 'housing, accommodation', example: 'Trouver un logement à Montréal coûte de plus en plus cher.' },
  { id: 'v002', fr: 'un loyer', en: 'rent', example: 'Le loyer augmente chaque année en juillet.' },
  { id: 'v003', fr: 'un emploi', en: 'a job', example: 'Elle cherche un emploi dans le secteur de la santé.' },
  { id: 'v004', fr: 'un employeur', en: 'an employer', example: 'Mon employeur offre des cours de français gratuits.' },
  { id: 'v005', fr: 'une formation', en: 'training, a course of study', example: 'Il suit une formation en comptabilité le soir.' },
  { id: 'v006', fr: 'un diplôme', en: 'a degree, diploma', example: 'Son diplôme étranger doit être reconnu au Canada.' },
  { id: 'v007', fr: 'une démarche', en: 'a step, procedure (paperwork)', example: 'Les démarches administratives prennent du temps.' },
  { id: 'v008', fr: 'remplir un formulaire', en: 'to fill in a form', example: 'Vous devez remplir ce formulaire avant vendredi.' },
  { id: 'v009', fr: 'un rendez-vous', en: 'an appointment', example: "J'ai pris rendez-vous chez le médecin pour mardi." },
  { id: 'v010', fr: 'un quartier', en: 'a neighbourhood', example: 'Ce quartier est calme et proche du métro.' },
  { id: 'v011', fr: 'les transports en commun', en: 'public transit', example: 'Je prends les transports en commun pour aller au travail.' },
  { id: 'v012', fr: 'un trajet', en: 'a commute, a trip', example: 'Mon trajet dure quarante minutes.' },
  { id: 'v013', fr: 'une augmentation', en: 'an increase, a raise', example: "Les employés demandent une augmentation de salaire." },
  { id: 'v014', fr: 'une baisse', en: 'a drop, decrease', example: 'On observe une baisse du chômage cette année.' },
  { id: 'v015', fr: 'le chômage', en: 'unemployment', example: 'Le taux de chômage reste stable.' },
  { id: 'v016', fr: 'un avantage', en: 'an advantage, a benefit', example: 'Le télétravail a beaucoup d’avantages.' },
  { id: 'v017', fr: 'un inconvénient', en: 'a drawback', example: 'Le principal inconvénient, c’est l’isolement.' },
  { id: 'v018', fr: 'en revanche', en: 'on the other hand', example: 'La ville est chère ; en revanche, les salaires sont plus élevés.' },
  { id: 'v019', fr: 'cependant', en: 'however', example: 'Le projet est intéressant ; cependant, il manque de financement.' },
  { id: 'v020', fr: 'par conséquent', en: 'consequently', example: 'Il a neigé toute la nuit ; par conséquent, l’école est fermée.' },
  { id: 'v021', fr: 'grâce à', en: 'thanks to', example: 'Grâce à ce programme, elle a trouvé un stage.' },
  { id: 'v022', fr: 'à cause de', en: 'because of (negative)', example: 'Le vol est annulé à cause de la tempête.' },
  { id: 'v023', fr: 'bien que (+ subjonctif)', en: 'although', example: 'Bien qu’il soit fatigué, il continue à étudier.' },
  { id: 'v024', fr: 'afin de', en: 'in order to', example: 'Il économise afin de voyager l’été prochain.' },
  { id: 'v025', fr: 'à mon avis', en: 'in my opinion', example: 'À mon avis, le transport devrait être gratuit.' },
  { id: 'v026', fr: 'il est indispensable que (+ subj.)', en: 'it is essential that', example: 'Il est indispensable que chacun recycle.' },
  { id: 'v027', fr: 'un enjeu', en: 'an issue, what is at stake', example: 'Le climat est un enjeu majeur pour les jeunes.' },
  { id: 'v028', fr: 'le réchauffement climatique', en: 'global warming', example: 'Le réchauffement climatique touche le Nord canadien.' },
  { id: 'v029', fr: 'une mesure', en: 'a measure (policy)', example: 'Le gouvernement annonce de nouvelles mesures.' },
  { id: 'v030', fr: 'un citoyen / une citoyenne', en: 'a citizen', example: 'Chaque citoyen peut donner son avis en ligne.' },
  { id: 'v031', fr: 'un bénévole', en: 'a volunteer', example: 'Les bénévoles distribuent des repas le samedi.' },
  { id: 'v032', fr: 'une entreprise', en: 'a company', example: 'Cette entreprise recrute des bilingues.' },
  { id: 'v033', fr: 'un congé', en: 'leave, time off', example: 'Elle prend un congé de maternité d’un an.' },
  { id: 'v034', fr: 'se plaindre (de)', en: 'to complain (about)', example: 'Les voisins se plaignent du bruit.' },
  { id: 'v035', fr: 's’habituer à', en: 'to get used to', example: 'Je me suis habitué à l’hiver.' },
  { id: 'v036', fr: 'se rendre compte (de)', en: 'to realise', example: 'Je me suis rendu compte de mon erreur.' },
  { id: 'v037', fr: 'davantage', en: 'more (formal)', example: 'Il faudrait investir davantage dans l’éducation.' },
  { id: 'v038', fr: 'dorénavant', en: 'from now on', example: 'Dorénavant, le bureau ferme à 17 h.' },
  { id: 'v039', fr: 'un courriel', en: 'an email (Québec)', example: 'Je vous envoie un courriel de confirmation.' },
  { id: 'v040', fr: 'une fin de semaine', en: 'a weekend (Québec)', example: 'On part au chalet la fin de semaine prochaine.' },
];
