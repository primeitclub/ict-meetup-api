import { DataSource, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { TeamMember } from '../entities/team-member.entity';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from '../dto/team-member.dto';
import { Category } from '../../category/entities/category.entity';
import { FlagshipEventVersion } from '../../flagship-event/entities/flagship-event.entity';
import { Designation } from '../../designation/entities/designation.entity';

export class TeamMemberService {
  private dataSource: DataSource;
  private teamMemberRepository: Repository<TeamMember>;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.teamMemberRepository = dataSource.getRepository(TeamMember);
  }

  private async createAuditLog(
    tableName: string,
    recordId: string | null | undefined,
    action: string,
    changedBy: string,
    changes: any
  ) {
    logger.info(`Audit Log: ${action} on ${tableName} by ${changedBy}`, {
      module: 'TeamMemberService',
      recordId,
      changes,
    });
  }

  async create(data: CreateTeamMemberDto, userId: string): Promise<TeamMember> {
    logger.info(`Creating new team member: ${data.name}`, {
      module: 'TeamMemberService',
    });


    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: data.versionId } });
    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    const categoryExists = await this.dataSource
      .getRepository(Category)
      .findOne({ where: { id: data.categoryId } });
    if (!categoryExists) {
      throw new AppError('Category not found', 404);
    }

    const designationExists = await this.dataSource
      .getRepository(Designation)
      .findOne({ where: { id: data.designationId } });
    if (!designationExists) {
      throw new AppError('Designation not found', 404);
    }

    try {
      const teamMember = new TeamMember();
      Object.assign(teamMember, data);

      // Use the fetched entities for relations
      teamMember.flagshipEvent = versionExists;
      teamMember.category = categoryExists;
      teamMember.designation = designationExists;

      const savedTeamMember = await this.teamMemberRepository.save(teamMember);

      await this.createAuditLog(
        'team_members',
        savedTeamMember.id,
        'CREATE',
        userId,
        savedTeamMember
      );

      return savedTeamMember;
    } catch (error: any) {
      logger.error(`Error saving team member: ${error.message}`, {
        module: 'TeamMemberService',
        error: error.stack,
        data
      });
      throw error;
    }
  }

  async findAll(query?: { versionId?: string; categoryId?: string }): Promise<TeamMember[]> {
    logger.debug('Fetching team members', {
      module: 'TeamMemberService',
      query,
    });

    const where: any = {};
    if (query?.versionId) where.versionId = query.versionId;
    if (query?.categoryId) where.categoryId = query.categoryId;

    return await this.teamMemberRepository.find({
      where,
      relations: ['category', 'flagshipEvent', 'designation'],
      order: { designationOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<TeamMember> {
    const teamMember = await this.teamMemberRepository.findOne({
      where: { id },
      relations: ['category', 'flagshipEvent'],
    });
    if (!teamMember) {
      throw new AppError('Team member not found', 404);
    }
    return teamMember;
  }

  async update(
    id: string,
    data: UpdateTeamMemberDto,
    userId: string
  ): Promise<TeamMember> {
    const teamMember = await this.findById(id);
    logger.info(`Updating team member: ${id}`, {
      module: 'TeamMemberService',
    });

    const oldState = { ...teamMember };
    if (data.versionId) {
      const versionExists = await this.dataSource
        .getRepository(FlagshipEventVersion)
        .findOne({ where: { id: data.versionId } });
      if (!versionExists) {
        throw new AppError('Flagship event version not found', 404);
      }
    }

    if (data.categoryId) {
      const categoryExists = await this.dataSource
        .getRepository(Category)
        .findOne({ where: { id: data.categoryId } });
      if (!categoryExists) {
        throw new AppError('Category not found', 404);
      }
    }

    if (data.designationId) {
      const designationExists = await this.dataSource
        .getRepository(Designation)
        .findOne({ where: { id: data.designationId } });
      if (!designationExists) {
        throw new AppError('Designation not found', 404);
      }
    }

    if (data.name) {
      const existing = await this.teamMemberRepository.findOne({
        where: {
          name: data.name,
          categoryId: data.categoryId || teamMember.categoryId,
        },
      });

      if (existing && existing.id !== id) {
        throw new AppError(
          `Team member with name '${data.name}' already exists in this category`,
          400
        );
      }
    }

    Object.assign(teamMember, data);
    if (data.versionId) teamMember.flagshipEvent = { id: data.versionId } as any;
    if (data.categoryId) teamMember.category = { id: data.categoryId } as any;
    if (data.designationId) teamMember.designation = { id: data.designationId } as any;

    const updatedTeamMember = await this.teamMemberRepository.save(teamMember);

    await this.createAuditLog(
      'team_members',
      updatedTeamMember.id,
      'UPDATE',
      userId,
      { before: oldState, after: updatedTeamMember }
    );

    return updatedTeamMember;
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    const teamMember = await this.findById(id);

    logger.warn(`Deleting team member: ${id}`, {
      module: 'TeamMemberService',
    });

    await this.teamMemberRepository.remove(teamMember);

    await this.createAuditLog(
      'team_members',
      id,
      'DELETE',
      userId,
      { deleted_team_member: teamMember }
    );

    return { message: 'Team member deleted successfully' };
  }
}
