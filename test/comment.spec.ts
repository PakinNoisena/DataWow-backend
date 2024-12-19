import { Test, TestingModule } from "@nestjs/testing";
import { CommentService } from "../src/comment/comment.service";
import { CommentEntity } from "../src/entities/comment.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { In } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { UserEntity } from "../src/entities/user.entity";
import { PostEntity } from "../src/entities/post.entity";
import { POST_ERR, USER_ERR } from "../src/config/constant.config";
import { UsersService } from "../src/users/users.service";

describe("CommentService", () => {
  let service: CommentService;
  let commentRepo: Repository<CommentEntity>;
  let postRepo: Repository<PostEntity>;
  let userService: any;

  beforeEach(async () => {
    // Mock repositories
    const mockCommentRepository = {
      find: jest.fn(),
      delete: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const mockPostRepository = {
      findOne: jest.fn(),
    };

    const mockUserService = {
      findUserByUserId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: mockCommentRepository,
        },
        {
          provide: getRepositoryToken(PostEntity),
          useValue: mockPostRepository,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepo = module.get<Repository<CommentEntity>>(
      getRepositoryToken(CommentEntity)
    );
    postRepo = module.get<Repository<PostEntity>>(
      getRepositoryToken(PostEntity)
    );
    userService = module.get(UsersService);
  });

  describe("findAll", () => {
    it.each([
      {
        caseName: "should return comments for given postIds",
        postIds: ["post1", "post2"],
        mockComments: [
          { id: "1", message: "Test Comment 1", createdAt: new Date() },
          { id: "2", message: "Test Comment 2", createdAt: new Date() },
        ],
        expectedFindCallArgs: {
          where: { post: { id: In(["post1", "post2"]) } },
          order: { createdAt: "DESC" },
        },
        expectedResult: [
          { id: "1", message: "Test Comment 1", createdAt: expect.any(Date) },
          { id: "2", message: "Test Comment 2", createdAt: expect.any(Date) },
        ],
      },
      {
        caseName: "should return empty array when no postIds",
        postIds: [],
        mockComments: [],
        expectedFindCallArgs: {
          order: { createdAt: "DESC" },
        },
        expectedResult: [],
      },
    ])(
      "should handle $caseName correctly",
      async ({
        postIds,
        mockComments,
        expectedFindCallArgs,
        expectedResult,
      }) => {
        commentRepo.find = jest.fn().mockResolvedValue(mockComments);

        const result = await service.findAll(postIds);

        // Check that the 'find' method was called with the correct arguments
        expect(commentRepo.find).toHaveBeenCalledWith(
          expect.objectContaining(expectedFindCallArgs)
        );

        // Check if the result matches the expected output
        expect(result).toEqual(expectedResult);
      }
    );
  });

  describe("deleteByPostId", () => {
    it.each`
      caseName                              | postId     | expectedDeleteCallArgs
      ${"should delete comments by postId"} | ${"post1"} | ${{ post: { id: "post1" } }}
    `("should handle $caseName", async ({ postId, expectedDeleteCallArgs }) => {
      commentRepo.delete = jest.fn().mockResolvedValue({});

      await service.deleteByPostId(postId);

      // Check that the 'delete' method was called with the correct arguments
      expect(commentRepo.delete).toHaveBeenCalledWith(expectedDeleteCallArgs);
    });
  });

  describe("create", () => {
    const userId = "user1";
    const postId = "post1";
    const commentDto = { message: "Test comment" };

    it("should create and save a new comment", async () => {
      const mockPost = {
        id: "post1",
        title: "Post 1",
        description: "Post description",
      };
      const mockUser = { id: userId, username: "User1" };

      // Mock post and user service responses
      postRepo.findOne = jest.fn().mockResolvedValue(mockPost);
      userService.findUserByUserId = jest.fn().mockResolvedValue(mockUser);

      // Mock save comment
      commentRepo.save = jest.fn().mockResolvedValue({
        id: "1",
        message: commentDto.message,
        post: mockPost,
        commentedBy: mockUser,
        createdAt: new Date(),
      });

      const result = await service.create(userId, postId, commentDto);

      // Check that the 'save' method was called with the correct arguments
      expect(commentRepo.save).toHaveBeenCalled();
      expect(result.message).toEqual(commentDto.message);
      expect(result.post).toEqual(mockPost);
    });

    it("should throw NotFoundException if post is not found", async () => {
      postRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.create(userId, postId, commentDto)
      ).rejects.toThrowError(new NotFoundException(POST_ERR.NOT_FOUND));
    });

    it("should throw NotFoundException if user is not found", async () => {
      const mockPost = {
        id: postId,
        title: "Post 1",
        description: "Post description",
      };
      postRepo.findOne = jest.fn().mockResolvedValue(mockPost);
      userService.findUserByUserId = jest.fn().mockResolvedValue(null); // Simulating user not found

      await expect(
        service.create(userId, postId, commentDto)
      ).rejects.toThrowError(new NotFoundException(USER_ERR.USER_NOT_FOUND));
    });
  });
});
