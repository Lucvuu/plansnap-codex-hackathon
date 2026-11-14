// Web deadline picker: the browser's native datetime-local input (as in the PWA).
import { createElement } from 'react';

import { toDatetimeLocalValue } from '@/lib/format';
import { colors } from '@/theme';

interface Props {
  value: Date;
  onChange: (next: Date) => void;
}

export function DeadlineField({ value, onChange }: Props) {
  return createElement('input', {
    type: 'datetime-local',
    'aria-label': 'Hạn chót',
    value: toDatetimeLocalValue(value),
    onChange: (e: { target: { value: string } }) => {
      const next = new Date(e.target.value);
      if (!isNaN(next.getTime())) onChange(next);
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
      boxSizing: 'border-box',
      width: '100%',
    },
  });
}
