import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteConfigController } from './site-config.controller';
import { SiteConfigService } from './site-config.service';
import { SiteConfig } from './site-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SiteConfig])],
  controllers: [SiteConfigController],
  providers: [SiteConfigService],
  exports: [SiteConfigService],
})
export class SiteConfigModule {} 