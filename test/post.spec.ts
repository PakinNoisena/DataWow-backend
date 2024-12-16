import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "../src/post/post.service";
import { PostEntity } from "../src/entities/post.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostRespDto } from "../src/dto/post.dto";

describe("PostService", () => {
  let service: PostService;
  let postRepoMock: any;

  beforeEach(async () => {
    postRepoMock = {
      createQueryBuilder: jest.fn().mockReturnThis(), // Mock createQueryBuilder to return 'this' for method chaining
      leftJoinAndSelect: jest.fn().mockReturnThis(), // Mock leftJoinAndSelect to return 'this' for chaining
      select: jest.fn().mockReturnThis(), // Mock select to return 'this' for chaining
      orderBy: jest.fn().mockReturnThis(), // Mock orderBy to return 'this' for chaining
      where: jest.fn().mockReturnThis(), // Mock where to return 'this' for chaining
      getMany: jest.fn(), // Mock getMany to return a result
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: postRepoMock,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  describe("findAll", () => {
    it.each`
      caseName                                              | searchTerm    | expectedResult
      ${"should return posts based on search term"}         | ${"Post"}     | ${[{ id: "1", title: "Post 1", description: "Description 1", createdAt: new Date(), updatedAt: new Date(), owner: { username: "user1" }, community: { name: "Community 1" } }]}
      ${"should return empty array when no search term"}    | ${""}         | ${[]}
      ${"should return an empty array when no posts found"} | ${"NotExist"} | ${[]}
    `("$caseName", async ({ searchTerm, expectedResult }) => {
      // Mocking the behavior of getMany to return the expected result
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
