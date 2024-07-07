export const TYPES = {
    userController:Symbol.for("userController"),
    superAdmin:Symbol.for("superAdmin"),
            // Controllers
            SuperAdminController: Symbol.for('SuperAdminController'),
            eventController:Symbol.for("eventController"),
            eventRegController:Symbol.for("eventRegController"),
            // Services
            userService: Symbol.for('userService'),
            PermissionService: Symbol.for('PermissionService'),
            eventService:Symbol.for("eventService"),
            eventRegService:Symbol.for("eventRegService"),
          
            // Middlewares
            AuthMiddleware: Symbol.for('AuthMiddleware'),
            PermissionMiddleware: Symbol.for('PermissionMiddleware'),
          
}