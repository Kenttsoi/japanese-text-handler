import { Button, Box } from '@mantine/core';
import { motion, Variants } from 'framer-motion';
import IconArrowDown from '@tabler/icons-react/dist/esm/icons/IconArrowDown.mjs';
import { useTranslation } from 'react-i18next';

const firstArrowVariants: Variants = {
  initial: { opacity: 1, y: 0 },
  hoverFlow: {
    opacity: [0, 1, 0],
    y: [-15, 0, 15],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const secondArrowVariants: Variants = {
  initial: { opacity: 0, y: -15 },
  hoverFlow: {
    opacity: [0, 1, 0],
    y: [-15, 0, 15],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
      delay: 0.75
    }
  }
};

interface AnimatedButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export default function AnimatedConvertButton({ onClick, loading }: AnimatedButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      variant="light"
      color="orange"
      size="md"
      onClick={onClick}
      loading={loading}
      component={motion.button}
      initial="initial"
      whileHover="hoverFlow"
      rightSection={
        <Box style={{
          position: 'relative',
          width: 20,
          height: 24,
          overflow: 'hidden'
        }}>
          <motion.div
            variants={firstArrowVariants}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <IconArrowDown size={16} />
          </motion.div>

          <motion.div
            variants={secondArrowVariants}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <IconArrowDown size={16} />
          </motion.div>
        </Box>
      }
    >
      {t('annotator.convertButton')}
    </Button>
  );
}