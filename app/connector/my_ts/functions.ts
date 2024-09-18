import { db } from "./db";
import bcrypt from "bcrypt";
import * as sdk from "@hasura/ndc-lambda-sdk"

import dotenv from 'dotenv'; 
dotenv.config();

/**
 * @readonly Exposes the function as an NDC function (the function should only query data without making modifications)
 */
export function hello(name?: string) {
  console.log(process.env);
  throw new sdk.Forbidden('Ooops', process.env);
  return 'hello';
}

export async function insertUser(username: string, password: string, name: string): Promise<{id: number}> {
  return db.insertInto('users').values({
    name,
    password: await bcrypt.hash(password, 8),
    username,
  }).returning('id').executeTakeFirstOrThrow();
}
