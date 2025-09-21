import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  // Проверяем, что полученные данные - это действительно файл
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No file uploaded." },
      { status: 400 }
    );
  }

  // Теперь TypeScript уверен, что у `file` есть свойство .name
  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json(blob);
}