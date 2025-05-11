import React from 'react';

// https://icon-sets.iconify.design/mdi/fire/
export function DangerIcon(): React.JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M17.66 11.2c-.23-.3-.51-.56-.77-.82c-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32c-2.59 2.08-3.61 5.75-2.39 8.9c.04.1.08.2.08.33c0 .22-.15.42-.35.5c-.23.1-.47.04-.66-.12a.58.58 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5c.14.6.41 1.2.71 1.73c1.08 1.73 2.95 2.97 4.96 3.22c2.14.27 4.43-.12 6.07-1.6c1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26m-3.16 6.3c-.28.24-.74.5-1.1.6c-1.12.4-2.24-.16-2.9-.82c1.19-.28 1.9-1.16 2.11-2.05c.17-.8-.15-1.46-.28-2.23c-.12-.74-.1-1.37.17-2.06c.19.38.39.76.63 1.06c.77 1 1.98 1.44 2.24 2.8c.04.14.06.28.06.43c.03.82-.33 1.72-.93 2.27"
            />
        </svg>
    );
}

// https://icon-sets.iconify.design/mdi/alert/
export function WarningIcon(): React.JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M13 14h-2V9h2m0 9h-2v-2h2M1 21h22L12 2z" />
        </svg>
    );
}

// https://icon-sets.iconify.design/mdi/check-circle/
export function SuccessIcon(): React.JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>check-circle</title>
            <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
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

// https://icon-sets.iconify.design/mdi/lightbulb-on-outline/
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

// https://icon-sets.iconify.design/mdi/lead-pencil/
export function AufgabeIcon(): React.JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M16.84 2.73c-.39 0-.77.15-1.07.44l-2.12 2.12l5.3 5.31l2.12-2.1c.6-.61.6-1.56 0-2.14L17.9 3.17c-.3-.29-.68-.44-1.06-.44M12.94 6l-8.1 8.11l2.56.28l.18 2.29l2.28.17l.29 2.56l8.1-8.11m-14 3.74L2.5 21.73l6.7-1.79l-.24-2.16l-2.31-.17l-.18-2.32"
            />
        </svg>
    );
}

// https://icon-sets.iconify.design/mdi/flask-outline/
export function ExperimentIcon(): React.JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M5 19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1c0-.21-.07-.41-.18-.57L13 8.35V4h-2v4.35L5.18 18.43c-.11.16-.18.36-.18.57m1 3a3 3 0 0 1-3-3c0-.6.18-1.16.5-1.63L9 7.81V6a1 1 0 0 1-1-1V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1v1.81l5.5 9.56c.32.47.5 1.03.5 1.63a3 3 0 0 1-3 3zm7-6l1.34-1.34L16.27 18H7.73l2.66-4.61zm-.5-4a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5a.5.5 0 0 1-.5-.5a.5.5 0 0 1 .5-.5"
            />
        </svg>
    );
}

// https://icon-sets.iconify.design/mdi/hand-pointing-up/
export function TipIcon(): React.JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M14 3v10l3.2-1.69l.22-.03c.29 0 .55.12.74.32l.74.77l-4.9 4.2c-.26.27-.61.43-1 .43H6.5c-.77 0-1.5-.7-1.5-1.5v-4.36c0-.61.35-1.14.85-1.34l4.94-2.2L12 7.47V3a1 1 0 0 1 1-1a1 1 0 0 1 1 1M5 19h8v3H5z"
            />
        </svg>
    );
}
