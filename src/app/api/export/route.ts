import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateUser();
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format") || "json";

    const [notes, projects, knowledgeAreas] = await Promise.all([
      db.note.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      db.project.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          notes: true,
        },
      }),
      db.knowledgeArea.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          notes: true,
        },
      }),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      statistics: {
        totalNotes: notes.length,
        totalProjects: projects.length,
        totalKnowledgeAreas: knowledgeAreas.length,
      },
      notes,
      projects,
      knowledgeAreas,
    };

    if (format === "csv") {
      const csvRows = [
        ["ID", "Title", "Type", "Content", "Tags", "Created At", "Updated At"],
        ...notes.map((note) => [
          note.id,
          `"${note.title.replace(/"/g, '""')}"`,
          note.type,
          `"${(note.content || "").replace(/"/g, '""')}"`,
          `"${(note.tags || "").replace(/"/g, '""')}"`,
          note.createdAt.toISOString(),
          note.updatedAt.toISOString(),
        ]),
      ];

      const csvContent = csvRows.map((row) => row.join(",")).join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="life2-export-${Date.now()}.csv"`,
        },
      });
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="life2-export-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error("Failed to export data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
