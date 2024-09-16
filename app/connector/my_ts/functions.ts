import { db } from "./db";
import bcrypt from "bcrypt";

/**
 * @readonly Exposes the function as an NDC function (the function should only query data without making modifications)
 */
export function hello(name?: string) {
  return `hello ${name ?? "world"}`;
}

export async function insertUser(username: string, password: string, name: string): Promise<{id: number}> {
  const user = await db.insertInto('users').values({
    name,
    password: await bcrypt.hash(password, 8),
    username,
  }).returning('id').executeTakeFirstOrThrow();
 return user;
}
