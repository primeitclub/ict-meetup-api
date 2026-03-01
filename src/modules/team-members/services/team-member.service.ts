import { DataSource, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { TeamMember } from '../entities/team-member.entity';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from '../validators/team-member.validator';
import { Category, CategoryType } from '../../category/entities/category.entity';
import { FlagshipEventVersion, EventVersionStatus } from '../../flagship-event/entities/flagship-event.entity';
import { Designation } from '../../designation/entities/designation.entity';
import { removeFile } from '../../../shared/utils/helpers/imageUpload.helper';

export class TeamMemberService {
  private dataSource: DataSource;
  private teamMemberRepository: Repository<TeamMember>;
  private categoryRepository: Repository<Category>;
  private flagshipEventVersionRepository: Repository<FlagshipEventVersion>;
  private designationRepository: Repository<Designation>;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.teamMemberRepository = dataSource.getRepository(TeamMember);
    this.categoryRepository = dataSource.getRepository(Category);
    this.flagshipEventVersionRepository = dataSource.getRepository(FlagshipEventVersion);
    this.designationRepository = dataSource.getRepository(Designation);
  }


  // social links and images
  async create(data: CreateTeamMemberDto): Promise<TeamMember> {
    logger.info(`Creating new team member: ${data.name}`, {
      module: 'TeamMemberService',
    });

    const versionExists = await this.flagshipEventVersionRepository.findOne({ where: { id: data.versionId } });
    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }
    if (versionExists.status !== EventVersionStatus.DRAFT) {
      throw new AppError('Can only create team members for a flagship event version that is in "draft" status', 400);
    }

    const categoryExists = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
    if (!categoryExists) {
      throw new AppError('Category not found', 404);
    }

    if (categoryExists.type !== CategoryType.TEAM) {
      throw new AppError('Only categories of type "teams" can be assigned to team members', 400);
    }

    const designationOrderExists = await this.teamMemberRepository.findOne({
      where: {
        categoryId: data.categoryId,
        designationOrder: data.designationOrder || 0
      }
    });

    if (designationOrderExists) {
      throw new AppError(`A member with designation order ${data.designationOrder || 0} already exists in this category`, 400);
    }

    const designationExists = await this.designationRepository.findOne({ where: { id: data.designationId } });
    if (!designationExists) {
      throw new AppError('Designation not found', 404);
    }

    const teamMember = this.teamMemberRepository.create(data);
    teamMember.flagshipEvent = versionExists;
    teamMember.category = categoryExists;
    teamMember.designation = designationExists;

    const savedTeamMember = await this.teamMemberRepository.save(teamMember)
    return savedTeamMember;
  }

  async findAll(query: any = {}): Promise<any> {
    logger.debug('Fetching team members', {
      module: 'TeamMemberService',
      query,
    });
    const { versionId, categoryId, ...rest } = query;
    const where: any = {};
    if (versionId) where.versionId = versionId;
    if (categoryId) where.categoryId = categoryId;
    where.category = { type: CategoryType.TEAM };

    const { page = 1, limit = 10 } = rest;
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await this.teamMemberRepository.findAndCount({
      where,
      relations: ['category', 'flagshipEvent', 'designation'],
      select: {
        id: true,
        // versionId: true,
        // categoryId: true,
        name: true,
        role: true,
        imagePath: true,
        imageUrl: true,
        socialLinks: true as any,
        designationOrder: true,
        createdAt: true,
        updatedAt: true,
        // designationId: true,
        category: {
          id: true,
          type: true,
          name: true,
          displayOrder: true,
        },
        designation: {
          id: true,
          name: true,
        },
        flagshipEvent: {
          id: true,
          version_name: true,
        },
      },
      order: {
        category: { displayOrder: 'ASC' },
        designationOrder: 'ASC',
        createdAt: 'DESC',
      },
      skip,
      take: Number(limit),
    });

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      }
    };
  }

  async findById(id: string): Promise<TeamMember> {
    const teamMember = await this.teamMemberRepository.findOne({
      where: { id },
      relations: ['category', 'flagshipEvent', 'designation'],
    });
    if (!teamMember) {
      throw new AppError('Team member not found', 404);
    }
    return teamMember;
  }

  async update(
    id: string,
    data: UpdateTeamMemberDto,
  ): Promise<TeamMember> {
    const teamMember = await this.findById(id);
    if (!teamMember) {
      throw new AppError('Team member not found', 404);
    }
    logger.info(`Updating team member: ${id}`, {
      module: 'TeamMemberService',
    });

    if (data.versionId) {
      const versionExists = await this.flagshipEventVersionRepository.findOne({ where: { id: data.versionId } });
      if (!versionExists) {
        throw new AppError('Flagship event version not found', 404);
      }
      if (versionExists.status === EventVersionStatus.ARCHIVED) {
        throw new AppError('Cannot update team members for an archived flagship event version', 400);
      }
    }

    if (data.categoryId && data.categoryId !== teamMember.categoryId) {
      const categoryExists = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
      if (!categoryExists) {
        throw new AppError('Category not found', 404);
      }
      if (categoryExists.type !== CategoryType.TEAM) {
        throw new AppError('Only categories of type "teams" can be assigned to team members', 400);
      }
    }

    if (data.designationId && data.designationId !== teamMember.designationId) {
      const designationExists = await this.designationRepository.findOne({ where: { id: data.designationId } });
      if (!designationExists) {
        throw new AppError('Designation not found', 404);
      }
    }

    const nameChanged = data.name && data.name !== teamMember.name;
    const categoryChanged = data.categoryId && data.categoryId !== teamMember.categoryId;
    const orderChanged = data.designationOrder !== undefined && data.designationOrder !== teamMember.designationOrder;

    if (nameChanged || categoryChanged || orderChanged) {
      const categoryId = data.categoryId || teamMember.categoryId;
      const designationOrder = data.designationOrder !== undefined ? data.designationOrder : teamMember.designationOrder;

      // 1. Check unique name in category
      if (nameChanged || categoryChanged) {
        const nameMatch = await this.teamMemberRepository.findOne({
          where: {
            name: data.name || teamMember.name,
            categoryId,
          },
        });
        if (nameMatch && nameMatch.id !== id) {
          throw new AppError(
            `Team member with name '${data.name || teamMember.name}' already exists in this category`,
            400
          );
        }
      }

      // 2. Check unique designationOrder in category
      if (orderChanged || categoryChanged) {
        const orderMatch = await this.teamMemberRepository.findOne({
          where: {
            categoryId,
            designationOrder
          }
        });
        if (orderMatch && orderMatch.id !== id) {
          throw new AppError(`A member with designation order ${designationOrder} already exists in this category`, 400);
        }
      }
    }

    const updatedTeamMember = await this.teamMemberRepository.save({
      ...teamMember,
      ...data,
      versionId: data.versionId || teamMember.versionId,
      categoryId: data.categoryId || teamMember.categoryId,
      designationId: data.designationId || teamMember.designationId,
    });

    return updatedTeamMember;
  }

  async delete(id: string): Promise<{ versionId: string }> {
    const teamMember = await this.findById(id);

    logger.warn(`Deleting team member: ${id}`, {
      module: 'TeamMemberService',
    });

    await this.teamMemberRepository.remove(teamMember);
    await removeFile(teamMember.imagePath);
    return { versionId: teamMember.versionId };
  }
}
