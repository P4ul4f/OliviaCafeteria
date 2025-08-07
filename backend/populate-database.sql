-- Script para poblar la base de datos con los datos específicos de Olivia Café
-- Este script elimina los datos existentes y inserta los nuevos datos

-- 1. LIMPIAR Y POBLAR contenido_config
DELETE FROM contenido_config;

INSERT INTO contenido_config (clave, contenido, descripcion) VALUES
('meriendas_libres_contenido', '{
  "dulces": [
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
  "bebidas": [
    "Jugo de naranjas, limonada clásica y de frutos rojos",
    "Cafés clásicos y saborizados de vainilla o caramelo",
    "Submarino, capuchino, moka",
    "Té clásico o saborizado"
  ],
  "salados": [
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
  ]
}', 'Contenido configurable de Meriendas Libres'),

('tardes_te_promo_olivia_contenido', '{
  "dulces": [
    "Shot de cheesecake de Frutos Rojos",
    "Brownie con dulce de leche y crema",
    "Alfajor de pistacho",
    "Mini torta de almendras"
  ],
  "bebidas": [
    "Infusión grande + refill",
    "Limonada",
    "Café, Café con leche, Cortado, Manchado",
    "Submarino, Cappuccino, Té clásico y saborizado"
  ],
  "salados": [
    "Sandwich de roquefort",
    "Sandwich de jamón crudo y rúcula",
    "Sandwich de palta y jamón cocido"
  ]
}', 'Contenido configurable de Tardes de Té - Promo Olivia'),

('tardes_te_promo_basica_contenido', '{
  "dulces": [
    "1 brownie con dulce de leche y crema",
    "1 porción de budín de naranja",
    "1 alfajor de maicena"
  ],
  "bebidas": [
    "Infusión mediana + refill",
    "Jugo de naranjas"
  ],
  "salados": [
    "Sandwich de jamón crudo y rúcula",
    "Sandwich de palta y jamón cocido",
    "Medialuna JyQ"
  ]
}', 'Contenido configurable de Tardes de Té - Promo Básica');

-- 2. LIMPIAR Y POBLAR site_config
DELETE FROM site_config;

INSERT INTO site_config (clave, telefono, direccion, email, horarios) VALUES
('info_general', '2617148842', 'Avenida Godoy Cruz 506, Mendoza', 'info@oliviacafe.com', '{
  "lunes": {
    "noche": "17:00 - 20:30",
    "manana": "9:00 - 13:00",
    "abierto": true
  },
  "jueves": {
    "noche": "17:00 - 20:30",
    "manana": "9:00 - 13:00",
    "abierto": true
  },
  "martes": {
    "noche": "17:00 - 20:30",
    "manana": "9:00 - 13:00",
    "abierto": true
  },
  "sabado": {
    "noche": "17:00 - 20:30",
    "manana": "9:00 - 13:00",
    "abierto": true
  },
  "domingo": {
    "noche": "",
    "manana": "",
    "abierto": false
  },
  "viernes": {
    "noche": "17:00 - 20:30",
    "manana": "9:00 - 13:00",
    "abierto": true
  },
  "miercoles": {
    "noche": "17:00 - 20:30",
    "manana": "9:00 - 13:00",
    "abierto": true
  }
}');

-- 3. LIMPIAR Y POBLAR precios_config
DELETE FROM precios_config;

INSERT INTO precios_config (clave, promoOlivia, promoBasica, meriendaLibre, descripcionPromoOlivia, descripcionPromoBasica, cuposMeriendasLibres, cuposTardesDeTe, aLaCarta, tardeDeTe) VALUES
('precios_principales', 18500.00, 15600.00, 18500.00, 'Promo completa con selección premium', 'Promo esencial con lo mejor de nuestra carta', 40, 65, 5000.00, 0.00);

-- 4. LIMPIAR Y POBLAR fechas_config (ejemplo con algunas fechas)
DELETE FROM fechas_config;

INSERT INTO fechas_config (fecha, activa, observaciones, turnos) VALUES
('2025-08-08', true, 'Fecha de merienda libre programada', '["16:30-18:30", "19:00-21:00"]'),
('2025-08-09', true, 'Fecha de merienda libre programada', '["16:30-18:30", "19:00-21:00"]'),
('2025-08-10', true, 'Fecha de merienda libre programada', '["16:30-18:30", "19:00-21:00"]'),
('2025-08-11', true, 'Fecha de merienda libre programada', '["16:30-18:30", "19:00-21:00"]'),
('2025-08-12', true, 'Fecha de merienda libre programada', '["16:30-18:30", "19:00-21:00"]'),
('2025-08-13', true, 'Fecha de merienda libre programada', '["16:30-18:30", "19:00-21:00"]');

-- 5. LIMPIAR Y POBLAR administrador (con contraseña hasheada)
DELETE FROM administrador;

INSERT INTO administrador (usuario, contrasena) VALUES
('admin', '$2b$12$ARQ61NzGqWBFlZockkwW9e12MXcHPxJUQk3kQum5f.kyIBPvf3VFi');

-- Verificar que los datos se insertaron correctamente
SELECT 'contenido_config' as tabla, COUNT(*) as registros FROM contenido_config
UNION ALL
SELECT 'site_config' as tabla, COUNT(*) as registros FROM site_config
UNION ALL
SELECT 'precios_config' as tabla, COUNT(*) as registros FROM precios_config
UNION ALL
SELECT 'fechas_config' as tabla, COUNT(*) as registros FROM fechas_config
UNION ALL
SELECT 'administrador' as tabla, COUNT(*) as registros FROM administrador;
