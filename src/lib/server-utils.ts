"use server";

import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import path from "path";

// TODO : change into Docker upload folder
// this is for client image
export async function uploadFileImage(
  fileName: string,
  file: File,
): Promise<string> {
  if (fileName.trim() === "") throw new Error("File name cannot be empty");

  // Use the Docker volume's mount path
  const destination = "/public/uploads";

  const directoryPath = path.resolve(destination);
  const fullPath = directoryPath + fileName;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Ensure the directory exists
  const isExist = existsSync(path.dirname(fullPath));
  console.log("isExist ", isExist);
  if (!isExist) {
    await mkdirSync(path.dirname(fullPath), { recursive: true });
  }

  try {
    await writeFile(fullPath, buffer);
    // Return a relative path or URL for accessing the file
    return `/uploads/${fileName}`;
  } catch (err) {
    console.log(err);
    return "";
  }
}
