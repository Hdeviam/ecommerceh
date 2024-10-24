import { User } from 'src/users/user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;
