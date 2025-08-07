-- Script para agregar las columnas faltantes a la tabla gift_card
-- Este script agrega las columnas que faltan en la tabla gift_card

-- Verificar si la tabla gift_card existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gift_card') THEN
        -- Agregar columna nombreDestinatario si no existe
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'gift_card' AND column_name = 'nombreDestinatario') THEN
            ALTER TABLE gift_card ADD COLUMN "nombreDestinatario" character varying NOT NULL DEFAULT '';
            RAISE NOTICE 'Columna nombreDestinatario agregada a gift_card';
        ELSE
            RAISE NOTICE 'Columna nombreDestinatario ya existe en gift_card';
        END IF;

        -- Agregar columna telefonoDestinatario si no existe
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'gift_card' AND column_name = 'telefonoDestinatario') THEN
            ALTER TABLE gift_card ADD COLUMN "telefonoDestinatario" character varying NOT NULL DEFAULT '';
            RAISE NOTICE 'Columna telefonoDestinatario agregada a gift_card';
        ELSE
            RAISE NOTICE 'Columna telefonoDestinatario ya existe en gift_card';
        END IF;

        -- Verificar estructura actual de la tabla
        RAISE NOTICE 'Estructura actual de gift_card:';
        FOR r IN SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'gift_card' ORDER BY ordinal_position LOOP
            RAISE NOTICE '  %: % (%)', r.column_name, r.data_type, r.is_nullable;
        END LOOP;
    ELSE
        RAISE NOTICE 'La tabla gift_card no existe';
    END IF;
END $$;
