import {Container} from 'inversify'
import { eventController, eventRegController, SuperAdminController } from './controller'
import { TYPES } from './types/TYPES'
import { PermissionMiddleware } from './middleware/permission.middleware'
import { eventService, PermissionService, superAdmin, userService } from './service'
import { userController } from './controller/user.controller'
import { eventRegService } from './service/eventReg.service'

const container = new Container()

//controller
container.bind<SuperAdminController>(TYPES.SuperAdminController).to(SuperAdminController)
container.bind<userController>(TYPES.userController).to(userController)
container.bind<eventController>(TYPES.eventController).to(eventController)
container.bind<eventRegController>(TYPES.eventRegController).to(eventRegController)

//middleware
container.bind<PermissionMiddleware>(TYPES.PermissionMiddleware).to(PermissionMiddleware)

//service
container.bind<PermissionService>(TYPES.PermissionService).to(PermissionService)
container.bind<superAdmin>(TYPES.superAdmin).to(superAdmin)
container.bind<userService>(TYPES.userService).to(userService)
container.bind<eventService>(TYPES.eventService).to(eventService)
container.bind<eventRegService>(TYPES.eventRegService).to(eventRegService)

export {container}