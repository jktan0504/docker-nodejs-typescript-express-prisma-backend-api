import { Router } from 'express';
import * as servicesController from './external-controller';
export const servicesRoutes: Router = Router();
import {
    ApiHandler,
    apiAuthHandler as protectRoute,
} from '../common/middlewares';

servicesRoutes.get(
    '/services/generate-secure-url',
    ApiHandler(servicesController.generateSecureUrl),
);
servicesRoutes.get(
    '/services/run-migrations',
    // protectRoute,
    ApiHandler(servicesController.runMigrations),
);
