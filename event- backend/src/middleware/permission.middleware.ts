import { BaseMiddleware } from 'inversify-express-utils'
import { NextFunction, Response } from 'express'
import { permission } from 'process'
import { inject } from 'inversify'
import { TYPES } from '../types/TYPES'
import { PermissionService } from '../service'

interface Permission {
  read: boolean
  write: boolean
  update: boolean
  delete: boolean
  roleName: string
}

interface User {
  permissions: Permission[]
}

export class PermissionMiddleware extends BaseMiddleware {
  constructor(
    @inject(TYPES.PermissionService)
    private readonly permissionService: PermissionService
  ) {
    super()
  }
  async handler(req: any, res: Response, next: NextFunction) {
    const moduleName = req.headers.module as string
    const role: string = req.user.role
    const permissions: Permission[] =
      await this.permissionService.getPermissions(moduleName, role)
    const permission = permissions[0]
    req.permission = permission

    next()
  }
}