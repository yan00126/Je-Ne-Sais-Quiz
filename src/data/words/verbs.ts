import { words } from './parse.ts';

// Verbes et adjectifs courants (B1-B2)
export const VERBS = words(`
2400 | permettre | to allow | Ce programme permet d'apprendre en ligne.
2401 | empêcher | to prevent | La neige nous a empêchés de partir.
2402 | éviter | to avoid | Évitez de sortir pendant la tempête.
2403 | profiter de | to take advantage of, enjoy | Profitez du beau temps !
2404 | dépendre de | to depend on | Tout dépend de la météo.
2405 | appartenir à | to belong to | Ce sac appartient à ma sœur.
2406 | concerner | to concern | Cette règle concerne tous les employés.
2407 | consister à | to consist in | Mon travail consiste à aider les clients.
2408 | comporter | to include, comprise | Le test comporte quatre parties.
2409 | contenir | to contain | Ce produit contient des noix.
2410 | inclure | to include | Le prix inclut le déjeuner.
2411 | exclure | to exclude | On ne peut pas exclure cette possibilité.
2412 | proposer | to propose, offer | Je propose qu'on se retrouve à midi.
2413 | suggérer | to suggest | Je vous suggère de réserver tôt.
2414 | conseiller | to advise | Le médecin m'a conseillé de marcher.
2415 | recommander | to recommend | Je vous recommande ce restaurant.
2416 | prévoir | to plan, forecast | Nous prévoyons de partir en juillet.
2417 | envisager | to consider, contemplate | Ils envisagent de déménager à Québec.
2418 | décider | to decide | Nous avons décidé de rester.
2419 | hésiter | to hesitate | N'hésitez pas à poser des questions.
2420 | se rendre | to go (somewhere) | Je me rends au bureau à pied.
2421 | se trouver | to be located | La pharmacie se trouve près de la gare.
2422 | se situer | to be situated | Le problème se situe à un autre niveau.
2423 | se produire | to happen, occur | L'accident s'est produit vers minuit.
2424 | avoir lieu | to take place | La réunion aura lieu jeudi.
2425 | se dérouler | to take place, unfold | L'entrevue s'est bien déroulée.
2426 | arriver | to arrive; to happen | Qu'est-ce qui est arrivé ?
2427 | survenir | to occur (suddenly) | Un problème est survenu pendant la livraison.
2428 | entraîner | to lead to, cause | Cette décision entraînera des changements.
2429 | provoquer | to cause | La neige a provoqué des retards.
2430 | causer | to cause | Le verglas a causé plusieurs accidents.
2431 | susciter | to arouse, give rise to | Le projet suscite beaucoup de critiques.
2432 | favoriser | to promote, favour | Le sport favorise la concentration.
2433 | encourager | to encourage | Mes amis m'encouragent à parler français.
2434 | décourager | to discourage | Ne te laisse pas décourager par les erreurs.
2435 | améliorer | to improve | Je veux améliorer ma prononciation.
2436 | une amélioration | an improvement | On note une nette amélioration.
2437 | s'améliorer | to get better | La situation s'améliore lentement.
2438 | empirer | to get worse | La circulation empire chaque année.
2439 | changer | to change | Les choses ont beaucoup changé.
2440 | transformer | to transform | Internet a transformé notre façon de travailler.
2441 | remplacer | to replace | Les machines remplacent certains emplois.
2442 | ajouter | to add | Ajoutez un peu de sel.
2443 | retirer | to withdraw, remove | J'ai retiré de l'argent au guichet.
2444 | supprimer | to delete, abolish | Le gouvernement veut supprimer cette taxe.
2445 | maintenir | to maintain | Il faut maintenir les services publics.
2446 | développer | to develop | L'entreprise développe une nouvelle application.
2447 | le développement | development | Le développement durable est une priorité.
2448 | créer | to create | Le projet va créer cent emplois.
2449 | une création | a creation | La création d'entreprises augmente.
2450 | produire | to produce | La région produit du fromage.
2451 | fournir | to provide | L'école fournit le matériel.
2452 | offrir | to offer, give | La ville offre des cours gratuits.
2453 | obtenir des résultats | to get results | Avec de la pratique, on obtient des résultats.
2454 | parvenir à | to manage to | Il est parvenu à trouver un emploi.
2455 | arriver à | to manage to | Je n'arrive pas à comprendre cet accent.
2456 | essayer de | to try to | J'essaie de parler français tous les jours.
2457 | tenter de | to attempt to | Il a tenté de réparer la voiture.
2458 | réaliser | to carry out; to realize | Elle a réalisé son rêve.
2459 | accomplir | to accomplish | Il a accompli beaucoup en un an.
2460 | se concentrer | to concentrate | J'ai du mal à me concentrer avec le bruit.
2461 | se souvenir de | to remember | Je me souviens de mon premier jour ici.
2462 | oublier | to forget | J'ai oublié mon mot de passe.
2463 | reconnaître | to recognize, acknowledge | Il faut reconnaître que c'est difficile.
2464 | admettre | to admit | J'admets que j'avais tort.
2465 | nier | to deny | Il nie avoir pris l'argent.
2466 | se tromper | to be mistaken | Je me suis trompé d'adresse.
2467 | avoir raison | to be right | Tu as raison, c'est plus simple.
2468 | avoir tort | to be wrong | Il a tort de ne pas essayer.
2469 | expliquer | to explain | Pouvez-vous expliquer cette règle ?
2470 | décrire | to describe | Décrivez votre logement idéal.
2471 | raconter | to tell (a story) | Raconte-moi ton voyage !
2472 | exprimer | to express | Il est difficile d'exprimer ses sentiments dans une autre langue.
2473 | justifier | to justify | Justifiez votre réponse.
2474 | comparer | to compare | Comparez les deux documents.
2475 | distinguer | to distinguish | Je distingue mal le « u » et le « ou ».
2476 | constater | to note, observe | On constate une hausse des prix.
2477 | remarquer | to notice | J'ai remarqué que tu parles mieux.
2478 | s'apercevoir | to realize, notice | Je me suis aperçu de mon erreur trop tard.
2479 | prendre conscience de | to become aware of | Les gens prennent conscience de l'urgence climatique.
2480 | s'adapter | to adapt | Il faut du temps pour s'adapter au climat.
2481 | s'habituer | to get used to | On finit par s'habituer au froid.
2482 | supporter | to bear, stand | Je ne supporte pas la chaleur.
2483 | important | important | C'est une décision importante.
2484 | essentiel | essential | Le sommeil est essentiel.
2485 | nécessaire | necessary | Est-ce vraiment nécessaire ?
2486 | utile | useful | Cette application est très utile.
2487 | inutile | useless | C'est inutile de crier.
2488 | efficace | effective, efficient | Cette méthode est très efficace.
2489 | possible | possible | Est-ce possible de changer la date ?
2490 | impossible | impossible | Il est impossible de tout faire en un jour.
2491 | facile | easy | Ce n'est pas facile d'apprendre une langue.
2492 | difficile | difficult | La grammaire est difficile au début.
2493 | complexe | complex | C'est un problème complexe.
2494 | évident | obvious | La réponse n'est pas évidente.
2495 | actuel | current | La situation actuelle est préoccupante.
2496 | actuellement | currently | Actuellement, je travaille dans un café.
2497 | récent | recent | Une étude récente montre le contraire.
2498 | ancien | former; old | Mon ancien patron m'a écrit.
2499 | préoccupant | worrying | Le niveau de pollution est préoccupant.
`);
