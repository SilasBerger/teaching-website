---
page_id: 98798b41-86ab-49c1-a3fc-21939df16a98
---
import BrowserWindow from '@tdev-components/BrowserWindow';

# Antworten

Um Antworten einzuholen, kann die überall verfügbare Komponente `Answer` verwendet werden (sie muss nicht importiert werden). Abhängig vom übergebenen Typ wird die Antwort in einer anderen Form dargestellt.

`string`
: `<String />` Komponente [String](./string-answers.md)
: Einzeilige Antwort
`text`
: `<QuillV2 />` Komponente [QuillV2](./quill-v2.md)
: Mehrzeilige Antwort mit WYSIWYG-Editor
: optionaler Typ: `quill-v2`
`state`
: `<TaskState />` Komponente [TaskState](./task-state.md)
: Zustandsauswahl
: optionaler Typ: `task-state`



```md
<Answer type="state" label="Fertig?" id="5404e731-fd66-42d9-9f61-0299df6a032b" />
<Answer type="string" id="259a2608-ee20-4f76-b558-09bf9871c235" />
<Answer type="text" id="c85a2c52-cdce-42ad-82c9-9924b3a9fa61" />
```

<BrowserWindow>
    <Answer type="state" label="Fertig?" id="5404e731-fd66-42d9-9f61-0299df6a032b" />
    <Answer type="string" id="259a2608-ee20-4f76-b558-09bf9871c235" />
    <Answer type="text" id="be8bc52f-deac-4a84-95c9-60e4d18011b9" />
</BrowserWindow>

## Installation

:::info[Code]
- `src/components/Answer`
:::

:::info[`src/theme/MDXComponents.tsx`]
```tsx
import Answer from '@tdev-components/Answer';
```
:::

:::info[`src/theme/MDXComponents.tsx`]
```tsx {2,7}
import MDXComponents from '@theme-original/MDXComponents';
import Answer from '@tdev-components/Answer';

export default {
  // Re-use the default mapping
  ...MDXComponents,
    Answer: Answer,
};
```
:::
