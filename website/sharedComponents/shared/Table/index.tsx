import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

interface HighlightedColumn {
    index: number;
    color: string;
}

interface Props {
    withHeader?: boolean;
    cells: (string | number | boolean | null | undefined)[][];
    className?: string;
    onSelectColumn?: (index: number) => void;
    highlightedColumns?: HighlightedColumn[];
    trimmedCells?: { [key: number]: number };
}

const Table = (props: Props) => {
    const toHighlight = new Map(props.highlightedColumns?.map((c) => [c.index, c.color]) || []);
    const trimmedCells = new Map<number, number>(
        Object.entries(props.trimmedCells || {}).map(([k, v]) => [parseInt(k), v])
    );
    return (
        <table className={clsx(styles.table, props.className, props.onSelectColumn && styles.selecteable)}>
            {props.withHeader && (
                <thead>
                    <tr>
                        {props.cells[0].map((cell, i) => (
                            <th
                                key={i}
                                className={clsx(toHighlight.has(i) && styles.highlight)}
                                style={{ backgroundColor: toHighlight.get(i) }}
                                onClick={(e) => {
                                    if (props.onSelectColumn) {
                                        props.onSelectColumn(i);
                                        e.preventDefault();
                                    }
                                }}
                            >
                                {cell}
                            </th>
                        ))}
                    </tr>
                </thead>
            )}
            <tbody>
                {props.cells.slice(props.withHeader ? 1 : 0).map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, j) => (
                            <td
                                key={j}
                                className={clsx(
                                    toHighlight.has(j) && styles.highlight,
                                    toHighlight.has(j) && `${cell}`.trim().length === 0 && styles.empty
                                )}
                                style={{
                                    backgroundColor:
                                        `${cell}`.trim().length > 0 ? toHighlight.get(j) : undefined
                                }}
                                onClick={(e) => {
                                    if (props.onSelectColumn) {
                                        props.onSelectColumn(j);
                                        e.preventDefault();
                                    }
                                }}
                                title={trimmedCells.has(j) ? `${cell}` : undefined}
                            >
                                {trimmedCells.has(j) ? `${cell}`.substring(0, trimmedCells.get(j)) : cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
