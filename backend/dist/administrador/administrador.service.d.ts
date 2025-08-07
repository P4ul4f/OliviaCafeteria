import { Repository } from 'typeorm';
import { Administrador } from './administrador.entity';
import { CreateAdministradorDto } from './dto/create-administrador.dto';
import { UpdateAdministradorDto } from './dto/update-administrador.dto';
export declare class AdministradorService {
    private administradorRepository;
    constructor(administradorRepository: Repository<Administrador>);
    create(dto: CreateAdministradorDto): Promise<Administrador>;
    findAll(): Promise<Administrador[]>;
    findOne(id: number): Promise<Administrador | null>;
    update(id: number, dto: UpdateAdministradorDto): Promise<Administrador | null>;
    remove(id: number): Promise<boolean>;
}
