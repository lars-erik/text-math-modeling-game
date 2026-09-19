export {
  isSkinId,
  skinIds,
  type Skin,
  type SkinFact,
  type SkinId,
  type SkinPresentation,
} from './skin';
export { dronePowerSkin } from './gaming-drone-power/skin';
export { creatorFollowersSkin } from './creator-followers/skin';
import type { Skin, SkinId } from './skin';
import { dronePowerSkin } from './gaming-drone-power/skin';
import { creatorFollowersSkin } from './creator-followers/skin';

export const skins: Readonly<Record<SkinId, Skin>> = {
  'gaming.drone-power': dronePowerSkin,
  'creator.followers': creatorFollowersSkin,
};
