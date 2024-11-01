import { lazy } from 'react';
import UsersTable from '../components/Users';

const Calendar = lazy(() => import('../pages/Calendar'));
const Brain = lazy(() => import('../pages/Brain/Brain'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/AddUser'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));

const subRoutesForBrains = [
  {
    path: '/users/invited-users',
    title: 'Invited Users',
    component: UsersTable,
  },
  {
    path: '/users/invite-user',
    title: 'Invite User',
    component: FormLayout,
  },
];

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
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
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
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },
  {
    path: '/users/invited-users',
    title: 'Invited Users',
    component: UsersTable
  },
  {
    path: '/users/invite-user',
    title: 'Invite User',
    component: FormLayout,
  },
  {
    path: '/brains',
    title: 'Invite User',
    component: Brain,
    subroutes: subRoutesForBrains
  }
];

const routes = [...coreRoutes];
export default routes;
