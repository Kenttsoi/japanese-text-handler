import { Card, Text, Badge, Group, Stack, Skeleton } from '@mantine/core';

interface KanjiCardProps {
  isLoading: boolean;
  data?: {
    literal: string;
    jlpt?: string;
    on_readings: string;
    kun_readings: string;
    nanori_readings: string;
    meaning: string;
  }
}

export default function KanjiCard({ isLoading, data }: KanjiCardProps) {

  if (isLoading) {
    return (
      <Card shadow="sm" padding="md" radius="lg" withBorder>
        <Skeleton height={20} radius="sm" ml="auto" mb="sm" />
        <Stack align="center" gap="sm" my="xs">
          <Skeleton height={50} width={50} radius="md" />
          <Skeleton height={16} width="80%" radius="sm" />
        </Stack>
        <Skeleton height={35} radius="sm" mt="md" opacity={0.6} />
      </Card>
    )
  }

  if (!data) return null;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder

    >
      <Group justify="space-between" mb="xs" >
        {data.jlpt ? (
          <Badge color="orange" variant="filled" radius="sm" size="lg">
            {data.jlpt}
          </Badge>
        ) : <></>}

      </Group >

      <Stack align="center" gap={4} my="sm" >
        <Text size="xl" fw={700} style={{ fontSize: '2.5rem', lineHeight: 1 }}>
          {data.literal}
        </Text>
      </Stack >

      <Text
        size="sm"
        c="dimmed"
        ta="center"
        lineClamp={1}
        mt="xs"
      >
        {data.meaning}
      </Text >
    </Card >
  );
}