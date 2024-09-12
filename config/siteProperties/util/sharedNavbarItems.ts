import {NavbarItem} from "@docusaurus/theme-common";

export const GithubNavItem: NavbarItem = {
  href: 'https://github.com/SilasBerger/teaching-website',
  label: 'GitHub',
  position: 'right',
}

export const TaskStateOverviewNavItem: NavbarItem = {
  type: 'custom-taskStateOverview',
  position: 'left'
};


export const AccountSwitcherNavItem: NavbarItem = {
  type: 'custom-accountSwitcher',
    position: 'right'
};

export const LoginProfileNavItem: NavbarItem = {
  type: 'custom-loginProfileButton',
  position: 'right'
};