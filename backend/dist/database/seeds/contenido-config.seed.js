"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedContenidoConfig = seedContenidoConfig;
const contenido_config_entity_1 = require("../../contenido-config/contenido-config.entity");
async function seedContenidoConfig(dataSource) {
    const contenidoConfigRepository = dataSource.getRepository(contenido_config_entity_1.ContenidoConfig);
    const meriendasLibresContenido = {
        dulces: [
            "Cheesecake de frutos rojos",
            "Cheesecake de maracuyá",
            "Matilda",
            "Torta de mandarina",
            "Torta de almendras",
            "3 variedad de cookies",
            "Alfajorcitos de pistachos",
            "Alfajorcitos de maicena",
            "Brownie con dulce de leche y crema",
            "Medialunas de nutella y frutilla"
        ],
        salados: [
            "Sanguchitos completos en pan de campo",
            "Sanguchitos de roquefort y jamón cocido en pan de campo",
            "Sanguchitos jamón y queso en pan ciabatta",
            "Sanguchitos jamón crudo y rúcula en pan ciabatta",
            "Sanguches de mortadela en Focaccia",
            "Sanguches de Jamón crudo en Focaccia",
            "Sanguches de Salame en Focaccia",
            "Medialunas de jamón y queso",
            "Medialunas de palta",
            "Tostadas con palta y huevo revuelto"
        ],
        bebidas: [
            "Jugo de naranjas, limonada clásica y de frutos rojos",
            "Cafés clásicos y saborizados de vainilla o caramelo",
            "Submarino, capuchino, moka",
            "Té clásico o saborizado"
        ]
    };
    const tardesTePromoOliviaContenido = {
        dulces: [
            "Shot de cheesecake de Frutos Rojos",
            "Brownie con dulce de leche y crema",
            "Alfajor de pistacho",
            "Mini torta de almendras"
        ],
        salados: [
            "Sandwich de roquefort",
            "Sandwich de jamón crudo y rúcula",
            "Sandwich de palta y jamón cocido"
        ],
        bebidas: [
            "Infusión grande + refill",
            "Limonada",
            "Café, Café con leche, Cortado, Manchado",
            "Submarino, Cappuccino, Té clásico y saborizado"
        ]
    };
    const tardesTePromoBasicaContenido = {
        dulces: [
            "1 brownie con dulce de leche y crema",
            "1 porción de budín de naranja",
            "1 alfajor de maicena"
        ],
        salados: [
            "Sandwich de jamón crudo y rúcula",
            "Sandwich de palta y jamón cocido",
            "Medialuna JyQ"
        ],
        bebidas: [
            "Infusión mediana + refill",
            "Jugo de naranjas"
        ]
    };
    const existingMeriendas = await contenidoConfigRepository.findOne({
        where: { clave: 'meriendas_libres_contenido' }
    });
    const existingPromoOlivia = await contenidoConfigRepository.findOne({
        where: { clave: 'tardes_te_promo_olivia_contenido' }
    });
    const existingPromoBasica = await contenidoConfigRepository.findOne({
        where: { clave: 'tardes_te_promo_basica_contenido' }
    });
    if (!existingMeriendas) {
        await contenidoConfigRepository.save({
            clave: 'meriendas_libres_contenido',
            contenido: meriendasLibresContenido,
            descripcion: 'Contenido configurable de Meriendas Libres'
        });
        console.log('✅ Contenido de Meriendas Libres inicializado');
    }
    if (!existingPromoOlivia) {
        await contenidoConfigRepository.save({
            clave: 'tardes_te_promo_olivia_contenido',
            contenido: tardesTePromoOliviaContenido,
            descripcion: 'Contenido configurable de Tardes de Té - Promo Olivia'
        });
        console.log('✅ Contenido de Tardes de Té - Promo Olivia inicializado');
    }
    if (!existingPromoBasica) {
        await contenidoConfigRepository.save({
            clave: 'tardes_te_promo_basica_contenido',
            contenido: tardesTePromoBasicaContenido,
            descripcion: 'Contenido configurable de Tardes de Té - Promo Básica'
        });
        console.log('✅ Contenido de Tardes de Té - Promo Básica inicializado');
    }
}
//# sourceMappingURL=contenido-config.seed.js.map