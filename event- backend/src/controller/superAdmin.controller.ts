import {
    controller,
    httpGet,
    httpPost,
    request,
    response,
    next
  } from 'inversify-express-utils'
  import { NextFunction, Request, Response } from 'express'

import { inject } from 'inversify'
import { ApiHandler } from '../utils/apiHandler'
import { PermissionService } from '../service/permission.service'
import { superAdmin } from '../service'
import { TYPES } from '../types/TYPES'
  
  @controller('/auth/superAdmin',)
  export class SuperAdminController {
    constructor(
      @inject(TYPES.superAdmin) private userService: superAdmin,
      @inject(TYPES.PermissionService)
      private readonly permissionService: PermissionService
    ) {}
    @httpPost('/roles')
    async assignRole(
      @request() req: Request,
      @response() res: Response,
      @next() next: NextFunction
    ) {
      try {
        const role = req.body.role
        console.log(role)
        const roles = await this.userService.assignRoles(role)
        res.send(new ApiHandler(roles))
      } catch (err) {
       console.log(err);
       
      }
    }
  
    @httpPost('/model')
    async addModel(
      @request() req: Request,
      @response() res: Response,
      @next() next: NextFunction
    ) {
      try {
        const name = req.body.name
        const moduleName = await this.userService.addModel(name)
        res.send(new ApiHandler(moduleName))
      } catch (err) {
        console.log(err);
      }
    }
  
    @httpPost('/permission')
    async addPermissions(
      @request() req: Request,
      @response() res: Response,
      @next() next: NextFunction
    ) {
      try {
        const { name, role, read, write, update, delete: del } = req.body 
        const sanitizedBody = {
          name,
          role,
          read,
          write,
          update,
          delete: del
        }
        const permissionName =
          await this.permissionService.addPermissions(sanitizedBody)
        res.send(new ApiHandler(permissionName))
      } catch (err) {
        console.log(err);
      }
    }
  }
  