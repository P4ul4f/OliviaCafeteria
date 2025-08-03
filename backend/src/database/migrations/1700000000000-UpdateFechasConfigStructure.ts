import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFechasConfigStructure1700000000000 implements MigrationInterface {
    name = 'UpdateFechasConfigStructure1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primero, agregar la nueva columna turnos
        await queryRunner.query(`ALTER TABLE "fechas_config" ADD "turnos" jsonb`);
        
        // Migrar datos existentes de turnosDisponibles a turnos
        const fechas = await queryRunner.query(`SELECT id, "turnosDisponibles", "cupos" FROM "fechas_config"`);
        
        for (const fecha of fechas) {
            let turnos: any[] = [];
            
            if (fecha.turnosDisponibles) {
                if (Array.isArray(fecha.turnosDisponibles)) {
                    // Si ya es un array de strings
                    turnos = fecha.turnosDisponibles.map((h: string) => ({ 
                        horario: h, 
                        cupos: typeof fecha.cupos === 'number' ? fecha.cupos : 30 
                    }));
                } else if (typeof fecha.turnosDisponibles === 'object') {
                    // Si es un objeto con mañana/tarde
                    for (const key of Object.keys(fecha.turnosDisponibles)) {
                        const turno = fecha.turnosDisponibles[key];
                        if (turno && turno.horario && typeof turno.horario === 'string') {
                            const partes = turno.horario.split(/y|Y/).map((s: string) => s.trim()).filter(Boolean);
                            for (const parte of partes) {
                                turnos.push({ 
                                    horario: parte, 
                                    cupos: typeof turno.cupos === 'number' ? turno.cupos : 30 
                                });
                            }
                        }
                    }
                } else if (typeof fecha.turnosDisponibles === 'string') {
                    // Si es un string
                    const partes = fecha.turnosDisponibles.split(/y|Y/).map((s: string) => s.trim()).filter(Boolean);
                    turnos = partes.map((h: string) => ({ 
                        horario: h, 
                        cupos: typeof fecha.cupos === 'number' ? fecha.cupos : 30 
                    }));
                }
            }
            
            // Actualizar el registro con los nuevos turnos
            await queryRunner.query(
                `UPDATE "fechas_config" SET "turnos" = $1 WHERE id = $2`,
                [JSON.stringify(turnos), fecha.id]
            );
        }
        
        // Eliminar las columnas antiguas
        await queryRunner.query(`ALTER TABLE "fechas_config" DROP COLUMN "turnosDisponibles"`);
        await queryRunner.query(`ALTER TABLE "fechas_config" DROP COLUMN "cupos"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recrear las columnas antiguas
        await queryRunner.query(`ALTER TABLE "fechas_config" ADD "turnosDisponibles" jsonb`);
        await queryRunner.query(`ALTER TABLE "fechas_config" ADD "cupos" integer`);
        
        // Migrar datos de vuelta (simplificado)
        const fechas = await queryRunner.query(`SELECT id, "turnos" FROM "fechas_config"`);
        
        for (const fecha of fechas) {
            if (fecha.turnos && Array.isArray(fecha.turnos)) {
                const horarios = fecha.turnos.map((t: any) => t.horario);
                const cupos = fecha.turnos.length > 0 ? fecha.turnos[0].cupos : 30;
                
                await queryRunner.query(
                    `UPDATE "fechas_config" SET "turnosDisponibles" = $1, "cupos" = $2 WHERE id = $3`,
                    [JSON.stringify(horarios), cupos, fecha.id]
                );
            }
        }
        
        // Eliminar la nueva columna
        await queryRunner.query(`ALTER TABLE "fechas_config" DROP COLUMN "turnos"`);
    }
} 