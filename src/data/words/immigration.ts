import { words } from './parse.ts';

// Immigration, administration et citoyenneté
export const IMMIGRATION = words(`
1500 | un immigrant / une immigrante | an immigrant | Les immigrants contribuent à l'économie du pays.
1501 | l'immigration | immigration | L'immigration est un sujet de débat important.
1502 | immigrer | to immigrate | Ses parents ont immigré au Canada en 1995.
1503 | émigrer | to emigrate | Beaucoup de jeunes émigrent pour trouver du travail.
1504 | un réfugié / une réfugiée | a refugee | Le pays accueille des milliers de réfugiés chaque année.
1505 | un demandeur d'asile | an asylum seeker | Le demandeur d'asile attend une décision.
1506 | la résidence permanente | permanent residence | Elle a obtenu la résidence permanente l'an dernier.
1507 | un résident permanent | a permanent resident | Les résidents permanents ont accès aux soins de santé.
1508 | un permis de travail | a work permit | Son permis de travail expire en juin.
1509 | un permis d'études | a study permit | Il faut un permis d'études pour étudier ici.
1510 | un visa | a visa | Le visa touristique est valable six mois.
1511 | un passeport | a passport | Mon passeport doit être renouvelé.
1512 | renouveler | to renew | Pensez à renouveler votre permis avant la date d'expiration.
1513 | expirer | to expire | Ma carte expire à la fin du mois.
1514 | la date d'expiration | the expiry date | Vérifiez la date d'expiration de votre passeport.
1515 | valide | valid | Ce document n'est plus valide.
1516 | une demande | an application, request | Ma demande a été acceptée.
1517 | faire une demande | to apply | Vous pouvez faire une demande en ligne.
1518 | déposer | to submit; to drop off | Il a déposé son dossier en mars.
1519 | un formulaire | a form | Le formulaire doit être signé et daté.
1520 | signer | to sign | Signez ici, s'il vous plaît.
1521 | une signature | a signature | Votre signature est obligatoire.
1522 | un justificatif | a supporting document | Joignez un justificatif de domicile.
1523 | joindre | to attach; to reach | Veuillez joindre une copie de votre diplôme.
1524 | une preuve | a proof | Une facture récente sert de preuve d'adresse.
1525 | une photocopie | a photocopy | Apportez une photocopie de votre passeport.
1526 | un acte de naissance | a birth certificate | L'acte de naissance doit être traduit.
1527 | une traduction certifiée | a certified translation | Il faut une traduction certifiée de vos documents.
1528 | les autorités | the authorities | Les autorités ont prolongé le délai.
1529 | le gouvernement fédéral | the federal government | Le gouvernement fédéral gère l'immigration.
1530 | une province | a province | Chaque province a ses propres programmes.
1531 | provincial | provincial | Les soins de santé sont de compétence provinciale.
1532 | un ministère | a government department | Le ministère a publié de nouvelles règles.
1533 | un fonctionnaire | a civil servant | Le fonctionnaire a vérifié mes documents.
1534 | un guichet | a service counter, window | Présentez-vous au guichet numéro trois.
1535 | un numéro d'assurance sociale | a social insurance number | Vous avez besoin d'un numéro d'assurance sociale pour travailler.
1536 | une déclaration de revenus | a tax return | La déclaration de revenus est due le 30 avril.
1537 | un remboursement d'impôt | a tax refund | J'ai reçu mon remboursement d'impôt.
1538 | une prestation | a benefit (government) | Les familles reçoivent des prestations pour enfants.
1539 | admissible | eligible | Vous êtes admissible à cette aide.
1540 | l'admissibilité | eligibility | Vérifiez votre admissibilité sur le site officiel.
1541 | un critère | a criterion | Il faut répondre à tous les critères.
1542 | exiger | to require | Le programme exige un niveau B2 en français.
1543 | obligatoire | mandatory | La visite médicale est obligatoire.
1544 | facultatif | optional | Cette section est facultative.
1545 | refuser | to refuse, reject | Sa demande de visa a été refusée.
1546 | un refus | a refusal | Il a reçu une lettre de refus.
1547 | accepter | to accept | Sa candidature a été acceptée.
1548 | approuver | to approve | Le ministère a approuvé la demande.
1549 | un traitement de dossier | file processing | Le traitement de dossier prend six mois.
1550 | un rendez-vous biométrique | a biometrics appointment | Mon rendez-vous biométrique est la semaine prochaine.
1551 | les empreintes digitales | fingerprints | On a pris mes empreintes digitales.
1552 | une entrevue | an interview (official) | L'entrevue avec l'agent s'est bien passée.
1553 | un agent d'immigration | an immigration officer | L'agent d'immigration a posé beaucoup de questions.
1554 | la frontière | the border | Ils ont traversé la frontière en voiture.
1555 | la douane | customs | Il faut déclarer ces produits à la douane.
1556 | déclarer | to declare | Avez-vous quelque chose à déclarer ?
1557 | un parrainage | a sponsorship | Il a fait une demande de parrainage pour sa femme.
1558 | parrainer | to sponsor | Elle parraine ses parents.
1559 | la réunification familiale | family reunification | La réunification familiale peut prendre des années.
1560 | un conjoint / une conjointe | a spouse, partner | Son conjoint a obtenu un permis de travail ouvert.
1561 | un conjoint de fait | a common-law partner | Ils sont conjoints de fait depuis trois ans.
1562 | un test de langue | a language test | Le test de langue est exigé pour la citoyenneté.
1563 | un examen de citoyenneté | a citizenship test | Il a réussi son examen de citoyenneté.
1564 | une cérémonie | a ceremony | La cérémonie de citoyenneté était émouvante.
1565 | prêter serment | to take an oath | Les nouveaux citoyens prêtent serment.
1566 | un droit | a right | Chaque citoyen a le droit de voter.
1567 | un devoir | a duty | Voter est aussi un devoir civique.
1568 | voter | to vote | Je vais voter pour la première fois.
1569 | une élection | an election | Les élections ont lieu en octobre.
1570 | la nationalité | nationality | Il a la double nationalité.
1571 | un pays d'origine | a country of origin | Elle retourne dans son pays d'origine chaque été.
1572 | un pays d'accueil | a host country | Le pays d'accueil offre des cours de langue.
1573 | une société d'accueil | a host society | L'intégration dépend aussi de la société d'accueil.
1574 | l'intégration | integration | L'emploi est la clé de l'intégration.
1575 | un organisme communautaire | a community organization | Un organisme communautaire m'a aidé à trouver un logement.
1576 | un intervenant / une intervenante | a social worker, caseworker | Une intervenante m'a expliqué les démarches.
1577 | accompagner | to accompany, support | L'organisme accompagne les nouveaux arrivants.
1578 | un service d'aide | a support service | Ce service d'aide est gratuit et confidentiel.
1579 | confidentiel | confidential | Vos renseignements restent confidentiels.
1580 | les renseignements personnels | personal information | Ne partagez pas vos renseignements personnels.
1581 | un renseignement | a piece of information | Pour tout renseignement, appelez ce numéro.
1582 | se renseigner | to find out, inquire | Renseignez-vous auprès de la mairie.
1583 | la mairie | city hall | La mairie organise une fête de quartier.
1584 | une municipalité | a municipality | La municipalité offre des activités gratuites.
1585 | une procédure | a procedure | La procédure est longue mais simple.
1586 | la paperasse | paperwork (informal) | Je déteste la paperasse administrative.
1587 | administratif | administrative | Les tâches administratives prennent du temps.
1588 | une étape | a step, stage | La première étape est de créer un compte.
1589 | un compte | an account | Créez un compte sur le portail en ligne.
1590 | un mot de passe | a password | Choisissez un mot de passe solide.
1591 | un délai de traitement | processing time | Le délai de traitement varie selon le pays.
1592 | une prolongation | an extension | Il a demandé une prolongation de son permis.
1593 | un statut | a status | Quel est votre statut au Canada ?
1594 | légal | legal | Il travaille ici de façon légale.
1595 | illégal | illegal | Travailler sans permis est illégal.
1596 | une amende | a fine | Il a reçu une amende pour excès de vitesse.
1597 | la loi | the law | Personne n'est au-dessus de la loi.
1598 | un avocat / une avocate | a lawyer | Un avocat l'aide avec son dossier d'immigration.
1599 | un consulat | a consulate | Le consulat délivre les passeports.
`);
