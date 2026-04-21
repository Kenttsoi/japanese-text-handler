import React from 'react';
import { Container, Title, Text, Button, Group, Stack, Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import FeaturesGrid from '@/components/home/features/FeaturesGrid';
import classes from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container size="md" style={{ marginTop: '150px', textAlign: 'center' }}>
      <Stack align="center" gap="xl">
        <Title order={1} style={{ fontSize: '3rem', fontWeight: 900 }}>
          Make Your Japanese <Text span c="orange.6" inherit>Readable.</Text>
        </Title>

        <Text size="lg" c="dimmed" style={{ maxWidth: '600px' }}>
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

        <Box className={classes.dropzone}>
          <Text c="dimmed">Drag and drop your dataset to begin (Feature in progress)</Text>
        </Box>
        
        <FeaturesGrid />
      </Stack>
    </Container>

  );
}
