import { words } from './parse.ts';

// Médias, technologie et internet
export const MEDIA = words(`
1700 | les médias | the media | Les médias jouent un rôle important en démocratie.
1701 | un journal | a newspaper | Je lis le journal en ligne chaque matin.
1702 | un journaliste / une journaliste | a journalist | La journaliste a interviewé le ministre.
1703 | un article | an article | Cet article explique bien le problème.
1704 | un reportage | a report, documentary piece | Le reportage montre la vie dans le Grand Nord.
1705 | une émission | a TV/radio program | Cette émission passe le dimanche soir.
1706 | une chaîne | a channel | Quelle chaîne regardes-tu ?
1707 | une station de radio | a radio station | J'écoute une station de radio francophone.
1708 | les actualités | the news | Je suis les actualités à la radio.
1709 | une nouvelle | a piece of news | C'est une excellente nouvelle !
1710 | un titre | a headline; a title | Le titre de l'article est trompeur.
1711 | trompeur | misleading | Cette publicité est trompeuse.
1712 | une information | information | Vérifiez toujours vos sources d'information.
1713 | une source | a source | Le journaliste protège ses sources.
1714 | fiable | reliable | Ce site n'est pas une source fiable.
1715 | une fausse nouvelle | fake news | Les fausses nouvelles circulent vite sur les réseaux.
1716 | la désinformation | disinformation | La désinformation menace la démocratie.
1717 | vérifier | to check, verify | Il faut vérifier une information avant de la partager.
1718 | partager | to share | Elle partage ses photos avec sa famille.
1719 | publier | to publish, post | Il publie une vidéo chaque semaine.
1720 | une publication | a post; a publication | Sa publication a été partagée mille fois.
1721 | les réseaux sociaux | social media | Les jeunes passent des heures sur les réseaux sociaux.
1722 | un abonné / une abonnée | a follower, subscriber | Elle a cent mille abonnés.
1723 | s'abonner à | to subscribe to | Je me suis abonné à ce balado.
1724 | un abonnement | a subscription | L'abonnement coûte dix dollars par mois.
1725 | un balado | a podcast | J'écoute un balado en français dans l'autobus.
1726 | une vidéo | a video | Cette vidéo explique la grammaire simplement.
1727 | un influenceur / une influenceuse | an influencer | Les influenceurs font la promotion de produits.
1728 | la publicité | advertising | La publicité cible souvent les enfants.
1729 | publicitaire | advertising (adj.) | Les panneaux publicitaires envahissent la ville.
1730 | une application | an app | Cette application aide à apprendre le français.
1731 | télécharger | to download | Téléchargez l'application gratuitement.
1732 | un téléphone intelligent | a smartphone | Presque tout le monde a un téléphone intelligent.
1733 | un écran | a screen | Les enfants passent trop de temps devant les écrans.
1734 | le temps d'écran | screen time | Il faut limiter le temps d'écran des enfants.
1735 | un ordinateur | a computer | Mon ordinateur est trop lent.
1736 | un ordinateur portable | a laptop | J'apporte mon ordinateur portable en cours.
1737 | un logiciel | software | Ce logiciel est gratuit.
1738 | un site web | a website | Le site web du gouvernement est clair.
1739 | une page d'accueil | a home page | Le lien est sur la page d'accueil.
1740 | un lien | a link | Cliquez sur le lien dans le courriel.
1741 | cliquer | to click | Cliquez ici pour vous inscrire.
1742 | un moteur de recherche | a search engine | J'ai trouvé l'adresse avec un moteur de recherche.
1743 | naviguer | to browse; to sail | Il navigue sur internet pendant des heures.
1744 | un internaute | an internet user | Les internautes ont réagi rapidement.
1745 | en direct | live | Le match est diffusé en direct.
1746 | diffuser | to broadcast | La télévision diffuse le débat ce soir.
1747 | la diffusion | broadcasting; distribution | La diffusion de fausses nouvelles est dangereuse.
1748 | la liberté d'expression | freedom of expression | La liberté d'expression a des limites.
1749 | la liberté de la presse | freedom of the press | La liberté de la presse est protégée par la loi.
1750 | la censure | censorship | La censure existe encore dans plusieurs pays.
1751 | la vie privée | privacy | Les applications collectent des données sur notre vie privée.
1752 | les données | data | Vos données sont protégées.
1753 | protéger ses données | to protect one's data | Il est important de protéger ses données personnelles.
1754 | un pirate informatique | a hacker | Un pirate informatique a volé des milliers de mots de passe.
1755 | une cyberattaque | a cyberattack | L'hôpital a subi une cyberattaque.
1756 | la cybersécurité | cybersecurity | La cybersécurité est un secteur en croissance.
1757 | une fraude | a fraud | Attention à la fraude par courriel.
1758 | une arnaque | a scam | Cet appel est une arnaque.
1759 | l'intelligence artificielle | artificial intelligence | L'intelligence artificielle transforme le travail.
1760 | un robot | a robot | Des robots remplacent certains travailleurs.
1761 | automatiser | to automate | L'usine veut automatiser la production.
1762 | une innovation | an innovation | Cette innovation facilite la vie des personnes âgées.
1763 | innovant | innovative | C'est une entreprise très innovante.
1764 | numérique | digital | Le passage au numérique est rapide.
1765 | la transformation numérique | digital transformation | La transformation numérique a changé l'école.
1766 | une technologie | a technology | Les nouvelles technologies facilitent le télétravail.
1767 | un appareil | a device | Éteignez vos appareils pendant l'examen.
1768 | une batterie | a battery | La batterie de mon téléphone est déchargée.
1769 | recharger | to recharge | Je recharge mon téléphone la nuit.
1770 | une mise à jour | an update | Installez la dernière mise à jour.
1771 | un bogue | a bug (software) | Un bogue empêche l'application de démarrer.
1772 | se connecter | to log in; to connect | Connectez-vous avec votre mot de passe.
1773 | une connexion | a connection | La connexion internet est lente ici.
1774 | le wifi | wifi | Le wifi est gratuit dans la bibliothèque.
1775 | un courriel indésirable | a spam email | Ce message est arrivé dans les courriels indésirables.
1776 | un texto | a text message | Envoie-moi un texto quand tu arrives.
1777 | une messagerie | messaging; voicemail | Laissez un message sur ma messagerie.
1778 | un appel vidéo | a video call | Je fais un appel vidéo avec ma mère chaque dimanche.
1779 | dépendant | addicted, dependent | Beaucoup d'adolescents sont dépendants à leur téléphone.
1780 | la dépendance | addiction, dependence | La dépendance aux écrans inquiète les parents.
1781 | l'opinion publique | public opinion | L'opinion publique a changé sur ce sujet.
1782 | influencer | to influence | Les médias influencent nos choix.
1783 | une influence | an influence | Les amis ont une grande influence sur les adolescents.
1784 | un lecteur / une lectrice | a reader | Les lecteurs ont envoyé des commentaires.
1785 | un auditeur / une auditrice | a listener | Les auditeurs peuvent appeler pendant l'émission.
1786 | un téléspectateur | a TV viewer | Les téléspectateurs ont voté pour leur chanson préférée.
1787 | un commentaire | a comment | Il a laissé un commentaire sous la vidéo.
1788 | critiquer | to criticize | Le journal critique la décision du maire.
1789 | une critique | a review; a criticism | La critique du film est très positive.
1790 | un éditorial | an editorial | L'éditorial défend la réforme.
1791 | accorder une entrevue | to give an interview | Le ministre a accepté d'accorder une entrevue à la radio.
1792 | une conférence de presse | a press conference | La première ministre a donné une conférence de presse.
1793 | annoncer | to announce | Le gouvernement a annoncé de nouvelles mesures.
1794 | une annonce officielle | an official announcement | L'annonce officielle est prévue demain.
1795 | un communiqué | a press release | L'entreprise a publié un communiqué.
1796 | relayer | to relay, pass on | Les médias ont relayé l'information.
1797 | viral | viral | La vidéo est devenue virale en une journée.
1798 | une tendance | a trend | C'est la nouvelle tendance chez les jeunes.
1799 | un algorithme | an algorithm | L'algorithme choisit les vidéos que l'on voit.
`);
