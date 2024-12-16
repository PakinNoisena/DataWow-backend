import { Test, TestingModule } from "@nestjs/testing";
import { CommunityService } from "../src/community/community.service";
import { CommunityEntity } from "../src/entities/community.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("CommunityService", () => {
  let service: CommunityService;
  let repo: Repository<CommunityEntity>;

  beforeEach(async () => {
    const repoMock = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        {
          provide: getRepositoryToken(CommunityEntity),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<CommunityService>(CommunityService);
    repo = module.get<Repository<CommunityEntity>>(
      getRepositoryToken(CommunityEntity)
    );
  });

  describe("findAll", () => {
    it.each`
      caseName                                              | shouldExist | expected
      ${"should return all community data"}                 | ${true}     | ${[{ id: 1, name: "History", createdAt: new Date() }, { id: 2, name: "Pets", createdAt: new Date() }, { id: 3, name: "Health", createdAt: new Date() }, { id: 4, name: "Fashion", createdAt: new Date() }, { id: 5, name: "Exercise", createdAt: new Date() }, { id: 6, name: "Others", createdAt: new Date() }]}
      ${"should return empty array when no community data"} | ${false}    | ${[]}
    `(
      "should return correct community data when $caseName",
      async ({ shouldExist, expected }) => {
        // Mock the repository's find method
        repo.find = jest.fn().mockResolvedValue(expected);

        // Call the service method
        const result = await service.findAll();

        // Check if the result matches the expected value
        expect(result).toEqual(expected);

        // Ensure the repository's find method was called
        expect(repo.find).toHaveBeenCalled();
      }
    );
  });
});
