import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUpBody } from './dto/SignUpBody.dto';
import { RtGuard } from './guards/rt.guard';
import type { Response } from 'express';
import { SignInBody } from './dto/SignInBody.dto';
import { Role } from 'generated/prisma/enums';

import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/isPublic.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(
    @Body() body: SignUpBody,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    return this.authService.signup(body, res);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: SignInBody, @Res({ passthrough: true }) res: Response) {
    return this.authService.signin(body, res);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(userId, res);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokens(userId, refreshToken, res);
  }
}
