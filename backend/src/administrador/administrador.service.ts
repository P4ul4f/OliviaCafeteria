import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administrador } from './administrador.entity';
import { CreateAdministradorDto } from './dto/create-administrador.dto';
import { UpdateAdministradorDto } from './dto/update-administrador.dto';

@Injectable()
export class AdministradorService {
  constructor(
    @InjectRepository(Administrador)
    private administradorRepository: Repository<Administrador>,
  ) {}

  async create(dto: CreateAdministradorDto): Promise<Administrador> {
    const admin = this.administradorRepository.create(dto);
    return this.administradorRepository.save(admin);
  }

  async findAll(): Promise<Administrador[]> {
    return this.administradorRepository.find();
  }

  async findOne(id: number): Promise<Administrador | null> {
    return this.administradorRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateAdministradorDto): Promise<Administrador | null> {
    const admin = await this.findOne(id);
    if (admin) {
      Object.assign(admin, dto);
      return this.administradorRepository.save(admin);
    }
    return null;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.administradorRepository.delete(id);
    return (result.affected || 0) > 0;
  }
} 