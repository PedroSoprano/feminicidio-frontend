import { Links } from '../pages/Links';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import { Sites } from '../pages/Sites';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import { Users } from '../pages/Users';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Calendar } from '../pages/Calendar';
import EventIcon from '@mui/icons-material/Event';
import { Iml } from '../pages/Iml';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Victims } from '../pages/Victims';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { Dashboards } from '../pages/Dashboard';

export const APP_PAGES = [
    {
        title: 'Dashboard',
        route: '/',
        icon: <DashboardIcon />,
        component: <Dashboards />,
        showMenu: true,
    },
    {
        title: 'Sites',
        route: '/sites',
        icon: <ScreenSearchDesktopIcon />,
        component: <Sites />,
        showMenu: true,
    },
    {
        title: 'Relatório IML',
        route: '/iml',
        icon: <TextSnippetIcon />,
        component: <Iml />,
        showMenu: true,
    },
    {
        title: 'Links',
        route: '/links',
        icon: <AddLinkOutlinedIcon />,
        component: <Links />,
        showMenu: true,
    },
    {
        title: 'Usuários',
        route: '/users',
        icon: <GroupAddIcon />,
        component: <Users />,
        showMenu: true,
    },
    {
        title: 'Vítimas',
        route: '/victims',
        icon: <ContactPageIcon />,
        component: <Victims />,
        showMenu: true,
    },
    {
        title: 'Calendário',
        route: '/calendar',
        icon: <EventIcon />,
        component: <Calendar />,
        showMenu: true,
    },
]


export const APP_PAGES_VISUALIZADOR = [
    {
        title: 'Dashboard',
        route: '/',
        icon: <DashboardIcon />,
        component: <Dashboards />,
        showMenu: true,
    }
]

export const APP_PAGES_EDITOR = [
    {
        title: 'Dashboard',
        route: '/',
        icon: <DashboardIcon />,
        component: <Dashboards />,
        showMenu: true,
    },
    {
        title: 'Sites',
        route: '/sites',
        icon: <ScreenSearchDesktopIcon />,
        component: <Sites />,
        showMenu: true,
    },
    {
        title: 'Relatório IML',
        route: '/iml',
        icon: <TextSnippetIcon />,
        component: <Iml />,
        showMenu: true,
    },
    {
        title: 'Links',
        route: '/links',
        icon: <AddLinkOutlinedIcon />,
        component: <Links />,
        showMenu: true,
    },
    {
        title: 'Vítimas',
        route: '/victims',
        icon: <ContactPageIcon />,
        component: <Victims />,
        showMenu: true,
    },
    {
        title: 'Calendário',
        route: '/calendar',
        icon: <EventIcon />,
        component: <Calendar />,
        showMenu: true,
    },
]
