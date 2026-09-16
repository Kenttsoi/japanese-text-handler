import { SimpleGrid, Center, Text, Card } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export default function NoResultFoundUI() {
  const { t } = useTranslation();

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      <Card
        radius="lg"
        padding="xl"
        withBorder
        mih={100}
        style={{
          borderStyle: 'dashed',
          borderColor: 'light-dark(#ced4da, var(--mantine-color-dark-4))',
          backgroundColor: 'light-dark(#f8f9fa, var(--mantine-color-dark-6))',
        }}
      >
        <Center style={{ height: '100%', flexDirection: 'column' }}>
          <Text c="dimmed" fw={500} size="sm">
            {t('studyPage.general.noResultFoundLabel')}
          </Text>
        </Center>
      </Card>
    </SimpleGrid>
  )
}
