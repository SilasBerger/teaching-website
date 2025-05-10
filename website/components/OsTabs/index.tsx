import React from 'react';
import Tabs from '@theme/Tabs';

type OsType = 'win10' | 'win11' | 'win' | 'mac' | 'osx';
interface Props {
    os?: OsType[];
    children: React.ReactElement[];
}

const OS_MAP: { [key in OsType]: string } = {
    mac: 'macOS',
    osx: 'macOS',
    win: 'Windows',
    win10: 'Windows 10',
    win11: 'Windows 11'
};

const getValues = (os: OsType[]) => {
    return os.map((t) => ({ label: OS_MAP[t], value: t }));
};

const OsTabs = (props: Props) => {
    const tabs = Array.isArray(props.children)
        ? props.children.map((tab) => tab.props.value)
        : ['win11', 'win10', 'macOS'];
    return (
        <Tabs
            groupId="operating-systems"
            defaultValue={props.os ? props.os[0] : tabs[0]}
            values={getValues(props.os || tabs)}
            lazy
        >
            {props.children}
        </Tabs>
    );
};

export default OsTabs;
