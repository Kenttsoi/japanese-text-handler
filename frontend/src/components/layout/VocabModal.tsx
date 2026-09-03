import React from 'react';
import { Modal, Text, ScrollArea } from '@mantine/core';
import VocabGrid from '../study/VocabGrid';
import { showErrorToast } from '@/utils/notification';
import { vocabService } from '@/services/vocabService';
import { VocabItems } from '@/types';
import { useTranslation } from 'react-i18next';

interface VocabModalProps {
  opened: boolean;
  onClose: () => void;
  query: string;
  total: number;
  starredIds: number[];
  onToggleStar: (id: number) => void
}

export default function VocabModal({ opened, onClose, query, total, starredIds, onToggleStar }: VocabModalProps) {
  const [items, setItems] = React.useState<VocabItems[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!opened || !query.trim()) return;
    const controller = new AbortController();

    async function fetchAllVocab() {
      try {
        setIsLoading(true);

        const result = await vocabService.searchVocab(query, controller.signal);
        console.log('ReSULT', result)
        if (result.items.length >= 0) {
          setItems(result.items);
        }
      } catch (err: any) {
        showErrorToast(t('others.fetchFailed'));
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllVocab();

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
        <VocabGrid isLoading={isLoading} data={items} starredIds={starredIds} onToggleStar={onToggleStar} />
      </Modal>
    </>
  )
}