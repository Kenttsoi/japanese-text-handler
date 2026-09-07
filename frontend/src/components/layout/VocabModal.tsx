import React from 'react';
import { Modal, Text, ScrollArea, Center, Loader } from '@mantine/core';
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
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [modalLoading, setModalLoading] = React.useState(false);
  const { t } = useTranslation();

  const viewportRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const LIMIT = 12;

  const fetchNextPage = async (currentOffset: number) => {
    if (modalLoading || !hasMore) return;
    setModalLoading(true);

    const controller = new AbortController();

    setModalLoading(true);

    try {
      const res = await vocabService.searchVocab(query, controller.signal, LIMIT, currentOffset);

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
    if (opened && query) {
      // reset all states
      setItems([]);
      setOffset(0);
      setHasMore(true);
      setModalLoading(false);

      // 2. fetch the first record
      fetchNextPage(0);
    }

  }, [opened, query]);

  React.useEffect(() => {
    if (!opened || !bottomRef.current || !viewportRef.current) return;

    const controller = new AbortController();

    const viewportNode = viewportRef.current;
    const bottomNode = bottomRef.current;
    console.log('[Debug] Modal Opened:', { viewportNode, bottomNode });
    if (!viewportNode || !bottomNode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasMore && !modalLoading) {
          fetchNextPage(offset);
        }
      },
      {
        root: viewportNode,
        rootMargin: '0px 0px 100px 0px',
        threshold: 0,
      }
    );

    observer.observe(bottomNode);

    return () => {
      if (observer) observer.disconnect();
    };
  }, [opened, offset, hasMore, modalLoading]);

  /* React.useEffect(() => {
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
          type="auto"
          viewportRef={viewportRef}
        >
          <VocabGrid isLoading={isLoading} data={items} starredIds={starredIds} onToggleStar={onToggleStar} />
          <div
            ref={bottomRef}
            style={{
              height: '40px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
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