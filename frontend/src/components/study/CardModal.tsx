import React from 'react';
import { Modal, Text, ScrollArea, Center, Loader } from '@mantine/core';
import VocabGrid from './VocabGrid';
import { showErrorToast } from '@/utils/notification';
import { vocabService } from '@/services/vocabService';
import { VocabItems } from '@/types';
import { useTranslation } from 'react-i18next';
import { SharedModalProps } from '@/types';
import { searchKanji } from '@/services/api';
import KanjiGrid from './KanjiGrid';

/* interface VocabModalProps {
  opened: boolean;
  onClose: () => void;
  query: string;
  total: number;
  starredIds: number[];
  onToggleStar: (id: number) => void
} */

export default function CardModal({ opened, onClose, query, type, total, starredIds, onToggleStar }: SharedModalProps) {
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
    if (modalLoading || !hasMore || !opened) return;
    setModalLoading(true);

    const controller = new AbortController();

    try {
      let res: { items: any[]; total: number; hasMore?: boolean } = { items: [], total: 0 };

      if (type === 'vocab') {
        res = await vocabService.searchVocab(query, controller.signal, LIMIT, currentOffset);
      }

      if (type === 'kanji') {
        const kanjiRes = await searchKanji(query, controller.signal, LIMIT, currentOffset)
        console.log(kanjiRes)
        res = {
          items: kanjiRes.result?.items || [],
          total: kanjiRes.result?.total || 0,
        };
        console.log(res)
      }

      const newItems = res.items;

      setItems((prev) => {
        const updatedItems = [...prev, ...newItems];

        if (updatedItems.length >= res.total || newItems.length < LIMIT) {
          setHasMore(false);
        }

        return updatedItems;
      });

      setOffset((prevOffset) => prevOffset + LIMIT);
      /* setItems((prev) => [...prev, ...res.items]);

      if (items.length + res.items.length >= res.total || res.items.length < LIMIT) {
        setHasMore(false);
      }

      setOffset(currentOffset + LIMIT); */
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setModalLoading(false);
      setIsLoading(false)
    }
  };

  React.useEffect(() => {
    if (opened && query) {
      // reset all states
      setIsLoading(true)
      setItems([]);
      setOffset(0);
      setHasMore(true);
      setModalLoading(false);

      // 2. fetch the first record
      fetchNextPage(0);
    }
    if (!opened) {
      setIsLoading(false)
      setItems([]);
      setOffset(0);
      setHasMore(true);
      setModalLoading(false);
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
        rootMargin: '0px',
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
        > {
            type === 'vocab' ? (
              <VocabGrid isLoading={isLoading} data={items} starredIds={starredIds} onToggleStar={onToggleStar} />
            ) : type === 'kanji' ? (
              <KanjiGrid isLoading={isLoading} data={items} />
            ) : null
          }
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