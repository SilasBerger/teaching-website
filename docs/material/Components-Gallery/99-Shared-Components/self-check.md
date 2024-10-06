---
page_id: f632a479-cfe4-4a98-848a-a0dd0e0f6535
---

import SelfCheckTaskState from '@tdev-components/documents/SelfCheck/SelfCheckTaskState';
import SelfCheckSolution from '@tdev-components/documents/SelfCheck/SelfCheckSolution';
import SelfCheckContent from '@tdev-components/documents/SelfCheck/SelfCheckContent';
import SelfCheck from '@tdev-components/documents/SelfCheck';
import { SelfCheckStateType } from '@tdev-components/documents/SelfCheck/models';
import Solution from '@tdev-components/documents/Solution';
import BrowserWindow from '@tdev-components/BrowserWindow';

# Selfcheck

Mit den drei Komponenten `<SelfCheck>`, `<SelfCheckTaskState>` und `<SelfCheckSolution>` lässt sich ein einfaches "Selfcheck-Szenario" (also eine Übung mit Selbstkontrolle) umsetzen:

:::warning[Erforderliche Elemente und Eigenschaften]
In jedem `<SelfCheck>`-Kontext müssen je genau ein `<SelfCheckTaskState>` und eine `<SelfCheckSolution>` verwendet werden. Zudem müssen auf dem `<SelfCheck>`-Element eine `taskStateId` und eine `solutionId` definiert werden.
:::

```md
<SelfCheck taskStateId="841c3390-17d5-42e5-bd9f-e50e46c97625" solutionId="71ed3d23-19d4-4575-9117-9cac09749223">
:::note[Aufgabe 1]
<SelfCheckTaskState />

Erstelle eine Lösung für diese Aufgabe.

<SelfCheckSolution>
Hallo Welt 🌍
</SelfCheckSolution>
:::
</SelfCheck>
```

<BrowserWindow>
<SelfCheck taskStateId="841c3390-17d5-42e5-bd9f-e50e46c97625" solutionId="71ed3d23-19d4-4575-9117-9cac09749223">
:::note[Aufgabe 1]
<SelfCheckTaskState />

Erstelle eine Lösung für diese Aufgabe.

<SelfCheckSolution>
Hallo Welt 🌍
</SelfCheckSolution>
:::
</SelfCheck>
</BrowserWindow>

