---
page_id: 3972ba2a-cd84-4f16-81d2-fa8163838838
---
import TaskState from '@tdev-components/documents/TaskState';
import BrowserWindow from '@tdev-components/BrowserWindow';

# Task State

```md
<TaskState id="69fdccb4-9d57-424a-9849-b762f2f48613" />
```
<BrowserWindow>
<TaskState id="69fdccb4-9d57-424a-9849-b762f2f48613" />
</BrowserWindow>

## TaskState Optionen
### Label

```md
<TaskState label="Ein Label" id="c599706c-8422-453d-af02-c23e00686504" />
```
<BrowserWindow>
<TaskState label="Ein Label" id="c599706c-8422-453d-af02-c23e00686504" />
</BrowserWindow>

### Label selber stylen

```md
<TaskState id="f72001d0-71ea-4cb7-a044-61fe09b1fd28">
    Aufgabe auf :mdi[checkbox-marked]{.green} setzen.
</TaskState>
```

<BrowserWindow>
<TaskState id="f72001d0-71ea-4cb7-a044-61fe09b1fd28">
    Aufgabe auf :mdi[checkbox-marked]{.green} setzen.
</TaskState>
</BrowserWindow>

### Zustände selber setzen

Zustände können in beliebiger Reihenfolge und Kombination gesetzt werden. Der erste Zustand ist der Standard-Wert. Folgende Zustände sind möglich:

:mdi[checkbox-blank-outline]
: `unset`
:mdi[account-question-outline]{.orange}
: `question`
:mdi[checkbox-marked-outline]{.green}
: `checked`
:mdi[hexagram-outline]{color=gold}
: `star-empty`
:mdi[star-half-full]{color=gold}
: `star-half`
:mdi[star]{color=gold}
: `star`
```md
<TaskState states={['unset', 'checked']} id="2586e204-29d0-4cb7-b5f8-c786579eb8df"/>
```
<BrowserWindow>
<TaskState states={['unset', 'checked']} id="2586e204-29d0-4cb7-b5f8-c786579eb8df"/>
</BrowserWindow>

### Readonly

TaskState kann nicht verändert werden, wenn `readonly` gesetzt wurde.

```md
<TaskState 
    readonly 
    label="ID nirgends sonst gebraucht" id="f0ebe357-ee78-4b5c-b64d-70faf6c2f80b"
/>
<TaskState 
    readonly
    label="Gleiche ID wie oben"
    id="2586e204-29d0-4cb7-b5f8-c786579eb8df"
/>
```
<BrowserWindow>
<TaskState 
    readonly 
    label="ID nirgends sonst gebraucht" id="f0ebe357-ee78-4b5c-b64d-70faf6c2f80b"
/>
<TaskState 
    readonly
    label="Gleiche ID wie oben"
    id="2586e204-29d0-4cb7-b5f8-c786579eb8df"
/>
</BrowserWindow>


:::info[Gleiche ID]
Wenn [👉 oberhalb](#zustände-selber-setzen) der Zustand verändert wird, wird er auch hier verändert.
:::

### In einer Admonition
Wird innerhalb einer Admonition als erstes Element eine TaskState-Komponente verwendet, wird diese als "Icon" des Admonition-Titels gesetzt.

```md
:::note[Admonition]
<TaskState id="d936a45b-8c22-42b6-abe4-4df6c3be9406" />
Hello aus einer Admonition.
:::
```
<BrowserWindow>

:::note[Admonition]
<TaskState id="d936a45b-8c22-42b6-abe4-4df6c3be9406" />
Hello aus einer Admonition.
:::
</BrowserWindow>


```md
:::note[So Nicht...]
Hello aus einer Admonition.
<TaskState id="d936a45b-8c22-42b6-abe4-4df6c3be9406" />
:::
```
<BrowserWindow>
:::note[So Nicht...]
Hello aus einer Admonition.
<TaskState id="d936a45b-8c22-42b6-abe4-4df6c3be9406" />
:::
</BrowserWindow>


### Temporäre Komponente (nicht persistiert)

Ohne `id` wird der Zustand nicht gespeichert, was mit einem roten Rand markiert.

```md
<TaskState />
```
<BrowserWindow>
<TaskState />
</BrowserWindow>

### Inline-TaskState
Es ist auch möglich, die TaskState-Komponente inline zu verwenden, bspw. in einer Überschrift

```md
## <TaskState inline /> Inline-TaskState
```

<BrowserWindow>
<h2><TaskState inline id="a9a14ffa-3e6e-4288-b2c5-73499d85f4c6" /> Inline-TaskState</h2>
</BrowserWindow>

## Installation

:::info[Code Kopieren]
- `src/models/documents/TaskState.ts`
- `src/components/documents/TaskState`

Für die Übersicht der TaskStates:
- `src/models/Page.ts` (für die TaskState-Übersicht)
- `src/stores/PageStore.ts`
:::

:::info[Konfigurieren]
Der `DocumentType.TaskState` muss unter
- `src/api/document.ts`
- `src/stores/DocumentStore.ts`
registriert/implementiert werden.

Im `src/stores/rootStore.ts` den `PageStore` registrieren.

Die TaskState-Übersicht kann in der Navbar hinzugefügt werden.

```ts title="docusaurus.config.ts" {5-8}
const config: Config = {
    themeConfig: {
        navbar: {
            items: [
                {
                    type: 'custom-taskStateOverview',
                    position: 'left'
                }
            ]
        }
    }
};
```

```ts title="src/theme/NavbarItem/ComponentTypes.tsx" {1,4}
import TaskStateOverview from '@tdev-components/documents/TaskState/TaskStateOverview';
const ComponentTypes: ComponentTypesObject = {
    ..., // andere Komponenten
    ['custom-taskStateOverview']: TaskStateOverview
};

export default ComponentTypes;
```
:::
