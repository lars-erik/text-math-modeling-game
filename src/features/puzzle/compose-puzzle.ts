import type { Problem } from '../problem-model/problem';
import { skins as allSkins, type Skin, type SkinId, type SkinPresentation } from '../skins';
import { modes } from './modes';
import type { ModeId, PuzzleScreen } from './modes';
import type { PuzzleLocale } from './lang';

export type ComposePuzzleOptions = {
  problem: Problem;
  skinId: SkinId;
  modeId: ModeId;
  locale: PuzzleLocale;
  storySeed?: number;
};

export function composePuzzle(options: ComposePuzzleOptions): PuzzleScreen {
  const skin: Skin | undefined = allSkins[options.skinId];
  if (skin === undefined) {
    throw new Error(`Unknown skin ${options.skinId}.`);
  }
  const mode = modes[options.modeId];
  if (mode === undefined) {
    throw new Error(`Unknown mode ${options.modeId}.`);
  }
  const presentation = skin.present({
    problem: options.problem,
    locale: options.locale,
    storySeed: options.storySeed ?? options.problem.replay?.seed ?? 0,
  });
  return mode.start({
    problem: options.problem,
    skin: presentation,
    locale: options.locale,
    replay: options.problem.replay,
  });
}

export function presentSkin(
  skinId: SkinId,
  problem: Problem,
  locale: PuzzleLocale,
  storySeed: number,
): SkinPresentation {
  const skin: Skin | undefined = allSkins[skinId];
  if (skin === undefined) {
    throw new Error(`Unknown skin ${skinId}.`);
  }
  return skin.present({ problem, locale, storySeed });
}
