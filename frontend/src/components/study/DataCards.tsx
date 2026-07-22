import React from 'react';
import { Paper, SimpleGrid, Text } from '@mantine/core';
import AnimatedNumber from '../AnimatedNumber';


/* function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const displayValue = useTransform(count, (latest) => Math.round(latest));

  React.useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [value, count]);

  return <motion.span>{displayValue}</motion.span>;
}

function AnimatedNumber2({ value }: { value: number }) {
  return (
    <div style={{ overflow: 'hidden', display: 'inline-flex', height: '1.2em' }}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }} 
          transition={{ 
            duration: 0.5, 
            type: 'spring', 
            bounce: 0.3 
          }}
          style={{ display: 'inline-block' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
 */
interface DataCardsProps {
  totalWords: number;
  favorites: number;
  /* categories: number;
  showing: number; */
}

export default function DataCards({ totalWords, favorites, /* categories, showing */ }: DataCardsProps) {
  const stats = [
    { title: 'Total Vocabulary', value: totalWords, color: 'pink', variant: 'pop' as const },
    { title: 'Favorites', value: favorites, color: 'orange', variant: 'scroll' as const },
    /* { title: 'Categories', value: categories, color: 'teal' },
    { title: 'Showing', value: showing, color: 'orange' }, */
  ];

  return (
    <SimpleGrid cols={{ base: 2, sm: 2, md: 2 }} spacing="md">
      {stats.map((stat) => (
        <Paper withBorder p="md" radius="lg" key={stat.title} ta="center" styles={{ root: { backgroundColor: 'white' } }}>
          <Text fz={32} fw={400} c={stat.color}>
            <AnimatedNumber value={stat.value} variant={stat.variant}/>
          </Text>
          <Text fz="sm" c="dimmed" mt={5}>
            {stat.title}
          </Text>
        </Paper>
      ))}
    </SimpleGrid>
  )
}