import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ContenidoConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clave: string;

  @Column({ type: 'jsonb' })
  contenido: any;

  @Column({ nullable: true })
  descripcion: string;

  @CreateDateColumn({ name: 'fechaCreacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fechaActualizacion' })
  fechaActualizacion: Date;
} 