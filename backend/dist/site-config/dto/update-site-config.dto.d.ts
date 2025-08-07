declare class HorarioDto {
    abierto?: boolean;
    manana?: string;
    noche?: string;
}
declare class HorariosDto {
    lunes?: HorarioDto;
    martes?: HorarioDto;
    miercoles?: HorarioDto;
    jueves?: HorarioDto;
    viernes?: HorarioDto;
    sabado?: HorarioDto;
    domingo?: HorarioDto;
}
export declare class UpdateSiteConfigDto {
    telefono?: string;
    direccion?: string;
    email?: string;
    horarios?: HorariosDto;
}
export {};
