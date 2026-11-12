# Optional module appearance

In Mirror Mischief, open **Module settings → choose a module → Appearance → Visual style**.
Choose **Original** or **Subtle gothic**, then save. Each module instance keeps its
own choice. Opening the editor does not enable or change a style.

Subtle gothic uses dark glass, aged-bronze edges and warm serif headings. Numbers,
status colors and artwork remain readable. Clock, lunar phase and quote treatments
are deliberately lighter than the framed information cards. Transparent full-screen
scene, weather-effect, star-field and layout controllers do not acquire opaque cards.
No extra fonts, services, assets, timers or animation loops are required.

| Standard MagicMirror² setting | Supported values | Default | Meaning |
| --- | --- | --- | --- |
| `classes` | Add `mischief-gothic` to opt in; omit it for Original | No gothic class | Optional gothic treatment |
| `classes` | Optional `mischief-earth-moss`, `-sage`, `-clay`, `-sand`, `-walnut`, `-slate`, `-peat` | Original background | Existing independent card background |

These are **top-level module entry classes**, alongside `position` and `config`.
Existing custom classes are retained by both companion selectors. Selecting Original
removes only `mischief-gothic`; it keeps the module, settings and background preset.

```js
{
  module: "MMM-MCHF-Wit",
  position: "bottom_center",
  classes: "mischief-gothic",
  config: {}
}
```

All MCHF modules bundle `mischief-surfaces.css` for ordinary standalone installation.
MCHF means Mischief. Native/third-party modules can use the companion's shared style
integration; specialized third-party DOM structures may receive only a fine edge.
Verified on the owner's Chromium 154 / MagicMirror² 2.38.0 display and focused UI
checks; other browser versions and every third-party module remain unverified.

Part of [Mirror Mischief](https://github.com/FoggEyez/Mirror-Mischief).
