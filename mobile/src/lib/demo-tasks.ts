// Deterministic demo extraction results used when no Gemini API key is set
// (ported from VisionAgent.simulateExtraction / extractHandwrittenPrompt).
import type { Task } from './types';

function nextWeekday(now: Date, weekday: number): Date {
  const d = new Date(now);
  d.setDate(now.getDate() + ((weekday + 7 - now.getDay()) % 7 || 7));
  return d;
}

export function buildStudentDemoTasks(now: Date = new Date()): Task[] {
  const nextFri = nextWeekday(now, 5);
  nextFri.setHours(17, 0, 0, 0);

  const nextNextFri = new Date(nextFri);
  nextNextFri.setDate(nextFri.getDate() + 7);

  const thisSun = nextWeekday(now, 0);
  thisSun.setHours(23, 59, 0, 0);

  const nextTue = nextWeekday(now, 2);
  nextTue.setHours(8, 0, 0, 0);

  const stamp = now.getTime();
  return [
    {
      id: `task_zalo_${stamp}`,
      title: 'Nộp bản cuối tiểu luận Marketing',
      source_quote: 'Hạn nộp bản cuối tiểu luận trước 17h thứ 6 tuần sau nha cả nhóm',
      source_image_index: 1,
      deadline_raw: '17h thứ 6 tuần sau',
      deadline_iso: null,
      needs_confirmation: true,
      question: '“Thứ 6 tuần sau” trong tin nhắn Zalo là ngày nào?',
      options: [nextFri.toISOString(), nextNextFri.toISOString()],
      estimated_minutes: 180,
      confidence: 0.82,
    },
    {
      id: `task_lms_${stamp + 1}`,
      title: 'Hoàn thành Quiz 4 Kinh tế vi mô',
      source_quote: 'LMS Canvas: Quiz 4 closes Sunday at 23:59',
      source_image_index: 2,
      deadline_raw: 'Chủ Nhật 23:59',
      deadline_iso: thisSun.toISOString(),
      needs_confirmation: false,
      question: null,
      options: [],
      estimated_minutes: 45,
      confidence: 0.96,
    },
    {
      id: `task_slide_${stamp + 2}`,
      title: 'Nộp slide thuyết trình Case Study 2',
      source_quote: 'Các nhóm nộp slide trước giờ vào lớp (08h00 thứ 3 tuần tới)',
      source_image_index: 3,
      deadline_raw: 'Thứ Ba 08:00',
      deadline_iso: nextTue.toISOString(),
      needs_confirmation: false,
      question: null,
      options: [],
      estimated_minutes: 120,
      confidence: 0.88,
    },
  ];
}

export function buildHandwrittenDemoTask(now: Date = new Date()): Task {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);

  return {
    id: `task_bgk_${now.getTime()}`,
    title: 'Nộp báo cáo tài chính dự án',
    source_quote: 'Ghi chú viết tay: "Nộp báo cáo tài chính trước 14h ngày mai"',
    source_image_index: 1,
    deadline_raw: '14h ngày mai',
    deadline_iso: tomorrow.toISOString(),
    needs_confirmation: false,
    question: null,
    options: [],
    estimated_minutes: 60,
    confidence: 0.94,
  };
}
