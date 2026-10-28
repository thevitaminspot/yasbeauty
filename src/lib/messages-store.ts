import { desc } from "drizzle-orm";
import { readFile, writeFile } from "fs/promises";
import { getDb, isDatabaseConfigured } from "@/db";
import { messages as messagesTable } from "@/db/schema";
import { messagesFilePath } from "@/lib/data-paths";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

function rowToMessage(row: typeof messagesTable.$inferSelect): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : String(row.createdAt),
  };
}

async function readMessagesFile(): Promise<ContactMessage[]> {
  try {
    return JSON.parse(
      await readFile(messagesFilePath, "utf8"),
    ) as ContactMessage[];
  } catch {
    return [];
  }
}

export async function readMessages(): Promise<ContactMessage[]> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    const rows = await db
      .select()
      .from(messagesTable)
      .orderBy(desc(messagesTable.createdAt));
    return rows.map(rowToMessage);
  }
  return readMessagesFile();
}

export async function appendMessage(
  entry: Omit<ContactMessage, "id" | "createdAt">,
): Promise<ContactMessage> {
  const record: ContactMessage = {
    ...entry,
    id: `msg_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };

  if (isDatabaseConfigured()) {
    const db = getDb();
    await db.insert(messagesTable).values({
      id: record.id,
      name: record.name,
      email: record.email,
      phone: record.phone,
      message: record.message,
      createdAt: new Date(record.createdAt),
    });
    return record;
  }

  const existing = await readMessagesFile();
  existing.unshift(record);
  await writeFile(messagesFilePath, JSON.stringify(existing, null, 2));
  return record;
}
