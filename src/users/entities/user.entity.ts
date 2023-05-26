import client from '@prisma/client';

export class User implements client.User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
