import React from 'react';
import { Modal, Text, ScrollArea } from '@mantine/core';
import VocabGrid from '../study/VocabGrid';
import { showErrorToast } from '@/utils/notification';
import { vocabService } from '@/services/vocabService';
import { VocabItems } from '@/types';

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
        } else {
          showErrorToast(`Fetch Failed`);
        }
      } catch (err: any) {
        showErrorToast(`Fetch Failed`);
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
            Vocab 完整搜尋結果（共 {total} 筆）
          </Text>
        }
        size="75%" // 大尺寸彈窗，適合放置 3 欄 Grid
        centered
        scrollAreaComponent={ScrollArea.Autosize} // 內容過長時彈窗內部可滾動
      >
        <VocabGrid isLoading={isLoading} data={items} starredIds={starredIds} onToggleStar={onToggleStar} />
      </Modal>
    </>
  )
}