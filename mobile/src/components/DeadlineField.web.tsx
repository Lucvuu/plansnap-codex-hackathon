// Web deadline picker: the browser's native datetime-local input (as in the PWA).
import { createElement } from 'react';

import { toDatetimeLocalValue } from '@/lib/format';
import { colors, fonts, radii } from '@/theme';

interface Props {
  value: Date;
  onChange: (next: Date) => void;
}

export function DeadlineField({ value, onChange }: Props) {
  return createElement('input', {
    type: 'datetime-local',
    'aria-label': 'Ngày giờ', // used for both a deadline and a fixed start
    value: toDatetimeLocalValue(value),
    onChange: (e: { target: { value: string } }) => {
      const next = new Date(e.target.value);
      if (!isNaN(next.getTime())) onChange(next);
    },
    style: {
      height: 44,
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: radii.md,
      padding: '0 12px',
      fontSize: 14,
      color: colors.text,
      fontFamily: `${fonts.regular}, sans-serif`,
      accentColor: colors.blue,
      outlineColor: colors.blue,
      boxSizing: 'border-box',
      width: '100%',
    },
  });
}
