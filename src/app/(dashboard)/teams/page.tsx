"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  Settings,
  UserPlus,
  Crown,
  Shield,
  User,
  Loader2,
  MoreVertical,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

interface TeamMember {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  user: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  owner: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  members: TeamMember[];
  _count: {
    members: number;
  };
}

export default function TeamsPage() {
  const { addToast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER" | "VIEWER">("MEMBER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch("/api/teams");
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      addToast("Failed to load teams", "error");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeamName,
          description: newTeamDescription || undefined,
        }),
      });

      if (res.ok) {
        addToast("Team created successfully", "success");
        setIsCreateModalOpen(false);
        setNewTeamName("");
        setNewTeamDescription("");
        fetchTeams();
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to create team", "error");
      }
    } catch (error) {
      console.error("Failed to create team:", error);
      addToast("Failed to create team", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !selectedTeam) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/teams/${selectedTeam.id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (res.ok) {
        addToast("Invitation sent successfully", "success");
        setIsInviteModalOpen(false);
        setInviteEmail("");
        setInviteRole("MEMBER");
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to send invitation", "error");
      }
    } catch (error) {
      console.error("Failed to send invitation:", error);
      addToast("Failed to send invitation", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "ADMIN":
        return <Shield className="w-4 h-4 text-purple-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const openInviteModal = (team: Team) => {
    setSelectedTeam(team);
    setIsInviteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-purple-400" />
            Teams
          </h1>
          <p className="text-gray-400 mt-1">Collaborate with others on your knowledge base</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      {teams.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No teams yet</h2>
          <p className="text-gray-400 mb-6">Create a team to start collaborating with others</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Team
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {team.imageUrl ? (
                    <img
                      src={team.imageUrl}
                      alt={team.name}
                      className="w-12 h-12 rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{team.name}</h3>
                    <p className="text-xs text-gray-500">
                      {team._count.members} member{team._count.members !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <button className="p-1.5 text-gray-500 hover:text-white hover:bg-[#252525] rounded transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {team.description && (
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{team.description}</p>
              )}

              <div className="flex items-center gap-1 mb-4">
                {team.members.slice(0, 5).map((member) => (
                  <div
                    key={member.id}
                    className="relative group"
                    title={member.user.name || member.user.email}
                  >
                    {member.user.imageUrl ? (
                      <img
                        src={member.user.imageUrl}
                        alt={member.user.name || "Member"}
                        className="w-8 h-8 rounded-full border-2 border-[#1a1a1a]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium border-2 border-[#1a1a1a]">
                        {(member.user.name || member.user.email)[0].toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5">
                      {getRoleIcon(member.role)}
                    </div>
                  </div>
                ))}
                {team._count.members > 5 && (
                  <div className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center text-xs text-gray-400 border-2 border-[#1a1a1a]">
                    +{team._count.members - 5}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => openInviteModal(team)}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Invite
                </Button>
                <Button variant="secondary" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Team"
      >
                <form onSubmit={handleCreateTeam} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Team Name
                    </label>
                    <Input
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="e.g., Research Team"
                      required
                    />
                  </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={newTeamDescription}
              onChange={(e) => setNewTeamDescription(e.target.value)}
              placeholder="What is this team about?"
              className="w-full px-3 py-2 bg-[#252525] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Team"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title={`Invite to ${selectedTeam?.name || "Team"}`}
      >
                <form onSubmit={handleInviteMember} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      icon={<Mail className="w-4 h-4" />}
                      required
                    />
                  </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as "ADMIN" | "MEMBER" | "VIEWER")}
              className="w-full px-3 py-2 bg-[#252525] border border-[#333] rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="VIEWER">Viewer - Can view content</option>
              <option value="MEMBER">Member - Can create and edit</option>
              <option value="ADMIN">Admin - Can manage team</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Send Invitation"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
