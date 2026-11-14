// Tab 4 — Cài đặt (Gemini key + model, free-time windows, local data)
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Button, Card, GroupLabel, InlineAlert, LinkButton } from '@/components/ui';
import { MODEL_OPTIONS } from '@/lib/gemini';
import { SLOT_OPTIONS } from '@/lib/slots';
import { useApp } from '@/state/AppStore';
import { colors, fonts, shadow, tabular } from '@/theme';

// react-native-web colours the "on" thumb with its own prop (default teal) instead of thumbColor.
const WEB_SWITCH_PROPS = (Platform.OS === 'web' ? { activeThumbColor: '#fff' } : {}) as object;

export default function SettingsScreen() {
  const { apiKey, model, slots, toggleSlot, clearAll } = useApp();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.h1} role="heading">
        Cài đặt
      </Text>

      <GroupLabel>Kết nối AI</GroupLabel>
      {/* Remounts (resetting the drafts) whenever the stored key/model change. */}
      <ApiCard key={`${apiKey}|${model}`} />

      <GroupLabel>Khung giờ rảnh</GroupLabel>
      <View style={styles.listGroup}>
        {SLOT_OPTIONS.map((opt, i) => (
          <Pressable
            key={opt.key}
            role="switch"
            aria-checked={slots[opt.key]}
            onPress={() => toggleSlot(opt.key)}
            style={[styles.toggleRow, i > 0 && styles.rowDivider]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>{opt.title}</Text>
              <Text style={[styles.toggleSub, tabular]}>{opt.sub}</Text>
            </View>
            {/* The whole row is the touch target; the Switch is display-only so taps never double-toggle. */}
            <View pointerEvents="none" importantForAccessibility="no-hide-descendants" aria-hidden>
              <Switch
                value={slots[opt.key]}
                trackColor={{ true: colors.blue, false: colors.borderStrong }}
                thumbColor="#fff"
                ios_backgroundColor={colors.borderStrong}
                {...WEB_SWITCH_PROPS}
              />
            </View>
          </Pressable>
        ))}
      </View>

      <GroupLabel>Dữ liệu cục bộ</GroupLabel>
      <Card>
        <Button label="Xóa dữ liệu đã lưu" variant="danger-outline" onPress={() => setConfirmClear(true)} />
        {confirmClear && (
          <InlineAlert
            action={
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <LinkButton label="Hủy" color={colors.textSecondary} onPress={() => setConfirmClear(false)} />
                <LinkButton
                  label="Xóa"
                  color={colors.red}
                  onPress={async () => {
                    await clearAll();
                    setConfirmClear(false);
                  }}
                />
              </View>
            }>
            Xóa toàn bộ đầu việc, lịch và API Key?
          </InlineAlert>
        )}
      </Card>
    </ScrollView>
  );
}

function ApiCard() {
  const { apiKey, model, saveApiSettings, testApiKey } = useApp();
  const [keyDraft, setKeyDraft] = useState(apiKey);
  const [modelDraft, setModelDraft] = useState(model);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  const onTest = async () => {
    setTesting(true);
    try {
      await testApiKey(keyDraft, modelDraft);
    } finally {
      setTesting(false);
    }
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await saveApiSettings(keyDraft, modelDraft);
    } finally {
      setSaving(false);
    }
  };

  const modelOptions = MODEL_OPTIONS.some((m) => m.value === modelDraft)
    ? MODEL_OPTIONS
    : [...MODEL_OPTIONS, { value: modelDraft, label: modelDraft }];

  return (
    <Card>
      <View style={styles.group}>
        <Text style={styles.label}>Gemini API Key</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={keyDraft}
            onChangeText={setKeyDraft}
            placeholder="AIza... hoặc AQ..."
            placeholderTextColor={colors.textMuted}
            secureTextEntry={!showKey}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            textContentType="password"
            style={[styles.input, { paddingRight: 40 }]}
            accessibilityLabel="Gemini API Key"
          />
          <Pressable
            role="button"
            accessibilityLabel="Hiện/ẩn key"
            hitSlop={8}
            onPress={() => setShowKey((v) => !v)}
            style={styles.eyeBtn}>
            <Icon name={showKey ? 'eye-off' : 'eye'} size={16} color={colors.textMuted} />
          </Pressable>
        </View>
        <Text style={styles.help}>Key được lưu trong kho bảo mật của thiết bị (Keychain / Keystore).</Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Model ưu tiên</Text>
        <View style={styles.radioList} role="radiogroup">
          {modelOptions.map((opt, i) => {
            const active = opt.value === modelDraft;
            return (
              <Pressable
                key={opt.value}
                role="radio"
                aria-checked={active}
                onPress={() => setModelDraft(opt.value)}
                style={[styles.radioRow, i > 0 && styles.rowDivider]}>
                <Text style={styles.radioLabel}>
                  {opt.label}
                  {opt.hint ? <Text style={styles.radioHint}>{`  ${opt.hint}`}</Text> : null}
                </Text>
                <View style={[styles.radioOuter, active && { borderColor: colors.blue }]}>
                  {active && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.btnRow}>
        <Button label={testing ? 'Đang thử...' : 'Kiểm tra'} variant="outline" onPress={onTest} loading={testing} />
        <Button label="Lưu" onPress={onSave} loading={saving} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingHorizontal: 16, paddingBottom: 32, gap: 14 },
  h1: { fontSize: 22, fontFamily: fonts.bold, letterSpacing: -0.5, color: colors.text },
  group: { gap: 6 },
  label: { fontSize: 12, fontFamily: fonts.semibold, color: colors.textSecondary },
  help: { fontSize: 11.5, color: colors.textMuted, fontFamily: fonts.regular },
  inputWrap: { justifyContent: 'center' },
  input: {
    height: 40,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13.5,
    color: colors.text,
    fontFamily: fonts.regular,
  },
  eyeBtn: { position: 'absolute', right: 10, padding: 4 },
  radioList: { backgroundColor: colors.bg, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  radioLabel: { fontSize: 13.5, color: colors.text, fontFamily: fonts.medium },
  radioHint: { fontSize: 11.5, color: colors.green, fontFamily: fonts.semibold },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.8,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.blue },
  btnRow: { flexDirection: 'row', gap: 8 },
  listGroup: { backgroundColor: colors.surface, borderRadius: 14, overflow: 'hidden', ...shadow(1) },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  toggleTitle: { fontSize: 13.5, fontFamily: fonts.semibold, color: colors.text },
  toggleSub: { fontSize: 11.5, color: colors.textMuted, fontFamily: fonts.regular },
});
