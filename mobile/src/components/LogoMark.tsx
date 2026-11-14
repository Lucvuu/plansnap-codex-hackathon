// PlanSnap logo mark: viewfinder corners (Snap) around a calendar pad (Plan).
import { View, type ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme';

interface Props {
  /** Edge length in pt; the mark fills the box, so add clear space (≥ size / 8) around it. */
  size?: number;
  /** Single-colour override, e.g. '#fff' on a brand-blue tile. */
  color?: ColorValue;
}

// Geometry of assets/brand/logo-mark.svg, with the right-hand bracket caps made round like the left ones.
const MARK =
  'M264 404A28 28 0 0 1 208 404L208 304A96 96 0 0 1 304 208L404 208A28 28 0 0 1 404 264L312 264A48 48 0 0 0 264 312Z' +
  'M620 208A28 28 0 0 0 620 264L712 264A48 48 0 0 1 760 312L760 404A28 28 0 0 0 816 404L816 304A96 96 0 0 0 720 208Z' +
  'M208 620A28 28 0 0 1 264 620L264 712A48 48 0 0 0 312 760L404 760A28 28 0 0 1 404 816L304 816A96 96 0 0 1 208 720Z' +
  'M816 620A28 28 0 0 0 760 620L760 712A48 48 0 0 1 712 760L620 760A28 28 0 0 0 620 816L720 816A96 96 0 0 0 816 720Z' +
  // Calendar pad; even-odd fill cuts out the header slit and the day cell.
  'M388 324L636 324A56 56 0 0 1 692 380L692 644A56 56 0 0 1 636 700L388 700A56 56 0 0 1 332 644L332 380A56 56 0 0 1 388 324Z' +
  'M332 424L692 424L692 456L332 456Z' +
  'M444 512L580 512A20 20 0 0 1 600 532L600 620A20 20 0 0 1 580 640L444 640A20 20 0 0 1 424 620L424 532A20 20 0 0 1 444 512Z';

export function LogoMark({ size = 32, color = colors.blue }: Props) {
  return (
    <View accessible role="img" accessibilityLabel="PlanSnap" style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="208 208 608 608">
        <Path d={MARK} fill={color} fillRule="evenodd" />
      </Svg>
    </View>
  );
}
