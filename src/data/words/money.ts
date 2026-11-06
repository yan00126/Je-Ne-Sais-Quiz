import { words } from './parse.ts';

// Consommation, argent et commerce
export const MONEY = words(`
2200 | l'argent | money | Il met de l'argent de côté chaque mois.
2201 | mettre de côté | to save, put aside | Je mets de côté cent dollars par mois.
2202 | les économies | savings | Ils ont utilisé leurs économies pour acheter la maison.
2203 | épargner | to save (money) | Il est difficile d'épargner avec l'inflation.
2204 | une banque | a bank | La banque ferme à seize heures.
2205 | un compte bancaire | a bank account | Il faut un compte bancaire pour recevoir sa paie.
2206 | un compte d'épargne | a savings account | Le compte d'épargne rapporte peu d'intérêts.
2207 | une carte de crédit | a credit card | Je paie avec ma carte de crédit.
2208 | une carte de débit | a debit card | La carte de débit est acceptée partout.
2209 | en espèces | in cash | Ce commerce accepte seulement les paiements en espèces.
2210 | la monnaie | change (coins); currency | Je n'ai pas de monnaie pour le parcomètre.
2211 | un paiement | a payment | Le paiement se fait en ligne.
2212 | payer | to pay | J'ai payé mon loyer hier.
2213 | une dette | a debt | Il a remboursé toutes ses dettes.
2214 | s'endetter | to go into debt | Beaucoup d'étudiants s'endettent pour étudier.
2215 | un intérêt | interest | Le taux d'intérêt de cette carte est élevé.
2216 | un budget familial | a household budget | Nous faisons un budget familial chaque mois.
2217 | dépenser | to spend | Je dépense trop au restaurant.
2218 | une dépense | an expense | Le logement est notre plus grosse dépense.
2219 | coûter | to cost | Combien coûte ce manteau ?
2220 | le coût | the cost | Le coût des études a augmenté.
2221 | un prix | a price; a prize | Les prix ont augmenté partout.
2222 | cher | expensive | La vie est chère à Vancouver.
2223 | bon marché | cheap | Ce magasin est bon marché.
2224 | une aubaine | a bargain | À ce prix-là, c'est une aubaine !
2225 | un rabais | a discount | Il y a un rabais de vingt pour cent cette semaine.
2226 | les soldes | sales | Les soldes commencent après Noël.
2227 | en solde | on sale | Ces bottes sont en solde.
2228 | une promotion commerciale | a special offer | Cette promotion commerciale finit dimanche.
2229 | un magasin | a store | Le magasin ouvre à dix heures.
2230 | un commerce | a business, shop | Les petits commerces souffrent de la concurrence en ligne.
2231 | un commerçant / une commerçante | a shopkeeper | Les commerçants du quartier sont sympathiques.
2232 | un centre commercial | a shopping mall | Le centre commercial est plein le samedi.
2233 | magasiner | to go shopping (Québec) | J'aime magasiner en ligne.
2234 | le magasinage | shopping (Québec) | Le magasinage des fêtes commence tôt.
2235 | acheter | to buy | J'ai acheté une nouvelle tuque.
2236 | vendre | to sell | Ils vendent leur voiture.
2237 | une vente | a sale | Les ventes en ligne ont explosé.
2238 | un vendeur / une vendeuse | a salesperson | Le vendeur m'a bien conseillé.
2239 | un consommateur / une consommatrice | a consumer | Les consommateurs veulent des produits locaux.
2240 | la société de consommation | consumer society | La société de consommation pousse à acheter toujours plus.
2241 | une marque | a brand | Cette marque est trop chère pour moi.
2242 | un produit | a product | Ce produit est fabriqué au Canada.
2243 | fabriquer | to make, manufacture | Ces meubles sont fabriqués à la main.
2244 | le rapport qualité-prix | value for money | Ce restaurant a un bon rapport qualité-prix.
2245 | une garantie | a warranty | L'appareil a une garantie de deux ans.
2246 | un reçu | a receipt | Gardez votre reçu pour un échange.
2247 | échanger | to exchange | Puis-je échanger ce chandail ?
2248 | un échange | an exchange | Les échanges sont possibles pendant trente jours.
2249 | un remboursement | a refund | Je voudrais un remboursement.
2250 | retourner | to return (an item) | Vous pouvez retourner l'article sans frais.
2251 | un modèle | a model, style | Ce modèle existe en trois couleurs.
2252 | disponible | available | Le modèle bleu est disponible en magasin.
2253 | en rupture de stock | out of stock | Ce produit est en rupture de stock.
2254 | une livraison | a delivery | La livraison est gratuite dès cinquante dollars.
2255 | livrer | to deliver | Le colis sera livré demain.
2256 | un colis | a parcel | J'ai reçu un colis de ma famille.
2257 | commander | to order | J'ai commandé un livre en ligne.
2258 | une commande | an order | Votre commande a été expédiée.
2259 | le commerce en ligne | online shopping | Le commerce en ligne menace les petits magasins.
2260 | une taxe | a tax | Les taxes ne sont pas incluses dans le prix.
2261 | toutes taxes comprises | all taxes included | Le prix est de cinquante dollars toutes taxes comprises.
2262 | un pourboire | a tip | Au Canada, on laisse un pourboire de quinze pour cent.
2263 | l'addition | the bill (restaurant) | L'addition, s'il vous plaît.
2264 | partager l'addition | to split the bill | On partage l'addition ?
2265 | un prêt | a loan | Il a obtenu un prêt pour sa voiture.
2266 | emprunter de l'argent | to borrow money | J'ai dû emprunter de l'argent à mes parents.
2267 | prêter | to lend | Peux-tu me prêter dix dollars ?
2268 | une assurance habitation | home insurance | L'assurance habitation est obligatoire pour les locataires.
2269 | une assurance auto | car insurance | L'assurance auto coûte cher pour les jeunes conducteurs.
2270 | une facture d'électricité | an electricity bill | La facture d'électricité double en hiver.
2271 | un forfait | a plan, package | Mon forfait cellulaire inclut les appels illimités.
2272 | un cellulaire | a cell phone (Québec) | J'ai oublié mon cellulaire à la maison.
2273 | un contrat de service | a service contract | Lisez bien le contrat de service avant de signer.
2274 | résilier | to cancel (a contract) | J'ai résilié mon abonnement au gym.
2275 | des frais | fees, charges | Il y a des frais pour annuler.
2276 | sans frais | free of charge, toll-free | Appelez le numéro sans frais.
2277 | rentable | profitable, worth it | Acheter en gros est plus rentable.
2278 | valoir la peine | to be worth it | Ce cours vaut vraiment la peine.
2279 | un investissement immobilier | a real-estate investment | L'immobilier reste un investissement populaire.
2280 | l'immobilier | real estate | Le marché de l'immobilier a ralenti.
2281 | un courtier / une courtière | a broker | Le courtier nous a trouvé une maison.
2282 | un budget serré | a tight budget | Avec un budget serré, on cuisine à la maison.
2283 | serré | tight | L'horaire est serré cette semaine.
2284 | une fin de mois difficile | a tight end of the month | Beaucoup de familles ont des fins de mois difficiles.
2285 | une banque alimentaire | a food bank | Les banques alimentaires reçoivent plus de demandes.
2286 | un don | a donation | Elle fait un don à une banque alimentaire chaque mois.
2287 | donner | to give | J'ai donné mes vieux vêtements.
2288 | une friperie | a thrift shop | J'achète mes vêtements dans une friperie.
2289 | un vêtement | a piece of clothing | Il faut des vêtements chauds pour l'hiver.
2290 | un manteau | a coat | Ce manteau est parfait pour moins vingt.
2291 | des bottes | boots | Achète de bonnes bottes avant l'hiver.
2292 | une tuque | a winter hat (Canada) | N'oublie pas ta tuque, il fait froid !
2293 | des mitaines | mittens | Les enfants ont perdu leurs mitaines.
2294 | une taille | a size; a height | Quelle taille faites-vous ?
2295 | essayer | to try (on) | Je peux essayer ce pantalon ?
2296 | une cabine d'essayage | a fitting room | Les cabines d'essayage sont au fond du magasin.
2297 | un marché | a market | Le marché Jean-Talon est ouvert tous les jours.
2298 | un panier | a basket | Le panier d'épicerie coûte plus cher qu'avant.
2299 | le panier d'épicerie | the grocery bill (cost) | Le panier d'épicerie a augmenté de dix pour cent.
`);
