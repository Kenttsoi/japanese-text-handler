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

  React.useEffect(() => {
    if (opened) {
      setItems([]);
      setOffset(0);
      setHasMore(true);
      setModalLoading(false);
    }
  }, [opened, query]);

  const fetchNextPage = async (currentOffset: number, controller: any ) => {
    if (modalLoading || !hasMore) return;
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
    const controller = new AbortController();
    
    if (opened && query) {
      // 1. 重置所有狀態
      setItems([]);
      setOffset(0);
      setHasMore(true);

      // 2. 主動抓取第 1 頁資料 (offset = 0)
      console.log('[Debug] Modal 開啟，主動發送第一次請求');
      fetchNextPage(0, controller);
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

        // 印出除錯資訊，幫你確認狀態
        console.log('👀 Observer 觸發:', {
          isIntersecting: entry.isIntersecting,
          hasMore,
          modalLoading,
          currentOffset: offset
        });

        if (entry.isIntersecting && hasMore && !modalLoading) {
          console.log('🚀 滿足條件，發送下一頁請求, offset:', offset);
          fetchNextPage(offset, controller);
        }
      },
      {
        root: viewportNode,
        // 關鍵修改 1：設定 rootMargin 讓它提早 100px 觸發（體驗更好，也比較不容易因為高度邊界問題不觸發）
        rootMargin: '0px 0px 100px 0px',
        threshold: 0, // 只要露出一點點（0%）就觸發
      }
    );

    observer.observe(bottomNode);

    return () => {
      // controller.abort();
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