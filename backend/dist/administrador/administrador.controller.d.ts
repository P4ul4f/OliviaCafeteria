import { AdministradorService } from './administrador.service';
import { CreateAdministradorDto } from './dto/create-administrador.dto';
import { UpdateAdministradorDto } from './dto/update-administrador.dto';
export declare class AdministradorController {
    private readonly administradorService;
    constructor(administradorService: AdministradorService);
    create(dto: CreateAdministradorDto): Promise<import("./administrador.entity").Administrador>;
    findAll(): Promise<import("./administrador.entity").Administrador[]>;
    findOne(id: string): Promise<import("./administrador.entity").Administrador | null>;
    update(id: string, dto: UpdateAdministradorDto): Promise<import("./administrador.entity").Administrador | null>;
    remove(id: string): Promise<boolean>;
}
