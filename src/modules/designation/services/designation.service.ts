import { DataSource, Repository } from "typeorm";
import { Designation } from "../entities/designation.entity";
import { CreateDesignationDTO, UpdateDesignationDTO } from "../dto/designation.dto";
import logger from "../../../shared/utils/logger.utils";
import { AppError } from "../../../shared/utils/error.utils";

export class DesignationService {
      private designationRepository: Repository<Designation>;
      constructor(private dataSource: DataSource) {
            this.designationRepository = dataSource.getRepository(Designation);
      }
      private async createAuditLog(
            tableName: string,
            recordId: string | null | undefined,
            action: string,
            changedBy: string,
            changes: any
      ) {
            logger.info(`Audit Log: ${action} on ${tableName} by ${changedBy}`, {
                  module: 'DesignationService',
                  recordId,
                  changes,
            });
      }
      create = async (data: CreateDesignationDTO, userId: string) => {
            try {
                  const existingDesignation = await this.designationRepository.findOne({ where: { name: data.name } });
                  if (existingDesignation) {
                        throw new AppError('Designation already exists', 400);
                  }
                  const payload = {
                        ...data,
                        createdById: userId
                  }
                  const designation = await this.designationRepository.save(payload);
                  await this.createAuditLog(
                        'designations',
                        designation.id,
                        'CREATE',
                        userId,
                        payload
                  );
                  return designation;
            } catch (error) {
                  throw error;
            }
      }

      update = async (id: string, data: UpdateDesignationDTO, userId: string) => {
            try {
                  const designationToUpdate = await this.designationRepository.findOne({ where: { id } });
                  if (!designationToUpdate) {
                        throw new AppError('Designation not found', 404);
                  }

                  if (data.name) {
                        const existingDesignation = await this.designationRepository.findOne({ where: { name: data.name } });
                        if (existingDesignation && existingDesignation.id !== id) {
                              throw new AppError('Designation already exists', 400);
                        }
                  }
                  const { versionId, ...updateData } = data;
                  const payload = {
                        ...updateData,
                        modifiedById: userId
                  }
                  const designation = await this.designationRepository.update(id, payload);
                  await this.createAuditLog(
                        'designations',
                        id,
                        'UPDATE',
                        userId,
                        payload
                  );
                  return designation;
            } catch (error) {
                  throw error;
            }
      }

      delete = async (id: string, userId: string) => {
            const existingDesignation = await this.designationRepository.findOne({ where: { id } });
            if (!existingDesignation) {
                  throw new AppError('Designation not found', 404);
            }

            // check if designation has members
            const teamMemberRepository = this.dataSource.getRepository('team_members');
            const membersCount = await teamMemberRepository.count({ where: { designationId: id } });

            if (membersCount > 0) {
                  throw new AppError('Cannot delete this designation because it is still assigned to one or more members', 409);
            }

            const designation = await this.designationRepository.delete(id);
            await this.createAuditLog(
                  'designations',
                  id,
                  'DELETE',
                  userId,
                  existingDesignation
            );
            return designation;
      }

      findAll = async (query: any = {}) => {
            try {
                  const { page = 1, limit = 10 } = query;
                  const skip = (Number(page) - 1) * Number(limit);
                  const [items, total] = await this.designationRepository.findAndCount({
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
            } catch (error) {
                  throw error;
            }
      }

      findOne = async (id: string) => {
            try {
                  const designation = await this.designationRepository.findOne({ where: { id } });
                  if (!designation) {
                        throw new AppError('Designation not found', 404);
                  }
                  return designation;
            } catch (error) {
                  throw error;
            }
      }
}