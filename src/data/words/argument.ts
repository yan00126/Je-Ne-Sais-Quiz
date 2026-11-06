import { words } from './parse.ts';

// Connecteurs et expressions pour argumenter (expression écrite et orale)
export const ARGUMENT = words(`
2300 | tout d'abord | first of all | Tout d'abord, je voudrais vous remercier.
2301 | ensuite | then, next | Ensuite, nous parlerons du budget.
2302 | enfin | finally | Enfin, je dirais que c'est une bonne idée.
2303 | premièrement | firstly | Premièrement, le projet coûte trop cher.
2304 | deuxièmement | secondly | Deuxièmement, il manque de personnel.
2305 | de plus | moreover | De plus, ce choix est écologique.
2306 | en outre | furthermore | En outre, la ville offre une subvention.
2307 | par ailleurs | besides, on another note | Par ailleurs, les citoyens sont satisfaits.
2308 | également | also, equally | Il faut également penser aux enfants.
2309 | non seulement… mais aussi | not only… but also | Non seulement c'est cher, mais aussi c'est inutile.
2310 | mais | but | C'est intéressant, mais trop long.
2311 | toutefois | however | Toutefois, certains ne sont pas d'accord.
2312 | or | yet, now (contrast) | On dit que c'est sûr ; or, les accidents augmentent.
2313 | au contraire | on the contrary | Au contraire, cette mesure aide les familles.
2314 | alors que | whereas, while | Il fait chaud ici alors qu'il neige chez moi.
2315 | tandis que | whereas, while | Elle aime la ville tandis que lui préfère la campagne.
2316 | malgré | despite | Malgré la pluie, le festival a eu lieu.
2317 | même si | even if | Même si c'est difficile, je continue.
2318 | quoique (+ subj.) | although | Quoique ce soit cher, c'est de bonne qualité.
2319 | parce que | because | Je reste ici parce que j'aime mon travail.
2320 | car | because, for | Je suis fatigué, car j'ai mal dormi.
2321 | puisque | since (known cause) | Puisque tu es là, aide-moi.
2322 | comme | as, since | Comme il pleuvait, nous sommes restés à la maison.
2323 | étant donné que | given that | Étant donné que les prix augmentent, il faut épargner.
2324 | en raison de | due to | Le vol est annulé en raison de la tempête.
2325 | à la suite de | following | À la suite de l'accident, la route a été fermée.
2326 | donc | so, therefore | Il neige, donc je reste à la maison.
2327 | ainsi | thus | Ainsi, nous pourrons économiser de l'argent.
2328 | c'est pourquoi | that is why | C'est pourquoi je recommande cette solution.
2329 | si bien que | so that (result) | Il a beaucoup étudié, si bien qu'il a réussi.
2330 | de sorte que | so that | Parlez fort de sorte que tout le monde entende.
2331 | en conséquence | as a result | En conséquence, les prix vont monter.
2332 | pour (+ inf.) | in order to | Je travaille pour payer mes études.
2333 | dans le but de | with the aim of | Il apprend le français dans le but de travailler au Québec.
2334 | de peur que (+ subj.) | for fear that | Je pars tôt de peur que l'autobus soit plein.
2335 | par exemple | for example | Par exemple, on peut prendre le vélo.
2336 | notamment | notably, in particular | Plusieurs villes, notamment Montréal, ont adopté ce plan.
2337 | en particulier | in particular | J'aime les sports d'hiver, en particulier le ski.
2338 | c'est-à-dire | that is to say | Il est végétalien, c'est-à-dire qu'il ne mange aucun produit animal.
2339 | en d'autres termes | in other words | En d'autres termes, il faut agir maintenant.
2340 | en résumé | in summary | En résumé, les avantages sont nombreux.
2341 | en conclusion | in conclusion | En conclusion, je suis favorable au projet.
2342 | pour conclure | to conclude | Pour conclure, je dirais que tout dépend de nous.
2343 | bref | in short | Bref, c'était une excellente journée.
2344 | finalement | in the end | Finalement, nous avons décidé de rester.
2345 | en fait | actually, in fact | En fait, je ne suis pas d'accord.
2346 | en réalité | in reality | En réalité, la situation est plus complexe.
2347 | effectivement | indeed | Effectivement, vous avez raison.
2348 | certes | admittedly | Certes, c'est cher, mais c'est utile.
2349 | il est vrai que | it is true that | Il est vrai que la ville est bruyante.
2350 | je pense que | I think that | Je pense que le télétravail est une bonne chose.
2351 | je trouve que | I find that | Je trouve que les loyers sont trop élevés.
2352 | selon moi | in my view | Selon moi, l'école devrait commencer plus tard.
2353 | d'après moi | in my opinion | D'après moi, c'est une erreur.
2354 | personnellement | personally | Personnellement, je préfère vivre en ville.
2355 | je suis d'accord avec | I agree with | Je suis d'accord avec cette proposition.
2356 | je ne suis pas d'accord | I disagree | Je ne suis pas d'accord avec vous sur ce point.
2357 | je doute que (+ subj.) | I doubt that | Je doute que cette mesure soit efficace.
2358 | il me semble que | it seems to me that | Il me semble que la situation s'améliore.
2359 | je suis convaincu que | I am convinced that | Je suis convaincu que le français m'ouvrira des portes.
2360 | être pour | to be in favour | Je suis pour la gratuité du transport en commun.
2361 | être contre | to be against | Beaucoup de gens sont contre ce projet.
2362 | favorable à | in favour of | La population est favorable à cette idée.
2363 | opposé à | opposed to | Les commerçants sont opposés à la fermeture de la rue.
2364 | un argument | an argument (reason) | C'est un argument convaincant.
2365 | convaincant | convincing | Ses explications sont convaincantes.
2366 | convaincre | to convince | Il a réussi à me convaincre.
2367 | persuader | to persuade | Elle m'a persuadé de m'inscrire.
2368 | un point de vue | a point of view | Je comprends votre point de vue.
2369 | une position | a position, stance | Quelle est votre position sur ce sujet ?
2370 | nuancer | to qualify (an opinion) | Il faut nuancer cette affirmation.
2371 | une nuance | a nuance | La réalité est pleine de nuances.
2372 | une affirmation | a statement | Cette affirmation est fausse.
2373 | affirmer | to state, claim | Le ministre affirme que tout va bien.
2374 | prétendre | to claim | Il prétend avoir tout compris.
2375 | souligner | to emphasize | Je tiens à souligner l'importance de l'éducation.
2376 | insister sur | to stress | Le rapport insiste sur la prévention.
2377 | mettre l'accent sur | to put the emphasis on | L'école met l'accent sur la lecture.
2378 | il faut | it is necessary to | Il faut protéger l'environnement.
2379 | il vaut mieux | it is better to | Il vaut mieux réserver à l'avance.
2380 | il est essentiel de | it is essential to | Il est essentiel de bien dormir.
2381 | il est important que (+ subj.) | it is important that | Il est important que chacun participe.
2382 | il est possible que (+ subj.) | it is possible that | Il est possible qu'il pleuve demain.
2383 | il est probable que | it is likely that | Il est probable que les prix augmentent.
2384 | sans doute | probably | Il viendra sans doute demain.
2385 | sans aucun doute | without a doubt | C'est sans aucun doute la meilleure solution.
2386 | peut-être | maybe | Peut-être que nous irons au cinéma.
2387 | d'un côté… de l'autre | on one hand… on the other | D'un côté c'est pratique, de l'autre c'est cher.
2388 | par contre | on the other hand | J'aime l'été ; par contre, je déteste la chaleur.
2389 | en comparaison | by comparison | En comparaison, Toronto est plus chère.
2390 | plutôt que | rather than | Je prends le vélo plutôt que la voiture.
2391 | au lieu de | instead of | Au lieu de regarder la télé, lis un livre.
2392 | à part | apart from | À part le froid, j'aime tout ici.
2393 | sauf | except | Tout le monde est venu sauf Marc.
2394 | jusqu'à ce que (+ subj.) | until | Attends jusqu'à ce qu'il arrive.
2395 | dès que | as soon as | Appelle-moi dès que tu arrives.
2396 | avant que (+ subj.) | before | Partons avant qu'il pleuve.
2397 | après que | after | Après qu'il est parti, nous avons mangé.
2398 | lorsque | when | Lorsque j'étais enfant, je vivais à la campagne.
2399 | pendant que | while | Je cuisine pendant que tu fais la vaisselle.
`);
