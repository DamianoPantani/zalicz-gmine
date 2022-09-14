import pg, { QueryResultRow } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("No DATABASE_URL env variable set");
}

export const query = async <T extends QueryResultRow>(
  query: string
): Promise<T[]> => {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  const res = await client.query<T>(query);
  client.end();

  return res.rows;
};
