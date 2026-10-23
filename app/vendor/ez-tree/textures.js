import * as THREE from 'three';

import birchAo from './assets/bark/birch_ao_1k.jpg';
import birchColor from './assets/bark/birch_color_1k.jpg';
import birchNormal from './assets/bark/birch_normal_1k.jpg';
import birchRoughness from './assets/bark/birch_roughness_1k.jpg';

import oakAo from './assets/bark/oak_ao_1k.jpg';
import oakColor from './assets/bark/oak_color_1k.jpg';
import oakNormal from './assets/bark/oak_normal_1k.jpg';
import oakRoughness from './assets/bark/oak_roughness_1k.jpg';

import pineAo from './assets/bark/pine_ao_1k.jpg';
import pineColor from './assets/bark/pine_color_1k.jpg';
import pineNormal from './assets/bark/pine_normal_1k.jpg';
import pineRoughness from './assets/bark/pine_roughness_1k.jpg';

import willowAo from './assets/bark/willow_ao_1k.jpg';
import willowColor from './assets/bark/willow_color_1k.jpg';
import willowNormal from './assets/bark/willow_normal_1k.jpg';
import willowRoughness from './assets/bark/willow_roughness_1k.jpg';

import ashLeaves from './assets/leaves/ash_color.png';
import aspenLeaves from './assets/leaves/aspen_color.png';
import oakLeaves from './assets/leaves/oak_color.png';
import pineLeaves from './assets/leaves/pine_color.png';

// LOCAL CHANGE (see README.md): upstream called loadTexture() on all 20 files when this
// module was imported, so every bark and leaf set downloaded and decoded whatever tree
// was built. Each texture now loads the first time a tree asks for it, and is shared
// from then on, the same way the eager version shared one instance per file.
const textureLoader = new THREE.TextureLoader();

const barkUrls = {
  birch: { ao: birchAo, color: birchColor, normal: birchNormal, roughness: birchRoughness },
  oak: { ao: oakAo, color: oakColor, normal: oakNormal, roughness: oakRoughness },
  pine: { ao: pineAo, color: pineColor, normal: pineNormal, roughness: pineRoughness },
  willow: { ao: willowAo, color: willowColor, normal: willowNormal, roughness: willowRoughness },
};

const leafUrls = {
  ash: ashLeaves,
  aspen: aspenLeaves,
  oak: oakLeaves,
  pine: pineLeaves,
};

const texturesByUrl = new Map();

/**
 * @param {string} url Path to texture
 * @param {boolean} srgb Set to true to set texture color space to SRGB
 * @returns {THREE.Texture}
 */
const loadTexture = (url, srgb = true) => {
  const texture = textureLoader.load(url);
  texture.premultiplyAlpha = true;
  if (srgb) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  return texture;
};

const getTextureByUrl = (url, srgb) => {
  if (!texturesByUrl.has(url)) texturesByUrl.set(url, loadTexture(url, srgb));
  return texturesByUrl.get(url);
};

/**
 * Gets a bark texture for the specified bark type
 * @param {string} barkType
 * @param {'ao' | 'color' | 'normal' | 'roughness'} fileType
 * @param {THREE.Vector2} scale
 * @returns {THREE.Texture}
 */
export const getBarkTexture = (barkType, fileType, scale = { x: 1, y: 1 }) => {
  // Only the colour map holds colour; ao, normal and roughness are linear data.
  const texture = getTextureByUrl(barkUrls[barkType][fileType], fileType === 'color');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = scale.x;
  texture.repeat.y = 1 / scale.y;
  return texture;
};

/**
 * Gets the leaf texture for the specified leaf type
 * @param {string} leafType
 * @returns {THREE.Texture}
 */
export const getLeafTexture = (leafType) => getTextureByUrl(leafUrls[leafType], true);
