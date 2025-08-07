export declare class SiteConfig {
    id: number;
    clave: string;
    telefono: string;
    direccion: string;
    email: string;
    horarios: {
        lunes: {
            abierto: boolean;
            manana: string;
            noche: string;
        };
        martes: {
            abierto: boolean;
            manana: string;
            noche: string;
        };
        miercoles: {
            abierto: boolean;
            manana: string;
            noche: string;
        };
        jueves: {
            abierto: boolean;
            manana: string;
            noche: string;
        };
        viernes: {
            abierto: boolean;
            manana: string;
            noche: string;
        };
        sabado: {
            abierto: boolean;
            manana: string;
            noche: string;
        };
        domingo: {
            abierto: boolean;
            manana: string;
            noche: string;
        };
    };
    fechaCreacion: Date;
    fechaActualizacion: Date;
}
