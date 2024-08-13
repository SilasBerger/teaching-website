import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import Figure from '../app/components/Figure';
import TabItem from '@theme/TabItem';
import DefinitionList from "@site/src/app/components/DefinitionList";

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Figure: Figure,
  TabItem: TabItem,
  Dl: DefinitionList,
};
