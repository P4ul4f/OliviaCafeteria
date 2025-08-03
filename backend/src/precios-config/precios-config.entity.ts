import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class PreciosConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  clave: string; // 'precios_principales' para identificar la configuración principal

  @Column('decimal', { precision: 10, scale: 2 })
  promoOlivia: number;

  @Column('decimal', { precision: 10, scale: 2 })
  promoBasica: number;

  @Column('decimal', { precision: 10, scale: 2 })
  meriendaLibre: number;

  @Column('decimal', { precision: 10, scale: 2, default: 5000 })
  aLaCarta: number;

  @Column('decimal', { precision: 10, scale: 2 })
  tardeDeTe: number;

  @Column({ nullable: true })
  descripcionPromoOlivia: string;

  @Column({ nullable: true })
  descripcionPromoBasica: string;

  @Column('int', { default: 40 })
  cuposMeriendasLibres: number;

  @Column('int', { default: 65 })
  cuposTardesDeTe: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
} 