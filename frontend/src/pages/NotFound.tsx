import { Title, Text, Button, Container, Group, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import classes from './NotFound.module.css';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Container py={80} className={classes.container}>
      <Stack align="center" gap="xl">
        <div className={classes.bgText}>404</div>

        <Title order={1} className={classes.title} fz="2.5rem">
          Data Alignment Error
        </Title>

        <Text c="dimmed" size="lg" ta="center" maw={500}>
          It seems this page has been misaligned or doesn't exist in our dataset. 
          Don't worry, your progress is safe.
        </Text>

        <Group justify="center">
          <Button 
            variant="subtle" 
            size="md" 
            color="gray"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          
          <Button 
            size="md" 
            radius="xl" 
            color="dark"
            onClick={() => navigate('/')}
          >
            Return Home
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}