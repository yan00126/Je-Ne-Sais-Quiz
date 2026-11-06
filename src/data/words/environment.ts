import { words } from './parse.ts';

// Environnement et climat
export const ENVIRONMENT = words(`
1600 | le climat | the climate | Le climat change plus vite que prévu.
1601 | les changements climatiques | climate change | Les changements climatiques menacent les côtes.
1602 | la pollution | pollution | La pollution de l'air est un problème dans les grandes villes.
1603 | polluer | to pollute | Les voitures polluent beaucoup.
1604 | polluant | polluting | Les industries polluantes doivent payer une taxe.
1605 | les gaz à effet de serre | greenhouse gases | Il faut réduire les gaz à effet de serre.
1606 | les émissions | emissions | Les émissions de carbone ont baissé cette année.
1607 | le carbone | carbon | Le prix du carbone augmente chaque année.
1608 | une empreinte écologique | an ecological footprint | Prendre l'avion augmente notre empreinte écologique.
1609 | écologique | ecological, green | Le vélo est un moyen de transport écologique.
1610 | l'écologie | ecology | L'écologie est au cœur du débat politique.
1611 | la planète | the planet | Nous n'avons qu'une seule planète.
1612 | la nature | nature | Les enfants ont besoin de contact avec la nature.
1613 | protéger | to protect | Il faut protéger les forêts.
1614 | la protection | protection | La protection des espèces menacées est urgente.
1615 | une espèce menacée | an endangered species | Le caribou est une espèce menacée.
1616 | la biodiversité | biodiversity | La biodiversité diminue partout dans le monde.
1617 | disparaître | to disappear | Certaines espèces risquent de disparaître.
1618 | la disparition | disappearance, extinction | La disparition des abeilles inquiète les agriculteurs.
1619 | une forêt | a forest | La forêt couvre une grande partie du Québec.
1620 | un incendie de forêt | a forest fire | Les incendies de forêt sont plus fréquents.
1621 | la sécheresse | drought | La sécheresse a touché les récoltes.
1622 | une canicule | a heat wave | Pendant la canicule, buvez beaucoup d'eau.
1623 | une tempête | a storm | La tempête a privé des milliers de foyers d'électricité.
1624 | la fonte des glaces | the melting of ice | La fonte des glaces fait monter le niveau de la mer.
1625 | le niveau de la mer | sea level | Le niveau de la mer augmente chaque année.
1626 | une catastrophe naturelle | a natural disaster | Les catastrophes naturelles coûtent des milliards.
1627 | les énergies renouvelables | renewable energy | Les énergies renouvelables créent des emplois.
1628 | l'énergie solaire | solar energy | L'énergie solaire devient moins chère.
1629 | l'énergie éolienne | wind power | L'énergie éolienne se développe au Canada.
1630 | l'hydroélectricité | hydroelectricity | Le Québec produit beaucoup d'hydroélectricité.
1631 | les combustibles fossiles | fossil fuels | Il faut réduire notre dépendance aux combustibles fossiles.
1632 | le pétrole | oil | Le prix du pétrole a beaucoup varié.
1633 | consommer | to consume | Nous consommons trop d'énergie.
1634 | la consommation | consumption | La consommation d'eau augmente en été.
1635 | économiser | to save | Éteignez la lumière pour économiser l'énergie.
1636 | réduire | to reduce | Nous devons réduire nos déchets.
1637 | la réduction | reduction | La réduction des emballages est une bonne idée.
1638 | les déchets | waste | Chaque Canadien produit beaucoup de déchets.
1639 | recycler | to recycle | Je recycle le papier et le plastique.
1640 | le compost | compost | La ville ramasse le compost chaque semaine.
1641 | composter | to compost | Nous compostons les restes de repas.
1642 | le plastique | plastic | Les sacs en plastique sont interdits dans plusieurs villes.
1643 | jetable | disposable | Évitez les gobelets jetables.
1644 | réutilisable | reusable | J'apporte un sac réutilisable à l'épicerie.
1645 | un emballage | packaging | Ce produit a trop d'emballage.
1646 | le gaspillage | waste, wastefulness | Le gaspillage alimentaire est énorme.
1647 | le gaspillage alimentaire | food waste | Un tiers de la nourriture finit en gaspillage alimentaire.
1648 | l'eau potable | drinking water | L'accès à l'eau potable est un droit.
1649 | une rivière | a river | La rivière déborde au printemps.
1650 | un lac | a lake | Nous nageons dans le lac en été.
1651 | un océan | an ocean | Le plastique pollue les océans.
1652 | l'air | air | La qualité de l'air est mauvaise aujourd'hui.
1653 | la qualité de l'air | air quality | La fumée des incendies a dégradé la qualité de l'air.
1654 | un environnementaliste | an environmentalist | Les environnementalistes s'opposent au projet.
1655 | militer | to campaign, be an activist | Elle milite pour la protection des océans.
1656 | une manifestation | a protest; an event | Des milliers de jeunes ont participé à la manifestation pour le climat.
1657 | sensibiliser | to raise awareness | Cette campagne veut sensibiliser les jeunes.
1658 | la sensibilisation | awareness-raising | La sensibilisation commence à l'école.
1659 | une campagne | a campaign; the countryside | La campagne de recyclage a bien fonctionné.
1660 | une taxe carbone | a carbon tax | La taxe carbone fait débat.
1661 | une voiture électrique | an electric car | Les voitures électriques sont de plus en plus populaires.
1662 | une borne de recharge | a charging station | Il manque de bornes de recharge en région.
1663 | le covoiturage | carpooling | Le covoiturage réduit le trafic.
1664 | un vélo | a bicycle | Je vais au travail à vélo.
1665 | une piste cyclable | a bike lane | La ville a ajouté de nouvelles pistes cyclables.
1666 | vert | green | La ville veut créer plus d'espaces verts.
1667 | un espace vert | a green space | Les espaces verts améliorent la qualité de vie.
1668 | un parc national | a national park | Le parc national attire beaucoup de touristes.
1669 | l'agriculture | agriculture | L'agriculture consomme beaucoup d'eau.
1670 | biologique | organic | Je préfère les légumes biologiques.
1671 | local | local | Achetez des produits locaux.
1672 | de saison | in season | Les fraises de saison ont plus de goût.
1673 | un pesticide | a pesticide | Les pesticides nuisent aux abeilles.
1674 | nuire à | to harm | La pollution nuit à la santé.
1675 | nuisible | harmful | Ces produits chimiques sont nuisibles pour l'environnement.
1676 | une conséquence | a consequence | Les conséquences du réchauffement sont déjà visibles.
1677 | un impact | an impact | Le tourisme a un impact sur l'environnement.
1678 | la transition énergétique | the energy transition | La transition énergétique demande des investissements.
1679 | la neutralité carbone | carbon neutrality | Le pays vise la neutralité carbone d'ici 2050.
1680 | un engagement | a commitment | Le gouvernement a pris des engagements pour le climat.
1681 | s'engager à | to commit to | L'entreprise s'engage à réduire ses émissions.
1682 | un accord | an agreement | L'accord de Paris fixe des objectifs pour le climat.
1683 | urgent | urgent | Il est urgent d'agir.
1684 | agir | to act | Chacun peut agir à son échelle.
1685 | un geste | a gesture, action | Chaque petit geste compte.
1686 | à l'échelle | at the scale/level | Il faut agir à l'échelle mondiale.
1687 | mondial | global, worldwide | Le réchauffement est un problème mondial.
1688 | une ressource naturelle | a natural resource | Le Canada est riche en ressources naturelles.
1689 | épuiser | to exhaust, use up | Nous épuisons les ressources de la planète.
1690 | l'eau | water | Ne laissez pas couler l'eau inutilement.
1691 | un écosystème | an ecosystem | La pollution menace l'écosystème du fleuve.
1692 | un fleuve | a (large) river | Le fleuve Saint-Laurent traverse le Québec.
1693 | la faune | wildlife (animals) | La faune locale est riche.
1694 | la flore | plant life | La flore de cette région est unique.
1695 | une saison | a season | L'hiver est ma saison préférée.
1696 | la météo | the weather forecast | La météo annonce de la neige demain.
1697 | une prévision | a forecast | Les prévisions annoncent une semaine chaude.
1698 | une température | a temperature | La température a chuté pendant la nuit.
1699 | le verglas | black ice, freezing rain | Attention au verglas sur les routes ce matin.
`);
