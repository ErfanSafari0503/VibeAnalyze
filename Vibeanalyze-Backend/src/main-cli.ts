import { AppModule } from './app.module';
import { CommandFactory } from 'nest-commander';

BigInt.prototype["toJSON"] = function () {
  return Number.parseInt(this.toString()) ?? this.toString();
};

async function bootstrap() {

  await CommandFactory.run(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
}

bootstrap();
