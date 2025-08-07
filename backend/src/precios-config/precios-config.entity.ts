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

  @Column('text')
  descripcionPromoOlivia: string;

  @Column('text')
  descripcionPromoBasica: string;

  @Column('integer', { default: 40 })
  cuposMeriendasLibres: number;

  @Column('integer', { default: 5 })
  cuposTardesDeTe: number;

  @Column('integer', { default: 65 })
  capacidadMaximaCompartida: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
} 