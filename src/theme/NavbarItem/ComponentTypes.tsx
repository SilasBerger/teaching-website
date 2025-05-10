import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import LocaleDropdownNavbarItem from '@theme/NavbarItem/LocaleDropdownNavbarItem';
import SearchNavbarItem from '@theme/NavbarItem/SearchNavbarItem';
import HtmlNavbarItem from '@theme/NavbarItem/HtmlNavbarItem';
import DocNavbarItem from '@theme/NavbarItem/DocNavbarItem';
import DocSidebarNavbarItem from '@theme/NavbarItem/DocSidebarNavbarItem';
import DocsVersionNavbarItem from '@theme/NavbarItem/DocsVersionNavbarItem';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

import type { ComponentTypesObject } from '@theme/NavbarItem/ComponentTypes';
import LoginProfileButton from '@tdev-components/Navbar/LoginProfileButton';
import AccountSwitcher from '@tdev-components/Navbar/AccountSwitcher';
import TaskStateOverview from '@tdev-components/documents/TaskState/TaskStateOverview';
import ReguestTarget from '@tdev-components/Navbar/RequestTarget';

const ComponentTypes: ComponentTypesObject = {
    default: DefaultNavbarItem,
    localeDropdown: LocaleDropdownNavbarItem,
    search: SearchNavbarItem,
    dropdown: DropdownNavbarItem,
    html: HtmlNavbarItem,
    doc: DocNavbarItem,
    docSidebar: DocSidebarNavbarItem,
    docsVersion: DocsVersionNavbarItem,
    docsVersionDropdown: DocsVersionDropdownNavbarItem,
    ['custom-accountSwitcher']: AccountSwitcher,
    ['custom-loginProfileButton']: LoginProfileButton,
    ['custom-taskStateOverview']: TaskStateOverview,
    ['custom-requestTarget']: ReguestTarget
};

export default ComponentTypes;
