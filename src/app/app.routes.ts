import { Routes } from '@angular/router';
import { authGuard } from './common/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./chat/chat.component').then(c => c.ChatComponent),
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'message-list'
            },
            {
                path: "message-list",
                loadComponent: () => import('./chat/message-list/message-list.component').then(c => c.MessageListComponent)
            },
            {
                path: "search",
                loadComponent: () => import('./chat/search-list/search-list.component').then(c => c.SearchListComponent)
            }
        ]
    },
    {
        path: "chat-room/:id",
        canActivate: [authGuard],
        loadComponent: () => import('./room/room.component').then(c => c.RoomComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'sign-up',
        loadComponent: () => import('./sign-up-page/sign-up-page.component').then(c => c.SignUpPageComponent)
    },
];
