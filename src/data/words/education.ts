import { words } from './parse.ts';

// Études et formation
export const EDUCATION = words(`
1300 | une école | a school | L'école primaire est à deux rues d'ici.
1301 | un établissement scolaire | a school (institution) | Chaque établissement scolaire a son règlement.
1302 | l'école secondaire | high school | Mon fils entre à l'école secondaire en septembre.
1303 | un cégep | a CEGEP (Quebec college) | Après le secondaire, elle ira au cégep.
1304 | une université | a university | L'université offre des cours de français gratuits.
1305 | un collège | a college | Il suit un programme technique au collège.
1306 | un programme | a program | Ce programme dure trois ans.
1307 | un cours | a class, course | Le cours commence à dix-huit heures.
1308 | un enseignant / une enseignante | a teacher | L'enseignante explique la règle avec patience.
1309 | un professeur / une professeure | a teacher, professor | Notre professeur corrige les devoirs le soir.
1310 | un élève | a pupil, student (school) | Les élèves portent un uniforme.
1311 | un étudiant / une étudiante | a student (post-secondary) | Les étudiants étrangers paient des frais plus élevés.
1312 | les frais de scolarité | tuition fees | Les frais de scolarité ont augmenté cette année.
1313 | une bourse | a scholarship | Elle a obtenu une bourse d'études.
1314 | un prêt étudiant | a student loan | Il rembourse encore son prêt étudiant.
1315 | les devoirs | homework | Les enfants font leurs devoirs après le souper.
1316 | un examen | an exam | L'examen final compte pour cinquante pour cent.
1317 | réussir | to succeed, pass | Elle a réussi tous ses examens.
1318 | échouer | to fail | Il a échoué à l'examen de conduite.
1319 | une note | a grade; a note | J'ai eu une bonne note en mathématiques.
1320 | un bulletin | a report card | Le bulletin arrive à la fin du trimestre.
1321 | une session | a semester, term | La session d'automne commence en septembre.
1322 | un trimestre | a term, quarter | Le premier trimestre se termine en novembre.
1323 | s'inscrire à un cours | to register for a class | Je me suis inscrit à un cours du soir.
1324 | assister à | to attend | Il faut assister à tous les cours.
1325 | être absent | to be absent | Elle était absente à cause d'un rhume.
1326 | une absence | an absence | Chaque absence doit être justifiée.
1327 | apprendre | to learn | J'apprends le français depuis un an.
1328 | un apprentissage | learning; apprenticeship | L'apprentissage d'une langue demande de la patience.
1329 | enseigner | to teach | Elle enseigne la chimie au secondaire.
1330 | l'enseignement | teaching, education | L'enseignement est gratuit jusqu'à dix-huit ans.
1331 | une matière | a school subject | Ma matière préférée est l'histoire.
1332 | les connaissances | knowledge | Ce test évalue vos connaissances en français.
1333 | un savoir-faire | know-how | L'entreprise valorise le savoir-faire des employés.
1334 | réviser | to review, study | Je révise mes notes avant l'examen.
1335 | mémoriser | to memorize | C'est difficile de mémoriser autant de mots.
1336 | comprendre | to understand | Je comprends mieux quand on parle lentement.
1337 | la compréhension | comprehension | La compréhension orale est ma force.
1338 | l'expression écrite | written expression | L'expression écrite demande beaucoup de pratique.
1339 | une rédaction | an essay, composition | La rédaction doit faire deux cents mots.
1340 | rédiger | to write, draft | Rédigez un courriel à votre propriétaire.
1341 | un résumé | a summary | Faites un résumé du texte en cinq lignes.
1342 | résumer | to summarize | Pouvez-vous résumer l'article ?
1343 | un exposé | a presentation (school) | Je dois préparer un exposé sur l'environnement.
1344 | un débat | a debate | Le débat portait sur les réseaux sociaux.
1345 | une recherche | a research; a search | Ses recherches portent sur le climat.
1346 | une thèse | a thesis | Elle termine sa thèse de doctorat.
1347 | un mémoire | a master's thesis | Il rédige son mémoire de maîtrise.
1348 | un baccalauréat | a bachelor's degree | Elle a un baccalauréat en biologie.
1349 | une maîtrise | a master's degree; mastery | Il a obtenu une maîtrise en éducation.
1350 | un doctorat | a doctorate | Le doctorat dure environ cinq ans.
1351 | un diplômé / une diplômée | a graduate | Les diplômés trouvent vite un emploi.
1352 | obtenir | to obtain, get | Elle a obtenu son diplôme avec mention.
1353 | une attestation | a certificate, proof | Vous recevrez une attestation de réussite.
1354 | un certificat | a certificate | Ce certificat prouve votre niveau de langue.
1355 | un niveau | a level | Quel est votre niveau de français ?
1356 | un débutant / une débutante | a beginner | Ce cours est pour les débutants.
1357 | avancé | advanced | Elle suit un cours de niveau avancé.
1358 | progresser | to progress, improve | Tu as beaucoup progressé en un mois !
1359 | un progrès | progress | Il fait des progrès chaque semaine.
1360 | une difficulté | a difficulty | Les élèves en difficulté reçoivent de l'aide.
1361 | un tuteur / une tutrice | a tutor | Une tutrice aide mon fils en mathématiques.
1362 | la francisation | French-language integration courses | Les cours de francisation sont gratuits pour les immigrants.
1363 | une langue maternelle | a mother tongue | Sa langue maternelle est l'arabe.
1364 | bilingue | bilingual | Les postes au gouvernement fédéral sont souvent bilingues.
1365 | maîtriser | to master | Il maîtrise parfaitement trois langues.
1366 | couramment | fluently | Elle parle couramment l'espagnol.
1367 | un accent | an accent | J'ai encore un accent, mais on me comprend.
1368 | la prononciation | pronunciation | La prononciation des voyelles nasales est difficile.
1369 | le vocabulaire | vocabulary | Lire aide à enrichir le vocabulaire.
1370 | la grammaire | grammar | La grammaire française a beaucoup d'exceptions.
1371 | une faute | a mistake | J'ai fait trois fautes d'orthographe.
1372 | l'orthographe | spelling | Vérifiez l'orthographe avant d'envoyer.
1373 | corriger | to correct | Le professeur corrige les copies.
1374 | une erreur | an error | Chaque erreur est une occasion d'apprendre.
1375 | un dictionnaire | a dictionary | Je cherche le mot dans le dictionnaire.
1376 | une bibliothèque | a library | La bibliothèque prête aussi des films.
1377 | emprunter | to borrow | J'ai emprunté trois livres à la bibliothèque.
1378 | un manuel | a textbook | Le manuel coûte quatre-vingts dollars.
1379 | un cahier | a notebook | Notez les nouveaux mots dans votre cahier.
1380 | prendre des notes | to take notes | Je prends des notes pendant le cours.
1381 | un horaire de cours | a class schedule | L'horaire de cours est disponible en ligne.
1382 | une salle de classe | a classroom | La salle de classe est au deuxième étage.
1383 | un campus | a campus | Le campus est grand et très vert.
1384 | une résidence étudiante | a student residence | Il vit en résidence étudiante la première année.
1385 | la rentrée | back-to-school | La rentrée scolaire a lieu fin août.
1386 | les vacances scolaires | school holidays | Pendant les vacances scolaires, les enfants vont au camp.
1387 | décrocher | to drop out; to land (a job) | Trop d'élèves décrochent avant la fin du secondaire.
1388 | le décrochage scolaire | school dropout | Le décrochage scolaire inquiète les parents.
1389 | la réussite scolaire | academic success | Le sommeil influence la réussite scolaire.
1390 | une orientation | guidance; orientation | Un conseiller d'orientation aide les élèves à choisir.
1391 | choisir | to choose | Il a choisi d'étudier l'informatique.
1392 | un choix | a choice | C'est un choix difficile à faire.
1393 | se spécialiser | to specialize | Elle veut se spécialiser en pédiatrie.
1394 | une formation à distance | distance learning | La formation à distance convient aux parents qui travaillent.
1395 | en ligne | online | Ce cours se donne entièrement en ligne.
1396 | un atelier | a workshop | L'atelier d'écriture a lieu le jeudi.
1397 | une conférence | a lecture, conference | La conférence sur l'immigration était passionnante.
1398 | un stage pratique | a practicum, internship | Le stage pratique fait partie du programme.
1399 | une équivalence | an equivalence (of diplomas) | Il a demandé une équivalence pour son diplôme.
`);
