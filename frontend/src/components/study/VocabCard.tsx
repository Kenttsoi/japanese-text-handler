import React from 'react';
import { Card, Text, Badge, Group, Stack, ActionIcon, Divider, Skeleton } from '@mantine/core';
import { VocabItems } from '@/types';
import IconVolume from '@tabler/icons-react/dist/esm/icons/IconVolume.mjs';
import IconStar from '@tabler/icons-react/dist/esm/icons/IconStar.mjs';
import IconStarFilled from '@tabler/icons-react/dist/esm/icons/IconStarFilled.mjs';

interface VocabCardProps {
  isLoading: boolean;
  data?: VocabItems
}

export default function VocabCard({ isLoading, data }: VocabCardProps) {
  const [isStarred, setIsStarred] = React.useState(false);

  if (isLoading) {
    return (
      <Card shadow="sm" padding="xl" radius="lg" withBorder>
        <Skeleton height={26} radius="xl" mb="md" />
        <Skeleton height={45} radius="md" mx="auto" mb="sm" />
        <Divider my="md" opacity={0.6} />
        <Skeleton height={20} radius="sm" mx="auto" />
      </Card>
    );
  }

  if (!data) return null;

  const badges = [
    data.jlpt_level_1 ? { label: data.jlpt_level_1, color: 'orange' } : null,
    data.pos ? { label: data.pos, color: 'gray' } : null,
  ].filter(Boolean)

  return (
    <Card
      shadow="sm"
      padding="xl"
      radius="lg"
      withBorder
      styles={{
        root: {
          maxWidth: 450,
          backgroundColor: '#ffffff',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          },
        }
      }}
    >
      <Group justify="space-between" align="center" mb="md" >
        <Group gap="xs" wrap="wrap">
          {badges.map((badge, index) => {
            if (!badge) return null;
            return (
              <Badge
                key={`${badge.label}-${index}`}
                color={badge.color}
                variant="light"
                size="lg"
                styles={{
                  root: {
                    textTransform: 'none',
                    fontWeight: 600
                  }
                }}
              >
                {badge.label}
              </Badge>
            )
          })}
        </Group>
        {/* <Badge
          variant="filled"
          size="md"
          radius="xl"
          styles={{
            root: {
              backgroundColor: '#FFE9DB',
              color: '#FF7643',
              textTransform: 'none',
              fontWeight: 600,
              paddingLeft: 12,
              paddingRight: 12,
            }
          }}
        >
          {pos}
        </Badge> */}

        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="gray"
            radius="xl"
            size="md"
          >
            <IconVolume size={20} stroke={1.5} />
          </ActionIcon>

          <ActionIcon
            variant="subtle"
            color={isStarred ? 'pink' : 'gray'}
            radius="xl"
            size="md"
            onClick={() => setIsStarred(!isStarred)}
          >
            {isStarred ? (
              <IconStarFilled size={20} color="#FF6B8B" />
            ) : (
              <IconStar size={20} stroke={1.5} />
            )}
          </ActionIcon>
        </Group>
      </Group>

      <Stack gap={4} mb="md">
        <Text
          styles={{
            root: {
              fontSize: '2.2rem',
              fontWeight: 500,
              color: '#212529',
              fontFamily: '"Noto Sans JP", sans-serif',
            }
          }}
        >
          {data.word}
        </Text>

        <Text size="md" c="dimmed" fw={500} style={{ fontFamily: 'monospace' }}>
          {data.reading}
        </Text>
      </Stack>
      <Divider my="md" color="#f1f3f5" />
      <Text
        size="lg"
        fw={500}
        c="gray.7"
        mt="sm"
      >
        {data.meaning_ch}
      </Text>
    </Card>
  )
}