import React from 'react';
import styles from './styles.module.scss';
import clsx from 'clsx';
import * as MDI from '@mdi/js';
import Icon from '@mdi/react';
import _ from 'lodash';
import {WEEK_DAYS} from "@site/src/helpers/time";

export enum Type {
  Holiday = 'holiday',
  Event = 'event',
  Test = 'test',
  Info = 'info'
}

const ICON_MAPPING: { [key in Type]: string } = {
  [Type.Holiday]: MDI.mdiIsland,
  [Type.Event]: MDI.mdiCalendar,
  [Type.Test]: MDI.mdiSchool,
  [Type.Info]: MDI.mdiInformation,
}

interface CellProps {
  value: string | JSX.Element;
  icon?: JSX.Element;
  align?: "left" | "center" | "right" | "justify" | "char";
  date?: Date;
}


const toDateString = (date: Date) => {
  const day = date.getDay()
  return (
    <span style={{ fontFamily: 'monospace' }}>
            {WEEK_DAYS[day]}. {String(date.getDate()).padStart(2, '0')}.{String(date.getMonth() + 1).padStart(2, '0')}.
        </span>)
}
export class Cell extends React.Component<CellProps> {

  render() {
    const { align, icon, date } = this.props;
    var value = this.props.value;
    if (date) {
      value = toDateString(date);
    }
    return (
      <td align={align} className={clsx(styles.cell)}>{value}{icon ? ' ' : ''}{icon}</td>
    )
  }
}

export interface iRow {
  cells: (string | JSX.Element)[];
  // type?: Type; TODO: Fix this.
  type?: string;
  className?: string;
  color?: string;
  icon?: string;
}

interface RowProps extends iRow {
  alignments?: ("left" | "center" | "right" | "justify" | "char")[];
  dateIndex?: number;
}

const getDate = (date: String) => {
  const parts = date.match(/(?<d>\d+)\.(?<m>\d+)\.(?<y>\d+)/);
  if (!parts || !parts.groups) {
    return;
  }
  return new Date(`${parts.groups.y}-${parts.groups.m}-${parts.groups.d}`);

}

const weekNumber = (date: Date) => {
  var oneJan = new Date(date.getFullYear(), 0, 1);
  var numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil(numberOfDays / 7) + 1;
}



export class Row extends React.Component<RowProps> {
  icon(): JSX.Element {
    if (this.props.icon) {
      return <Icon path={MDI[_.camelCase(this.props.icon)] || MDI.mdiProgressQuestion} size={0.5} />
    } else if (this.props.type) {
      return <Icon path={ICON_MAPPING[this.props.type]} size={0.5} />
    }
  }
  render() {
    const { type, cells } = this.props;
    const props: any = { className: [] }
    if (this.props.className) {
      props.className.push(this.props.className);
    }
    if (type) {
      props.className.push(styles[type]);
    }

    var date = undefined;
    if (this.props.dateIndex !== undefined && this.props.dateIndex >= 0) {
      const c = cells[this.props.dateIndex];
      if (typeof c === 'string') {
        date = getDate(c);
        if (date && weekNumber(new Date()) === weekNumber(date)) {
          props.className.push(`${props.className} ${styles.currentWeek}`)
        }
      }
    }

    return (
      <tr {...props} className={clsx(...props.className)} style={{ background: this.props.color }}>
        {
          cells.map((cell, idx) => {
            const cellProps: CellProps = { value: cell }
            if (idx === 0) {
              cellProps.icon = this.icon();
            }
            if (this.props.alignments && this.props.alignments.length > idx) {
              cellProps.align = this.props.alignments[idx];
            } else {
              cellProps.align = 'left';
            }
            return <Cell {...cellProps} key={idx} date={this.props.dateIndex === idx ? date : undefined} />
          })
        }
      </tr>
    );
  }
}

interface TableProps {
  header?: string[];
  rows: iRow[];
  alignments?: ("left" | "center" | "right" | "justify" | "char")[];
  size?: 'tiny' | 'small' | 'normal' | 'large';
  compact?: boolean;
  celled?: boolean;
  striped?: boolean;
  collapsing?: boolean;
  selectable?: boolean;
  order?: (rows: iRow[]) => iRow[]
}

export default class Table extends React.Component<TableProps> {
  render() {
    const dateIndex = (this.props.header || []).indexOf('Datum');
    const rows = this.props.order ? this.props.order(this.props.rows) : this.props.rows;
    return (
      <table
        style={{ display: 'table', borderCollapse: 'collapse' }}
        className={clsx(
          styles['ofi-table'],
          styles[this.props.size],
          styles[this.props.compact && 'compact'],
          styles[this.props.celled && 'celled'],
          styles[this.props.striped && 'striped'],
          styles[this.props.collapsing && 'collapsing'],
          styles[this.props.selectable && 'selectable']
        )}
      >
        <thead>
        {
          this.props.header && (
            <tr>
              {
                this.props.header.map((cell, idx) => {
                  const align = (this.props.alignments?.length || 0) > idx ? this.props.alignments[idx] : 'left';
                  return <th align={align} key={idx}>{cell}</th>
                })

              }
            </tr>
          )
        }
        </thead>
        <tbody>
        {
          rows.map((row, idx) => {
            return <Row alignments={this.props.alignments} {...row} key={idx} dateIndex={dateIndex} />
          })
        }
        </tbody>
      </table>
    )
  }
}
