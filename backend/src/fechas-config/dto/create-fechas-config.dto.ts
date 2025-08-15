export class CreateFechasConfigDto {
  fecha: Date;
  tipoReserva: string;
  turnos?: any;
  cupos?: number;
  activa?: boolean;
  observaciones?: string;
}
