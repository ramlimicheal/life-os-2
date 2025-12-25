import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { sendEmail, getTeamInviteEmailHtml } from "@/lib/email";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id: teamId } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        members: { where: { userId: user.id } },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const membership = team.members[0];
    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
      return NextResponse.json({ error: "Not authorized to invite members" }, { status: 403 });
    }

    const body = await request.json();
    const { email, role } = inviteSchema.parse(body);

    const existingInvite = await db.teamInvite.findFirst({
      where: {
        teamId,
        email,
        status: "PENDING",
      },
    });

    if (existingInvite) {
      return NextResponse.json({ error: "Invite already sent to this email" }, { status: 400 });
    }

    const existingMember = await db.teamMember.findFirst({
      where: {
        teamId,
        user: { email },
      },
    });

    if (existingMember) {
      return NextResponse.json({ error: "User is already a team member" }, { status: 400 });
    }

    const invite = await db.teamInvite.create({
      data: {
        email,
        role,
        teamId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/teams/invite/${invite.id}`;
    
    await sendEmail({
      to: email,
      subject: `You're invited to join ${team.name} on Life 2.0`,
      html: getTeamInviteEmailHtml(team.name, user.name || user.email, inviteLink),
    });

    await db.notification.create({
      data: {
        type: "TEAM_INVITE",
        title: "Team Invitation Sent",
        message: `Invitation sent to ${email} for ${team.name}`,
        userId: user.id,
      },
    });

    return NextResponse.json(invite, { status: 201 });
  } catch (error) {
    console.error("Failed to send invite:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to send invite" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id: teamId } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const membership = await db.teamMember.findFirst({
      where: { teamId, userId: user.id },
    });

    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
      return NextResponse.json({ error: "Not authorized to view invites" }, { status: 403 });
    }

    const invites = await db.teamInvite.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invites);
  } catch (error) {
    console.error("Failed to fetch invites:", error);
    return NextResponse.json({ error: "Failed to fetch invites" }, { status: 500 });
  }
}
