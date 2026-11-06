import { words } from './parse.ts';

// Relations, famille, émotions et caractère
export const RELATIONS = words(`
2100 | une famille | a family | Ma famille vit encore en Chine.
2101 | les parents | parents; relatives | Mes parents viennent me voir en été.
2102 | un enfant | a child | Ils ont deux enfants.
2103 | un frère / une sœur | a brother / a sister | Mon frère habite à Calgary.
2104 | un grand-parent | a grandparent | Les grands-parents gardent souvent les enfants.
2105 | un cousin / une cousine | a cousin | Ma cousine se marie en août.
2106 | un oncle / une tante | an uncle / an aunt | Mon oncle tient un restaurant.
2107 | un neveu / une nièce | a nephew / a niece | J'ai offert un livre à ma nièce.
2108 | un mari / une femme | a husband / a wife | Son mari travaille de nuit.
2109 | un couple | a couple | Ce couple vit ensemble depuis vingt ans.
2110 | se marier | to get married | Ils se sont mariés l'été dernier.
2111 | un mariage | a wedding; a marriage | Le mariage aura lieu à la campagne.
2112 | divorcer | to divorce | Ses parents ont divorcé quand il était jeune.
2113 | se séparer | to separate | Ils ont décidé de se séparer.
2114 | une famille monoparentale | a single-parent family | Les familles monoparentales ont souvent moins de revenus.
2115 | une famille recomposée | a blended family | Il vit dans une famille recomposée.
2116 | élever | to raise (children) | Elle élève seule ses trois enfants.
2117 | l'éducation des enfants | child-rearing | L'éducation des enfants demande beaucoup de patience.
2118 | un ami / une amie | a friend | C'est ma meilleure amie depuis l'école.
2119 | l'amitié | friendship | L'amitié est précieuse.
2120 | un copain / une copine | a pal; a boyfriend/girlfriend | Elle sort avec son copain ce soir.
2121 | une connaissance | an acquaintance | C'est une simple connaissance, pas un ami.
2122 | rencontrer | to meet | J'ai rencontré mon conjoint au travail.
2123 | une rencontre | a meeting, encounter | Cette rencontre a changé ma vie.
2124 | se faire des amis | to make friends | Ce n'est pas facile de se faire des amis à l'âge adulte.
2125 | fréquenter | to spend time with; to attend | Il fréquente un groupe de conversation en français.
2126 | la solitude | loneliness, solitude | La solitude touche beaucoup de personnes âgées.
2127 | seul | alone | Il vit seul depuis son divorce.
2128 | s'entendre bien avec | to get along well with | Je m'entends bien avec mes collègues.
2129 | une dispute | an argument | Ils ont eu une dispute pour une question d'argent.
2130 | se disputer | to argue | Les enfants se disputent tout le temps.
2131 | se réconcilier | to make up | Ils se sont réconciliés après une semaine.
2132 | faire confiance à | to trust | Je fais confiance à mon médecin.
2133 | la confiance | trust, confidence | La confiance se construit avec le temps.
2134 | la confiance en soi | self-confidence | Parler en public améliore la confiance en soi.
2135 | le respect | respect | Le respect est la base d'une bonne relation.
2136 | soutenir | to support | Mes amis m'ont soutenu pendant cette période.
2137 | le soutien | support | Merci pour votre soutien.
2138 | aider | to help | Pouvez-vous m'aider à porter ces boîtes ?
2139 | une émotion | an emotion | Il a du mal à exprimer ses émotions.
2140 | un sentiment | a feeling | J'ai le sentiment d'avoir progressé.
2141 | heureux | happy | Je suis heureux d'être ici.
2142 | le bonheur | happiness | Le bonheur est dans les petites choses.
2143 | triste | sad | Elle est triste de quitter ses amis.
2144 | la tristesse | sadness | Il cache sa tristesse derrière son sourire.
2145 | en colère | angry | Les citoyens sont en colère contre la hausse des taxes.
2146 | la colère | anger | Il a du mal à contrôler sa colère.
2147 | inquiet | worried | Je suis inquiet pour mon examen.
2148 | s'inquiéter | to worry | Ne t'inquiète pas, tout ira bien.
2149 | l'inquiétude | worry, concern | Cette décision suscite l'inquiétude des parents.
2150 | avoir peur de | to be afraid of | J'ai peur de faire des fautes quand je parle.
2151 | la peur | fear | La peur de l'échec bloque beaucoup d'apprenants.
2152 | déçu | disappointed | Je suis déçu par les résultats.
2153 | la déception | disappointment | Sa déception était visible.
2154 | surpris | surprised | J'ai été surpris par la gentillesse des gens.
2155 | fier | proud | Je suis fier de mes progrès en français.
2156 | la fierté | pride | Elle parle de sa culture avec fierté.
2157 | gêné | embarrassed | J'étais gêné de ne pas comprendre la question.
2158 | timide | shy | Il est timide mais très drôle.
2159 | impatient | impatient; eager | Je suis impatient de voir mes progrès.
2160 | la patience | patience | Apprendre une langue demande de la patience.
2161 | généreux | generous | Ses voisins sont très généreux.
2162 | gentil | kind, nice | C'est très gentil de votre part.
2163 | poli | polite | Restez poli même si vous n'êtes pas d'accord.
2164 | sympathique | friendly, nice | Mon nouveau collègue est sympathique.
2165 | égoïste | selfish | Ce comportement est égoïste.
2166 | honnête | honest | Il est honnête avec ses clients.
2167 | sérieux | serious, reliable | C'est une étudiante sérieuse.
2168 | travailleur | hard-working | Les nouveaux arrivants sont souvent très travailleurs.
2169 | paresseux | lazy | Je suis un peu paresseux le dimanche.
2170 | curieux | curious | Les enfants sont naturellement curieux.
2171 | ouvert d'esprit | open-minded | Il faut être ouvert d'esprit pour vivre à l'étranger.
2172 | un caractère | a personality, temper | Elle a un caractère fort.
2173 | une personnalité | a personality | Sa personnalité plaît à tout le monde.
2174 | un comportement | a behaviour | Ce comportement n'est pas acceptable.
2175 | se comporter | to behave | Les enfants se sont bien comportés.
2176 | une attitude | an attitude | Une attitude positive aide à apprendre.
2177 | un défaut | a flaw | Mon plus grand défaut est l'impatience.
2178 | une qualité | a quality | Sa principale qualité est l'écoute.
2179 | l'écoute | listening (attentiveness) | Une bonne écoute est essentielle en couple.
2180 | partager un repas | to share a meal | Partager un repas rapproche les gens.
2181 | rapprocher | to bring closer | Les épreuves ont rapproché la famille.
2182 | les liens familiaux | family ties | Les liens familiaux sont importants pour lui.
2183 | manquer à quelqu'un | to be missed by someone | Ma famille me manque beaucoup.
2184 | le mal du pays | homesickness | Il a eu le mal du pays le premier hiver.
2185 | une habitude familiale | a family habit | Le souper du dimanche est une habitude familiale.
2186 | un âge | an age | À quel âge as-tu immigré ?
2187 | l'enfance | childhood | J'ai passé mon enfance à la campagne.
2188 | l'adolescence | adolescence | L'adolescence est une période difficile.
2189 | un adulte | an adult | Ce cours est réservé aux adultes.
2190 | grandir | to grow up | J'ai grandi à Shanghai.
2191 | vieillir | to grow old | Mes parents vieillissent et ont besoin d'aide.
2192 | naître | to be born | Ma fille est née à Montréal.
2193 | une naissance | a birth | Félicitations pour la naissance de votre fils !
2194 | mourir | to die | Son grand-père est mort l'an dernier.
2195 | un décès | a death | Le décès de sa mère l'a beaucoup affecté.
2196 | un deuil | grief, mourning | Il traverse une période de deuil.
2197 | féliciter | to congratulate | Je te félicite pour ta réussite !
2198 | remercier | to thank | Je tiens à vous remercier pour votre aide.
2199 | s'excuser | to apologize | Il s'est excusé pour son retard.
`);
