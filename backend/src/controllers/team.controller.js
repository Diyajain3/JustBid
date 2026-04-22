import prisma from '../config/db.js';

export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const ownerId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const team = await prisma.team.create({
      data: {
        name,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: 'owner'
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    res.status(201).json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Server error creating team' });
  }
};

export const getMyTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    const memberships = await prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true }
                }
              }
            }
          }
        }
      }
    });

    const teams = memberships.map(m => ({
      ...m.team,
      currentUserRole: m.role
    }));
    
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Server error fetching teams' });
  }
};

export const inviteToTeam = async (req, res) => {
  try {
    const { teamId, email, role } = req.body;
    const inviterId = req.user.id;

    if (!teamId || !email) {
      return res.status(400).json({ message: 'Team ID and email are required' });
    }

    // Check if team exists and user is owner/admin
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: { teamId, userId: inviterId }
      }
    });

    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
      return res.status(403).json({ message: 'Not authorized to invite to this team' });
    }

    // Find user by email
    const userToInvite = await prisma.user.findUnique({ where: { email } });
    if (!userToInvite) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    // Create membership
    const newMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId: userToInvite.id,
        role: role || 'member'
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json(newMember);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'User is already a member of this team' });
    }
    console.error('Error inviting to team:', error);
    res.status(500).json({ message: 'Server error inviting to team' });
  }
};

export const removeFromTeam = async (req, res) => {
  try {
    const { teamId, userId } = req.params;
    const requesterId = req.user.id;

    // Check if requester is owner/admin
    const requesterMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: { teamId, userId: requesterId }
      }
    });

    if (!requesterMembership || (requesterMembership.role !== 'owner' && requesterMembership.role !== 'admin')) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Cannot remove owner
    const targetMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: { teamId, userId }
      }
    });

    if (!targetMembership) {
      return res.status(404).json({ message: 'Member not found in this team' });
    }

    if (targetMembership.role === 'owner') {
      return res.status(400).json({ message: 'Cannot remove the team owner' });
    }

    await prisma.teamMember.delete({
      where: {
        teamId_userId: { teamId, userId }
      }
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ message: 'Server error removing member' });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;

    // Check if team exists and user is owner
    const team = await prisma.team.findUnique({
      where: { id: teamId }
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.ownerId !== userId) {
      return res.status(403).json({ message: 'Only the owner can delete the team' });
    }

    await prisma.team.delete({
      where: { id: teamId }
    });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ message: 'Server error deleting team' });
  }
};
