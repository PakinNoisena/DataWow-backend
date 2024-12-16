import { Test, TestingModule } from "@nestjs/testing";
import { CommentService } from "../src/comment/comment.service";
import { CommentEntity } from "../src/entities/comment.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { In } from "typeorm";

describe("CommentService", () => {
  let service: CommentService;
  let commentRepo: Repository<CommentEntity>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepo = module.get<Repository<CommentEntity>>(
      getRepositoryToken(CommentEntity)
    );
  });

  describe("findAll", () => {
    it.each([
      {
        caseName: "should return comments for given postIds",
        postIds: ["post1", "post2"],
        expectedFindCallArgs: {
          where: { post: { id: In(["post1", "post2"]) } },
          order: { createdAt: "DESC" },
        },
      },
      {
        caseName: "should return empty array when no postIds",
        postIds: [],
        expectedFindCallArgs: {
          order: { createdAt: "DESC" },
        },
      },
    ])("should handle $caseName", async ({ postIds, expectedFindCallArgs }) => {
      const mockComments = [
        { id: "1", message: "Test Comment", createdAt: new Date() },
      ];
      commentRepo.find = jest.fn().mockResolvedValue(mockComments);

      const result = await service.findAll(postIds);

      // Check that the 'find' method was called with the correct arguments
      expect(commentRepo.find).toHaveBeenCalledWith(
        expect.objectContaining(expectedFindCallArgs)
      );

      // Check if the result matches the expected output
      expect(result).toEqual(mockComments);
    });
  });
});
