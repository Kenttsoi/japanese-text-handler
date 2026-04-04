import React from 'react';
import { Container, Title, Text, Button, Group, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container size="md" style={{ marginTop: '150px', textAlign: 'center' }}>
      <Stack align="center" gap="xl">
        <Title order={1} style={{ fontSize: '3rem', fontWeight: 900 }}>
          Make Your Japanese <span style={{ color: '#228be6' }}>Readable.</span>
        </Title>

        <Text size="lg" color="dimmed" style={{ maxWidth: '600px' }}>
          A dedicated tool for Kanji alignment and data annotation. Zero setup, start labeling instantly.
        </Text>

        <Group>
          <Button size="lg" radius="xl" color="dark" onClick={() => navigate('/annotate')}>
            Start Annotating
          </Button>
          <Button variant="outline" size="lg" radius="xl">
              Find out more
          </Button>
        </Group>

        <div style={{
          marginTop: '50px',
          width: '100%',
          height: '300px',
          backgroundColor: '#f1f3f5',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #ced4da'
        }}>
          <Text color="dimmed">Drag and drop your dataset to begin (Feature in progress)</Text>
        </div>
      </Stack>
    </Container>

  );
}
