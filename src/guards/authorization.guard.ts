import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { USER_ERR } from "../config/constant.config";

@Injectable()
export class CheckUserExistGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers["user-id"] || request.query["user-id"];

    if (!userId) {
      throw new NotFoundException(USER_ERR.USER_REQUIRED);
    }

    const user = await this.usersService.findUserByUserId(userId as string);
    if (!user) {
      throw new NotFoundException(USER_ERR.USER_NOT_FOUND);
    }

    return true;
  }
}
