import { Module } from '@nestjs/common';
import {
  IsStrongPassword,
  IsStrongPasswordConstraint,
} from './strong-password.validator';

@Module({
  providers: [IsStrongPasswordConstraint],
  exports: [IsStrongPasswordConstraint, IsStrongPassword],
})
export class SharedModule {}
