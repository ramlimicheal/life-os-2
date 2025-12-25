import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

const updateUserSchema = z.object({
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({
      where: { clerkId },
    });

    if (!adminUser || (adminUser.role !== "ADMIN" && adminUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const user = await db.user.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        projects: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        knowledgeAreas: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            notes: true,
            projects: true,
            knowledgeAreas: true,
            notifications: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({
      where: { clerkId },
    });

    if (!adminUser || adminUser.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { role } = updateUserSchema.parse(body);

    const user = await db.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to update user:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({
      where: { clerkId },
    });

    if (!adminUser || adminUser.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super admin access required" }, { status: 403 });
    }

    if (adminUser.id === id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
