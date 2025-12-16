// This file is never changed by teaching-dev.
// Use it to override or extend your app configuration.

import { VersionOptions } from '@docusaurus/plugin-content-docs';
import { SiteConfig, SiteConfigProvider } from '@tdev/siteConfig/siteConfig';
import { ScriptsBuilder } from './framework/builder/scriptsBuilder';
import { DevComponentGalleryNavbarItem, DevDevDocsNavbarItem, DevDocsNavbarItem } from './navbarItems';
import {
    codeAsAttributePluginConfig,
    commentPluginConfig,
    enumerateAnswersPluginConfig,
    kbdPluginConfig,
    linkAnnotationPluginConfig,
    mdiPluginConfig,
    mediaPluginConfig,
    pagePluginConfig,
    pdfPluginConfig,
    remarkMathPluginConfig,
    strongPluginConfig
} from './src/siteConfig/markdownPluginConfigs';
import {
    accountSwitcher,
    loginProfileButton,
    personalSpaceOverlay,
    requestTarget,
    taskStateOverview
} from './src/siteConfig/navbarItems';
import { remarkContainerDirectivesConfig } from './website/plugin-configs/remark-container-directives/plugin-config';
import { remarkLineDirectivesPluginConfig } from './website/plugin-configs/remark-line-directives/plugin-config';
import remarkContainerDirectives from './website/plugins/remark-container-directives/plugin';
import remarkLineDirectives from './website/plugins/remark-line-directives/plugin';

const REMARK_PLUGINS = [
    strongPluginConfig,
    mdiPluginConfig,
    mediaPluginConfig,
    kbdPluginConfig,
    remarkMathPluginConfig,
    enumerateAnswersPluginConfig,
    pdfPluginConfig,
    pagePluginConfig,
    [remarkContainerDirectives, remarkContainerDirectivesConfig], // TODO: Resolve this.
    [remarkLineDirectives, remarkLineDirectivesPluginConfig], // TODO: Resolve this.
    commentPluginConfig,
    linkAnnotationPluginConfig,
    codeAsAttributePluginConfig
] as any;

const GIT_COMMIT_SHA = process.env.GITHUB_SHA || Math.random().toString(36).substring(7);
const ADMONITION_CONFIG = {
    admonitions: {
        keywords: ['aufgabe', 'insight', 'key', 'definition', 'tip', 'info', 'note'],
        extendDefaults: true
    }
};

const getSiteConfig: SiteConfigProvider = () => {
    const SCRIPTS_CONFIG_FILE = 'scriptsConfig.yaml';

    const versions: { [key: string]: VersionOptions } = {
        current: {
            badge: false,
            banner: 'none',
            path: 'docs'
        }
    };

    ScriptsBuilder.readScriptNames(SCRIPTS_CONFIG_FILE).forEach((scriptName: string) => {
        versions[scriptName] = {
            badge: false,
            banner: 'none'
        };
    });

    if (!process.env.NO_SYNC) {
        ScriptsBuilder.buildOnce(SCRIPTS_CONFIG_FILE);
    }

    return {
        title: 'classrooms.app',
        tagline: 'Classrooms',
        url: 'https://classrooms.app',
        siteStyles: ['website/css/custom.scss'],
        navbarItems: [
            taskStateOverview,
            DevDocsNavbarItem,
            DevComponentGalleryNavbarItem,
            DevDevDocsNavbarItem,
            accountSwitcher,
            requestTarget,
            personalSpaceOverlay,
            loginProfileButton
        ].filter((item) => !!item),
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Tools',
                    items: [
                        {
                            label: 'Thonny',
                            to: 'https://thonny.org/'
                        },
                        {
                            label: 'VS Code',
                            to: 'https://code.visualstudio.com/'
                        },
                        {
                            label: 'Python',
                            to: 'https://www.python.org/'
                        }
                    ]
                },
                {
                    title: 'Meine Schule',
                    items: [
                        {
                            label: 'Passwort Zurücksetzen',
                            to: 'https://password.edubern.ch/'
                        },
                        {
                            label: 'Office 365',
                            to: 'https://office.com'
                        },
                        {
                            label: 'GBSL',
                            to: 'https://gbsl.ch'
                        },
                        {
                            label: 'Intranet',
                            to: 'https://erzbe.sharepoint.com/sites/GYMB/gbs'
                        },
                        {
                            label: 'Stundenplan',
                            to: 'https://mese.webuntis.com/WebUntis/?school=gym_Biel-Bienne#/basic/main'
                        },
                        {
                            label: '🧑🏽‍💻 Anleitungen BYOD / ICT',
                            to: 'https://ict.gbsl.website/'
                        },
                        {
                            label: '⛑️ IT-Support für Schüler*innen',
                            to: 'mailto:it-help-for-students@bernedu.ch'
                        }
                    ]
                }
            ],
            copyright: `<a class="footer__link-item" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de">
                          <img src="/img/by-nc-sa.eu.svg" alt="CC-BY-NC-SA">© ${new Date().getFullYear()} Silas Berger</a> | Ausnahmen sind gekennzeichnet.<br/>
                          <a class="badge badge--primary" href="https://github.com/SilasBerger/teaching-website/commits/${GIT_COMMIT_SHA}">
                            ᚶ ${GIT_COMMIT_SHA.substring(0, 7)}</a>`
        },
        onBrokenLinks: 'warn',
        docs: {
            ...ADMONITION_CONFIG,
            lastVersion: 'current',
            routeBasePath: '',
            versions: versions
        },
        pages: ADMONITION_CONFIG,
        remarkPlugins: REMARK_PLUGINS,
        personalSpaceDocRootId: 'f00a2e3e-c7f9-4dbe-ad02-6546daf72477',
        themeConfig: {
            algolia: {
                appId: 'Q2EWIP1F49',
                apiKey: '8f75046084437d3265e53a6b78c7c2e0',
                indexName: 'classrooms.app',
                searchPagePath: 'search'
            }
        },
        scripts: [
            {
                src: 'https://brr-umami.gbsl.website/script.js',
                ['data-website-id']: process.env.UMAMI_ID,
                ['data-domains']: 'classrooms.app',
                async: true,
                defer: true
            }
        ],
        gitHub: {
            orgName: 'SilasBerger',
            projectName: 'teaching-website'
        }
    } as SiteConfig;
};

export default getSiteConfig;
