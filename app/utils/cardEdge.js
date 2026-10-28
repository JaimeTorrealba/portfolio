import { reactive } from "vue";
import { usePaneStore } from "@/stores/pane";

// Settings of the cards' torn, grainy edge (the SVG filter in CardFrame.vue). Shared and
// module-level so values tuned in the debug pane survive closing and reopening a card.
export const cardEdgeOptions = reactive({
  tear: 15.5, // px the outline is pushed in and out
  tearSize: 0.031, // frequency of the tear noise: lower = wider bumps
  fringe: 2.75, // px blur of the rim the grain eats into
  grain: 0, // how much the grain breaks up the rim
  grainSize: 0.05, // frequency of the grain: higher = finer specks
  hardness: 1.4, // how fast the rim turns solid going inwards
  colour: "#000000",
  opacity: 1,
});

// Adds the "Card Edge" folder once; the pane only exists on #debug.
let isPaneRegistered = false;
export const registerCardEdgePane = () => {
  const pane = usePaneStore().pane;
  if (!pane || isPaneRegistered) return;
  isPaneRegistered = true;
  const folder = pane.addFolder({ title: "Card Edge", expanded: false });
  folder.addBinding(cardEdgeOptions, "tear", { min: 0, max: 40, step: 0.5 });
  folder.addBinding(cardEdgeOptions, "tearSize", { min: 0.002, max: 0.15, step: 0.001 });
  folder.addBinding(cardEdgeOptions, "fringe", { min: 0, max: 20, step: 0.25 });
  folder.addBinding(cardEdgeOptions, "grain", { min: 0, max: 3, step: 0.05 });
  folder.addBinding(cardEdgeOptions, "grainSize", { min: 0.05, max: 2, step: 0.01 });
  folder.addBinding(cardEdgeOptions, "hardness", { min: 1, max: 6, step: 0.1 });
  folder.addBinding(cardEdgeOptions, "colour");
  folder.addBinding(cardEdgeOptions, "opacity", { min: 0, max: 1, step: 0.01 });
  // To copy the values found back into the defaults above.
  folder.addButton({ title: "Log values" }).on("click", () => console.log({ ...cardEdgeOptions }));
};
