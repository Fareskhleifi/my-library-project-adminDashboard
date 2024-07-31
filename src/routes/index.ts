import { lazy } from 'react';

const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const UserCrud = lazy(() => import('../pages/CRUD/UserCrud'));
const BookCrud = lazy(() => import('../pages/CRUD/BookCrud'));
const CategorieCrud = lazy(() => import('../pages/CRUD/CategorieCrud'));

const coreRoutes = [
  {
    path: '/calendar',
    title: 'Calender',
    component: Calendar,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/users',
    title: 'User',
    component: UserCrud,
  },
  {
    path: '/books',
    title: 'Books',
    component: BookCrud,
  },
  {
    path: '/categories',
    title: 'Categories',
    component: CategorieCrud,
  },
];

const routes = [...coreRoutes];
export default routes;
