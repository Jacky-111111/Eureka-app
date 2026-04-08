import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { IDEA_CATEGORIES } from '@/constants/categories';
import { IDEA_DIFFICULTIES, IDEA_STATUSES } from '@/constants/difficulty';
import { Theme } from '@/constants/theme';
import type { CreateIdeaInput, Idea } from '@/types/idea';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  initialValue?: Partial<Idea>;
  submitLabel: string;
  onSubmit: (value: CreateIdeaInput) => Promise<void> | void;
};

const safeSplit = (value?: string[]) => (value && value.length ? value.join(', ') : '');

export const IdeaForm = ({ initialValue, submitLabel, onSubmit }: Props) => {
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [description, setDescription] = useState(initialValue?.description ?? '');
  const [category, setCategory] = useState<Idea['category']>(initialValue?.category ?? 'Mobile App');
  const [difficulty, setDifficulty] = useState<Idea['difficulty']>(initialValue?.difficulty ?? 'Easy');
  const [status, setStatus] = useState<Idea['status']>(initialValue?.status ?? 'New');
  const [techStack, setTechStack] = useState(safeSplit(initialValue?.techStack));
  const [tags, setTags] = useState(safeSplit(initialValue?.tags));
  const [saving, setSaving] = useState(false);

  const valid = useMemo(() => title.trim().length > 0 && description.trim().length > 0, [title, description]);

  const handleSubmit = async () => {
    if (!valid) {
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        techStack: techStack
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        difficulty,
        status,
        tags: tags
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        source: initialValue?.source ?? 'manual',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.group}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Idea title" />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your idea..."
          multiline
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.row}>
          {IDEA_CATEGORIES.map((value) => (
            <PrimaryButton
              key={value}
              label={value}
              onPress={() => setCategory(value)}
              variant={category === value ? 'primary' : 'secondary'}
              style={styles.chip}
            />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.row}>
          {IDEA_DIFFICULTIES.map((value) => (
            <PrimaryButton
              key={value}
              label={value}
              onPress={() => setDifficulty(value)}
              variant={difficulty === value ? 'primary' : 'secondary'}
              style={styles.chip}
            />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.row}>
          {IDEA_STATUSES.map((value) => (
            <PrimaryButton
              key={value}
              label={value}
              onPress={() => setStatus(value)}
              variant={status === value ? 'primary' : 'secondary'}
              style={styles.chip}
            />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Tech stack (comma separated)</Text>
        <TextInput
          style={styles.input}
          value={techStack}
          onChangeText={setTechStack}
          placeholder="React Native, Expo, Firebase"
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Tags (optional, comma separated)</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="productivity, ai" />
      </View>

      <PrimaryButton
        label={saving ? 'Saving...' : submitLabel}
        onPress={handleSubmit}
        disabled={saving || !valid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: Theme.spacing.md,
  },
  group: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Theme.colors.text,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
  },
});
