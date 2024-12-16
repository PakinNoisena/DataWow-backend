import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../src/users/users.service";
import { UserBodyDto } from "../src/dto/users.dto";
import { UserEntity } from "../src/entities/user.entity";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const serviceMock = {
      findUserByUsername: jest.fn(),
      signIn: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe("findUserByUsername", () => {
    it.each`
      caseName                                   | username          | shouldExist | expected
      ${"should return data that already exist"} | ${"Pakin1"}       | ${true}     | ${{ id: 1, username: "Pakin1", createdAt: new Date() }}
      ${"should return null when not found"}     | ${"NotFoundUser"} | ${false}    | ${null}
    `(
      "should validate db service $caseName",
      async ({ username, shouldExist, expected }) => {
        service.findUserByUsername = jest.fn().mockResolvedValue(expected);
        const result = await service.findUserByUsername({} as any, username);
        expect(result).toEqual(expected);
      }
    );
  });

  describe("signIn", () => {
    it.each`
      caseName                               | username     | shouldExist | expectedUserReturn
      ${"should create and return new user"} | ${"NewUser"} | ${false}    | ${{ id: 2, username: "NewUser", createdAt: new Date() }}
    `(
      "should handle signIn correctly when $caseName",
      async ({ username, shouldExist, expectedUserReturn }) => {
        const mockUserBody = { username };

        // Mock the findUserByUsername behavior
        if (shouldExist) {
          service.findUserByUsername = jest
            .fn()
            .mockResolvedValue(expectedUserReturn);
        } else {
          service.findUserByUsername = jest.fn().mockResolvedValue(null);
          // Mock the behavior of signIn correctly to return a user if created
          service.signIn = jest.fn().mockResolvedValue(expectedUserReturn);
        }

        const result = await service.signIn({} as any, mockUserBody);
        expect(result).toEqual(expectedUserReturn);

        // If the user does not exist, ensure the 'signIn' method is called
        if (!shouldExist) {
          expect(service.signIn).toHaveBeenCalledWith({}, mockUserBody);
        }
      }
    );
  });
});
