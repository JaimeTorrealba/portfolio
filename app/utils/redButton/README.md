# Red button

Procedural dark-fantasy button, used as the cards' Close button (`CardFrame.vue`). HTML,
CSS, SVG and vanilla ES modules only: no images, no dependencies, no `Math.random()`.
Everything is generated from a numeric seed, so the same seed always draws the same thing.

- Styles: `red-button.css`. Global on purpose: the module creates its own elements.

## Red button

```html
<button class="cf-btn" type="button">Cancel</button>
```

```js
import { createRedButton } from './red-button.js'

const button = createRedButton(buttonElement, { seed: 42, variant: 'danger' })
button.setLabel('Retreat')
button.update({ variant: 'primary', chipCount: 3 })
button.setSeed(43)
button.destroy()
```

| Option | Default | |
| --- | --- | --- |
| `seed` | `1337 + 101` | `CardFrame.vue` passes the card seed + 101, so every card's button is different |
| `variant` | `'danger'` | `'danger'` (blood red) or `'primary'` (dark gold) |
| `wobble` | `0.6` | px amplitude of the outline displacement |
| `chipCount` | `2` | notches in the rim |
| `scratchCount` | `2` | hairline scratches on the rim |
| `grain` | `0.5` | 0–1 strength of the lacquer grain |
| `palette` | variant's | `{ faceTop, faceBottom, outline, highlight, rim, metalLight, metalDark, text, glow }`; any subset overrides the variant |
| `lightAngle` | `225` | deg |
| `bake` | `'auto'` | see Bake mode |
| `interactive` | `true` | pointer highlight on the face |
| `lazy` | `false` | wait until the button nears the viewport |
| `label` | – | replaces the label text |
| `labelMaxWidth` | `14em` | longer labels end in an ellipsis |

### Layers

- `.cf-btn__art`: plate and face with every filter. It is a live `<svg>`, or the baked `<img>`.
- `.cf-btn__overlay`: unfiltered strokes. The bevel lines use `--hl` / `--sh`, and the worn
  inner outline carries the ember pulse.
- `.cf-btn__shine`: pointer highlight, clipped to the face.
- `.cf-btn__label`: real DOM text, never filtered.

## States

Every state is CSS on top of the art that was rendered once. No state re-runs an SVG
filter, and all of them work the same on a baked button.

| State | What changes |
| --- | --- |
| Hover (pointer devices) | art `filter: brightness(1.12) saturate(1.1)`, red glow (`::before`, `--cf-btn-glow`), shine |
| Pressed | `translateY(1px)`, `brightness(.9)`, bevel swapped (`--hl: .15`, `--sh: .8`), less glow |
| Focus-visible | 2px outline in `--cf-btn-text`, 3px outside the button, never clipped |
| Disabled | art and overlay `grayscale(.8) brightness(.6)`, no glow, no pulse, `not-allowed` cursor |
| Reduced motion | no ember pulse, no shine, no press transition |

CSS variables: `--cf-btn-text`, `--cf-btn-glow` (set from the palette), `--hl`, `--sh` and
`--cf-btn-label-max`.

## Bake mode

`bake: true` rasterises the SVG once (Blob → Image → canvas at `devicePixelRatio`,
capped at 2) and swaps in an `<img>`. While a resize bakes the new size, the button keeps
its old art. Bitmaps are cached by seed, size, DPR, variant and the visual options, so
buttons that match share one bitmap. `'auto'` bakes only in Safari, where the
lighting filters are slow. If baking fails (for example, a tainted canvas), the live SVG
stays. The CSS fallback (`.cf-btn--fallback`: gradient face, 3px border, inset bevel) is
used when the browser has no SVG lighting filters.

The overlay is never baked. It is small and unfiltered except for one turbulence mask,
which is what lets the pressed bevel and the ember pulse work on a baked button.

## Accessibility

- The button is a real `<button>`: Tab, Enter, Space, forms and screen readers work as
  usual. A button with no `type` gets `type="button"`, and an explicit type is kept, so
  `type="submit"` still submits its form.
- All the art is `aria-hidden`. The etched duplicate of the label is a `::before` with
  empty alt text (`content: attr(data-label) / ""`), so it is not read out twice.
- The label is selectable text with no filter, displacement or blend mode on it.
- The hit area is at least 44px tall (`::after`), even though the art is 36px.
- Nothing around the button hides overflow, so the focus ring is never clipped.

## Fonts

Only system fonts are used: `"Cinzel", "Trajan Pro", "Palatino Linotype", Georgia, serif`.
To use Cinzel, load it yourself (an `@font-face` rule or a `<link>` to a font host), and
the stack picks it up first.
