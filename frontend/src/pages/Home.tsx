import React from 'react';
import { Container, Title, Text, Button, Group, Stack, Box } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import FeaturesGrid from '@/components/home/features/FeaturesGrid';
import classes from './Home.module.css';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation();

  return (
    <Container size="md" style={{ marginTop: '150px', textAlign: 'center' }}>
      <Stack align="center" gap="xl">
        <Title order={1} style={{ fontSize: '3rem', fontWeight: 900 }}>
          {t('homePage.mainSlogan1')} <Text span c="orange.6" inherit>{t('homePage.mainSlogan2')}</Text>
        </Title>

        <Text size="lg" c="dimmed" style={{ maxWidth: '600px' }}>
          {t('homePage.subSlogan')}
        </Text>

        <Group>
          <Button size="lg" radius="xl" color="dark" onClick={() => navigate(`/${lang}/annotate`)}>
            {t('homePage.button1')}
          </Button>
          <Button variant="outline" size="lg" radius="xl">
              {t('homePage.button2')}
          </Button>
        </Group>

        <Box className={classes.dropzone}>
          <Text c="dimmed">{t('homePage.dragAndDrop')}</Text>
        </Box>
        
        <FeaturesGrid />
      </Stack>
    </Container>

  );
}
