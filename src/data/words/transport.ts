import { words } from './parse.ts';

// Transports, ville et voyages
export const TRANSPORT = words(`
1900 | un autobus | a bus | Je prends l'autobus de sept heures quinze.
1901 | un arrêt d'autobus | a bus stop | L'arrêt d'autobus est devant la pharmacie.
1902 | le métro | the subway | Le métro est plus rapide que l'autobus.
1903 | une station de métro | a subway station | La station de métro la plus proche est à cinq minutes.
1904 | un train | a train | Le train pour Québec part à quinze heures.
1905 | une gare | a train station | Rendez-vous à la gare centrale.
1906 | un avion | a plane | L'avion a atterri avec une heure de retard.
1907 | un aéroport | an airport | L'aéroport est à trente minutes du centre.
1908 | un vol | a flight; a theft | Mon vol a été annulé à cause de la neige.
1909 | annuler | to cancel | Ils ont annulé le spectacle à cause de la pluie.
1910 | une annulation | a cancellation | Les annulations sont remboursées.
1911 | un retard | a delay | Le train a vingt minutes de retard.
1912 | en retard | late | Désolé, je suis en retard.
1913 | à l'heure | on time | L'autobus est rarement à l'heure en hiver.
1914 | un billet | a ticket | J'ai acheté mon billet en ligne.
1915 | un aller simple | a one-way ticket | Un aller simple pour Ottawa, s'il vous plaît.
1916 | un aller-retour | a round trip | L'aller-retour coûte cent dollars.
1917 | un tarif | a fare, rate | Le tarif étudiant est moins cher.
1918 | un laissez-passer | a transit pass | Mon laissez-passer mensuel coûte quatre-vingt-dix dollars.
1919 | une correspondance | a transfer, connection | Il faut prendre une correspondance à Berri-UQAM.
1920 | une ligne | a line | La ligne orange est fermée ce week-end.
1921 | la circulation | traffic | La circulation est dense à l'heure de pointe.
1922 | l'heure de pointe | rush hour | Évitez de conduire à l'heure de pointe.
1923 | un embouteillage | a traffic jam | Je suis resté coincé dans un embouteillage.
1924 | un bouchon | a traffic jam (informal); a cork | Il y a un bouchon sur l'autoroute.
1925 | une autoroute | a highway | L'autoroute est fermée pour des travaux.
1926 | une route | a road | La route est glissante ce matin.
1927 | un carrefour | an intersection | Tournez à gauche au prochain carrefour.
1928 | un feu de circulation | a traffic light | Arrêtez-vous au feu de circulation.
1929 | un piéton | a pedestrian | Les piétons ont la priorité.
1930 | un trottoir | a sidewalk | Le trottoir est couvert de neige.
1931 | traverser | to cross | Traversez la rue au passage piéton.
1932 | conduire | to drive | J'apprends à conduire en hiver.
1933 | un conducteur / une conductrice | a driver | Le conducteur a perdu le contrôle de la voiture.
1934 | stationner | to park | Il est interdit de stationner ici.
1935 | une contravention | a ticket (fine) | J'ai eu une contravention pour stationnement interdit.
1936 | la vitesse | speed | La vitesse est limitée à cinquante kilomètres à l'heure.
1937 | un accident | an accident | L'accident n'a pas fait de blessés.
1938 | l'essence | gasoline | L'essence coûte plus cher cet été.
1939 | un pneu d'hiver | a winter tire | Les pneus d'hiver sont obligatoires au Québec.
1940 | louer une voiture | to rent a car | Nous allons louer une voiture pour le voyage.
1941 | un taxi | a taxi | Le taxi nous attend devant l'hôtel.
1942 | un trajet en autobus | a bus ride | Le trajet en autobus dure quarante minutes.
1943 | un itinéraire | a route, itinerary | L'application propose un itinéraire plus court.
1944 | une carte | a map; a card | Regarde la carte pour trouver la rue.
1945 | se perdre | to get lost | Je me suis perdu dans le Vieux-Québec.
1946 | s'orienter | to find one's way | Il est facile de s'orienter dans cette ville.
1947 | tout droit | straight ahead | Continuez tout droit jusqu'au parc.
1948 | à droite | to the right | La banque est à droite de la poste.
1949 | à gauche | to the left | Tournez à gauche après le pont.
1950 | un pont | a bridge | Le pont relie Ottawa et Gatineau.
1951 | un quartier résidentiel | a residential area | Ils habitent dans un quartier résidentiel tranquille.
1952 | une rue piétonne | a pedestrian street | La rue piétonne est pleine de terrasses en été.
1953 | une place | a square; a seat; a spot | Il n'y a plus de place dans l'autobus.
1954 | un monument | a monument | Ce monument date du dix-neuvième siècle.
1955 | un musée | a museum | Le musée est gratuit le premier dimanche du mois.
1956 | un voyage | a trip | Nous préparons un voyage en Gaspésie.
1957 | voyager | to travel | J'aime voyager seul.
1958 | un voyageur / une voyageuse | a traveller | Les voyageurs doivent présenter leur passeport.
1959 | un touriste / une touriste | a tourist | Les touristes visitent le Vieux-Montréal.
1960 | le tourisme | tourism | Le tourisme est important pour l'économie locale.
1961 | une destination | a destination | Quelle est votre destination préférée ?
1962 | réserver | to book, reserve | J'ai réservé une chambre pour deux nuits.
1963 | une réservation | a reservation | Avez-vous une réservation ?
1964 | un hébergement | accommodation (travel) | L'hébergement est inclus dans le prix.
1965 | un hôtel | a hotel | L'hôtel est près de la plage.
1966 | une auberge de jeunesse | a youth hostel | Les auberges de jeunesse sont économiques.
1967 | un camping | a campsite | Nous dormons au camping près du lac.
1968 | une valise | a suitcase | Ma valise est trop lourde.
1969 | les bagages | luggage | Les bagages sont limités à vingt-trois kilos.
1970 | faire ses bagages | to pack | Je fais mes bagages la veille du départ.
1971 | le départ | the departure | Le départ est prévu à six heures.
1972 | l'arrivée | the arrival | L'arrivée est à midi, heure locale.
1973 | une escale | a stopover | Le vol fait une escale à Paris.
1974 | le décalage horaire | jet lag; time difference | Le décalage horaire avec la France est de six heures.
1975 | un guide | a guide; a guidebook | Le guide nous a montré la vieille ville.
1976 | une visite guidée | a guided tour | La visite guidée dure deux heures.
1977 | un séjour | a stay | Notre séjour à Québec était merveilleux.
1978 | séjourner | to stay (somewhere) | Ils ont séjourné une semaine à Tadoussac.
1979 | un paysage | a landscape | Les paysages de Charlevoix sont magnifiques.
1980 | la côte | the coast | Nous avons visité la côte atlantique.
1981 | une région | a region | Cette région est connue pour ses fromages.
1982 | une ville | a city, town | Ottawa est une ville bilingue.
1983 | un village | a village | Ils habitent dans un petit village.
1984 | rural | rural | Les régions rurales manquent de médecins.
1985 | urbain | urban | La vie urbaine est stressante pour certains.
1986 | l'urbanisme | urban planning | L'urbanisme doit tenir compte des piétons.
1987 | l'étalement urbain | urban sprawl | L'étalement urbain augmente l'usage de la voiture.
1988 | un aménagement | a development, layout | L'aménagement du parc a coûté cher.
1989 | un nid-de-poule | a pothole | Ce nid-de-poule a abîmé mon pneu.
1990 | un cône orange | an orange traffic cone | Les cônes orange sont partout à Montréal en été.
1991 | une déviation | a detour | Suivez la déviation à cause des travaux.
1992 | fermé | closed | La rue est fermée jusqu'à vendredi.
1993 | ouvert | open | Le musée est ouvert tous les jours.
1994 | l'accès | access | L'accès au parc est gratuit.
1995 | accéder à | to access, reach | On accède à l'île par un pont.
1996 | se déplacer | to get around | Je me déplace surtout à vélo.
1997 | un déplacement | a trip, movement | Les déplacements professionnels sont remboursés.
1998 | une navette | a shuttle | Une navette gratuite relie l'hôtel à l'aéroport.
1999 | le transport actif | active transportation | La ville encourage le transport actif.
`);
