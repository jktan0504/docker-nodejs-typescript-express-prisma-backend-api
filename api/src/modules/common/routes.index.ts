import express from 'express';
// All routes
import { servicesRoutes } from '../external-module/external-routes';
import { providersRoutes } from '../providers-module/provider-routes';
import { countriesRoutes } from '../country-module/country-routes';
import { rolesRoutes } from '../role-module/role-routes';
import { membershipsRoutes } from '../membership-module/membership-routes';
import { influencersRoutes } from '../influencer-module/influencer-routes';
import { usersRoutes } from '../user-module/user-routes';
import { authRoutes } from '../auth-module/auth-routes';
import { chatroomsListRoutes } from '../chatroom-module/chatroom-routes';
import { chatmessageListRoutes } from '../chat-message-module/chat-message-routes';
import { chatRoutes } from '../chat-module/chat-routes';

export const routes = express.Router();

routes.use([
    servicesRoutes,
    providersRoutes,
    countriesRoutes,
    rolesRoutes,
    membershipsRoutes,
    influencersRoutes,
    usersRoutes,
    authRoutes,
    chatroomsListRoutes,
    chatmessageListRoutes,
    chatRoutes,
]);
