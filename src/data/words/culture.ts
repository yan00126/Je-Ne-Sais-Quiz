import { words } from './parse.ts';

// Culture, loisirs et sport
export const CULTURE = words(`
2000 | la culture | culture | La culture québécoise est très riche.
2001 | culturel | cultural | Le festival propose des activités culturelles gratuites.
2002 | un spectacle | a show | Le spectacle commence à vingt heures.
2003 | un festival | a festival | Le festival de jazz attire des milliers de visiteurs.
2004 | un concert | a concert | Nous sommes allés au concert samedi soir.
2005 | un chanteur / une chanteuse | a singer | Cette chanteuse est très connue au Québec.
2006 | une chanson | a song | J'apprends le français avec des chansons.
2007 | un musicien / une musicienne | a musician | Les musiciens jouent dans la rue en été.
2008 | jouer d'un instrument | to play an instrument | Il joue de la guitare depuis l'enfance.
2009 | une pièce de théâtre | a play | La pièce de théâtre était très drôle.
2010 | un comédien / une comédienne | an actor | La comédienne a reçu un prix.
2011 | un film | a film | Ce film est sous-titré en français.
2012 | sous-titré | subtitled | Je regarde des films sous-titrés pour progresser.
2013 | un cinéma | a movie theatre | Le cinéma du quartier a fermé.
2014 | une série | a series | Cette série a trois saisons.
2015 | un roman | a novel | Je lis un roman de Michel Tremblay.
2016 | un écrivain / une écrivaine | a writer | Cette écrivaine a gagné un grand prix littéraire.
2017 | un auteur / une autrice | an author | L'auteur signera ses livres samedi.
2018 | un livre | a book | Ce livre m'a beaucoup touché.
2019 | la lecture | reading | La lecture est mon loisir préféré.
2020 | une exposition | an exhibition | L'exposition présente des œuvres autochtones.
2021 | une œuvre | a work (of art) | Cette œuvre est exposée au musée.
2022 | un artiste / une artiste | an artist | Les artistes locaux vendent leurs tableaux au marché.
2023 | un tableau | a painting; a table (chart) | Ce tableau vaut des millions.
2024 | la peinture | painting; paint | Elle fait de la peinture le dimanche.
2025 | la photographie | photography | Il suit un cours de photographie.
2026 | le patrimoine | heritage | Le Vieux-Québec fait partie du patrimoine mondial.
2027 | l'histoire | history; story | L'histoire du Canada est fascinante.
2028 | historique | historic | Ce quartier historique attire les touristes.
2029 | une fête | a party; a holiday | La fête nationale du Québec est le 24 juin.
2030 | un jour férié | a public holiday | Lundi est un jour férié.
2031 | célébrer | to celebrate | Nous célébrons l'anniversaire de ma mère.
2032 | un anniversaire | a birthday; an anniversary | Bon anniversaire !
2033 | une invitation | an invitation | Merci pour l'invitation !
2034 | inviter | to invite | Je t'invite à souper samedi.
2035 | sortir | to go out | Nous sortons souvent le vendredi soir.
2036 | une sortie | an outing; an exit | La sortie au musée a plu aux enfants.
2037 | se divertir | to have fun, be entertained | Il y a beaucoup de façons de se divertir en hiver.
2038 | le divertissement | entertainment | Le divertissement en ligne remplace la télévision.
2039 | s'amuser | to have fun | Les enfants se sont bien amusés.
2040 | s'ennuyer | to be bored | Je m'ennuie quand il pleut.
2041 | un passe-temps | a hobby | Mon passe-temps préféré est la cuisine.
2042 | se passionner pour | to be passionate about | Elle se passionne pour l'astronomie.
2043 | passionnant | fascinating, exciting | Ce documentaire est passionnant.
2044 | un sport | a sport | Le hockey est le sport national d'hiver.
2045 | faire du sport | to exercise, play sports | Je fais du sport trois fois par semaine.
2046 | un match | a game, match | Le match de hockey commence à dix-neuf heures.
2047 | une équipe sportive | a sports team | Il joue dans une équipe sportive du quartier.
2048 | un joueur / une joueuse | a player | Le joueur a marqué deux buts.
2049 | gagner | to win; to earn | Notre équipe a gagné le match.
2050 | perdre | to lose | Ils ont perdu en prolongation.
2051 | un entraînement | a training session | L'entraînement a lieu le mardi soir.
2052 | s'entraîner | to train, work out | Je m'entraîne au gym avant le travail.
2053 | un entraîneur / une entraîneuse | a coach | L'entraîneur encourage les joueurs.
2054 | une compétition | a competition | Elle participe à une compétition de natation.
2055 | la natation | swimming | La natation est bonne pour le dos.
2056 | le patinage | skating | Le patinage est gratuit sur le canal.
2057 | patiner | to skate | Nous patinons sur le lac gelé.
2058 | le ski de fond | cross-country skiing | Le ski de fond est populaire au Québec.
2059 | la raquette | snowshoeing | On fait de la raquette dans le parc.
2060 | camper | to camp | Nous aimons camper au bord du lac.
2061 | la pêche | fishing | Mon père adore la pêche.
2062 | la chasse | hunting | La saison de la chasse commence en automne.
2063 | une piscine | a swimming pool | La piscine municipale est gratuite.
2064 | un centre sportif | a sports centre | Le centre sportif offre des cours de yoga.
2065 | un terrain | a field; a plot of land | Les enfants jouent au soccer sur le terrain.
2066 | un club | a club | Je fais partie d'un club de lecture.
2067 | un camp de jour | a day camp | Les enfants vont au camp de jour en juillet.
2068 | la gastronomie | gastronomy | La gastronomie québécoise mélange plusieurs influences.
2069 | un plat | a dish | La poutine est un plat typique.
2070 | une recette | a recipe | Je cherche une recette de soupe aux pois.
2071 | un restaurant | a restaurant | Ce restaurant sert de la cuisine libanaise.
2072 | une terrasse | a patio, terrace | On mange sur la terrasse quand il fait beau.
2073 | une cabane à sucre | a sugar shack | Nous allons à la cabane à sucre au printemps.
2074 | le sirop d'érable | maple syrup | Le Québec produit la majorité du sirop d'érable.
2075 | typique | typical | C'est un repas typique de la région.
2076 | une coutume | a custom | Chaque pays a ses coutumes.
2077 | un événement | an event | Cet événement attire beaucoup de familles.
2078 | organiser | to organize | La ville organise un marché de Noël.
2079 | un organisateur / une organisatrice | an organizer | Les organisateurs attendent dix mille personnes.
2080 | un lieu | a place, venue | Ce lieu accueille des concerts en plein air.
2081 | un billet d'entrée | an admission ticket | Le billet d'entrée coûte quinze dollars.
2082 | gratuit | free (of charge) | L'entrée est gratuite pour les enfants.
2083 | complet | full, sold out | Le spectacle est complet.
2084 | le public | the audience; the public | Le public a applaudi longtemps.
2085 | applaudir | to applaud | Les spectateurs ont applaudi les danseurs.
2086 | un spectateur / une spectatrice | a spectator | Les spectateurs étaient nombreux.
2087 | la danse | dance | Elle prend des cours de danse.
2088 | danser | to dance | On a dansé toute la nuit.
2089 | un jeu vidéo | a video game | Il joue aux jeux vidéo le week-end.
2090 | un jeu de société | a board game | Nous jouons à un jeu de société en famille.
2091 | le bricolage | DIY, crafts | Le bricolage est son passe-temps.
2092 | le jardinage | gardening | Le jardinage me détend.
2093 | se détendre | to relax | Je me détends en lisant.
2094 | la détente | relaxation | Le spa est un lieu de détente.
2095 | un parc d'attractions | an amusement park | Le parc d'attractions ouvre en mai.
2096 | une plage | a beach | La plage est bondée le week-end.
2097 | la randonnée pédestre | hiking | La randonnée pédestre est gratuite et saine.
2098 | un sentier | a trail | Ce sentier mène au sommet de la montagne.
2099 | le plein air | the outdoors | Les activités de plein air sont populaires ici.
`);
