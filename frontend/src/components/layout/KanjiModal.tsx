import React from 'react';
import { Modal, Text, ScrollArea } from '@mantine/core';
import KanjiGrid from '../study/KanjiGrid';
import { showErrorToast } from '@/utils/notification';
import { KanjiItems } from '@/types';
import { useTranslation } from 'react-i18next';

interface VocabModalProps {
  opened: boolean;
  onClose: () => void;
  query: string;
  total: number;
}

export default function KanjiModal({ opened, onClose, query, total }: VocabModalProps) {
  const [items, setItems] = React.useState<KanjiItems[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!opened || !query.trim()) return;
    const controller = new AbortController();

    async function fetchAllKanji() {
      try {
        setIsLoading(true);

        if (true) {
          setItems([]);
        }
      } catch (err: any) {
        showErrorToast(t('others.fetchFailed'));
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllKanji();

    return () => {
      controller.abort();
    }
  }, [opened, query]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={
          <Text fw={700} size="lg">
            {t('studyPage.general.modal.modalTitle.part1')}{total}{t('studyPage.general.modal.modalTitle.part2')}
          </Text>
        }
        size="75%"
        centered
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <KanjiGrid isLoading={isLoading} data={items} />
      </Modal>
    </>
  )
}