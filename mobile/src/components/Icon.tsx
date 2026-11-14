// Stroke icons copied from the PWA's inline SVGs (Feather icon set).
import type { ColorValue } from 'react-native';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

export type IconName =
  | 'calendar'
  | 'camera'
  | 'image'
  | 'tasks'
  | 'settings'
  | 'check'
  | 'edit'
  | 'trash'
  | 'download'
  | 'eye'
  | 'eye-off'
  | 'close'
  | 'plus'
  | 'external'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-left';

interface Props {
  name: IconName;
  size?: number;
  color?: ColorValue;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, color = '#111827', strokeWidth = 2 }: Props) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {renderIcon(name, common)}
    </Svg>
  );
}

function renderIcon(name: IconName, p: object) {
  switch (name) {
    case 'calendar':
      return (
        <>
          <Rect x="3" y="4" width="18" height="18" rx="2" {...p} />
          <Line x1="16" y1="2" x2="16" y2="6" {...p} />
          <Line x1="8" y1="2" x2="8" y2="6" {...p} />
          <Line x1="3" y1="10" x2="21" y2="10" {...p} />
        </>
      );
    case 'camera':
      return (
        <>
          <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...p} />
          <Circle cx="12" cy="13" r="4" {...p} />
        </>
      );
    case 'image':
      return (
        <>
          <Rect x="3" y="3" width="18" height="18" rx="2" {...p} />
          <Circle cx="8.5" cy="8.5" r="1.5" {...p} />
          <Polyline points="21 15 16 10 5 21" {...p} />
        </>
      );
    case 'tasks':
      return (
        <>
          <Path d="M9 11l3 3L22 4" {...p} />
          <Path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" {...p} />
        </>
      );
    case 'settings':
      return (
        <>
          <Circle cx="12" cy="12" r="3" {...p} />
          <Path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            {...p}
          />
        </>
      );
    case 'check':
      return <Polyline points="20 6 9 17 4 12" {...p} />;
    case 'edit':
      return (
        <>
          <Path d="M12 20h9" {...p} />
          <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" {...p} />
        </>
      );
    case 'trash':
      return (
        <>
          <Polyline points="3 6 5 6 21 6" {...p} />
          <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" {...p} />
          <Path d="M10 11v6M14 11v6" {...p} />
        </>
      );
    case 'download':
      return (
        <>
          <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...p} />
          <Polyline points="7 10 12 15 17 10" {...p} />
          <Line x1="12" y1="15" x2="12" y2="3" {...p} />
        </>
      );
    case 'eye':
      return (
        <>
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...p} />
          <Circle cx="12" cy="12" r="3" {...p} />
        </>
      );
    case 'eye-off':
      return (
        <>
          <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" {...p} />
          <Line x1="1" y1="1" x2="23" y2="23" {...p} />
        </>
      );
    case 'close':
      return (
        <>
          <Line x1="18" y1="6" x2="6" y2="18" {...p} />
          <Line x1="6" y1="6" x2="18" y2="18" {...p} />
        </>
      );
    case 'plus':
      return (
        <>
          <Line x1="12" y1="5" x2="12" y2="19" {...p} />
          <Line x1="5" y1="12" x2="19" y2="12" {...p} />
        </>
      );
    case 'chevron-down':
      return <Polyline points="6 9 12 15 18 9" {...p} />;
    case 'chevron-right':
      return <Polyline points="9 18 15 12 9 6" {...p} />;
    case 'chevron-left':
      return <Polyline points="15 18 9 12 15 6" {...p} />;
    case 'external':
      return (
        <>
          <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" {...p} />
          <Polyline points="15 3 21 3 21 9" {...p} />
          <Line x1="10" y1="14" x2="21" y2="3" {...p} />
        </>
      );
  }
}
