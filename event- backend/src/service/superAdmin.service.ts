import { injectable } from 'inversify'
import { promisify } from 'util'
import mongoose, { PipelineStage, isObjectIdOrHexString } from 'mongoose'
import { Module, Role } from '../model'


@injectable()
export class superAdmin  {
  constructor() {}

  async assignRoles(roleData: string) {
    const role = await Role.create({ role: roleData })
    if (role) return role
    throw new Error(
      "Error During giving role"
    )
  }

  async addModel(moduleName: string) {
    const module = await Module.create({ name: moduleName })
    if (module) return module
    throw new Error("Error"
    )
  }
}