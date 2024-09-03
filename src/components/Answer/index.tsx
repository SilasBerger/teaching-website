import * as React from 'react';
import { observer } from 'mobx-react-lite';
import QuillV2 from '../documents/QuillV2';
import String from '../documents/String';
import TaskState from '../documents/TaskState';
import { DocumentType } from '@site/src/api/document';

interface Props {
    id: string;
    type: DocumentType | 'text' | 'state';
    pagePosition?: number;
}

type AnswerProps = Props &
    (
        | React.ComponentProps<typeof QuillV2>
        | React.ComponentProps<typeof String>
        | React.ComponentProps<typeof TaskState>
    );

const Answer = observer((props: AnswerProps) => {
    switch (props.type) {
        case 'text':
        case DocumentType.QuillV2:
            return <QuillV2 {...props} />;
        case DocumentType.String:
            return <String {...props} />;
        case 'state':
        case DocumentType.TaskState:
            return <TaskState {...props} />;
    }
    return (
        <span className="badge badge--danger">
            Unbekannte Komponente <code>{props.type}</code>
        </span>
    );
});

export default Answer;
