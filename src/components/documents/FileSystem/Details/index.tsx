import React, { useRef, useState, type ComponentProps, type ReactElement } from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';

import { useCollapsible, Collapsible } from '@docusaurus/theme-common';

import styles from './styles.module.css';
import iFileSystem from '@site/src/models/documents/FileSystem/iFileSystem';

function isInSummary(node: HTMLElement | null): boolean {
    if (!node) {
        return false;
    }
    return node.tagName === 'SUMMARY' || isInSummary(node.parentElement);
}

function hasParent(node: HTMLElement | null, parent: HTMLElement): boolean {
    if (!node) {
        return false;
    }
    return node === parent || hasParent(node.parentElement, parent);
}

export type DetailsProps = {
    /**
     * Summary is provided as props, optionally including the wrapping
     * `<summary>` tag
     */
    summary: ReactElement | string;
    model: iFileSystem<any>;
    lazy?: boolean;
} & ComponentProps<'details'>;

const Details = ({ summary, model, lazy, children, ...props }: DetailsProps): JSX.Element => {
    const isBrowser = useIsBrowser();
    const detailsRef = useRef<HTMLDetailsElement>(null);

    const { collapsed, setCollapsed } = useCollapsible({
        initialState: !model.isOpen
    });
    // Use a separate state for the actual details prop, because it must be set
    // only after animation completes, otherwise close animations won't work
    // --> use the model directly
    // const [open, setOpen] = useState(props.open);

    const summaryElement = React.isValidElement(summary) ? summary : <summary>{summary}</summary>;

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <details
            {...props}
            ref={detailsRef}
            open={model.isOpen}
            data-collapsed={collapsed}
            className={clsx(
                'alert',
                !/alert--/.test(props.className || '') && 'alert--info',
                styles.details,
                isBrowser && styles.isBrowser,
                props.className
            )}
            onMouseDown={(e) => {
                const target = e.target as HTMLElement;
                // Prevent a double-click to highlight summary text
                if (isInSummary(target) && e.detail > 1) {
                    e.preventDefault();
                }
            }}
            onClick={(e) => {
                e.stopPropagation(); // For isolation of multiple nested details/summary
                const target = e.target as HTMLElement;
                const shouldToggle = isInSummary(target) && hasParent(target, detailsRef.current!);
                if (!shouldToggle) {
                    return;
                }
                e.preventDefault();
                if (collapsed) {
                    setCollapsed(false);
                    model.setIsOpen(true);
                } else {
                    setCollapsed(true);
                    // Don't do this, it breaks close animation!
                    // setOpen(false);
                }
            }}
        >
            {summaryElement}

            <Collapsible
                lazy={!!lazy} // Here we don't care about SEO
                collapsed={collapsed}
                disableSSRStyle // Allows component to work fine even with JS disabled!
                onCollapseTransitionEnd={(newCollapsed) => {
                    setCollapsed(newCollapsed);
                    model.setIsOpen(!newCollapsed);
                }}
            >
                <div className={clsx(styles.collapsibleContent)}>{children}</div>
            </Collapsible>
        </details>
    );
};

export default Details;
