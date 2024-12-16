import { NotFoundException } from "@nestjs/common";
import { UsersController } from "../src/users/users.controller";
import { UsersService } from "../src/users/users.service";
import { Test, TestingModule } from "@nestjs/testing";
import { UserBodyDto } from "../src/dto/users.dto";

describe("UsersController", () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const serviceMock = {
      findUserByUsername: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe("findUserByUsername", () => {
    it.each`
      caseName                                   | username          | shouldExist | expected
      ${"should return data that already exist"} | ${"Pakin1"}       | ${true}     | ${{ id: 1, username: "Pakin1", createdAt: new Date() }}
      ${"should throw error when not found"}     | ${"NotFoundUser"} | ${false}    | ${null}
    `(
      "should validate db service $caseName",
      async ({ username, shouldExist, expected }) => {
        if (shouldExist) {
          service.findUserByUsername = jest.fn().mockResolvedValue(expected);
        } else {
          service.findUserByUsername = jest.fn().mockResolvedValue(null);
        }

        // Mock Request object
        const mockRequest = {} as any;

        // Test that the controller behaves correctly
        if (shouldExist) {
          const result = await controller.findUserByUsername(
            mockRequest,
            username
          );
          expect(result).toEqual(expected);
        } else {
          await expect(
            controller.findUserByUsername(mockRequest, username)
          ).rejects.toThrowError(
            new NotFoundException({
              message: `User with username '${username}' not found`,
              messageCode: 1001,
            })
          );
        }
      }
    );
  });

  describe("signIn", () => {
    const currentServiceDB = process.env.SERVICE_DB;
    afterAll(() => {
      process.env.SERVICE_DB = currentServiceDB;
    });

    it.each`
      caseName                               | username     | shouldExist | expectedUserReturn
      ${"should return the existing user"}   | ${"Pakin1"}  | ${true}     | ${{ id: 1, username: "Pakin1", createdAt: new Date() }}
      ${"should create and return new user"} | ${"NewUser"} | ${false}    | ${{ id: 2, username: "NewUser", createdAt: new Date() }}
    `(
      "should handle signIn correctly when $caseName",
      async ({ username, shouldExist, expectedUserReturn }) => {
        const mockUserBody = { username }; // Mock the UserBodyDto

        if (shouldExist) {
          service.findUserByUsername = jest
            .fn()
            .mockResolvedValue(expectedUserReturn);
        } else {
          service.findUserByUsername = jest.fn().mockResolvedValue(null);
          service.create = jest.fn().mockResolvedValue(expectedUserReturn);
        }

        // Mock Request object
        const mockRequest = {} as any;

        const result = await controller.signIn(mockRequest, mockUserBody);
        expect(result).toEqual(expectedUserReturn);

        // If the user does not exist, ensure the 'create' method is called
        if (!shouldExist) {
          expect(service.create).toHaveBeenCalledWith(
            mockRequest,
            mockUserBody
          );
        }
      }
    );
  });
});
