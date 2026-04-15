import { Title, Text, Button, Container, Group, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Container style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <Stack align="center" gap="xl">
        {/* 巨大的 404 背景文字 */}
        <div style={{ 
          fontSize: '12rem', 
          fontWeight: 900, 
          lineHeight: 1, 
          color: '#d8dadc',
          position: 'absolute',
          zIndex: -1,
          userSelect: 'none'
        }}>
          404
        </div>

        <Title order={1} style={{ fontSize: '2.5rem', marginTop: '40px' }}>
          Data Alignment Error
        </Title>

        <Text c="dimmed" size="lg" ta="center" style={{ maxWidth: '500px' }}>
          It seems this page has been misaligned or doesn't exist in our dataset. 
          Don't worry, your progress is safe.
        </Text>

        <Group justify="center">
          <Button 
            variant="subtle" 
            size="md" 
            color="gray"
            onClick={() => navigate(-1)} // 回到上一頁
          >
            Go Back
          </Button>
          
          <Button 
            size="md" 
            radius="xl" 
            color="dark"
            onClick={() => navigate('/')} // 回首頁
          >
            Return Home
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}