<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BeldiSeeder extends Seeder
{
    public function run(): void
    {
        // ---- Wipe existing data (bypass FK constraints) ----
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('products')->truncate();
        DB::table('categories')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // ---- Categories ----
        $categories = [
            [
                'name'        => 'Salon Marocain',
                'slug'        => 'salon-marocain',
                'description' => 'Ensembles salon traditionnels marocains, fabriqués à la main en bois de cèdre et garnis de tissus Beldi.',
                'image'       => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
            ],
            [
                'name'        => 'Tables',
                'slug'        => 'tables',
                'description' => 'Tables artisanales en bois sculpté, avec incrustations de zellige ou de métal forgé.',
                'image'       => 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&q=80',
            ],
            [
                'name'        => 'Chaises & Fauteuils',
                'slug'        => 'chaises-fauteuils',
                'description' => 'Chaises et fauteuils en bois de noyer ou cèdre, tapissés de cuir tanné naturel.',
                'image'       => 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80',
            ],
            [
                'name'        => 'Chambres',
                'slug'        => 'chambres',
                'description' => 'Mobilier de chambre artisanal : lits, armoires et tables de chevet en bois massif.',
                'image'       => 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80',
            ],
            [
                'name'        => 'Décoration Artisanale',
                'slug'        => 'decoration-artisanale',
                'description' => 'Lanternes, miroirs, vases et objets décoratifs faits à la main par des artisans marocains.',
                'image'       => 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=600&q=80',
            ],
            [
                'name'        => 'Tapis & Textiles',
                'slug'        => 'tapis-textiles',
                'description' => 'Tapis berbères, coussins et poufs tissés à la main avec des laines naturelles teintes.',
                'image'       => 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80',
            ],
            [
                'name'        => 'Bois Sculpté',
                'slug'        => 'bois-sculpte',
                'description' => 'Pièces uniques en bois de cèdre sculpté à la main selon les motifs arabesques traditionnels.',
                'image'       => 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=600&q=80',
            ],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // ---- Products ----
        $products = [

            // ============================
            // SALON MAROCAIN
            // ============================
            [
                'name'        => 'Salon Beldi Tizimi — 8 Pièces',
                'description' => 'Ensemble salon marocain complet en bois de cèdre sculpté à la main. Garniture en tissu Beldi bicolore beige et bordeaux. Finition laquée miel. Motifs géométriques traditionnels sur les façades.',
                'price'       => 18500,
                'category'    => 'salon-marocain',
                'images'      => ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
                'stock'       => 4,
                'rating'      => 4.9,
                'materials'   => 'Cèdre de l\'Atlas, tissu Beldi, laque naturelle',
                'dimensions'  => 'Canapé 220cm, 2 fauteuils 80cm, 2 banquettes 120cm',
                'sales_count' => 31,
            ],
            [
                'name'        => 'Canapé Riad — 3 Places',
                'description' => 'Canapé marocain trois places sculpté en bois de noyer. Assise profonde en mousse haute densité, revêtement en velours Kelim brodé à la main.',
                'price'       => 7800,
                'category'    => 'salon-marocain',
                'images'      => ['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'],
                'stock'       => 6,
                'rating'      => 4.8,
                'materials'   => 'Noyer, velours Kelim, mousse HR',
                'dimensions'  => '200cm x 90cm x 95cm',
                'sales_count' => 22,
            ],
            [
                'name'        => 'Banquette Andalouse — Paire',
                'description' => 'Paire de banquettes en cèdre sculpté avec pieds tournés. Assise en tissu jacquard vert amande à motifs ottomans. Idéale pour l\'entrée ou le salon.',
                'price'       => 4200,
                'category'    => 'salon-marocain',
                'images'      => ['https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800&q=80'],
                'stock'       => 8,
                'rating'      => 4.7,
                'materials'   => 'Cèdre sculpté, jacquard, pieds laiton',
                'dimensions'  => '120cm x 50cm x 85cm chacune',
                'sales_count' => 18,
            ],
            [
                'name'        => 'Table Basse Salon Zellij',
                'description' => 'Table basse carrée avec plateau en zellige de Fès, pieds en fer forgé noir. Chaque carreau est posé à la main par un mâalem zellij. Pièce unique.',
                'price'       => 3600,
                'category'    => 'salon-marocain',
                'images'      => ['https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=80'],
                'stock'       => 7,
                'rating'      => 4.9,
                'materials'   => 'Zellige de Fès, fer forgé',
                'dimensions'  => '90cm x 90cm x 45cm',
                'sales_count' => 27,
            ],

            // ============================
            // TABLES
            // ============================
            [
                'name'        => 'Table à Manger Sultane — 8 Places',
                'description' => 'Grande table à manger en chêne massif avec incrustations de laiton forgé sur les bords. Pieds carrés en bois tourné avec ceinture en fer peint. Livraison montée.',
                'price'       => 14900,
                'category'    => 'tables',
                'images'      => ['https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80'],
                'stock'       => 3,
                'rating'      => 4.8,
                'materials'   => 'Chêne massif, laiton incrusté, fer forgé',
                'dimensions'  => '220cm x 100cm x 76cm',
                'sales_count' => 12,
            ],
            [
                'name'        => 'Table Guéridon Cèdre Sculpté',
                'description' => 'Table d\'appoint ronde en cèdre de l\'Atlas entièrement sculpté à la main. Motifs rosaces et arabesques. Plateau verni à l\'huile de noix, préservant le grain naturel du bois.',
                'price'       => 2800,
                'category'    => 'tables',
                'images'      => ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80'],
                'stock'       => 10,
                'rating'      => 4.7,
                'materials'   => 'Cèdre de l\'Atlas, huile de noix',
                'dimensions'  => '60cm diamètre x 65cm hauteur',
                'sales_count' => 35,
            ],
            [
                'name'        => 'Console Orientale — Bois & Laiton',
                'description' => 'Console d\'entrée en bois de noyer avec incrustation de plaques en laiton martelé. Un tiroir central avec poignée en bronze. Finition cirée à la main.',
                'price'       => 4100,
                'category'    => 'tables',
                'images'      => ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80'],
                'stock'       => 5,
                'rating'      => 4.9,
                'materials'   => 'Noyer, laiton martelé, bronze',
                'dimensions'  => '130cm x 38cm x 88cm',
                'sales_count' => 16,
            ],
            [
                'name'        => 'Table de Salon Mashrabiya',
                'description' => 'Table basse rectangulaire avec pieds en treillis mashrabiya sculpté en cèdre. Plateau en verre trempé transparent. Design traditionnel revisité en minimaliste contemporain.',
                'price'       => 3300,
                'category'    => 'tables',
                'images'      => ['https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80'],
                'stock'       => 6,
                'rating'      => 4.6,
                'materials'   => 'Cèdre sculpté, verre trempé 10mm',
                'dimensions'  => '120cm x 60cm x 40cm',
                'sales_count' => 19,
            ],

            // ============================
            // CHAISES & FAUTEUILS
            // ============================
            [
                'name'        => 'Fauteuil Pacha — Cuir Tanné',
                'description' => 'Fauteuil d\'accent inspiré du trône marocain. Structure en bois de cèdre massif, tapissé de cuir tanné naturel couleur whisky avec motifs piqués à la main. Confort royal.',
                'price'       => 3900,
                'category'    => 'chaises-fauteuils',
                'images'      => ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80'],
                'stock'       => 7,
                'rating'      => 4.9,
                'materials'   => 'Cèdre, cuir tanné végétal, rembourrage kapok',
                'dimensions'  => '75cm x 80cm x 105cm',
                'sales_count' => 29,
            ],
            [
                'name'        => 'Chaise Mâalem — Noyer & Rotin',
                'description' => 'Chaise artisanale à dossier en rotin tressé, structure en noyer huilé. Assise en cuir naturel. Empilable. Parfaite pour la salle à manger ou le bureau.',
                'price'       => 1450,
                'category'    => 'chaises-fauteuils',
                'images'      => ['https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80'],
                'stock'       => 20,
                'rating'      => 4.7,
                'materials'   => 'Noyer huilé, rotin naturel, cuir',
                'dimensions'  => '45cm x 50cm x 88cm',
                'sales_count' => 54,
            ],
            [
                'name'        => 'Pouffe Ottomane Brodée — XL',
                'description' => 'Grande ottomane ronde en cuir de buffle tanné, entièrement brodée à la main de fils dorés selon les motifs fassi. Rembourrage kapok naturel. Fabriquée à Marrakech.',
                'price'       => 1850,
                'category'    => 'chaises-fauteuils',
                'images'      => ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80'],
                'stock'       => 15,
                'rating'      => 4.8,
                'materials'   => 'Cuir buffle, broderie fil d\'or, kapok',
                'dimensions'  => '65cm diamètre x 35cm hauteur',
                'sales_count' => 61,
            ],
            [
                'name'        => 'Chaise Berber — Bois & Tissu',
                'description' => 'Chaise légère à structure en bois de hêtre avec assise et dossier en tissu Kilim berbère tissé à la main. Chaque chaise est unique de par son motif.',
                'price'       => 980,
                'category'    => 'chaises-fauteuils',
                'images'      => ['https://images.unsplash.com/photo-1601366533287-5ee4c763ae4e?w=800&q=80'],
                'stock'       => 25,
                'rating'      => 4.6,
                'materials'   => 'Hêtre massif, tissu Kilim berbère',
                'dimensions'  => '46cm x 52cm x 82cm',
                'sales_count' => 42,
            ],

            // ============================
            // CHAMBRES
            // ============================
            [
                'name'        => 'Lit Riad Impérial — 160x200',
                'description' => 'Lit en cèdre sculpté avec tête de lit monumental à motifs arabesques. Pieds tournés. Vernis au tampon naturel. Fabrication artisanale de Fès. Livré sans sommier.',
                'price'       => 16800,
                'category'    => 'chambres',
                'images'      => ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'],
                'stock'       => 3,
                'rating'      => 4.9,
                'materials'   => 'Cèdre de l\'Atlas, vernis tampon',
                'dimensions'  => '160cm x 200cm, tête de lit 140cm haut',
                'sales_count' => 8,
            ],
            [
                'name'        => 'Armoire Fassia — 3 Portes',
                'description' => 'Grande armoire en bois de noyer massif, trois portes battantes avec miroir central en plein bois sculptés. Intérieur en aromate naturel repoussant la mite. Quincaillerie en laiton.',
                'price'       => 22400,
                'category'    => 'chambres',
                'images'      => ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
                'stock'       => 2,
                'rating'      => 4.8,
                'materials'   => 'Noyer massif, miroir, laiton, aromate',
                'dimensions'  => '180cm x 60cm x 220cm',
                'sales_count' => 5,
            ],
            [
                'name'        => 'Table de Chevet Berbère',
                'description' => 'Table de chevet en bois de cèdre sur pieds tournés, avec un tiroir en bois flotté et une tablette ajourée. Finition beeswax naturel. Paire disponible.',
                'price'       => 2100,
                'category'    => 'chambres',
                'images'      => ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
                'stock'       => 12,
                'rating'      => 4.7,
                'materials'   => 'Cèdre, beeswax naturel',
                'dimensions'  => '50cm x 40cm x 62cm',
                'sales_count' => 24,
            ],
            [
                'name'        => 'Commode Zouak — 5 Tiroirs',
                'description' => 'Commode peinte selon la technique Zouak de Meknès : motifs floraux peints à la main sur fond blanc cassé. Cinq tiroirs sur quincaillerie en bronze patiné. Chef-d\'œuvre artisanal.',
                'price'       => 8900,
                'category'    => 'chambres',
                'images'      => ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'],
                'stock'       => 4,
                'rating'      => 4.9,
                'materials'   => 'Cèdre peint Zouak, bronze patiné',
                'dimensions'  => '110cm x 48cm x 90cm',
                'sales_count' => 11,
            ],

            // ============================
            // DÉCORATION ARTISANALE
            // ============================
            [
                'name'        => 'Lanterne Khaïma — Laiton Ciselé',
                'description' => 'Lanterne suspendue en laiton ciselé à la main, motifs étoiles géométriques. Verre biseauté coloré: ambre, bleu et incolore. Projetée des ombres magnifiques. Câble tressé 1.5m inclus.',
                'price'       => 850,
                'category'    => 'decoration-artisanale',
                'images'      => ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80'],
                'stock'       => 30,
                'rating'      => 4.9,
                'materials'   => 'Laiton ciselé, verre soufflé coloré',
                'dimensions'  => '25cm diamètre x 45cm hauteur',
                'sales_count' => 89,
            ],
            [
                'name'        => 'Miroir Moucharabieh — Cèdre',
                'description' => 'Miroir mural avec cadre en cèdre sculpté en treillis moucharabieh. Chaque pièce du treillis est tournée et assemblée à la main. Miroir argent anti-oxydant. Disponible en 60cm et 90cm.',
                'price'       => 1650,
                'category'    => 'decoration-artisanale',
                'images'      => ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
                'stock'       => 18,
                'rating'      => 4.8,
                'materials'   => 'Cèdre sculpté, miroir argent',
                'dimensions'  => '80cm x 80cm, profondeur 8cm',
                'sales_count' => 46,
            ],
            [
                'name'        => 'Tagine Décoratif — Poterie Safi',
                'description' => 'Grand tagine décoratif en poterie de Safi, peint à la main en bleu cobalt et blanc. Motifs géométriques traditionnels. Usage décoratif ou culinaire. Signé par l\'artisan.',
                'price'       => 480,
                'category'    => 'decoration-artisanale',
                'images'      => ['https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=800&q=80'],
                'stock'       => 50,
                'rating'      => 4.7,
                'materials'   => 'Terre cuite de Safi, pigments naturels',
                'dimensions'  => '35cm diamètre x 25cm hauteur',
                'sales_count' => 102,
            ],
            [
                'name'        => 'Plateau Tray Laiton Fès',
                'description' => 'Grand plateau de service en laiton martelé et gravé à la main. Motifs Islimi. Peut être posé sur un support en bois (vendu séparément) pour former une table basse Tbida.',
                'price'       => 1100,
                'category'    => 'decoration-artisanale',
                'images'      => ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
                'stock'       => 22,
                'rating'      => 4.8,
                'materials'   => 'Laiton martelé et gravé',
                'dimensions'  => '70cm diamètre',
                'sales_count' => 38,
            ],
            [
                'name'        => 'Photophore Bougies Cuivre — Lot 3',
                'description' => 'Lot de trois photophores en cuivre repoussé de tailles graduées. Motifs de pin et lune percés. Effet lumineux spectaculaire avec une bougie chauffe-plat.',
                'price'       => 390,
                'category'    => 'decoration-artisanale',
                'images'      => ['https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&q=80'],
                'stock'       => 40,
                'rating'      => 4.6,
                'materials'   => 'Cuivre repoussé',
                'dimensions'  => '12cm, 16cm, 20cm diamètre',
                'sales_count' => 74,
            ],

            // ============================
            // TAPIS & TEXTILES
            // ============================
            [
                'name'        => 'Tapis Beni Ourain — 200x300',
                'description' => 'Tapis berbère authentique Beni Ourain en laine de brebis filée et teinte à la main. Trame en coton naturel. Motifs losanges noirs sur fond ivoire. Certifié origine Moyen Atlas.',
                'price'       => 5800,
                'category'    => 'tapis-textiles',
                'images'      => ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80'],
                'stock'       => 8,
                'rating'      => 4.9,
                'materials'   => 'Laine naturelle filée main, coton',
                'dimensions'  => '200cm x 300cm, épaisseur 2cm',
                'sales_count' => 23,
            ],
            [
                'name'        => 'Coussin Kilim Marrakchi — Lot 2',
                'description' => 'Paire de coussins en tissu Kilim tissé à la main sur métier à bras. Coloris terre de Sienne, rouge berbère et indigo. Fermeture zip dissimulé. Garnissage plume.',
                'price'       => 680,
                'category'    => 'tapis-textiles',
                'images'      => ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80'],
                'stock'       => 35,
                'rating'      => 4.7,
                'materials'   => 'Tissu Kilim laine, garnissage plume',
                'dimensions'  => '45cm x 45cm chacun',
                'sales_count' => 67,
            ],
            [
                'name'        => 'Tapis Azrou Haute Laine — 160x230',
                'description' => 'Tapis Azrou en laine épaisse de 3cm, tissé au nœud berbère. Fond rouge carmin avec motifs géométriques en écru et bleu roi. Bords frangés naturels.',
                'price'       => 3900,
                'category'    => 'tapis-textiles',
                'images'      => ['https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80'],
                'stock'       => 10,
                'rating'      => 4.8,
                'materials'   => 'Laine haute montagne, teintures naturelles',
                'dimensions'  => '160cm x 230cm',
                'sales_count' => 17,
            ],
            [
                'name'        => 'Jeté de Lit Sabra — Soie Végétale',
                'description' => 'Couverture de lit en soie de cactus (Sabra), tissée à plat. Reflets dorés naturels. Légère et soyeuse. Coloris disponibles: safran, bleu de Fès, ivoire.',
                'price'       => 1250,
                'category'    => 'tapis-textiles',
                'images'      => ['https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=80'],
                'stock'       => 20,
                'rating'      => 4.8,
                'materials'   => 'Soie de cactus Sabra',
                'dimensions'  => '220cm x 240cm',
                'sales_count' => 41,
            ],

            // ============================
            // BOIS SCULPTÉ
            // ============================
            [
                'name'        => 'Porte Riad — Cèdre Sculpté 2 Vantaux',
                'description' => 'Porte double en cèdre de l\'Atlas entièrement sculptée à la main. Motifs muqarnas et arabesques sur l\'ensemble de la surface. Ferrures en fer forgé artisanal. Finition cire d\'abeille.',
                'price'       => 38000,
                'category'    => 'bois-sculpte',
                'images'      => ['https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=800&q=80'],
                'stock'       => 2,
                'rating'      => 5.0,
                'materials'   => 'Cèdre de l\'Atlas, fer forgé, cire d\'abeille',
                'dimensions'  => '200cm x 210cm (chaque vantail 100cm)',
                'sales_count' => 3,
            ],
            [
                'name'        => 'Panneau Moucharabieh Mural',
                'description' => 'Panneau décoratif en cèdre sculpté motif moucharabieh. Chaque petite pièce cylindrique est tournée séparément et assemblée à la main. Idéal comme séparation ou décoration murale.',
                'price'       => 6500,
                'category'    => 'bois-sculpte',
                'images'      => ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
                'stock'       => 5,
                'rating'      => 4.9,
                'materials'   => 'Cèdre de l\'Atlas tourné',
                'dimensions'  => '120cm x 180cm x 6cm',
                'sales_count' => 9,
            ],
            [
                'name'        => 'Bibliothèque Arabesque — Cèdre',
                'description' => 'Bibliothèque murale en cèdre avec façade ajourée en arabesques. Trois étagères intérieures réglables. Portes basses à panneaux sculptés. Finition laque cuivre foncé.',
                'price'       => 11500,
                'category'    => 'bois-sculpte',
                'images'      => ['https://images.unsplash.com/photo-1594831250069-f3e4d9b3e6d7?w=800&q=80'],
                'stock'       => 3,
                'rating'      => 4.8,
                'materials'   => 'Cèdre, laque cuivre artisanale',
                'dimensions'  => '180cm x 40cm x 220cm',
                'sales_count' => 6,
            ],
            [
                'name'        => 'Cadre Photo Arabesques — Cèdre',
                'description' => 'Cadre photo en cèdre sculpté à la main selon les motifs arabesques marocains. Disponible en 20x25 et 30x40. Verre optique anti-reflet. Idéal comme cadeau de mariage ou pendaison.',
                'price'       => 320,
                'category'    => 'bois-sculpte',
                'images'      => ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
                'stock'       => 60,
                'rating'      => 4.7,
                'materials'   => 'Cèdre sculpté, verre optique',
                'dimensions'  => '30cm x 40cm (extérieur)',
                'sales_count' => 128,
            ],
            [
                'name'        => 'Etagère Murale Zouak — 3 Niveaux',
                'description' => 'Etagère murale en bois de cèdre peint selon la technique Zouak (peinture à l\'huile sur bois). Fleurs et rinceaux multicolores sur fond doré. Trois tablettes. Fixations laiton incluses.',
                'price'       => 1900,
                'category'    => 'bois-sculpte',
                'images'      => ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'],
                'stock'       => 14,
                'rating'      => 4.8,
                'materials'   => 'Cèdre peint Zouak, dorure',
                'dimensions'  => '90cm x 25cm x 80cm',
                'sales_count' => 33,
            ],
        ];

        foreach ($products as $p) {
            Product::create($p);
        }

        $this->command->info('✅ ' . count($categories) . ' catégories et ' . count($products) . ' produits Beldi insérés avec succès.');
    }
}
