# Lunar Labs Dither Machine (web port)

This is a JavaScript/HTML port of the wonderful [Dither Machine by Lunar Labs](https://lunarlabs.itch.io/dither-machine). This is a Unity project to create dithered gradients. It was [released as open source](https://lunarlabs.itch.io/dither-machine/devlog/72198/dither-machine-is-now-open-source) in 2019.

[Dither Machine on Github](https://github.com/Relfos/Dither_Machine)

The core code is in [DitherEditor.cs](https://github.com/Relfos/Dither_Machine/blob/master/Assets/Scripts/DitherEditor.cs) and [Dither.cs](https://github.com/Relfos/Dither_Machine/blob/master/Assets/Scripts/Dither.cs).

This port is a React app running with Vite. It was created with the [Vite React quickstart template](https://vitejs.dev/guide/#community-templates).

I referenced [this helpful article](https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258) for working with `<canvas>` in React.

## Features

A few features from the original Unity app are incomplete.

- [x] Linear gradients
  - [x] Changing the gradient angle
- [ ] Radial gradients
  - [ ] Changing the gradient offset
  - [ ] Changing the gradient scale
- [ ] Paste-in image to dither
- [x] Bayer dither patterns
- [ ] Image-mask dither patterns
- [ ] Rotating the dither mask
- [x] Editable colors
- [x] Changing the number of dither steps
- [ ] Changing color percentages in the gradient
  - [ ] Equalizing the color percentages
- [ ] Swapping color palettes (gameboy, amber, CMYK, rainbow, etc)
- [x] Exporting images
- [x] Changing the canvas size
- [ ] View the undithered gradient in black and white

## Other possible improvements

- save your custom color palette for later
- paste in a hex value to change the color
- able to type in all input fields next to sliders
