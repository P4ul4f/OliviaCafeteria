import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class MenuPdf {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  clave: string; // 'carta_principal' para identificar la carta actual

  @Column()
  nombreArchivo: string;

  @Column()
  rutaArchivo: string;

  @Column()
  tamanoArchivo: number; // en bytes

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'bytea', nullable: true })
  contenidoArchivo: Buffer; // Almacenar el contenido del PDF en la base de datos

  @CreateDateColumn({ name: 'createdAt' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  fechaActualizacion: Date;
} 