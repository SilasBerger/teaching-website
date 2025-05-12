import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import type { Props } from '@theme/Admonition';

import styles from './styles.module.scss';
import {
    DangerIcon,
    DefinitionIcon,
    InsightIcon,
    KeyIcon,
    InfoIcon,
    WarningIcon,
    AufgabeIcon,
    SuccessIcon
} from '@tdev/theme/Admonition/icons';

type AdmonitionType =
    | 'danger'
    | 'warning'
    | 'success'
    | 'key'
    | 'definition'
    | 'insight'
    | 'info'
    | 'aufgabe';

type AdmonitionConfig = {
    iconComponent: React.ComponentType;
    infimaClassName: string;
    label: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
const AdmonitionConfigs: Record<AdmonitionType, AdmonitionConfig> = {
    danger: {
        infimaClassName: 'danger',
        iconComponent: DangerIcon,
        label: 'Danger'
    },
    warning: {
        infimaClassName: 'warning',
        iconComponent: WarningIcon,
        label: 'Warning'
    },
    info: {
        infimaClassName: 'secondary',
        iconComponent: InfoIcon,
        label: 'Info'
    },
    success: {
        infimaClassName: 'success',
        iconComponent: SuccessIcon,
        label: 'Success'
    },
    key: {
        infimaClassName: 'definition',
        iconComponent: KeyIcon,
        label: 'Key'
    },
    definition: {
        infimaClassName: 'definition',
        iconComponent: DefinitionIcon,
        label: 'Definition'
    },
    insight: {
        infimaClassName: 'info',
        iconComponent: InsightIcon,
        label: 'Insight'
    },
    aufgabe: {
        infimaClassName: 'aufgabe',
        iconComponent: AufgabeIcon,
        label: 'Aufgabe'
    }
};

// Legacy aliases, undocumented but kept for retro-compatibility
const aliases = {
    finding: 'key',
    note: 'info',
    tip: 'info'
};

function getAdmonitionConfig(unsafeType: string): AdmonitionConfig {
    const type = (aliases as { [key: string]: Props['type'] })[unsafeType] ?? unsafeType;
    const config = (AdmonitionConfigs as { [key: string]: AdmonitionConfig })[type];
    if (config) {
        return config;
    }
    console.warn(`No admonition config found for admonition type "${type}". Using Info as fallback.`);
    return AdmonitionConfigs.info;
}

// Workaround because it's difficult in MDX v1 to provide a MDX title as props
// See https://github.com/facebook/docusaurus/pull/7152#issuecomment-1145779682
function extractMDXAdmonitionTitle(children: ReactNode): {
    mdxAdmonitionTitle: ReactNode | undefined;
    rest: ReactNode;
} {
    const items = React.Children.toArray(children);
    const mdxAdmonitionTitle = items.find(
        (item) =>
            React.isValidElement(item) &&
            (item.props as { mdxType: string } | null)?.mdxType === 'mdxAdmonitionTitle'
    );
    const rest = <>{items.filter((item) => item !== mdxAdmonitionTitle)}</>;
    return {
        mdxAdmonitionTitle,
        rest
    };
}

function processAdmonitionProps(props: Props): Props {
    const { mdxAdmonitionTitle, rest } = extractMDXAdmonitionTitle(props.children);
    return {
        ...props,
        title: props.title ?? mdxAdmonitionTitle,
        children: rest
    };
}

export default function Admonition(props: Props): JSX.Element {
    const { children, type, title, icon: iconProp } = processAdmonitionProps(props);

    const typeConfig = getAdmonitionConfig(type);
    const titleLabel = title ?? typeConfig.label;
    const { iconComponent: IconComponent } = typeConfig;
    const icon = iconProp ?? <IconComponent />;
    return (
        <div
            className={clsx(
                ThemeClassNames.common.admonition,
                ThemeClassNames.common.admonitionType(props.type),
                'alert',
                `alert--${typeConfig.infimaClassName}`,
                styles.admonition,
                styles[props.type]
            )}
        >
            <div className={styles.admonitionHeading}>
                <span className={styles.admonitionIcon}>{icon}</span>
                {titleLabel}
            </div>
            <div className={styles.admonitionContent}>{children}</div>
        </div>
    );
}
