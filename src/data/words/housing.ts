import { words } from './parse.ts';

// Logement et vie quotidienne
export const HOUSING = words(`
1100 | un appartement | an apartment | Nous louons un appartement de trois pièces.
1101 | une pièce | a room | L'appartement a quatre pièces et un balcon.
1102 | une chambre | a bedroom | La chambre des enfants donne sur la cour.
1103 | la cuisine | the kitchen; cooking | Nous mangeons souvent dans la cuisine.
1104 | une salle de bain | a bathroom | La salle de bain a été rénovée l'an dernier.
1105 | un immeuble | an apartment building | L'immeuble compte six étages et un ascenseur.
1106 | un étage | a floor, storey | J'habite au troisième étage.
1107 | un ascenseur | an elevator | L'ascenseur est en panne depuis lundi.
1108 | un escalier | a staircase | Prenez l'escalier, c'est plus rapide.
1109 | le chauffage | heating | Le chauffage est compris dans le loyer.
1110 | l'électricité | electricity | La facture d'électricité a beaucoup augmenté.
1111 | une facture | a bill, invoice | Je paie mes factures en ligne.
1112 | les charges | utilities, shared costs | Les charges sont de cent dollars par mois.
1113 | meublé | furnished | Ils cherchent un studio meublé près de l'université.
1114 | un studio | a studio apartment | Un studio coûte moins cher qu'un appartement.
1115 | une colocation | a shared apartment | Je vis en colocation avec deux étudiants.
1116 | un colocataire | a roommate | Mon colocataire travaille la nuit.
1117 | un dépôt de garantie | a security deposit | Le dépôt de garantie vous sera rendu à la fin du bail.
1118 | une annonce | an ad, announcement | J'ai trouvé cet appartement grâce à une annonce en ligne.
1119 | visiter | to visit, view (a place) | Nous allons visiter l'appartement samedi.
1120 | louer | to rent | Ils préfèrent louer plutôt qu'acheter.
1121 | un achat | a purchase | L'achat d'une maison est une grosse décision.
1122 | une hypothèque | a mortgage | Ils remboursent leur hypothèque depuis dix ans.
1123 | un emprunt | a loan | La banque a accepté notre emprunt.
1124 | rénover | to renovate | Ils veulent rénover la cuisine cet été.
1125 | des travaux | renovation work | Les travaux dans l'immeuble font beaucoup de bruit.
1126 | le bruit | noise | Le bruit de la rue m'empêche de dormir.
1127 | bruyant | noisy | Mes voisins sont trop bruyants le soir.
1128 | calme | calm, quiet | Je cherche un quartier calme pour ma famille.
1129 | spacieux | spacious | Le salon est lumineux et spacieux.
1130 | lumineux | bright | Cet appartement est très lumineux le matin.
1131 | un balcon | a balcony | On prend le café sur le balcon.
1132 | une cour | a courtyard, yard | Les enfants jouent dans la cour.
1133 | un jardin | a garden | Nous cultivons des tomates dans le jardin.
1134 | un sous-sol | a basement | Le sous-sol sert de salle de jeux.
1135 | un stationnement | a parking space | Le stationnement est inclus avec l'appartement.
1136 | une clé | a key | J'ai perdu la clé de la boîte aux lettres.
1137 | une boîte aux lettres | a mailbox | Vérifie la boîte aux lettres en rentrant.
1138 | le concierge | the building superintendent | Appelez le concierge s'il y a une fuite.
1139 | une fuite | a leak | Il y a une fuite d'eau sous l'évier.
1140 | une panne | a breakdown, outage | Une panne d'électricité a touché tout le quartier.
1141 | réparer | to repair | Le propriétaire doit réparer la fenêtre.
1142 | entretenir | to maintain, look after | Il faut bien entretenir le jardin.
1143 | le ménage | housework, cleaning | Nous faisons le ménage le samedi matin.
1144 | la vaisselle | the dishes | C'est mon tour de faire la vaisselle.
1145 | la lessive | laundry | Je fais la lessive deux fois par semaine.
1146 | les ordures | garbage | On sort les ordures le mardi soir.
1147 | une poubelle | a garbage can | La poubelle est pleine.
1148 | les courses | groceries, shopping | Je fais les courses après le travail.
1149 | une épicerie | a grocery store | L'épicerie du coin ferme à vingt-deux heures.
1150 | un repas | a meal | Le repas du soir est le moment de la famille.
1151 | préparer | to prepare | Je prépare le dîner pendant que les enfants jouent.
1152 | le quotidien | daily life | Le quotidien d'un nouvel arrivant n'est pas toujours simple.
1153 | quotidiennement | daily, every day | Je pratique le français quotidiennement.
1154 | se lever | to get up | Je me lève à six heures en semaine.
1155 | se coucher | to go to bed | Les enfants se couchent à vingt heures.
1156 | se réveiller | to wake up | Je me réveille sans réveil le dimanche.
1157 | une routine | a routine | Le sport fait partie de ma routine.
1158 | un emploi du temps | a schedule | Mon emploi du temps est très chargé cette semaine.
1159 | chargé | busy, loaded | J'ai eu une journée très chargée.
1160 | le temps libre | free time | Que fais-tu pendant ton temps libre ?
1161 | s'occuper de | to take care of | Je m'occupe de mes parents le week-end.
1162 | garder | to keep; to look after | Ma sœur garde les enfants ce soir.
1163 | une garderie | a daycare | La garderie ouvre à sept heures.
1164 | un animal de compagnie | a pet | Les animaux de compagnie sont interdits dans l'immeuble.
1165 | interdit | forbidden | Il est interdit de fumer dans les parties communes.
1166 | autorisé | allowed | Les chats sont autorisés, mais pas les chiens.
1167 | un règlement | rules, regulations | Le règlement de l'immeuble est affiché à l'entrée.
1168 | respecter | to respect, comply with | Merci de respecter le silence après vingt-deux heures.
1169 | une plainte | a complaint | Les voisins ont déposé une plainte pour le bruit.
1170 | un conflit | a conflict | Le conflit entre voisins a été réglé à l'amiable.
1171 | régler | to settle; to pay | Il faut régler ce problème rapidement.
1172 | un meuble | a piece of furniture | Nous avons acheté des meubles d'occasion.
1173 | d'occasion | second-hand | Une voiture d'occasion coûte beaucoup moins cher.
1174 | un canapé | a sofa | Le canapé se transforme en lit.
1175 | une étagère | a shelf | Les livres sont rangés sur l'étagère.
1176 | ranger | to tidy, put away | Range ta chambre avant de sortir !
1177 | un déménagement | a move (house) | Le déménagement a duré toute la journée.
1178 | un carton | a cardboard box | Il nous reste vingt cartons à vider.
1179 | s'installer | to settle in | Nous nous sommes installés à Gatineau en mai.
1180 | une adresse | an address | N'oubliez pas de changer votre adresse.
1181 | un code postal | a postal code | Indiquez votre code postal sur le formulaire.
1182 | un logement social | social housing | Les familles à faible revenu peuvent demander un logement social.
1183 | abordable | affordable | Il manque de logements abordables en ville.
1184 | la crise du logement | the housing crisis | La crise du logement touche surtout les jeunes.
1185 | un loyer modéré | a moderate rent | Ils cherchent un appartement à loyer modéré.
1186 | la banlieue | the suburbs | Beaucoup de familles partent vivre en banlieue.
1187 | le centre-ville | downtown | Le centre-ville est animé le samedi soir.
1188 | un voisinage | a neighbourhood, vicinity | Le voisinage est très accueillant.
1189 | accueillant | welcoming | Les gens du quartier sont accueillants.
1190 | isolé | isolated; insulated | La maison est mal isolée, alors on a froid.
1191 | l'isolation | insulation | Une bonne isolation réduit la facture de chauffage.
1192 | la climatisation | air conditioning | La climatisation est utile pendant les canicules.
1193 | une inondation | a flood | L'inondation a endommagé le sous-sol.
1194 | endommager | to damage | La tempête a endommagé le toit.
1195 | un toit | a roof | Il faut refaire le toit avant l'hiver.
1196 | un plancher | a floor | Le plancher craque dans le couloir.
1197 | un couloir | a hallway | Les manteaux sont dans le couloir.
1198 | pratique | practical, convenient | C'est pratique d'avoir une épicerie en bas.
1199 | confortable | comfortable | Le nouveau lit est très confortable.
`);
