import { SimpleGrid, Center, Text, Card } from '@mantine/core';

export default function NoResultFoundUI() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      <Card
        radius="lg"
        padding="xl"
        withBorder
        style={{
          borderStyle: 'dashed',
          borderColor: '#ced4da',
          backgroundColor: '#f8f9fa',
          height: 250,
        }}
      >
        <Center style={{ height: '100%', flexDirection: 'column' }}>
          <Text c="dimmed" fw={500} size="sm">
            No Result Found
          </Text>
        </Center>
      </Card>
    </SimpleGrid>
  )
}
