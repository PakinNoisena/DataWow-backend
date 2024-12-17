import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users/users.service";
import { USER_ERR } from "../config/constant.config";

@Injectable()
export class CheckUserExistMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers["user-id"] || req.query["user-id"];

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      // Check if user exists in the database
      const user = await this.usersService.findUserByUserId(userId as string);

      if (!user) {
        throw new NotFoundException(
          USER_ERR.USERNAME_NOT_FOUND(userId as string)
        );
      }

      next();
    } catch (error) {
      return res.status(404).json({
        success: false,
        statusCode: 500,
        ...USER_ERR.USER_NOT_FOUND,
      });
    }
  }
}
