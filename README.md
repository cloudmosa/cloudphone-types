# Cloud Phone Types

Cloud Phone TypeScript type declarations.

## Installation

NPM

```bash
npm install -D @cloudmosa/cloudphone-types
```

PNPM

```bash
pnpm add @cloudmosa/cloudphone-types --save-dev
```

Bun

```bash
bun add --development @cloudmosa/cloudphone-types
```

## Cloud Phone APIs

This document provides a reference for all non-standard APIs specific to Cloud Phone. These are custom APIs that extend standard web APIs to support Cloud Phone's unique features and hardware constraints.

## Table of Contents

- [Feature Detection API](#feature-detection-api)
- [Volume Manager API](#volume-manager-api)
- [Back Event Handler](#back-event-handler)
- [Custom HTML Attributes](#custom-html-attributes)

---

## Feature Detection API

The Feature Detection API allows you to detect specific Cloud Phone client capabilities so your app can offer the best user experience.

### Signature

```typescript
navigator.hasFeature(name: string): Promise<boolean>
```

### Availability

- Available on main thread and Web Workers
- Available on all Cloud Phone client versions
- Feature names are **case-sensitive**

### Supported Features

| Feature             | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `AudioCapture`      | Audio recording using `getUserMedia` is supported                        |
| `AudioPlay`         | Audio playback is supported for `HTMLAudioElement`                       |
| `AudioSeek`         | Audio seeking is supported via `HTMLMediaElement.currentTime`            |
| `AudioUpload`       | Audio uploads are supported using `<input type="file" accept="audio/*">` |
| `VideoCapture`      | Video recording using `getUserMedia` is supported                        |
| `VideoSeek`         | Video seeking is supported via `HTMLMediaElement.currentTime`            |
| `VideoUpload`       | Video uploads are supported using `<input type="file" accept="video/*">` |
| `EmbeddedTextInput` | Embedded text input (IME with header/footer) is supported                |
| `FileDownload`      | File downloads are supported using `<a download>`                        |
| `FileUpload`        | File uploads are supported using `<input type="file">`                   |
| `ImageUpload`       | Image uploads are supported using `<input type="file" accept="image/*">` |
| `SmsScheme`         | Links using `sms:` URI scheme are supported                              |
| `TelScheme`         | Links using `tel:` URI scheme are supported                              |
| `Vibrate`           | Vibration hardware is supported via `navigator.vibrate()`                |

### Example Usage

```javascript
// Check if file downloads are supported
const fileDownloadSupported = await navigator.hasFeature("FileDownload");

if (fileDownloadSupported) {
  downloadLink.setAttribute("download", "podcast.mp3");
  downloadLink.classList.remove("hidden");
}

// Check if video seeking is supported
if (await navigator.hasFeature("VideoSeek")) {
  scrubber.classList.remove("hidden");
}

// Check if vibration is supported
if (await navigator.hasFeature("Vibrate")) {
  navigator.vibrate(200); // Vibrate for 200ms
}
```

### Important Notes

- Feature names are **case-sensitive**
- Invalid feature names resolve to `false`
- This detects software capabilities, not hardware availability or permissions
- Always catch exceptions when using detected features (e.g., `getUserMedia` may throw `NotAllowedError` or `NotFoundError`)

### Documentation

See [Feature Detection](https://developer.cloudfone.com/docs/reference/feature-detection/) for complete documentation.

---

## Volume Manager API

The Volume Manager API allows control of the system volume on Cloud Phone devices. Many Cloud Phone devices lack physical volume rockers, making this API essential for user experience.

### Interface

```typescript
interface VolumeManager {
  requestUp(): void;
  requestDown(): void;
}
```

Available on `navigator.volumeManager` (may be `undefined` on non-Cloud Phone browsers).

### Methods

#### `requestUp()`

Displays the volume HUD and immediately raises the system volume by one increment.

```javascript
navigator.volumeManager.requestUp();
```

#### `requestDown()`

Displays the volume HUD and immediately lowers the system volume by one increment.

```javascript
navigator.volumeManager.requestDown();
```

### Example Usage

```javascript
// Show volume controls when media is playing
document.getElementById("volumeButton").addEventListener("click", () => {
  if (navigator.volumeManager) {
    navigator.volumeManager.requestShow();
  }
});

// Bind volume controls to custom keys
document.addEventListener("keydown", (e) => {
  if (e.key === "1" && navigator.volumeManager) {
    navigator.volumeManager.requestUp();
  } else if (e.key === "2" && navigator.volumeManager) {
    navigator.volumeManager.requestDown();
  }
});
```

### Important Notes

- Controls **system volume**, not playback volume
- `HTMLMediaElement.volume` does not work on Cloud Phone; use `volumeManager` instead
- Volume HUD appearance varies by device (different styles and increment counts)
- While HUD is visible, arrow keys are intercepted for volume control
- Volume HUD automatically dismisses after a few seconds of inactivity

### Documentation

See [Multimedia - Volume Manager API](https://developer.cloudfone.com/docs/reference/multimedia/#volume-manager-api) for complete documentation.

---

## Back Event Handler

The Back Event Handler allows you to override the default behavior of the Right Soft Key (RSK), which normally triggers `history.back()`.

### Event Signature

```typescript
window.addEventListener("back", (event: Event) => void);
```

### Description

The global `"back"` event fires when the user presses the Right Soft Key (RSK). By default, this navigates back in history or exits the app. You can intercept this behavior using `event.preventDefault()`.

### Example Usage

#### Basic Override

```javascript
window.addEventListener("back", (event) => {
  event.preventDefault();
  // Handle custom back behavior
  goToPreviousScreen();
});
```

#### Exit Confirmation

```javascript
window.addEventListener("back", (event) => {
  if (isSomethingToGoBackTo) {
    event.preventDefault();
    // Return to previous page
    goBackInTime();
  } else {
    // Quit widget
    window.close();
  }
});
```

#### Conditional Interception

```javascript
let modalOpen = false;

window.addEventListener("back", (event) => {
  if (modalOpen) {
    event.preventDefault();
    closeModal();
  }
  // If modal is not open, allow default behavior (exit app)
});
```

### Important Notes

- RSK is the physical Right Soft Key on Cloud Phone devices
- Default behavior: `history.back()` or exit app if no history
- Call `event.preventDefault()` to intercept the default behavior
- Call `window.close()` to explicitly quit the widget
- If you don't call `preventDefault()`, the app will exit when history is empty

### Documentation

See [Cloud Phone Design - Soft Keys](https://developer.cloudfone.com/docs/guides/cloud-phone-design/#soft-keys) for complete documentation.

---

## Custom HTML Attributes

Cloud Phone provides custom HTML attributes for controlling specific behaviors.

### `x-puffin-entersfullscreen`

Controls whether text input displays a fullscreen Input Method Editor (IME) dialog.

#### Values

- `"off"` - Disables fullscreen IME (uses embedded input)
- Default - Uses fullscreen IME on devices without embedded input support

#### Usage

```html
<input type="text" x-puffin-entersfullscreen="off" id="customTextInput" />
```

#### When to Use

- Creating custom emoji keyboards
- Building custom input interfaces
- Apps that need to maintain visibility of the input element during editing

#### Example: Custom Emoji Keyboard

```html
<input type="text" x-puffin-entersfullscreen="off" id="emojiInput" />
```

```javascript
const emojiMap = new Map([
  ["1", "😀"],
  ["2", "😃"],
  ["3", "😄"],
]);

const input = document.getElementById("emojiInput");

input.addEventListener("keydown", (e) => {
  const emoji = emojiMap.get(e.key);
  if (emoji) {
    input.value += emoji;
  }
});
```

#### Important Notes

- Only affects devices that support `EmbeddedTextInput` feature
- On devices with fullscreen IME, attribute has no effect
- Apps disabling fullscreen IME must manually handle keyboard input
- Check `await navigator.hasFeature("EmbeddedTextInput")` to detect support

---

### `x-puffin-playsinline`

Disables the default fullscreen display for `<video>` elements.

#### Usage

HTML Attribute

```html
<video x-puffin-playsinline src="video.mp4" controls></video>
```

JavaScript Property

```js
const video = document.createElement("video");
video.playsInline = true;
```

#### When to Use

- Short, small videos (GIF-like clips)
- Inline video previews
- Video thumbnails
- Multi-video layouts

#### Example

```html
<div class="video-grid">
  <video x-puffin-playsinline src="clip1.mp4" autoplay loop muted></video>
  <video x-puffin-playsinline src="clip2.mp4" autoplay loop muted></video>
  <video x-puffin-playsinline src="clip3.mp4" autoplay loop muted></video>
</div>
```

#### Important Notes

- By default, Cloud Phone plays all videos in fullscreen
- Use this attribute for videos that should remain inline
- Particularly useful for short, looping clips or animations
- Does not affect video playback controls or functionality

### Documentation

- [Feature Detection - EmbeddedTextInput](https://developer.cloudfone.com/docs/reference/feature-detection/#embeddedtextinput)
- [Multimedia - Inline Playback](https://developer.cloudfone.com/docs/reference/multimedia/#inline-playback)

---

## TypeScript Support

For TypeScript projects, use the companion `cloudphone.d.ts` declaration file to enable type checking and autocompletion for all Cloud Phone APIs.

```typescript
// Include in your project
/// <reference path="./cloudphone.d.ts" />

// Or add to tsconfig.json
{
  "include": ["cloudphone.d.ts"]
}
```

---

## Additional Resources

- [Cloud Phone Developer Portal](https://developer.cloudfone.com/)
- [Cloud Phone Architecture](https://developer.cloudfone.com/docs/guides/architecture/)
- [Cloud Phone Design Guide](https://developer.cloudfone.com/docs/guides/cloud-phone-design/)
- [Developer Console](https://www.cloudphone.tech/auth/sign-in)

## License

[Apache 2.0](./LICENSE)
