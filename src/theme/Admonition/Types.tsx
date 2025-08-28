import React from 'react';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import AdmonitionLayout from '@theme/Admonition/Layout';
import clsx from 'clsx';
import styles from './types.module.scss';

function AufgabeIcon() {
    return (
        <svg viewBox="0 0 576 512">
            <path
                fill="currentColor"
                d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"
            ></path>
        </svg>
    );
}

export function InsightIcon(): React.JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M20 11h3v2h-3zM1 11h3v2H1zM13 1v3h-2V1zM4.92 3.5l2.13 2.14l-1.42 1.41L3.5 4.93zm12.03 2.13l2.12-2.13l1.43 1.43l-2.13 2.12zM12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1zm-3-3h2v-2.13c1.73-.44 3-2.01 3-3.87a4 4 0 0 0-4-4a4 4 0 0 0-4 4c0 1.86 1.27 3.43 3 3.87z"
            />
        </svg>
    );
}

// https://icon-sets.iconify.design/mdi/crown-outline/
export function KeyIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="m12 8l3 5.2l3-2.7l-.7 3.5H6.7L6 10.5l3 2.7zm0-4l-3.5 6L3 5l2 11h14l2-11l-5.5 5zm7 14H5v1c0 .6.4 1 1 1h12c.6 0 1-.4 1-1z"
            />
        </svg>
    );
}

// https://icon-sets.iconify.design/mdi/script-text-outline/
export function DefinitionIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M15 20a1 1 0 0 0 1-1V4H8a1 1 0 0 0-1 1v11H5V5a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v1h-2V5a1 1 0 0 0-1-1a1 1 0 0 0-1 1v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-1h11a2 2 0 0 0 2 2M9 6h5v2H9zm0 4h5v2H9zm0 4h5v2H9z"
            />
        </svg>
    );
}

// https://icon-sets.iconify.design/mdi/hand-pointing-up/
export function InfoIcon(): React.JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M11 7v2h2V7zm3 10v-2h-1v-4h-3v2h1v2h-1v2zm8-5c0 5.5-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2s10 4.5 10 10m-2 0c0-4.42-3.58-8-8-8s-8 3.58-8 8s3.58 8 8 8s8-3.58 8-8"
            />
        </svg>
    );
}

function AufgabeAmonition(props: any) {
    return (
        <AdmonitionLayout
            icon={<AufgabeIcon />}
            title="Aufgabe"
            {...props}
            className={clsx('alert', 'alert--info', props.className, styles.aufgabe)}
        >
            {props.children}
        </AdmonitionLayout>
    );
}

function InsightAmonition(props: any) {
    return (
        <AdmonitionLayout
            icon={<InsightIcon />}
            title="Insight"
            {...props}
            className={clsx('alert', 'alert--info', props.className, styles.insight)}
        >
            {props.children}
        </AdmonitionLayout>
    );
}

function KeyAmonition(props: any) {
    return (
        <AdmonitionLayout
            icon={<KeyIcon />}
            title="Key"
            {...props}
            className={clsx('alert', 'alert--info', props.className, styles.key)}
        >
            {props.children}
        </AdmonitionLayout>
    );
}

function DefinitionAmonition(props: any) {
    return (
        <AdmonitionLayout
            icon={<DefinitionIcon />}
            title="Definition"
            {...props}
            className={clsx('alert', 'alert--info', props.className, styles.definition)}
        >
            {props.children}
        </AdmonitionLayout>
    );
}

function InfoAmonition(props: any) {
    return (
        <AdmonitionLayout
            icon={<InfoIcon />}
            title="Info"
            {...props}
            className={clsx('alert', 'alert--secondary', props.className, styles.info)}
        >
            {props.children}
        </AdmonitionLayout>
    );
}

const AdmonitionTypes = {
    ...DefaultAdmonitionTypes,

    aufgabe: AufgabeAmonition,
    insight: InsightAmonition,
    key: KeyAmonition,
    definition: DefinitionAmonition,

    info: InfoAmonition,
    tip: InfoAmonition,
    note: InfoAmonition
};

export default AdmonitionTypes;
