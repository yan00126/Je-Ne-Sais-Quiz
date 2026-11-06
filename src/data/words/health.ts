import { words } from './parse.ts';

// Santé et corps
export const HEALTH = words(`
1400 | un médecin | a doctor | Le médecin m'a prescrit des antibiotiques.
1401 | un médecin de famille | a family doctor | Il est difficile de trouver un médecin de famille.
1402 | un infirmier / une infirmière | a nurse | L'infirmière prend ma tension.
1403 | un pharmacien / une pharmacienne | a pharmacist | Demandez conseil au pharmacien.
1404 | une pharmacie | a pharmacy | La pharmacie est ouverte jusqu'à minuit.
1405 | un hôpital | a hospital | Elle a passé deux nuits à l'hôpital.
1406 | une clinique | a clinic | La clinique sans rendez-vous ouvre à huit heures.
1407 | les urgences | the emergency room | Nous avons attendu six heures aux urgences.
1408 | une consultation | a medical appointment | La consultation est couverte par la carte santé.
1409 | la carte d'assurance maladie | the health card | Présentez votre carte d'assurance maladie à l'accueil.
1410 | un patient / une patiente | a patient | Le patient se repose dans sa chambre.
1411 | un symptôme | a symptom | Quels sont vos symptômes ?
1412 | la fièvre | fever | L'enfant a de la fièvre depuis hier.
1413 | la toux | cough | Ce sirop calme la toux.
1414 | tousser | to cough | Il tousse beaucoup la nuit.
1415 | un rhume | a cold | J'ai attrapé un rhume.
1416 | la grippe | the flu | Le vaccin contre la grippe est gratuit.
1417 | un vaccin | a vaccine | Le vaccin est recommandé aux personnes âgées.
1418 | se faire vacciner | to get vaccinated | Je me suis fait vacciner en octobre.
1419 | une douleur | a pain | J'ai une douleur au dos.
1420 | avoir mal à | to have a pain in | J'ai mal à la tête depuis ce matin.
1421 | une blessure | an injury | Sa blessure au genou guérit lentement.
1422 | se blesser | to get hurt | Il s'est blessé en jouant au hockey.
1423 | se casser | to break (a bone) | Elle s'est cassé le bras en patinant.
1424 | guérir | to heal, cure | Il faut du temps pour guérir.
1425 | une maladie | an illness | Le diabète est une maladie chronique.
1426 | chronique | chronic | Elle souffre de douleurs chroniques.
1427 | souffrir | to suffer | Il souffre d'allergies au printemps.
1428 | une allergie | an allergy | J'ai une allergie aux arachides.
1429 | un traitement | a treatment | Le traitement dure trois semaines.
1430 | un médicament | a medication | Prenez ce médicament après le repas.
1431 | une dose | a dose | Ne dépassez pas la dose recommandée.
1432 | prescrire | to prescribe | Le médecin a prescrit du repos.
1433 | une prise de sang | a blood test | Je dois faire une prise de sang à jeun.
1434 | une analyse | a test, analysis | Les analyses sont normales.
1435 | un diagnostic | a diagnosis | Le diagnostic a été rapide.
1436 | une opération | a surgery | L'opération s'est bien passée.
1437 | un spécialiste | a specialist | Il attend un rendez-vous chez un spécialiste.
1438 | un dentiste | a dentist | Je vais chez le dentiste deux fois par an.
1439 | la santé mentale | mental health | La santé mentale des jeunes est une priorité.
1440 | le stress | stress | Le stress nuit au sommeil.
1441 | stressé | stressed | Je suis stressé avant les examens.
1442 | l'anxiété | anxiety | Le sport aide à réduire l'anxiété.
1443 | la dépression | depression | La dépression est une maladie qui se soigne.
1444 | se soigner | to look after oneself, get treatment | Il faut se soigner avant de reprendre le travail.
1445 | le sommeil | sleep | Un bon sommeil est essentiel.
1446 | fatigué | tired | Je suis fatigué après cette longue journée.
1447 | la fatigue | tiredness | La fatigue rend la concentration difficile.
1448 | se reposer | to rest | Reposez-vous pendant quelques jours.
1449 | le repos | rest | Le médecin m'a conseillé une semaine de repos.
1450 | en forme | fit, in shape | Elle fait du vélo pour rester en forme.
1451 | une alimentation | a diet, nutrition | Une alimentation équilibrée protège le cœur.
1452 | équilibré | balanced | Essayez de manger des repas équilibrés.
1453 | un régime | a diet (to lose weight) | Il suit un régime sans sucre.
1454 | le poids | weight | Il a perdu du poids depuis qu'il marche.
1455 | maigrir | to lose weight | Elle a maigri de cinq kilos.
1456 | grossir | to gain weight | On grossit souvent en hiver.
1457 | l'activité physique | physical activity | Trente minutes d'activité physique par jour suffisent.
1458 | sédentaire | sedentary | Un mode de vie sédentaire est mauvais pour la santé.
1459 | le tabac | tobacco | Le tabac cause de nombreuses maladies.
1460 | arrêter de fumer | to quit smoking | Il a arrêté de fumer il y a deux ans.
1461 | l'alcool | alcohol | La consommation d'alcool diminue chez les jeunes.
1462 | la prévention | prevention | La prévention coûte moins cher que les soins.
1463 | prévenir | to prevent; to warn | Il vaut mieux prévenir que guérir.
1464 | les soins | care, treatment | Les soins sont gratuits pour les résidents.
1465 | un soignant / une soignante | a healthcare worker | Les soignants travaillent dans des conditions difficiles.
1466 | le système de santé | the health care system | Le système de santé manque de personnel.
1467 | une liste d'attente | a waiting list | Il est sur une liste d'attente depuis un an.
1468 | une ambulance | an ambulance | L'ambulance est arrivée en dix minutes.
1469 | une urgence | an emergency | En cas d'urgence, composez le 911.
1470 | grave | serious | Ce n'est rien de grave, rassurez-vous.
1471 | enceinte | pregnant | Elle est enceinte de six mois.
1472 | une grossesse | a pregnancy | Sa grossesse se passe bien.
1473 | accoucher | to give birth | Elle a accouché d'une petite fille.
1474 | un handicap | a disability | Les bâtiments doivent être accessibles aux personnes en situation de handicap.
1475 | accessible | accessible | Le métro n'est pas toujours accessible en fauteuil roulant.
1476 | une personne âgée | an elderly person | Les personnes âgées sont plus fragiles en hiver.
1477 | le vieillissement | ageing | Le vieillissement de la population pose des défis.
1478 | l'espérance de vie | life expectancy | L'espérance de vie dépasse quatre-vingts ans.
1479 | le cœur | the heart | Le sport est bon pour le cœur.
1480 | le cerveau | the brain | Apprendre une langue stimule le cerveau.
1481 | le dos | the back | Il a mal au dos à force de rester assis.
1482 | l'estomac | the stomach | J'ai mal à l'estomac après le repas.
1483 | la peau | the skin | Le soleil abîme la peau.
1484 | une jambe | a leg | Il s'est fait mal à la jambe.
1485 | un genou | a knee | Mon genou me fait mal quand je cours.
1486 | la gorge | the throat | J'ai mal à la gorge.
1487 | respirer | to breathe | Respirez profondément.
1488 | la tension artérielle | blood pressure | Il surveille sa tension artérielle.
1489 | un virus | a virus | Ce virus se transmet facilement.
1490 | contagieux | contagious | La grippe est très contagieuse.
1491 | une épidémie | an epidemic | L'épidémie a fermé les écoles.
1492 | une pandémie | a pandemic | La pandémie a changé nos habitudes.
1493 | la propagation | the spread | Le lavage des mains limite la propagation.
1494 | se laver les mains | to wash one's hands | Lavez-vous les mains avant de manger.
1495 | un masque | a mask | Le masque est obligatoire à l'hôpital.
1496 | une assurance complémentaire | supplementary health insurance | Mon assurance complémentaire rembourse les lunettes.
1497 | rembourser | to reimburse; to repay | L'assurance rembourse les médicaments.
1498 | un arrêt de travail | a sick note, medical leave | Le médecin m'a donné un arrêt de travail.
1499 | se rétablir | to recover | Elle se rétablit lentement après l'opération.
`);
