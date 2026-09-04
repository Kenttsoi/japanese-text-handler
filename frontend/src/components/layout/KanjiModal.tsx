import React from 'react';
import { Modal, Text, ScrollArea, Center, Loader } from '@mantine/core';
import KanjiGrid from '../study/KanjiGrid';
import { showErrorToast } from '@/utils/notification';
import { KanjiItems } from '@/types';
import { useTranslation } from 'react-i18next';
import { vocabService } from '@/services/vocabService';

interface VocabModalProps {
  opened: boolean;
  onClose: () => void;
  query: string;
  total: number;
}

export default function KanjiModal({ opened, onClose, query, total }: VocabModalProps) {
  const [items, setItems] = React.useState<KanjiItems[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [modalLoading, setModalLoading] = React.useState(false);
  const { t } = useTranslation();

  const viewportRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const LIMIT = 12;

  React.useEffect(() => {
    if (opened) {
      setItems([]);
      setOffset(0);
      setHasMore(true);
      setModalLoading(false);
    }
  }, [opened, query]);

  const fetchNextPage = async (controller: any, currentOffset: number) => {
    if (modalLoading || !hasMore) return;
    setModalLoading(true);

    try {
      const res = await vocabService.searchVocab(query, controller, LIMIT, currentOffset);
      
      setItems((prev) => [...prev, ...res.items]);

      if (items.length + res.items.length >= res.total || res.items.length < LIMIT) {
        setHasMore(false);
      }

      setOffset(currentOffset + LIMIT);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setModalLoading(false);
    }
  };

  React.useEffect(() => {
    if (!opened || !bottomRef.current || !viewportRef.current) return;
    const controller = new AbortController();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !modalLoading) {
          fetchNextPage(controller, offset);
        }
      },
      {
        root: viewportRef.current,
        threshold: 0.1,
      }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [opened, offset, hasMore, modalLoading]);

  /* React.useEffect(() => {
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
  }, [opened, query]); */

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
        /* scrollAreaComponent={ScrollArea.Autosize} */
      >
        <ScrollArea.Autosize
          mah="70vh"
          viewportRef={viewportRef}
        >
          <KanjiGrid isLoading={isLoading} data={items} />
          <div ref={bottomRef} style={{ minHeight: '20px' }}>
            {modalLoading && (
              <Center p="xs">
                <Loader size="sm" />
              </Center>
            )}
          </div>
        </ScrollArea.Autosize>
      </Modal>
    </>
  )
}