import { plainToInstance } from 'class-transformer';
import { IsIn, IsInt, IsString, IsUrl, Min, validateSync } from 'class-validator';

class Environment {
  @IsIn(['development', 'test', 'production'])
  NODE_ENV = 'development';

  @IsInt()
  @Min(1)
  PORT = 8000;

  @IsUrl({ require_tld: false, protocols: ['postgresql'] })
  DATABASE_URL!: string;

  @IsString()
  JWT_ACCESS_SECRET!: string;

  @IsString()
  JWT_ACCESS_TTL = '15m';

  @IsString()
  JWT_REFRESH_SECRET!: string;

  @IsString()
  JWT_REFRESH_TTL = '30d';

  @IsString()
  CORS_ORIGINS = 'http://localhost:8081,http://localhost:3000';
}

export function validateEnvironment(values: Record<string, unknown>) {
  const normalizedValues = { ...values };
  if (values.PORT !== undefined) normalizedValues.PORT = Number(values.PORT);
  const config = plainToInstance(Environment, normalizedValues);
  const errors = validateSync(config, { skipMissingProperties: false });
  if (errors.length) throw new Error(errors.toString());
  return config;
}
