/**
 * TypeScript declarations for non-standard Cloud Phone APIs
 *
 * Cloud Phone extends the standard web platform with custom APIs
 * to support unique device capabilities and hardware constraints.
 *
 * @see https://developer.cloudfone.com/
 */

/**
 * Volume Manager API
 *
 * Controls system volume on Cloud Phone devices. Many Cloud Phone devices
 * lack physical volume rockers, making this API essential for user experience.
 *
 * @remarks
 * - Controls system volume, NOT playback volume
 * - HTMLMediaElement.volume does not work on Cloud Phone
 * - Volume HUD appearance varies by device
 * - While HUD is visible, arrow keys control volume
 *
 * @see https://developer.cloudfone.com/docs/reference/multimedia/#volume-manager-api
 */
interface VolumeManager {
  /**
   * Displays the volume HUD and immediately raises the system volume
   * by one increment.
   *
   * @example
   * ```typescript
   * document.addEventListener("keydown", (e) => {
   *   if (e.key === "1") {
   *     navigator.volumeManager?.requestUp();
   *   }
   * });
   * ```
   *
   * @see https://developer.cloudfone.com/docs/reference/multimedia/#volume-manager-api
   */
  requestUp(): void;

  /**
   * Displays the volume HUD and immediately lowers the system volume
   * by one increment.
   *
   * @example
   * ```typescript
   * document.addEventListener("keydown", (e) => {
   *   if (e.key === "2") {
   *     navigator.volumeManager?.requestDown();
   *   }
   * });
   * ```
   *
   * @see https://developer.cloudfone.com/docs/reference/multimedia/#volume-manager-api
   */
  requestDown(): void;
}

/**
 * Feature names supported by navigator.hasFeature()
 *
 * @remarks
 * Feature names are case-sensitive and must match exactly.
 */
type CloudPhoneFeature =
  | "AudioCapture" // Audio recording via getUserMedia
  | "AudioPlay" // Audio playback via HTMLAudioElement
  | "AudioSeek" // Audio seeking via currentTime
  | "AudioUpload" // Audio file uploads (audio/*)
  | "VideoCapture" // Video recording via getUserMedia
  | "VideoSeek" // Video seeking via currentTime
  | "VideoUpload" // Video file uploads (video/*)
  | "EmbeddedTextInput" // Embedded IME with header/footer
  | "FileDownload" // File downloads via <a download>
  | "FileUpload" // File uploads via <input type="file">
  | "ImageUpload" // Image file uploads (image/*)
  | "SmsScheme" // Support for sms: URI scheme
  | "TelScheme" // Support for tel: URI scheme
  | "Vibrate"; // Vibration hardware support

/**
 * Back Event
 *
 * Fired when the user presses the Right Soft Key (RSK).
 * By default, this navigates back in history or exits the app.
 *
 * @remarks
 * - Call event.preventDefault() to intercept default behavior
 * - If not prevented, app will exit when history is empty
 * - Call window.close() to explicitly quit the widget
 *
 * @see https://developer.cloudfone.com/docs/guides/cloud-phone-design/#back-event
 */
interface BackEvent extends Event {
  readonly type: "back";
}

/**
 * Extended Navigator interface with Cloud Phone-specific APIs
 */
