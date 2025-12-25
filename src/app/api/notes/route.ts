import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { z } from "zod";

const createNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  type: z.enum(["NOTE", "ARTICLE", "PHOTOGRAPH", "VIDEO", "LINK"]).default("NOTE"),
  icon: z.string().default("description"),
  iconColor: z.string().optional(),
  tags: z.string().optional(),
  aiGenerated: z.boolean().default(false),
  projectId: z.string().optional(),
  knowledgeAreaId: z.string().optional(),
});

export async function GET() {
  try {
    const user = await getOrCreateUser();

    const notes = await db.note.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getOrCreateUser();
    const body = await request.json();

    const validatedData = createNoteSchema.parse(body);

    const note = await db.note.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Failed to create note:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
