import { useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Admonition from '@theme/Admonition';
import { useLocation } from '@docusaurus/router';
import Button from '@tdev-components/shared/Button';
import Badge from '@tdev-components/shared/Badge';
import { useStore } from '@tdev-hooks/useStore';
import { mdiFileDownloadOutline, mdiFilePdfBox, mdiFileUploadOutline } from '@mdi/js';
import { ScavengerHuntStore } from '../../stores/ScavengerHuntStore';
import styles from './Admin.module.scss';
import Select from 'react-select';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import DefinitionList from '@tdev-components/DefinitionList';

const ScavengerHuntAdmin = observer(() => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const excelInputRef = useRef<HTMLInputElement>(null);
    const location = useLocation();
    const scavengerHuntStore = (
        useStore('siteStore') as unknown as { scavengerHuntStore: ScavengerHuntStore }
    ).scavengerHuntStore;
    const [isPreparingPdf, setIsPreparingPdf] = useState(false);
    const [isPreparingCsv, setIsPreparingCsv] = useState(false);
    const [pdfError, setPdfError] = useState<string | null>(null);

    const gameOptions = useMemo(() => {
        return scavengerHuntStore.importedGameIds.map((gameId) => ({
            value: gameId,
            label: gameId
        }));
    }, [scavengerHuntStore.importedGameIds.join('|')]);

    const verifyBaseUrl = useMemo(() => {
        if (typeof window === 'undefined') {
            return '';
        }

        const normalizedPath = location.pathname.replace(/\/$/, '');
        return `${window.location.origin}${normalizedPath}`;
    }, [location.pathname]);

    const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        try {
            const yamlContent = await file.text();
            scavengerHuntStore.importConfigFromYaml(yamlContent, file.name);
        } catch {
            // errors are exposed through the store
        } finally {
            event.target.value = '';
        }
    };

    const handleExcelSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        try {
            await scavengerHuntStore.importExcelFromFile(file);
        } catch {
            // errors are exposed through the store
        } finally {
            event.target.value = '';
        }
    };

    const downloadCsvExport = () => {
        if (!scavengerHuntStore.canExportCsv) {
            return;
        }

        setIsPreparingCsv(true);

        try {
            const { csvText, fileName } = scavengerHuntStore.buildCsvExportForSelectedGame();
            const blob = new Blob(['\ufeff', csvText], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 0);
        } catch {
            // errors are exposed through the store
        } finally {
            setIsPreparingCsv(false);
        }
    };

    const openPrintableQrCodes = async () => {
        if (!scavengerHuntStore.canGenerateQrCodes) {
            return;
        }

        // Open immediately in the click handler context to avoid popup blockers.
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            setPdfError('Die Druckansicht konnte nicht geöffnet werden.');
            return;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>Druckansicht wird vorbereitet</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 24px;
                            color: #111827;
                        }
                    </style>
                </head>
                <body>
                    <h1>Druckansicht wird vorbereitet...</h1>
                    <p>Bitte einen Moment warten.</p>
                </body>
            </html>
        `);
        printWindow.document.close();

        setPdfError(null);
        setIsPreparingPdf(true);

        try {
            const tileElements = Array.from(
                document.querySelectorAll('[data-scavenger-qr-tile-inner="true"]')
            );
            const tileImages = await Promise.all(
                tileElements.map((element) =>
                    toPng(element as HTMLElement, {
                        cacheBust: true,
                        pixelRatio: 2,
                        backgroundColor: '#ffffff'
                    })
                )
            );

            printWindow.document.write(`
                <html>
                    <head>
                        <title>QR-Codes ${scavengerHuntStore.selectedImportedGameId || ''}</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 24px;
                                color: #111827;
                            }
                            h1 {
                                margin: 0 0 16px;
                                font-size: 20px;
                            }
                            p {
                                margin: 0 0 24px;
                                color: #4b5563;
                            }
                            .grid {
                                display: grid;
                                grid-template-columns: repeat(2, minmax(0, 1fr));
                                gap: 18px;
                            }
                            .tile {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                padding: 12px;
                                border: 1px solid #d1d5db;
                                border-radius: 16px;
                                break-inside: avoid;
                            }
                            .tile img {
                                max-width: 100%;
                                height: auto;
                                display: block;
                            }
                            @media print {
                                body {
                                    margin: 12mm;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <h1>QR-Codes für ${scavengerHuntStore.selectedImportedGameId || ''}</h1>
                        <div class="grid">
                            ${tileImages
                                .map(
                                    (src) => `
                                        <div class="tile">
                                            <img src="${src}" alt="QR-Code" />
                                        </div>
                                    `
                                )
                                .join('')}
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.onload = () => {
                printWindow.print();
            };
        } catch (error) {
            setPdfError(
                error instanceof Error ? error.message : 'Die Druckansicht konnte nicht vorbereitet werden.'
            );
        } finally {
            setIsPreparingPdf(false);
        }
    };

    return (
        <div className={styles.adminPage}>
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Admin-Tools</h2>
                    <p>
                        Laden Sie die Konfigurationsdatei Ihrer Schnitzeljagd hoch. Die Datei wird direkt
                        geprüft und in den Store eingelesen.
                    </p>
                </div>

                <div className={styles.uploadCard}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".yml,.yaml"
                        className={styles.hiddenInput}
                        onChange={handleFileSelection}
                    />

                    <div className={styles.uploadActions}>
                        <Button
                            icon={mdiFileUploadOutline}
                            iconSide="left"
                            color="primary"
                            text="YAML-Datei auswählen"
                            onClick={() => fileInputRef.current?.click()}
                        />
                        <span className={styles.hint}>
                            Erlaubt sind Dateien mit den Endungen .yml und .yaml.
                        </span>
                    </div>

                    {scavengerHuntStore.importedConfigFileName && (
                        <div className={styles.statusRow}>
                            <Badge type="primary">Datei: {scavengerHuntStore.importedConfigFileName}</Badge>
                            <Badge type="success">
                                {scavengerHuntStore.importedGameCount} Spiele,{' '}
                                {scavengerHuntStore.importedStationCount} Posten
                            </Badge>
                        </div>
                    )}
                </div>

                {scavengerHuntStore.importError && (
                    <Admonition type="danger" title="Datei konnte nicht geladen werden">
                        {scavengerHuntStore.importError}
                    </Admonition>
                )}

                {scavengerHuntStore.importedConfig && (
                    <div className={styles.selectField}>
                        <label htmlFor="scavenger-hunt-game-select">Spiel auswählen</label>
                        <Select
                            inputId="scavenger-hunt-game-select"
                            classNamePrefix="scavenger-select"
                            options={gameOptions}
                            value={
                                gameOptions.find(
                                    (option) => option.value === scavengerHuntStore.selectedImportedGameId
                                ) || null
                            }
                            onChange={(option) =>
                                scavengerHuntStore.setSelectedImportedGameId(option?.value || null)
                            }
                            isSearchable={false}
                        />
                    </div>
                )}
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3>QR-Codes generieren</h3>
                    <p>
                        Wählen Sie ein Spiel aus. Für alle Posten dieses Spiels werden automatisch QR-Codes
                        zur Verify-Seite erzeugt.
                    </p>
                </div>

                {!scavengerHuntStore.importedConfig && (
                    <Admonition type="info" title="Noch keine Daten geladen">
                        Laden Sie zuerst erfolgreich eine YAML-Datei hoch. Danach können Sie hier ein Spiel
                        auswählen und die QR-Codes erzeugen.
                    </Admonition>
                )}

                {scavengerHuntStore.importedConfig && (
                    <>
                        <div className={styles.qrToolbar}>
                            <div className={styles.qrActions}>
                                <Button
                                    icon={mdiFilePdfBox}
                                    iconSide="left"
                                    color="primary"
                                    text={
                                        isPreparingPdf
                                            ? 'Druckansicht wird vorbereitet...'
                                            : 'Druckansicht / PDF'
                                    }
                                    disabled={!scavengerHuntStore.canGenerateQrCodes || isPreparingPdf}
                                    onClick={() => openPrintableQrCodes()}
                                />
                                <span className={styles.hint}>
                                    Über den Browser-Druckdialog können Sie die QR-Codes als PDF speichern.
                                </span>
                            </div>
                        </div>

                        {!!pdfError && (
                            <Admonition type="danger" title="Druckansicht fehlgeschlagen">
                                {pdfError}
                            </Admonition>
                        )}

                        {scavengerHuntStore.canGenerateQrCodes && (
                            <div className={styles.qrGrid}>
                                {scavengerHuntStore.selectedImportedStations.map((station) => {
                                    const qrUrl = `${verifyBaseUrl}?game_id=${encodeURIComponent(
                                        station.gameId
                                    )}&station_id=${encodeURIComponent(station.id)}`;

                                    return (
                                        <a
                                            key={`${station.gameId}-${station.id}`}
                                            className={styles.qrTile}
                                            href={qrUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            data-scavenger-qr-tile="true"
                                        >
                                            <div
                                                className={styles.qrTileInner}
                                                data-scavenger-qr-tile-inner="true"
                                            >
                                                <QRCodeSVG value={qrUrl} size={180} includeMargin />
                                                <div className={styles.qrTileLabel}>
                                                    Posten-ID: {station.id}
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3>CSV-Export vorbereiten</h3>
                    <p>
                        Laden Sie die von MSForms exportierte Excel-Datei hoch. Anschließend wird sie anhand
                        der geladenen Konfiguration bereinigt, angereichert und als CSV exportiert.
                    </p>
                </div>

                {!scavengerHuntStore.importedConfig && (
                    <Admonition type="info" title="Noch keine Daten geladen">
                        Laden Sie zuerst erfolgreich die YAML-Konfiguration hoch. Erst danach können Sie die
                        Excel-Datei importieren und CSV-Dateien erzeugen.
                    </Admonition>
                )}

                {scavengerHuntStore.importedConfig && (
                    <>
                        <div className={styles.uploadCard}>
                            <input
                                ref={excelInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                className={styles.hiddenInput}
                                onChange={handleExcelSelection}
                            />

                            <div className={styles.uploadActions}>
                                <Button
                                    icon={mdiFileUploadOutline}
                                    iconSide="left"
                                    color="primary"
                                    text="Excel-Datei auswählen"
                                    disabled={!scavengerHuntStore.importedConfig}
                                    onClick={() => excelInputRef.current?.click()}
                                />
                                <span className={styles.hint}>
                                    Erwartet wird die MSForms-Excel-Datei mit den in der Konfiguration
                                    definierten Spaltennamen.
                                </span>
                            </div>

                            {scavengerHuntStore.importedExcelFileName && (
                                <div className={styles.statusRow}>
                                    <Badge type="primary">
                                        Datei: {scavengerHuntStore.importedExcelFileName}
                                    </Badge>
                                    <Badge type="success">
                                        {scavengerHuntStore.importedExcelRowCount} Einträge verarbeitet
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {scavengerHuntStore.importedExcelError && (
                            <Admonition type="danger" title="Excel-Datei konnte nicht geladen werden">
                                {scavengerHuntStore.importedExcelError}
                            </Admonition>
                        )}

                        {scavengerHuntStore.importedExcelFileName && (
                            <div className={styles.excelProcessorContainer}>
                                <div className={styles.previewCard}>
                                    <div className={styles.exportSummary}>
                                        {!scavengerHuntStore.selectedImportedGameId && (
                                            <Badge type="primary">'Kein Spiel gewählt'</Badge>
                                        )}
                                        <Button
                                            icon={mdiFileDownloadOutline}
                                            iconSide="left"
                                            color="primary"
                                            text={
                                                isPreparingCsv
                                                    ? 'CSV wird erstellt...'
                                                    : `CSV herunterladen (${scavengerHuntStore.selectedImportedExcelRowCount} Zeilen)`
                                            }
                                            disabled={!scavengerHuntStore.canExportCsv || isPreparingCsv}
                                            onClick={() => downloadCsvExport()}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {scavengerHuntStore.exportedCsvError && (
                            <Admonition type="danger" title="CSV-Export fehlgeschlagen">
                                {scavengerHuntStore.exportedCsvError}
                            </Admonition>
                        )}
                    </>
                )}
            </section>
        </div>
    );
});

export default ScavengerHuntAdmin;
