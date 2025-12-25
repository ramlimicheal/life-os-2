import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { z } from "zod";

const createKnowledgeAreaSchema = z.object({
  title: z.string().min(1),
  icon: z.string().default("psychology"),
});

export async function GET() {
  try {
    const user = await getOrCreateUser();

    const knowledgeAreas = await db.knowledgeArea.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { notes: true },
        },
      },
    });

    const areasWithCount = knowledgeAreas.map((area) => ({
      ...area,
      disciplinesCount: area._count.notes,
    }));

    return NextResponse.json(areasWithCount);
  } catch (error) {
    console.error("Failed to fetch knowledge areas:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge areas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getOrCreateUser();
    const body = await request.json();

    const validatedData = createKnowledgeAreaSchema.parse(body);

    const knowledgeArea = await db.knowledgeArea.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    return NextResponse.json(knowledgeArea, { status: 201 });
  } catch (error) {
    console.error("Failed to create knowledge area:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create knowledge area" },
      { status: 500 }
    );
  }
}
