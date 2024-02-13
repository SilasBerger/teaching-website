import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import Figure from '../app/components/Figure';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Figure: Figure,
};
