---
page_id: d38be43d-eb1a-43f0-8b8b-42d9336fa726
---
import BrowserWindow from '@tdev-components/BrowserWindow';

# Medien Einfügen

Folgende Quellen werden aktuell unterstützt:
- video
- audio
- youtube
- circuitverse
- learningapps

```md
::video[./assets/yogi-bear.mp4]{width=100% height=200px}

::audio[./assets/sound.mp3]
@by [KAM HESARI - Chill](https://freemusicarchive.org/music/kam-hesari/single/chill-3/)

::youtube[https://www.youtube.com/embed/QPZ0pIK_wsc?si=fP8L8fYQ-TYgYwUe]

::circuitverse[https://circuitverse.org/simulator/embed/rothe-inverter]

::learningapps[https://learningapps.org/7863213]
```

<BrowserWindow>
::video[./assets/yogi-bear.mp4]{width=100% height=200px}
</BrowserWindow>
<BrowserWindow>
::audio[./assets/sound.mp3]

@by [KAM HESARI - Chill](https://freemusicarchive.org/music/kam-hesari/single/chill-3/)
</BrowserWindow>
<BrowserWindow>
::youtube[https://www.youtube.com/embed/QPZ0pIK_wsc?si=fP8L8fYQ-TYgYwUe]
</BrowserWindow>
<BrowserWindow>
::circuitverse[https://circuitverse.org/simulator/embed/rothe-inverter]
</BrowserWindow>
<BrowserWindow>
::learningapps[https://learningapps.org/7863213]
</BrowserWindow>


## Installation

:::info[Code]
- `src/plugins/remark-media`
:::

:::info[`docusaurus.config.ts]

```ts
import mediaPlugin from './src/plugins/remark-media/plugin';

const REMARK_PLUGINS = [
    /* ... */
    mediaPlugin
];
```
:::
