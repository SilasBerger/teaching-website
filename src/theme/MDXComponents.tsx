import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import Figure from '@tdev-components/Figure';
import DefinitionList from "@tdev-components/DefinitionList";
import DefBox from '@tdev-components/CodeDefBox';
import DefHeading from '@tdev-components/CodeDefBox/DefHeading';
import DefContent from '@tdev-components/CodeDefBox/DefContent';
import SourceRef from '@tdev-components/Figure/SourceRef';
import Answer from '@tdev-components/Answer';
import Solution from '@tdev-components/documents/Solution';
import TabItem from "@theme/TabItem";
import MdxPage from "@tdev-components/MdxPage";
import MdxComment from '@tdev-components/documents/MdxComment';

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
  TabItem: TabItem,
  MdxPage: MdxPage,
  MdxComment: MdxComment
};
