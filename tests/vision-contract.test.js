'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
global.window = {};
require('../app/js/vision-agent.js');
const VisionAgent = window.VisionAgent;

const validTask = {
  id: 't1', title: 'Nộp bài', source_quote: 'Nộp bài trước 17h', source_image_index: 1,
  deadline_raw: '17h', deadline_iso: '2026-11-20T17:00:00+07:00', needs_confirmation: false,
  question: null, options: [], estimated_minutes: 60, confidence: 0.9
};

test('JSON parser recovers object from surrounding text', () => {
  const parsed = VisionAgent.parseExtraction(`prefix {"tasks":[]} suffix`);
  assert.deepEqual(parsed, { tasks: [] });
});

test('schema validator enforces required evidence and marks low confidence for confirmation', () => {
  const [task] = VisionAgent.validateExtraction({ tasks: [{ ...validTask, confidence: 0.7 }] }, 1);
  assert.equal(task.needs_confirmation, true);
  assert.throws(() => VisionAgent.validateExtraction({ tasks: [{ ...validTask, source_quote: '' }] }, 1));
  assert.throws(() => VisionAgent.validateExtraction({ tasks: [{ ...validTask, source_image_index: 2 }] }, 1));
});
