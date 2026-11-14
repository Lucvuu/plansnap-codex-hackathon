// Web time-of-day picker: the browser's native time input.
import { createElement } from 'react';

import { colors } from '@/theme';

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
      borderRadius: 10,
      padding: '0 12px',
      fontSize: 13.5,
      color: colors.text,
      fontFamily: 'BeVietnamPro_400Regular, sans-serif',
      fontVariantNumeric: 'tabular-nums',
      boxSizing: 'border-box',
      width: '100%',
    },
  });
}
