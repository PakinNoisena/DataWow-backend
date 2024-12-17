export const POST_ERR = {
  NOT_FOUND: {
    messageCode: 1001,
    message: "Post not found",
  },
  NOT_POST_OWNER: {
    messageCode: 1002,
    message: "You are not the owner of this post",
  },
};

export const COMMUNITY_ERR = {
  ID_NOT_FOUND: {
    messageCode: 2001,
    message: "Community id not found",
  },
};

export const USER_ERR = {
  USERNAME_NOT_FOUND: (username: string) => ({
    messageCode: 3001,
    message: `User with username '${username}' not found`,
  }),
  USER_NOT_FOUND: {
    messageCode: 3002,
    message: "User not found",
  },
  USER_REQUIRED: {
    messageCode: 3003,
    message: "User Id is required",
  },
};
