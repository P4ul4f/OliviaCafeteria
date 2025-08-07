"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFechasConfigStructure1700000000000 = void 0;
class UpdateFechasConfigStructure1700000000000 {
    name = 'UpdateFechasConfigStructure1700000000000';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "fechas_config" ADD "turnos" jsonb`);
        const fechas = await queryRunner.query(`SELECT id, "turnosDisponibles", "cupos" FROM "fechas_config"`);
        for (const fecha of fechas) {
            let turnos = [];
            if (fecha.turnosDisponibles) {
                if (Array.isArray(fecha.turnosDisponibles)) {
                    turnos = fecha.turnosDisponibles.map((h) => ({
                        horario: h,
                        cupos: typeof fecha.cupos === 'number' ? fecha.cupos : 30
                    }));
                }
                else if (typeof fecha.turnosDisponibles === 'object') {
                    for (const key of Object.keys(fecha.turnosDisponibles)) {
                        const turno = fecha.turnosDisponibles[key];
                        if (turno && turno.horario && typeof turno.horario === 'string') {
                            const partes = turno.horario.split(/y|Y/).map((s) => s.trim()).filter(Boolean);
                            for (const parte of partes) {
                                turnos.push({
                                    horario: parte,
                                    cupos: typeof turno.cupos === 'number' ? turno.cupos : 30
                                });
                            }
                        }
                    }
                }
                else if (typeof fecha.turnosDisponibles === 'string') {
                    const partes = fecha.turnosDisponibles.split(/y|Y/).map((s) => s.trim()).filter(Boolean);
                    turnos = partes.map((h) => ({
                        horario: h,
                        cupos: typeof fecha.cupos === 'number' ? fecha.cupos : 30
                    }));
                }
            }
            await queryRunner.query(`UPDATE "fechas_config" SET "turnos" = $1 WHERE id = $2`, [JSON.stringify(turnos), fecha.id]);
        }
        await queryRunner.query(`ALTER TABLE "fechas_config" DROP COLUMN "turnosDisponibles"`);
        await queryRunner.query(`ALTER TABLE "fechas_config" DROP COLUMN "cupos"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "fechas_config" ADD "turnosDisponibles" jsonb`);
        await queryRunner.query(`ALTER TABLE "fechas_config" ADD "cupos" integer`);
        const fechas = await queryRunner.query(`SELECT id, "turnos" FROM "fechas_config"`);
        for (const fecha of fechas) {
            if (fecha.turnos && Array.isArray(fecha.turnos)) {
                const horarios = fecha.turnos.map((t) => t.horario);
                const cupos = fecha.turnos.length > 0 ? fecha.turnos[0].cupos : 30;
                await queryRunner.query(`UPDATE "fechas_config" SET "turnosDisponibles" = $1, "cupos" = $2 WHERE id = $3`, [JSON.stringify(horarios), cupos, fecha.id]);
            }
        }
        await queryRunner.query(`ALTER TABLE "fechas_config" DROP COLUMN "turnos"`);
    }
}
exports.UpdateFechasConfigStructure1700000000000 = UpdateFechasConfigStructure1700000000000;
//# sourceMappingURL=1700000000000-UpdateFechasConfigStructure.js.map