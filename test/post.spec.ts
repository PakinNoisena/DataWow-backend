import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "../src/post/post.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { PostEntity } from "../src/entities/post.entity";
import { CommentService } from "../src/comment/comment.service";
import { CommunityEntity } from "../src/entities/community.entity";

describe("PostService", () => {
  let service: PostService;
  let postRepoMock: any;
  let commentServiceMock: any;
  let communityRepoMock: any;

  beforeEach(async () => {
    commentServiceMock = {
      findAll: jest.fn(),
    };

    postRepoMock = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    communityRepoMock = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: postRepoMock,
        },
        {
          provide: CommentService,
          useValue: commentServiceMock,
        },
        {
          provide: getRepositoryToken(CommunityEntity),
          useValue: communityRepoMock, // Add the mock for CommunityEntityRepository here
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  describe("findAll", () => {
    it.each`
      caseName                                              | searchTerm    | expectedResult
      ${"should return posts based on search term"} | ${"Post"} | ${[{
    id: "1",
    title: "Post 1",
    description: "Description 1",
    createdAt: new Date().toISOString().split(".")[0], // Truncate milliseconds
    updatedAt: new Date().toISOString().split(".")[0], // Truncate milliseconds
    owner: { username: "user1" },
    community: { name: "Community 1" },
    comments: [{
        id: "1",
        message: "Test Comment",
        createdAt: new Date().toISOString().split(".")[0], // Truncate milliseconds
        commentedBy: "user1",
      }],
  }]}
      ${"should return empty array when no search term"}    | ${""}         | ${[]}
      ${"should return an empty array when no posts found"} | ${"NotExist"} | ${[]}
    `("$caseName", async ({ searchTerm, expectedResult }) => {
      const mockComments = [
        {
          id: "1",
          message: "Test Comment",
          createdAt: new Date().toISOString().split(".")[0], // Truncate milliseconds
          commentedBy: { username: "user1" },
          post: { id: "1" },
        },
      ];
      commentServiceMock.findAll.mockResolvedValue(mockComments); // Mock the commentService

      postRepoMock.getMany.mockResolvedValue(expectedResult);

      // Mock where behavior if a search term is provided
      if (searchTerm) {
        postRepoMock.where.mockReturnThis();
      }

      // Call the service method
      const result = await service.findAll(searchTerm);

      // Verify if the result matches the expected result
      expect(result).toEqual(expectedResult);

      // If a search term is provided, ensure that 'where' method was called
      if (searchTerm) {
        expect(postRepoMock.where).toHaveBeenCalledWith(
          "post.title LIKE :title",
          { title: `%${searchTerm}%` }
        );
      }
    });
  });
});
