import { words } from './parse.ts';

// Travail et emploi
export const WORK = words(`
1200 | un poste | a job, position | Elle a obtenu un poste de gestionnaire.
1201 | une offre d'emploi | a job offer, posting | J'ai répondu à trois offres d'emploi cette semaine.
1202 | postuler | to apply (for a job) | Il a postulé à un poste dans une banque.
1203 | une candidature | an application | Votre candidature a bien été reçue.
1204 | un candidat / une candidate | a candidate | Le candidat doit parler français et anglais.
1205 | un curriculum vitae | a CV, résumé | Envoyez votre curriculum vitae avant vendredi.
1206 | une lettre de motivation | a cover letter | La lettre de motivation doit être courte et précise.
1207 | une expérience | an experience | J'ai cinq ans d'expérience en vente.
1208 | une compétence | a skill | La communication est une compétence essentielle.
1209 | compétent | competent | C'est une employée très compétente.
1210 | qualifié | qualified | L'entreprise manque de travailleurs qualifiés.
1211 | la main-d'œuvre | the workforce, labour | Le Canada a besoin de main-d'œuvre dans la santé.
1212 | un recruteur | a recruiter | Le recruteur m'a rappelé le lendemain.
1213 | recruter | to recruit | L'hôpital recrute des infirmières.
1214 | engager | to hire; to commit | Ils ont engagé deux nouveaux techniciens.
1215 | licencier | to lay off, dismiss | L'usine a licencié cent employés.
1216 | un licenciement | a layoff, dismissal | Les licenciements ont choqué la ville.
1217 | un contrat | a contract | J'ai signé un contrat d'un an.
1218 | à temps plein | full-time | Elle travaille à temps plein depuis janvier.
1219 | à temps partiel | part-time | Beaucoup d'étudiants travaillent à temps partiel.
1220 | un emploi saisonnier | a seasonal job | Il a trouvé un emploi saisonnier dans un parc.
1221 | un travailleur autonome | a self-employed worker | Comme travailleur autonome, je choisis mes horaires.
1222 | un patron / une patronne | a boss | Mon patron est très exigeant.
1223 | un supérieur | a superior, manager | Parlez-en à votre supérieur.
1224 | un gestionnaire | a manager | Le gestionnaire organise une réunion d'équipe.
1225 | une équipe | a team | Notre équipe travaille sur un nouveau projet.
1226 | un projet | a project | Le projet doit être terminé en mars.
1227 | une tâche | a task | Chaque employé a des tâches précises.
1228 | une responsabilité | a responsibility | Ce poste comporte beaucoup de responsabilités.
1229 | être chargé de | to be in charge of | Elle est chargée de la formation des nouveaux employés.
1230 | diriger | to manage, lead | Il dirige une équipe de douze personnes.
1231 | gérer | to manage, handle | Elle gère bien son stress.
1232 | la gestion | management | Il a étudié la gestion à l'université.
1233 | un objectif | a goal, target | Nous avons atteint nos objectifs cette année.
1234 | atteindre | to reach, achieve | Il faut atteindre ce résultat avant juin.
1235 | un résultat | a result | Les résultats de l'entreprise sont excellents.
1236 | un rendement | performance, output | Le télétravail n'a pas réduit le rendement.
1237 | la productivité | productivity | Des pauses régulières améliorent la productivité.
1238 | le télétravail | remote work | Le télétravail est devenu courant depuis 2020.
1239 | un bureau | an office; a desk | Je vais au bureau deux jours par semaine.
1240 | une pause | a break | Nous avons une pause de trente minutes à midi.
1241 | des heures supplémentaires | overtime | Il fait souvent des heures supplémentaires.
1242 | un horaire flexible | flexible hours | Un horaire flexible aide les parents.
1243 | le salaire minimum | the minimum wage | Le salaire minimum augmente en mai.
1244 | une paie | a paycheque, pay | Je reçois ma paie toutes les deux semaines.
1245 | brut | gross (before tax) | Son salaire brut est de soixante mille dollars.
1246 | net | net (after tax) | Après les impôts, le salaire net est plus bas.
1247 | un avantage social | a benefit (job perk) | Les avantages sociaux incluent une assurance dentaire.
1248 | une retraite | a retirement; a pension | Mon père prend sa retraite l'an prochain.
1249 | un syndicat | a union | Le syndicat négocie une hausse de salaire.
1250 | une grève | a strike | Les enseignants sont en grève depuis lundi.
1251 | négocier | to negotiate | Elle a négocié un meilleur salaire.
1252 | une promotion | a promotion | Il a obtenu une promotion après deux ans.
1253 | une évaluation | an evaluation, review | Mon évaluation annuelle a lieu en décembre.
1254 | une période d'essai | a probation period | La période d'essai dure trois mois.
1255 | un client / une cliente | a customer, client | Le client a toujours raison, dit-on.
1256 | un service à la clientèle | customer service | J'ai appelé le service à la clientèle.
1257 | un fournisseur | a supplier | Nous changeons de fournisseur d'internet.
1258 | une usine | a factory | L'usine emploie trois cents personnes.
1259 | un chantier | a construction site | Il travaille sur un chantier au centre-ville.
1260 | un métier | a trade, occupation | Plombier est un métier très recherché.
1261 | une profession | a profession | La profession d'infirmière est exigeante.
1262 | un secteur | a sector | Le secteur de la santé recrute beaucoup.
1263 | une carrière | a career | Elle veut faire carrière dans l'enseignement.
1264 | se reconvertir | to change careers | À quarante ans, il a décidé de se reconvertir.
1265 | une reconversion | a career change | Sa reconversion dans l'informatique a réussi.
1266 | un ordre professionnel | a professional order (regulatory body) | Les ingénieurs doivent être membres d'un ordre professionnel.
1267 | la reconnaissance des diplômes | credential recognition | La reconnaissance des diplômes étrangers prend du temps.
1268 | un réseau | a network | Il a trouvé son emploi grâce à son réseau.
1269 | le réseautage | networking | Le réseautage est essentiel pour trouver un emploi.
1270 | une référence | a reference | Pouvez-vous fournir deux références ?
1271 | un employé / une employée | an employee | Chaque employé reçoit une carte d'accès.
1272 | un travailleur / une travailleuse | a worker | Les travailleurs étrangers sont nombreux en agriculture.
1273 | les ressources humaines | human resources | Envoyez vos questions aux ressources humaines.
1274 | une formation continue | continuing education | L'entreprise paie la formation continue.
1275 | se former | to train, learn | Il se forme en ligne le soir.
1276 | un apprenti / une apprentie | an apprentice | L'apprenti apprend le métier sur le terrain.
1277 | exigeant | demanding | C'est un travail exigeant mais passionnant.
1278 | épuisant | exhausting | Les quarts de nuit sont épuisants.
1279 | un quart de travail | a work shift | Mon quart de travail commence à sept heures.
1280 | l'épuisement professionnel | burnout | L'épuisement professionnel touche de nombreux soignants.
1281 | la conciliation travail-famille | work-life balance | La conciliation travail-famille est une priorité pour les jeunes parents.
1282 | un congé parental | parental leave | Il a pris un congé parental de six mois.
1283 | l'assurance-emploi | employment insurance | Après son licenciement, il a demandé l'assurance-emploi.
1284 | un chômeur / une chômeuse | an unemployed person | Le nombre de chômeurs a diminué.
1285 | le marché du travail | the job market | Le marché du travail est favorable aux candidats.
1286 | une pénurie de main-d'œuvre | a labour shortage | La pénurie de main-d'œuvre touche les restaurants.
1287 | une entreprise en démarrage | a startup | Elle travaille pour une entreprise en démarrage.
1288 | un chiffre d'affaires | revenue, turnover | Le chiffre d'affaires a doublé en deux ans.
1289 | un bénéfice | a profit | L'entreprise a fait des bénéfices records.
1290 | une perte | a loss | Les pertes sont dues à la crise.
1291 | un concurrent | a competitor | Notre concurrent a baissé ses prix.
1292 | la concurrence | competition | La concurrence est forte dans ce secteur.
1293 | une réussite | a success | Le lancement du produit est une réussite.
1294 | un échec | a failure | Un échec peut être une occasion d'apprendre.
1295 | une occasion | an opportunity; a bargain | C'est une belle occasion de progresser.
1296 | collaborer | to collaborate | Nous collaborons avec une université.
1297 | une collaboration | a collaboration | Cette collaboration a donné d'excellents résultats.
1298 | un délai de livraison | a delivery time | Le délai de livraison est de cinq jours.
1299 | une échéance | a deadline | L'échéance du projet approche.
`);
