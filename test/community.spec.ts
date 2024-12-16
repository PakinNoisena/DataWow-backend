import { NotFoundException } from "@nestjs/common";
import { CommunityController } from "../src/community/community.controller";
import { CommunityService } from "../src/community/community.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CommunityEntity } from "../src/entities/community.entity";

describe("CommunityController", () => {
  let controller: CommunityController;
  let service: CommunityService;

  beforeEach(async () => {
    const serviceMock = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityController],
      providers: [
        {
          provide: CommunityService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<CommunityController>(CommunityController);
    service = module.get<CommunityService>(CommunityService);
  });

  describe("findAllCommunity", () => {
    it.each`
      caseName                                              | shouldExist | expected
      ${"should return all community data"}                 | ${true}     | ${[{ id: 1, name: "History", createdAt: new Date() }, { id: 2, name: "Pets", createdAt: new Date() }, { id: 3, name: "Health", createdAt: new Date() }, { id: 4, name: "Fashion", createdAt: new Date() }, { id: 5, name: "Exercise", createdAt: new Date() }, { id: 6, name: "Others", createdAt: new Date() }]}
      ${"should return empty array when no community data"} | ${false}    | ${[]}
    `(
      "should validate db service for $caseName",
      async ({ shouldExist, expected }) => {
        if (shouldExist) {
          service.findAll = jest.fn().mockResolvedValue(expected);
        } else {
          service.findAll = jest.fn().mockResolvedValue([]);
        }

        const result = await controller.findAllCommunity();
        expect(result).toEqual(expected);
      }
    );
  });
});
