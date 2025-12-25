import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { z } from "zod";

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["BUSINESS", "ACADEMIC", "PERSONAL"]).default("PERSONAL"),
});

export async function GET() {
  try {
    const user = await getOrCreateUser();

    const projects = await db.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { notes: true },
        },
      },
    });

    const projectsWithCount = projects.map((project) => ({
      ...project,
      creationsCount: project._count.notes,
    }));

    return NextResponse.json(projectsWithCount);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getOrCreateUser();
    const body = await request.json();

    const validatedData = createProjectSchema.parse(body);

    const project = await db.project.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
