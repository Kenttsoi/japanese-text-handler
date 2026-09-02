import React from 'react';
import { Modal, Text, Loader, Center, Stack } from '@mantine/core';
import KanjiGrid from '../study/KanjiGrid';
import { showErrorToast } from '@/utils/notification';
import { KanjiItems } from '@/types';

interface VocabModalProps {
  opened: boolean;
  onClose: () => void;
  query: string;
  total: number;
}

export default function KanjiModal({ opened, onClose, query, total }: VocabModalProps) {
  const [items, setItems] = React.useState<KanjiItems[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!opened || !query.trim()) return;
    const controller = new AbortController();

    async function fetchAllKanji() {
      try {
        setIsLoading(true);


        if (true) {
          setItems([]);
        } else {
          showErrorToast(`Fetch Failed`);
        }
      } catch (err: any) {
        showErrorToast(`Fetch Failed`);
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
            Kanji 完整搜尋結果（共 {total} 筆）
          </Text>
        }
        size="75%" // 大尺寸彈窗，適合放置 3 欄 Grid
        centered
        scrollAreaComponent={Modal.NativeScrollArea} // 內容過長時彈窗內部可滾動
      >
        <KanjiGrid isLoading={isLoading} data={items} />
      </Modal>
    </>
  )
}