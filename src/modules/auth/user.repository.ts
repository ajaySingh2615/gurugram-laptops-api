import { eq } from 'drizzle-orm';
import { db } from '../../common/config/db.js';
import { users } from './user.model.js';
import type { RegisterDto } from './dto/auth.dto.js';

export class UserRepository {
  public static async findUserByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? result[0] : null;
  }

  public static async insertUser(data: RegisterDto & { password: string }) {
    const [newUser] = await db
      .insert(users)
      .values({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      })
      .returning();

    return newUser;
  }

  public static async updateUser(id: string, updateData: any) {
    const [updateUser] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();

    return updateUser;
  }

  public static async findUserById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : null;
  }
}
