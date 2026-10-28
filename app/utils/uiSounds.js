import { useMainStore } from "@/stores";

// Only these files are imported from uisfx, never its JS runtime (createUISFX), which
// carries the recipes for every pack. `?url` makes Vite emit just these small MP3s (2-3 KB
// each) and hand back their URLs; the rest of the package never reaches the build.
import scifiHoverUrl from "uisfx/sounds/scifi/hover.mp3?url";
import scifiDragStartUrl from "uisfx/sounds/scifi/drag-start.mp3?url";
import scifiDropUrl from "uisfx/sounds/scifi/drop.mp3?url";

const UI_SOUND_VOLUME = 0.5;

// Each Audio is created on its first play rather than at load, like the other sounds in
// SoundToggle.vue. Restarts rather than layers when the same sound fires again quickly.
// play() rejects when the browser blocks playback; a missed UI sound is not worth reporting.
const createUISound = (url) => {
  let audio = null;
  return () => {
    if (!audio) {
      audio = new Audio(url);
      audio.volume = UI_SOUND_VOLUME;
    }
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };
};

const playHoverSound = createUISound(scifiHoverUrl);
export const playCardOpenSound = createUISound(scifiDragStartUrl);
export const playCardCloseSound = createUISound(scifiDropUrl);

// UI sounds stay silent unless the visitor chose the full experience or unmuted.
export const isUISoundOn = () => useMainStore().soundPreference === "on";

// For @pointerenter on the menu buttons and the social links. Mouse only: on touch,
// pointerenter fires with the tap, which already opens the card or the link.
export const playHoverSoundOnMouseEnter = (event) => {
  if (event.pointerType !== "mouse" || !isUISoundOn()) return;
  playHoverSound();
};
