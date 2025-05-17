import { NavbarItem } from '@docusaurus/theme-common';

const isDev = process.env.NODE_ENV === 'development';

export const GithubNavItem: NavbarItem = {
    href: 'https://github.com/SilasBerger/teaching-website',
    label: 'GitHub',
    position: 'right'
};

export const TaskStateOverviewNavItem: NavbarItem = {
    type: 'custom-taskStateOverview',
    position: 'left'
};

export const AccountSwitcherNavItem: NavbarItem = {
    type: 'custom-accountSwitcher',
    position: 'right'
};

export const RequestTargetNavItem: NavbarItem = {
    type: 'custom-requestTarget',
    position: 'right'
};

export const LoginProfileNavItem: NavbarItem = {
    type: 'custom-loginProfileButton',
    position: 'right'
};

export const DevDocsNavbarItem: NavbarItem | null = isDev
    ? {
          to: 'docs/material',
          label: '📄 Material',
          position: 'right'
      }
    : null;

export const DevDraftNavbarItem: NavbarItem | null = isDev
    ? {
          to: 'draft',
          label: '🚧 Draft',
          position: 'right'
      }
    : null;

export const DevComponentGalleryNavbarItem: NavbarItem | null = isDev
    ? {
          to: 'docs/material/Components-Gallery/Teaching-Dev/gallery',
          label: '🔧 Components',
          position: 'right'
      }
    : null;

export const DevDevDocsNavbarItem: NavbarItem | null = isDev
    ? {
          to: 'docs/material/Dev-Docs/VSCode-Cheatsheet',
          label: '📓 Dev Docs',
          position: 'right'
      }
    : null;
