export type PostResponse = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  owner: PostOwner;
  community: PostCommunity;
  comments: PostComment[];
};

type PostOwner = {
  username: string;
};

type PostCommunity = {
  name: string;
  id: number;
};

export type PostComment = {
  id: string;
  message: string;
  createdAt: Date;
  commentedBy: string;
};
