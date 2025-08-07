import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SiteConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  clave: string; // 'info_general' para identificar la configuración principal

  @Column()
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  email: string;

  @Column('jsonb')
  horarios: {
    lunes: { abierto: boolean; manana: string; noche: string };
    martes: { abierto: boolean; manana: string; noche: string };
    miercoles: { abierto: boolean; manana: string; noche: string };
    jueves: { abierto: boolean; manana: string; noche: string };
    viernes: { abierto: boolean; manana: string; noche: string };
    sabado: { abierto: boolean; manana: string; noche: string };
    domingo: { abierto: boolean; manana: string; noche: string };
  };

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
} 