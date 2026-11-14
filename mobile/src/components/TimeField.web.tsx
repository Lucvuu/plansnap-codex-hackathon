// Web time-of-day picker: the browser's native time input.
import { createElement } from 'react';

import { colors, fonts, radii } from '@/theme';

interface Props {
  value: string; // HH:mm
  onChange: (next: string) => void;
  accessibilityLabel: string;
}

export function TimeField({ value, onChange, accessibilityLabel }: Props) {
  return createElement('input', {
    type: 'time',
    step: 300,
    'aria-label': accessibilityLabel,
    value,
    onChange: (e: { target: { value: string } }) => {
      if (/^\d{2}:\d{2}$/.test(e.target.value)) onChange(e.target.value);
    },
    style: {
      height: 40,
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: radii.md,
      padding: '0 12px',
      fontSize: 14,
      color: colors.text,
      fontFamily: `${fonts.semibold}, sans-serif`,
      fontVariantNumeric: 'tabular-nums',
      accentColor: colors.blue,
      outlineColor: colors.blue,
      boxSizing: 'border-box',
      width: '100%',
    },
  });
}
