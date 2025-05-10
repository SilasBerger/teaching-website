// import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import DefinitionList from '@tdev-components/DefinitionList';
import DefBox from '@tdev-components/CodeDefBox';
import DefHeading from '@tdev-components/CodeDefBox/DefHeading';
import DefContent from '@tdev-components/CodeDefBox/DefContent';
import Figure from '@tdev-components/Figure';
import SourceRef from '@tdev-components/Figure/SourceRef';
import Answer from '@tdev-components/Answer';
import Solution from '@tdev-components/documents/Solution';
import MdxComment from '@tdev-components/documents/MdxComment';
import MdxPage from '@tdev-components/MdxPage';

export default {
    // Re-use the default mapping
    ...MDXComponents,
    Dl: DefinitionList,
    DefBox: DefBox,
    DefHeading: DefHeading,
    DefContent: DefContent,
    Figure: Figure,
    SourceRef: SourceRef,
    Answer: Answer,
    Solution: Solution,
    MdxPage: MdxPage,
    MdxComment: MdxComment
};
