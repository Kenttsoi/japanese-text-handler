import React from 'react';
import { Modal, Text, ScrollArea, Center, Loader } from '@mantine/core';
import VocabGrid from './VocabGrid';
import { showErrorToast } from '@/utils/notification';
import { vocabService } from '@/services/vocabService';
import { ApiResponse, KanjiItems, VocabAPIResult, VocabItems } from '@/types';
import { useTranslation } from 'react-i18next';
import { SharedModalProps } from '@/types';
import { searchKanji } from '@/services/api';
import KanjiGrid from './KanjiGrid';

export default function CardModal({ opened, onClose, query, type, total, starredIds, onToggleStar }: SharedModalProps) {
  const [items, setItems] = React.useState<(VocabItems | KanjiItems)[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [offset, setOffset] = React.useState<number>(0);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [modalLoading, setModalLoading] = React.useState<boolean>(false);
  const { t } = useTranslation();

  const viewportRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const LIMIT = 12;

  const fetchNextPage = async (currentOffset: number) => {
    if (modalLoading || !hasMore || !opened) return;
    setModalLoading(true);

    const controller = new AbortController();

    try {
      const apiMap = {
        vocab: vocabService.searchVocab,
        kanji: searchKanji
      }

      const fetchApi = apiMap[type];

      const res = await fetchApi(query, controller.signal, LIMIT, currentOffset);

      if (!res.success && !res.result) {
        throw new Error;
      }

      if (res.success && res.result) {
        const newItems = res.result.data;
        const newTotal = res.result.total

        setItems((prev) => {
          const updatedItems = [...prev, ...newItems];

          if (updatedItems.length >= newTotal || newItems.length < LIMIT) {
            setHasMore(false);
          }

          return updatedItems;
        });

        setOffset((prevOffset) => prevOffset + LIMIT);
      }
    } catch (err) {
      showErrorToast(t('others.notification.errorMessage.catchedError'));
      setItems([]);
      setOffset(0);
      setHasMore(true);
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