import { words } from './parse.ts';

// Société, politique et économie
export const SOCIETY = words(`
1800 | la société | society | La société canadienne est très diverse.
1801 | social | social | Les inégalités sociales augmentent.
1802 | une inégalité | an inequality | Les inégalités de revenu se creusent.
1803 | l'égalité | equality | L'égalité entre les femmes et les hommes est un droit.
1804 | la pauvreté | poverty | La pauvreté touche aussi les travailleurs.
1805 | pauvre | poor | Les familles pauvres dépensent surtout pour se nourrir.
1806 | riche | rich | Les plus riches paient-ils assez d'impôts ?
1807 | la richesse | wealth | La richesse est mal répartie.
1808 | un sans-abri | a homeless person | Le nombre de sans-abri augmente en hiver.
1809 | l'itinérance | homelessness | L'itinérance est un problème croissant à Montréal.
1810 | la diversité | diversity | La diversité culturelle enrichit la ville.
1811 | multiculturel | multicultural | Toronto est une ville multiculturelle.
1812 | une minorité | a minority | Les minorités linguistiques ont des droits.
1813 | la majorité | the majority | La majorité des citoyens soutient cette mesure.
1814 | la discrimination | discrimination | La discrimination à l'embauche est illégale.
1815 | le racisme | racism | L'école lutte contre le racisme.
1816 | lutter contre | to fight against | Le gouvernement lutte contre la pauvreté.
1817 | la lutte | the fight, struggle | La lutte contre le changement climatique est mondiale.
1818 | les Autochtones | Indigenous peoples | Les Autochtones vivaient ici bien avant l'arrivée des Européens.
1819 | la réconciliation | reconciliation | La réconciliation avec les peuples autochtones est essentielle.
1820 | la francophonie | the French-speaking world | La francophonie compte plus de trois cents millions de personnes.
1821 | francophone | French-speaking | Les communautés francophones hors Québec sont dynamiques.
1822 | anglophone | English-speaking | Il a grandi dans une famille anglophone.
1823 | une communauté | a community | La communauté chinoise est importante à Vancouver.
1824 | la solidarité | solidarity | La solidarité entre voisins a aidé pendant la tempête.
1825 | le bénévolat | volunteering | Le bénévolat permet de rencontrer des gens.
1826 | une association | an association | Elle fait partie d'une association de parents.
1827 | la politique | politics; policy | Il ne s'intéresse pas à la politique.
1828 | un politicien / une politicienne | a politician | Les politiciens promettent beaucoup pendant la campagne.
1829 | un parti | a political party | Quel parti a gagné les élections ?
1830 | un député / une députée | a member of parliament | La députée a rencontré les citoyens du quartier.
1831 | le Parlement | Parliament | Le Parlement a adopté la loi.
1832 | le premier ministre | the prime minister/premier | Le premier ministre a fait une annonce ce matin.
1833 | un maire / une mairesse | a mayor | La mairesse veut améliorer le transport.
1834 | un conseil municipal | a city council | Le conseil municipal se réunit lundi.
1835 | entrer en vigueur | to come into force | La nouvelle loi va entrer en vigueur en janvier.
1836 | adopter | to adopt, pass | Le projet de loi a été adopté.
1837 | un projet de loi | a bill | Le projet de loi sera étudié en commission.
1838 | une réforme | a reform | La réforme du système de santé fait débat.
1839 | une politique publique | a public policy | Les politiques publiques doivent aider les familles.
1840 | un budget | a budget | Le budget prévoit plus d'argent pour l'éducation.
1841 | les dépenses publiques | public spending | Les dépenses publiques ont augmenté.
1842 | un investissement | an investment | Cet investissement créera des emplois.
1843 | investir | to invest | La ville va investir dans le transport en commun.
1844 | financer | to fund, finance | Qui va financer ce projet ?
1845 | le financement | funding | Le financement des écoles est insuffisant.
1846 | une subvention | a grant, subsidy | L'association reçoit une subvention du gouvernement.
1847 | l'économie | the economy | L'économie a ralenti cette année.
1848 | économique | economic | La crise économique a touché tous les secteurs.
1849 | la croissance | growth | La croissance économique est faible.
1850 | une crise | a crisis | La crise du logement s'aggrave.
1851 | s'aggraver | to get worse | La situation s'aggrave chaque mois.
1852 | l'inflation | inflation | L'inflation fait monter le prix de la nourriture.
1853 | le coût de la vie | the cost of living | Le coût de la vie est élevé dans les grandes villes.
1854 | le pouvoir d'achat | purchasing power | Les familles ont perdu du pouvoir d'achat.
1855 | un taux | a rate | Le taux d'intérêt a augmenté.
1856 | le taux de chômage | the unemployment rate | Le taux de chômage est de cinq pour cent.
1857 | une statistique | a statistic | Les statistiques montrent une amélioration.
1858 | un pourcentage | a percentage | Quel pourcentage de la population parle français ?
1859 | la moitié | half | La moitié des répondants sont d'accord.
1860 | le tiers | a third | Un tiers des jeunes vivent chez leurs parents.
1861 | augmenter | to increase | Les prix ont augmenté de trois pour cent.
1862 | diminuer | to decrease | Le nombre d'accidents a diminué.
1863 | doubler | to double | Le prix de l'essence a doublé.
1864 | une évolution | a development, change | L'évolution des mentalités est lente.
1865 | évoluer | to evolve, change | La société évolue rapidement.
1866 | une tendance à la hausse | an upward trend | On observe une tendance à la hausse des loyers.
1867 | un phénomène | a phenomenon | Le télétravail est un phénomène récent.
1868 | la population | the population | La population vieillit.
1869 | démographique | demographic | Le Canada fait face à un défi démographique.
1870 | un défi | a challenge | Apprendre une langue est un beau défi.
1871 | relever un défi | to take up a challenge | Elle a relevé le défi avec succès.
1872 | la sécurité | safety, security | La sécurité des piétons est une priorité.
1873 | la criminalité | crime (rate) | La criminalité a baissé dans le quartier.
1874 | un crime | a crime | Ce crime a choqué toute la ville.
1875 | la police | the police | Appelez la police en cas d'accident.
1876 | la justice | justice; the courts | Il fait confiance à la justice.
1877 | un tribunal | a court | Le tribunal a rendu sa décision.
1878 | un procès | a trial | Le procès durera deux semaines.
1879 | une victime | a victim | Les victimes ont reçu de l'aide.
1880 | la violence | violence | La violence conjugale est un crime.
1881 | les droits de la personne | human rights | La charte protège les droits de la personne.
1882 | une charte | a charter | La Charte de la langue française protège le français au Québec.
1883 | la laïcité | secularism | La laïcité fait débat au Québec.
1884 | une religion | a religion | Chacun est libre de pratiquer sa religion.
1885 | une valeur | a value | Le respect est une valeur importante.
1886 | une tradition | a tradition | Chaque famille a ses traditions.
1887 | une génération | a generation | Les nouvelles générations utilisent moins la voiture.
1888 | les jeunes | young people | Les jeunes s'intéressent à l'environnement.
1889 | un adolescent / une adolescente | a teenager | Les adolescents dorment souvent trop peu.
1890 | un retraité / une retraitée | a retiree | Les retraités font souvent du bénévolat.
1891 | un débat de société | a societal debate | L'aide médicale à mourir est un débat de société.
1892 | une controverse | a controversy | La décision a provoqué une controverse.
1893 | une opinion | an opinion | Les opinions sont partagées.
1894 | partagé | divided (opinions); shared | Les citoyens sont partagés sur la question.
1895 | la plupart de | most of | La plupart des Canadiens vivent près de la frontière.
1896 | un sondage d'opinion | an opinion poll | Un sondage d'opinion montre que le parti recule.
1897 | un citoyen engagé | an engaged citizen | Un citoyen engagé participe à la vie locale.
1898 | la démocratie | democracy | Le vote est la base de la démocratie.
1899 | la participation | participation; turnout | La participation électorale est faible chez les jeunes.
`);
