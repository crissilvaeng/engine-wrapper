import { BeforeApplicationShutdown, Module } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Engine } from 'node-uci';
import { EngineHealthIndicator } from './engine.health';
import { EngineService } from './engine.service';

@Module({
  providers: [
    {
      provide: Engine,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const engine = new Engine(config.get('ENGINE_PATH'));
        await engine.init();
        await engine.isready();
        return engine;
      },
    },
    EngineHealthIndicator,
    EngineService,
  ],
  exports: [EngineHealthIndicator],
})
export class EngineModule implements BeforeApplicationShutdown {
  constructor(private readonly engine: Engine) {}

  async beforeApplicationShutdown() {
    await this.engine.quit();
  }
}