Die im Task State verfügbaren Zustände sind abhängig davon, ob die Lösung bereits verfügbar ist. Durch die Verwendung der `<SelfCheckSolution>` ist das Lösungselement zudem nur dann sichtbar, wenn sich der Task State im Status _Warten auf Musterlösung_ oder _Korrektur_ befindet (siehe auch [unten](#statusabhängige-sichtbarkeit)). 

Die Interpretation der verschiedenen Zustände ist wie folgt vorgesehen:

| Zustand                                                                                                 | Interpretation                                                                                                                                                                                                   |
|---------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| :mdi[checkbox-blank-outline] Offen                                                                      | Aufgabe in Bearbeitung / noch nicht begonnen.                                                                                                                                                                    |
| :mdi[account-question-outline]{.orange} Frage                                                           | Die Schülerin braucht zur weiteren Bearbeitung die Unterstützung der Lehrperson. Dieser Status ist optional und kann mit `<SelfCheckTaskState includeQuestion={false} />` entfernt werden.                       |
| :mdi[clock-check-outline]{color=var(--ifm-color-secondary-contrast-foreground)} Warten auf Musterlösung | Der Schüler ist mit der Bearbeitung der Aufgabe fertig, die Musterlösung ist jedoch noch nicht verfügbar. Die Lehrperson kann nun die Musterlösung freischalten oder den/die Schüler:in um Überarbeitung bitten. |
| :mdi[progress-check]{color=var(--ifm-color-info)} Korrektur                                             | Die Schülerin ist mit der Bearbeitung der Aufgabe fertig, die Musterlösung ist verfügbar. Die eigene Antwort soll nun mit der Musterlösung verglichen und bei Bedarf verbesser werden.                           |
| :mdi[checkbox-marked-outline]{.green} Fertig                                                            | Die Bearbeitung der Aufgabe ist abgeschlossen - die eigene Antwort des Schülers ist nun vollständig und korrekt.                                                                                                 |

## Statusabhängige Sichtbarkeit
Wenn gewisse Elemente (z.B. die Musterlösung, Hinweise, etc.) nur während bestimmten Zuständen sichtbar sein sollen, eignen sich die Komponenten `<SelfCheckSolution>` (für die Lösung; muss pro `<SelfCheck>` genau einmal vorhanden sein) und `<SelfCheckContent>` (für beliebige Inhalte). Das hier beschriebene Verhalten ist für beide Komponenten identisch. Zusätzlich stehen bei der `<SelfCheckSolution>` auch alle Parameter der [`<Solution>`](./solutions.md) zur Verfügung.

Standardmässig zeigen diese Komponenten ihren Inhalt nur in den Zuständen _Warten auf Musterlösung_ und _Korrektur_ an. Dies kann mit den Eigenschaften `visibleFrom` und `visibleTo` angepasst werden. Es stehen dafür je folgende Konstanten zur Verfügung:

| Zustand                                                                                                 | Konstante                               |
|---------------------------------------------------------------------------------------------------------|-----------------------------------------|
| :mdi[checkbox-blank-outline] Offen                                                                      | `SelfCheckStateType.Open`               |
| :mdi[account-question-outline]{.orange} Frage                                                           | `SelfCheckStateType.Question`           |
| :mdi[clock-check-outline]{color=var(--ifm-color-secondary-contrast-foreground)} Warten auf Musterlösung | `SelfCheckStateType.WaitingForSolution` |
| :mdi[progress-check]{color=var(--ifm-color-info)} Korrektur                                             | `SelfCheckStateType.Reviewing`          |
| :mdi[checkbox-marked-outline]{.green} Fertig                                                            | `SelfCheckStateType.Done`               |

Zudem zeigt sie ihren Inhalt für Lehrpersonen standardmässig immer an. Dieses Verhalten kann mit `<SelfCheckContent alwaysVisibleForTeacher={false}>` (resp. `<SelfCheckSolution alwaysVisibleForTeacher={false}>`) angepasst werden.

Folgendes Beispiel enthält ein Selfcheck-Szenario, in dem die Musterlösung (ausser für Lehrpersonen) nur in den Zuständen _Warten auf Musterlösung_ (als nicht-verfügbar) und _Korrektur_ angezeigt wird. Zudem wird den Zuständen _Frage_, _Warten auf Musterlösung_ und _Korrektur_ je ein spezifischer Hinweis angezeigt. Diese Hinweise sind auch für Lehrpersonen nur im entsprechenden Zustand sichtbar.

```md
<SelfCheck taskStateId="df3313a5-c18f-4220-9dfe-cf4314c1b7b9" solutionId="e92b6f49-396e-48bc-8a6c-4ca94947210d">
:::note[2. Aufgabe]
<SelfCheckTaskState />

Erstelle auch für diese Aufgabe eine Lösung.

<SelfCheckSolution title="Lösung zur Aufgabe 2" open>
Lösung zur zweiten Aufgabe 🥳
</SelfCheckSolution>
:::

<SelfCheckContent alwaysVisibleForTeacher={false} visibleTo={SelfCheckStateType.WaitingForSolution}>
    :::info[Auf Musterlösung warten]
    Die Lehrperson wird dir die Musterlösung bald freischalten.
    :::
</SelfCheckContent>

<SelfCheckContent alwaysVisibleForTeacher={false} visibleFrom={SelfCheckStateType.Reviewing}>
    :::info[Selbstständig korrigieren]
    Vergleiche deine Lösung nun mit der Musterlösung und korrigiere deine Antwort.
    :::
</SelfCheckContent>

<SelfCheckContent alwaysVisibleForTeacher={false} visibleFrom={SelfCheckStateType.Question} visibleTo={SelfCheckStateType.Question}>
    :::info[Frage?]
    Wenn du während des Unterrichts eine Frage hast, dann kannst du jederzeit die Lehrperson rufen.
    :::
</SelfCheckContent>
</SelfCheck>
```

<BrowserWindow>
<SelfCheck taskStateId="df3313a5-c18f-4220-9dfe-cf4314c1b7b9" solutionId="e92b6f49-396e-48bc-8a6c-4ca94947210d">
:::note[2. Aufgabe]
<SelfCheckTaskState />

Erstelle auch für diese Aufgabe eine Lösung.

<SelfCheckSolution title="Lösung zur Aufgabe 2" open>
Lösung zur zweiten Aufgabe 🥳
</SelfCheckSolution>
:::

<SelfCheckContent alwaysVisibleForTeacher={false} visibleTo={SelfCheckStateType.WaitingForSolution}>
    :::info[Auf Musterlösung warten]
    Die Lehrperson wird dir die Musterlösung bald freischalten.
    :::
</SelfCheckContent>

<SelfCheckContent alwaysVisibleForTeacher={false} visibleFrom={SelfCheckStateType.Reviewing}>
    :::info[Selbstständig korrigieren]
    Vergleiche deine Lösung nun mit der Musterlösung und korrigiere deine Antwort.
    :::
</SelfCheckContent>

<SelfCheckContent alwaysVisibleForTeacher={false} visibleFrom={SelfCheckStateType.Question} visibleTo={SelfCheckStateType.Question}>
    :::info[Frage?]
    Wenn du während des Unterrichts eine Frage hast, dann kannst du jederzeit die Lehrperson rufen.
    :::
</SelfCheckContent>
</SelfCheck>
</BrowserWindow>

## Erforderliche Konfiguration
Damit für die Selfcheck TaskStates eine TaskState-Übersicht generiert wird, muss in `docusaurus.config.ts` bei der Konfiguration des `enumerateAnswersPlugin` der Komponententyp `SelfCheckTaskState` registriert werden:
```ts title="docusaurus.config.ts" {4}
[
  enumerateAnswersPlugin,
  {
    componentsToEnumerate: ['SelfCheckTaskState', ...],
  }
]
```