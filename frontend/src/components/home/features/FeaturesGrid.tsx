import React from 'react';
import { SimpleGrid, Card, Text, Title, Container, ThemeIcon, rem } from '@mantine/core';
import { features } from 'node:process';

const mockData = [
    {
        title: '自動標註振假名',
        description: '利用的語法分析技術，一鍵為日文漢字標上正確的讀音，支援多種顯示模式。',
        color: 'orange',
    },
    {
        title: '深度語彙分析',
        description: '不只是翻譯，我們提供詳細的詞性拆解與原型檢索，幫助你徹底理解句子結構。',
        color: 'amber',
    },
    {
        title: '沈浸式閱讀',
        description: '專為長篇文章優化的 UI 設計，結合 Ruby Text 顯示，讓你享受最自然的閱讀體驗。',
        color: 'orange',
    }, {
        title: '自動標註振假名',
        description: '利用的語法分析技術，一鍵為日文漢字標上正確的讀音，支援多種顯示模式。',
        color: 'orange',
    },
    {
        title: '深度語彙分析',
        description: '不只是翻譯，我們提供詳細的詞性拆解與原型檢索，幫助你徹底理解句子結構。',
        color: 'amber',
    },
    {
        title: '沈浸式閱讀',
        description: '專為長篇文章優化的 UI 設計，結合 Ruby Text 顯示，讓你享受最自然的閱讀體驗。',
        color: 'orange',
    }, {
        title: '自動標註振假名',
        description: '利用的語法分析技術，一鍵為日文漢字標上正確的讀音，支援多種顯示模式。',
        color: 'orange',
    },
    {
        title: '深度語彙分析',
        description: '不只是翻譯，我們提供詳細的詞性拆解與原型檢索，幫助你徹底理解句子結構。',
        color: 'amber',
    },
    {
        title: '沈浸式閱讀',
        description: '專為長篇文章優化的 UI 設計，結合 Ruby Text 顯示，讓你享受最自然的閱讀體驗。',
        color: 'orange',
    },
];

export default function FeaturesGrid() {

    const features = mockData.map((feature) => (
        <Card key={feature.title} shadow="md" radius="md" padding="xl" style={{ borderBottom: `4px solid var(--mantine-color-${feature.color}-6)` }}>
            <ThemeIcon
                size={44}
                radius="md"
                variant="light"
                color={feature.color}
            >
            </ThemeIcon>
            <Text fz="lg" fw={700} mt="md">
                {feature.title}
            </Text>
            <Text fz="sm" c="dimmed" mt="sm" lh={1.6}>
                {feature.description}
            </Text>
        </Card>
    ));

    return (
        <>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt={50}>
                {features}
            </SimpleGrid>
        </>
    )
}