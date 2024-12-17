import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "../src/post/post.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostEntity } from "../src/entities/post.entity";
import { CommunityService } from "../src/community/community.service";
import { UsersService } from "../src/users/users.service";
import { CommentService } from "../src/comment/comment.service";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { POST_ERR, USER_ERR } from "../src/config/constant.config";
import { PostCreateBodyDto } from "../src/dto/post.dto";

describe("PostService", () => {
  let service: PostService;
  let postRepo: Repository<PostEntity>;
  let communityService: CommunityService;
  let usersService: UsersService;
  let commentService: CommentService;

  beforeEach(async () => {
    const mockPostRepository = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      select: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const mockCommunityService = {
      findOneById: jest.fn(),
    };

    const mockUsersService = {
      findUserByUserId: jest.fn(),
    };

    const mockCommentService = {
      deleteByPostId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: mockPostRepository,
        },
        {
          provide: CommunityService,
          useValue: mockCommunityService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepo = module.get<Repository<PostEntity>>(
      getRepositoryToken(PostEntity)
    );
    communityService = module.get<CommunityService>(CommunityService);
    usersService = module.get<UsersService>(UsersService);
    commentService = module.get<CommentService>(CommentService);
  });

  describe("findOneById", () => {
    it.each`
      caseName                                                     | postId   | mockPost                                                                                                                                                                                                                                                                                                   | expectedResult                                                                                                                                                                                                                                                                                                 | expectedError
      ${"should return post data when post exists"}                | ${"1"}   | ${{ id: "1", title: "Post 1", description: "Description 1", createdAt: new Date(), updatedAt: new Date(), owner: { username: "Owner1" }, community: { id: "1", name: "Health" }, comments: [{ id: "comment1", message: "Great post!", createdAt: new Date(), commentedBy: { username: "Commenter1" } }] }} | ${{ id: "1", title: "Post 1", description: "Description 1", createdAt: expect.any(Date), updatedAt: expect.any(Date), owner: { username: "Owner1" }, community: { id: "1", name: "Health" }, comments: [{ id: "comment1", message: "Great post!", createdAt: expect.any(Date), commentedBy: "Commenter1" }] }} | ${null}
      ${"should throw NotFoundException when post does not exist"} | ${"999"} | ${null}                                                                                                                                                                                                                                                                                                    | ${null}                                                                                                                                                                                                                                                                                                        | ${POST_ERR.NOT_FOUND}
    `(
      "should handle $caseName correctly",
      async ({ postId, mockPost, expectedResult, expectedError }) => {
        postRepo.createQueryBuilder().getOne = jest
          .fn()
          .mockResolvedValue(mockPost);

        if (expectedError) {
          await expect(service.findOneById(postId)).rejects.toThrowError(
            new NotFoundException(expectedError)
          );
        } else {
          const result = await service.findOneById(postId);
          expect(result).toEqual(expectedResult);
        }

        expect(postRepo.createQueryBuilder).toHaveBeenCalled();
        expect(postRepo.createQueryBuilder().getOne).toHaveBeenCalled();
      }
    );
  });

  describe("findAll", () => {
    const cases = [
      {
        caseName: "should return posts based on search term",
        searchTerm: "Post",
        mockPosts: [
          {
            id: "1",
            title: "Post 1",
            description: "Description 1",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            owner: { username: "Owner1" },
            community: { id: "1", name: "Health" },
            comments: [
              {
                id: "1",
                message: "Comment 1",
                createdAt: new Date(),
                commentedBy: { username: "Commenter1" },
              },
            ],
          },
        ],
        expectedResult: [
          {
            id: "1",
            title: "Post 1",
            description: "Description 1",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            deletedAt: null,
            owner: { username: "Owner1" },
            community: { id: "1", name: "Health" },
            comments: [
              {
                id: "1",
                message: "Comment 1",
                createdAt: expect.any(Date),
                commentedBy: "Commenter1",
              },
            ],
          },
        ],
      },
      {
        caseName: "should return empty array when no posts match",
        searchTerm: "Non-matching",
        mockPosts: [],
        expectedResult: [],
      },
      {
        caseName: "should return all posts when no search term",
        searchTerm: "",
        mockPosts: [
          {
            id: "1",
            title: "Post 1",
            description: "Description 1",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            owner: { username: "Owner1" },
            community: { id: "1", name: "Health" },
            comments: [
              {
                id: "1",
                message: "Comment 1",
                createdAt: new Date(),
                commentedBy: { username: "Commenter1" },
              },
            ],
          },
        ],
        expectedResult: [
          {
            id: "1",
            title: "Post 1",
            description: "Description 1",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            deletedAt: null,
            owner: { username: "Owner1" },
            community: { id: "1", name: "Health" },
            comments: [
              {
                id: "1",
                message: "Comment 1",
                createdAt: expect.any(Date),
                commentedBy: "Commenter1",
              },
            ],
          },
        ],
      },
    ];

    it.each(cases)(
      "should handle $caseName correctly",
      async ({ searchTerm, mockPosts, expectedResult }) => {
        postRepo.createQueryBuilder = jest.fn().mockReturnValue({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue(mockPosts),
        });

        const result = await service.findAll(searchTerm);

        expect(result).toEqual(expectedResult);
        expect(postRepo.createQueryBuilder).toHaveBeenCalled();
      }
    );
  });

  describe("edit", () => {
    const mockPost = {
      id: "1",
      title: "Post 1",
      description: "Description 1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      owner: { id: "user1", username: "Owner1" },
      community: { id: "1", name: "Health" },
    };

    beforeEach(() => {
      postRepo.findOne = jest.fn().mockResolvedValue(mockPost);
    });

    it.each`
      caseName                                                        | postId   | userId     | updateData                                                                          | expectedResult | expectedError
      ${"should throw NotFoundException when post does not exist"}    | ${"999"} | ${"user1"} | ${{ title: "Updated Title", description: "Updated Description", communityId: "2" }} | ${null}        | ${new NotFoundException(POST_ERR.NOT_FOUND)}
      ${"should throw ForbiddenException when user is not the owner"} | ${"1"}   | ${"user2"} | ${{ title: "Updated Title", description: "Updated Description", communityId: "2" }} | ${null}        | ${new ForbiddenException(POST_ERR.NOT_POST_OWNER)}
    `(
      "should handle $caseName correctly",
      async ({ postId, userId, updateData, expectedResult, expectedError }) => {
        communityService.findOneById = jest
          .fn()
          .mockResolvedValue({ id: "3", name: "Education" });
        postRepo.save = jest.fn().mockResolvedValue(expectedResult);

        if (expectedError) {
          await expect(
            service.edit(postId, userId, updateData)
          ).rejects.toThrowError(expectedError);
        }
      }
    );
  });

  describe("deleteCommentsByPostId", () => {
    it("should call commentService.deleteByPostId with the correct postId", async () => {
      const postId = "1";

      commentService.deleteByPostId = jest.fn().mockResolvedValue(null);

      await service.deleteCommentsByPostId(postId);

      expect(commentService.deleteByPostId).toHaveBeenCalledWith(postId);
    });
  });

  describe("delete", () => {
    const mockPost = {
      id: "1",
      title: "Post 1",
      description: "Description 1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      owner: { id: "user1", username: "Owner1" },
      community: { id: "1", name: "Health" },
    };

    beforeEach(() => {
      postRepo.findOne = jest.fn().mockResolvedValue(mockPost);
      postRepo.delete = jest.fn().mockResolvedValue(null);
      commentService.deleteByPostId = jest.fn().mockResolvedValue(null);
    });

    it("should throw NotFoundException when post does not exist", async () => {
      postRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.delete("999", "user1")).rejects.toThrowError(
        new NotFoundException(POST_ERR.NOT_FOUND)
      );
    });

    it("should throw ForbiddenException when user is not the owner", async () => {
      mockPost.owner.id = "user2";
      await expect(service.delete("1", "user1")).rejects.toThrowError(
        new ForbiddenException(POST_ERR.NOT_POST_OWNER)
      );
    });
  });

  describe("create", () => {
    const createData: PostCreateBodyDto = {
      title: "New Post",
      description: "Post description",
      communityId: 1,
    };

    it("should successfully create a post when user exists", async () => {
      const mockUser = { id: "user1", username: "User1" };
      const mockCommunity = { id: "1", name: "Health" };
      const mockSavedPost = {
        id: "1",
        title: "New Post",
        description: "Post description",
        community: mockCommunity,
        owner: mockUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock service methods
      communityService.findOneById = jest.fn().mockResolvedValue(mockCommunity);
      usersService.findUserByUserId = jest.fn().mockResolvedValue(mockUser);
      postRepo.create = jest.fn().mockReturnValue(mockSavedPost);
      postRepo.save = jest.fn().mockResolvedValue(mockSavedPost);
      service.findOneById = jest.fn().mockResolvedValue(mockSavedPost);

      const result = await service.create("user1", createData);

      expect(result).toEqual(mockSavedPost);
      expect(communityService.findOneById).toHaveBeenCalledWith(
        createData.communityId
      );
      expect(usersService.findUserByUserId).toHaveBeenCalledWith("user1");
      expect(postRepo.create).toHaveBeenCalledWith({
        title: createData.title,
        description: createData.description,
        community: mockCommunity,
        owner: mockUser,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(postRepo.save).toHaveBeenCalledWith(mockSavedPost);
    });

    it("should throw NotFoundException when user is not found", async () => {
      const mockCommunity = { id: "1", name: "Health" };
      communityService.findOneById = jest.fn().mockResolvedValue(mockCommunity);
      usersService.findUserByUserId = jest.fn().mockResolvedValue(null); // Simulate user not found

      await expect(service.create("user1", createData)).rejects.toThrowError(
        new NotFoundException(USER_ERR.USER_NOT_FOUND)
      );
    });
  });
});
