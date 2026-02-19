import { DataSource, Repository } from "typeorm";
import { Designation } from "../entities/designation.entity";
import { CreateDesignationDTO, UpdateDesignationDTO } from "../dto/designation.dto";
import logger from "../../../shared/utils/logger.utils";
import { AppError } from "../../../shared/utils/error.utils";

export class DesignationService {
      private designationRepository: Repository<Designation>;
      constructor(dataSource: DataSource) {
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
                  if (data.name) {
                        const existingDesignation = await this.designationRepository.findOne({ where: { name: data.name } });
                        if (existingDesignation && existingDesignation.id !== id) {
                              throw new AppError('Designation already exists', 400);
                        }
                  }
                  const payload = {
                        ...data,
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
            try {
                  const existingDesignation = await this.designationRepository.findOne({ where: { id } });
                  if (!existingDesignation) {
                        throw new AppError('Designation not found', 404);
                  }
                  const resignation = await this.designationRepository.delete(id);
                  await this.createAuditLog(
                        'designations',
                        id,
                        'DELETE',
                        userId,
                        existingDesignation
                  );
                  return resignation;
            } catch (error) {
                  throw error;
            }
      }

      findAll = async () => {
            try {
                  const designations = await this.designationRepository.find();
                  return designations;
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