declare global {
  interface Navigator {
    /**
     * Feature Detection API
     *
     * Detects specific Cloud Phone client capabilities so your app
     * can offer the best user experience.
     *
     * @param name - Case-sensitive feature name to check
     * @returns Promise that resolves to `true` if feature is supported
     *
     * @remarks
     * - Available on all Cloud Phone client versions
     * - Invalid feature names resolve to false
     * - Detects software capabilities, not hardware availability or permissions
     * - Always catch exceptions when using detected features
     *
     * @example
     * ```typescript
     * // Check if file downloads are supported
     * const canDownload = await navigator.hasFeature("FileDownload");
     * if (canDownload) {
     *   downloadLink.setAttribute("download", "file.pdf");
     * }
     *
     * // Check if video seeking is supported
     * if (await navigator.hasFeature("VideoSeek")) {
     *   videoScrubber.classList.remove("hidden");
     * }
     *
     * // Check if vibration is supported
     * if (await navigator.hasFeature("Vibrate")) {
     *   navigator.vibrate(200);
     * }
     * ```
     *
     * @see https://developer.cloudfone.com/docs/reference/feature-detection/
     */
    hasFeature(name: CloudPhoneFeature | string): Promise<boolean>;

    /**
     * Volume Manager API
     *
     * Controls system volume on Cloud Phone devices.
     *
     * @remarks
     * - May be undefined on non-Cloud Phone browsers
     * - Controls system volume, not playback volume
     * - HTMLMediaElement.volume does not work on Cloud Phone
     *
     * @example
     * ```typescript
     * // Raise system volume
     * if (navigator.volumeManager) {
     *   navigator.volumeManager.requestUp();
     * }
     * ```
     *
     * @see https://developer.cloudfone.com/docs/reference/multimedia/#volume-manager-api
     */
    volumeManager?: VolumeManager;
  }

  /**
   * Extended WorkerNavigator interface with Cloud Phone-specific APIs
   */
  interface WorkerNavigator {
    /**
     * Feature Detection API (Web Worker context)
     *
     * Same as navigator.hasFeature but available in Web Workers.
     *
     * @param name - Case-sensitive feature name to check
     * @returns Promise that resolves to `true` if feature is supported
     *
     * @see https://developer.cloudfone.com/docs/reference/feature-detection/
     */
    hasFeature(name: CloudPhoneFeature | string): Promise<boolean>;
  }

  /**
   * Extended WindowEventMap with Cloud Phone-specific events
   */
  interface WindowEventMap {
    /**
     * Back Event
     *
     * Fired when the user presses the Right Soft Key (RSK).
     *
     * @example
     * ```typescript
     * window.addEventListener("back", (event) => {
     *   event.preventDefault();
     *   // Handle custom back behavior
     *   goToPreviousScreen();
     * });
     *
     * // Exit confirmation
     * window.addEventListener("back", (event) => {
     *   if (canGoBack) {
     *     event.preventDefault();
     *     goBack();
     *   } else {
     *     window.close(); // Quit widget
     *   }
     * });
     * ```
     *
     * @see https://developer.cloudfone.com/docs/guides/cloud-phone-design/#back-event
     */
    back: BackEvent;
  }

  /**
   * Extended HTMLInputElement with Cloud Phone-specific attributes
   */
  interface HTMLInputElement {
    /**
     * Controls whether text input displays a fullscreen IME dialog.
     *
     * @remarks
     * - "off" disables fullscreen IME (uses embedded input)
     * - Only affects devices that support EmbeddedTextInput feature
     * - Apps disabling fullscreen IME must manually handle keyboard input
     *
     * @example
     * ```typescript
     * const input = document.createElement("input");
     * input.type = "text";
     * input.setAttribute("x-puffin-entersfullscreen", "off");
     * ```
     *
     * @see https://developer.cloudfone.com/docs/reference/feature-detection/#x-puffin-entersfullscreen
     */
    "x-puffin-entersfullscreen"?: "off";
  }

  /**
   * Extended HTMLVideoElement with Cloud Phone-specific attributes
   */
  interface HTMLVideoElement {
    /**
     * Disables the default fullscreen display for video elements.
     *
     * @remarks
     * - By default, Cloud Phone plays all videos in fullscreen
     * - Use for short clips, GIF-like videos, or inline previews
     * - Does not affect video playback controls or functionality
     *
     * @example
     * ```typescript
     * const video = document.createElement("video");
     * video.src = "clip.mp4";
     * video.setAttribute("x-puffin-playsinline", "");
     * video.autoplay = true;
     * video.loop = true;
     * video.muted = true;
     * ```
     *
     * @see https://developer.cloudfone.com/docs/reference/multimedia/#inline-playback
     */
    "x-puffin-playsinline"?: string;

    /**
     * Disables the default fullscreen display for video elements.
     *
     * @remarks
     * - By default, Cloud Phone plays all videos in fullscreen
     * - Use for short clips, GIF-like videos, or inline previews
     * - Does not affect video playback controls or functionality
     *
     * @example
     * ```typescript
     * const video = document.createElement("video");
     * video.src = "clip.mp4";
     * video.playsInline = true;
     * video.autoplay = true;
     * video.loop = true;
     * video.muted = true;
     * ```
     *
     * @see https://developer.cloudfone.com/docs/reference/multimedia/#inline-playback
     */
    playsInline: boolean;
  }
}

/**
 * Module augmentation marker
 * Ensures this file is treated as a module
 */
export {};
