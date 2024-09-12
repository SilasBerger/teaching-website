---
page_id: d587a55b-f232-461d-8957-98c71d722bf6
---
import String from '@tdev-components/documents/String';
import PermissionsPanel from "@tdev-components/PermissionsPanel"

# String Answers

Einzeilige Texteingabe ohne Formatierung.

```md
<String id="4caa49d4-5385-433e-9651-a48ebed29a9a" />
```

<String id="4caa49d4-5385-433e-9651-a48ebed29a9a" />
<PermissionsPanel documentRootId="4caa49d4-5385-433e-9651-a48ebed29a9a" />

## Label

```md
<String label="Aufgabe 1" id="0c63f1d6-fbd7-42f5-a553-4e3716355083"/>
```

<String label="Aufgabe 1" id="0c63f1d6-fbd7-42f5-a553-4e3716355083"/>


## Platzhalter
```md
<String placeholder="Eine Zahl" id="4612436b-b10e-4e6d-9a40-ea04f701bf87" />
```
<String placeholder="Eine Zahl" id="4612436b-b10e-4e6d-9a40-ea04f701bf87" />

## Standardwert
```md
<String default="Hello World" id="1218a15f-094d-44e9-b5e1-51108d5532a1"/>
```
<String default="Hello World" id="1218a15f-094d-44e9-b5e1-51108d5532a1"/>

## Lösung
Es können auch Lösungen hinterlegt werden um die Eingabe zu überprüfen. Durch einen Klick auf den Button (alternativ mit [[ctrl + :mdi[keyboard-return]]] bzw. [[cmd + :mdi[keyboard-return]]]) wird die Eingabe überprüft.

<String solution="Lösung" placeholder="Die Lösung ist 'Lösung'" id="6970d5f8-0015-40a8-97d4-e576dd1b4b3c"/>

### Textlösung
```md
<String solution="Hello" id="a1eb0082-4eb1-4247-8448-ca971ac02238"/>
```
<String solution="Hello" id="a1eb0082-4eb1-4247-8448-ca971ac02238"/>

:::warning[Beachte Exakte Übereinstimmung]
Hier muss alles exakt übereinstimmen - inkl. Gross- und Kleinschreibung, Leerzeichen, etc.
:::

### Lösung vorbereiten
Die eingebene Lösung wird vor der Überprüfung vorbereitet. Dies kann z.B. genutzt werden um alle Zeichen zu entfernen, die nicht Buchstaben sind.
```md
<String solution="Hello World" sanitizer={(val) => val.toLowerCase().replace(/[^a-zA-Z]/g, '')} id="cd49abd7-e957-49b5-b262-600f98c96b5d" />
```
<String solution="Hello World" sanitizer={(val) => val.toLowerCase().replace(/[^a-zA-Z]/g, '')} id="cd49abd7-e957-49b5-b262-600f98c96b5d" />

:::info[Beachte]
Nun funktioniert auch die Eingabe __HELLO WORLD!__ oder __hello world.__ oder __h e l l o w o r l d__.
:::

## Aussehen verändern

### Setzen der Label-Breite
Wenn mehrere Eingaben übereinander sind und alle die gleiche Label-Breite haben sollen, kann dies mit `labelWidth` erreicht werden.

```md
<String label="Ein Label" labelWidth="12em" id="7e4f1eb8-0fdf-49aa-a8e0-fcb78b454826" />
<String label="Ein seeeehr langes Label" labelWidth="12em" id="ecd0290c-dc12-442c-8a16-3c1e052e92b7" />
```

<String label="Ein Label" labelWidth="12em" id="7e4f1eb8-0fdf-49aa-a8e0-fcb78b454826" />
<String label="Ein seeeehr langes Label" labelWidth="12em" id="ecd0290c-dc12-442c-8a16-3c1e052e92b7" />

### Setzen der Eingabe-Breite
```md
<String label="Lieblingsbuchstabe?" inputWidth="3em" id="30641746-7524-4a1b-b09f-ab19cc993a22" />
```

<String label="Lieblingsbuchstabe?" inputWidth="3em" id="30641746-7524-4a1b-b09f-ab19cc993a22" />

## Label selber stylen
Eigene Label-Komponenten können als `children` übergeben werden.

<String id="006725b9-1256-4221-ae3e-a57baa6a6660" type="tel">
    <span style={{paddingRight: '1.5em'}}>
        :mdi[phone] Telefonnummer
    </span>
</String>

## Text-Typen
Es sind alle HTML5-Input-Typen möglich.

```md
<String type="checkbox" label="checkbox"  />
<String type="color" label="color" default="#3396c7" />
<String type="date" label="date"  />
<String type="datetime-local" label="datetime-local" />
<String type="email" label="email" />
<String type="month" label="month" />
<String type="number" label="number" />
<String type="password" label="password" />
<String type="radio" label="radio" />
<String type="range" label="range" />
<String type="search" label="search" />
<String type="tel" label="tel" />
<String type="text" label="text" />
<String type="time" label="time" />
<String type="url" label="url" />
<String type="week" label="week" />
```

<String type="checkbox" label="checkbox"  hideWarning hideApiState />
<String type="color" label="color" default="#3396c7" hideWarning hideApiState />
<String type="date" label="date"  hideWarning hideApiState />
<String type="datetime-local" label="datetime-local" hideWarning hideApiState />
<String type="email" label="email" hideWarning hideApiState />
<String type="month" label="month" hideWarning hideApiState />
<String type="number" label="number" hideWarning hideApiState />
<String type="password" label="password" hideWarning hideApiState />
<String type="radio" label="radio" hideWarning hideApiState />
<String type="range" label="range" hideWarning hideApiState />
<String type="search" label="search" hideWarning hideApiState />
<String type="tel" label="tel" hideWarning hideApiState />
<String type="text" label="text" hideWarning hideApiState />
<String type="time" label="time" hideWarning hideApiState />
<String type="url" label="url" hideWarning hideApiState />
<String type="week" label="week" hideWarning hideApiState />


## Temporäre Komponente (nicht persistiert)

Ohne `id` wird der Zustand nicht gespeichert, was mit einem :mdi[flash-triangle-outline]{.orange} markiert wird.

```md
<String />
```

<String />


## Weitere Attribute

`hideWarning`
:  Versteckt die Warnung :mdi[flash-triangle-outline]{.orange}, dass es sich um eine temporäre Komponente handelt.
`hideApiState`
: Versteckt den API-Status (Icon das angezeigt wird beim Speichern).
`inline`
: Verwendet anstatt eines Block-Elements (`<div></div>` mit `display: flex`) ein Inline-Element (`<span></span>` mit `display: inline-flex`).
`stateIconsPosition`
: `inside` das Sync-Icon wird innerhalb des Inputs angezeigt (standard für `text`, `email`, `tel` und `url`)
: `outside` rechts neben dem Input (standard für alle anderen Felder)
: `none` Icon wird nicht angezeigt

<String label="inside" stateIconsPosition="inside" />
<String label="outside" stateIconsPosition="outside" />
<String label="none" stateIconsPosition="none" />
