import "server-only";
import { eq } from "drizzle-orm";
import { readFile, writeFile } from "fs/promises";
import { getDb, isDatabaseConfigured } from "@/db";
import { trainingSettings as trainingTable } from "@/db/schema";
import { trainingFilePath } from "@/lib/data-paths";
import {
  defaultTrainingSettings,
  normalizeTrainingSettings,
  type TrainingSettings,
} from "@/lib/training-types";

async function readTrainingFile(): Promise<TrainingSettings> {
  try {
    const raw = await readFile(trainingFilePath, "utf8");
    return normalizeTrainingSettings(JSON.parse(raw) as TrainingSettings);
  } catch {
    const seeded = defaultTrainingSettings();
    await writeFile(
      trainingFilePath,
      `${JSON.stringify(seeded, null, 2)}\n`,
      "utf8",
    );
    return seeded;
  }
}

export async function readTrainingSettings(): Promise<TrainingSettings> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    const rows = await db
      .select()
      .from(trainingTable)
      .where(eq(trainingTable.id, "default"))
      .limit(1);
    if (rows[0]) {
      return normalizeTrainingSettings({
        mode: rows[0].mode,
        cohorts: rows[0].cohorts,
      });
    }
    const seeded = defaultTrainingSettings();
    await db.insert(trainingTable).values({
      id: "default",
      mode: seeded.mode,
      cohorts: seeded.cohorts,
      updatedAt: new Date(),
    });
    return seeded;
  }
  return readTrainingFile();
}

export async function writeTrainingSettings(
  settings: TrainingSettings,
): Promise<TrainingSettings> {
  const next = normalizeTrainingSettings(settings);
  if (isDatabaseConfigured()) {
    const db = getDb();
    await db
      .insert(trainingTable)
      .values({
        id: "default",
        mode: next.mode,
        cohorts: next.cohorts,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: trainingTable.id,
        set: {
          mode: next.mode,
          cohorts: next.cohorts,
          updatedAt: new Date(),
        },
      });
    return next;
  }
  await writeFile(
    trainingFilePath,
    `${JSON.stringify(next, null, 2)}\n`,
    "utf8",
  );
  return next;
}
