import CmsText from '@tdev-components/documents/CmsText';
import WithCmsText from '@tdev-components/documents/CmsText/WithCmsText';
import { observer } from 'mobx-react-lite';

interface Props {
    entries: {
        [key: string]: {
            descriptor: string;
            gradeCmsTextId: string;
        };
    };
}

const ZeugnisnotenTable = observer(({ entries }: Props) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Semester</th>
                    <th>Zeugnisnote</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(entries).map((semesterName: string) => {
                    const semesterData = entries[semesterName];
                    return (
                        <tr>
                            <td>
                                <b>{semesterName}</b> ({semesterData.descriptor})
                            </td>
                            <td>
                                <WithCmsText entries={{ note: semesterData.gradeCmsTextId } as any}>
                                    <strong className="boxed">
                                        <CmsText name="note" />
                                    </strong>
                                </WithCmsText>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
});

export default ZeugnisnotenTable;
