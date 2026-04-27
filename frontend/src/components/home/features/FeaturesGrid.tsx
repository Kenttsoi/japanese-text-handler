import React from 'react';
import { motion, Variants } from 'framer-motion';
import { SimpleGrid, Card, Text, Title, Container, ThemeIcon, rem } from '@mantine/core';

const mockData = [
    {
        title: 'Auto Furigana Annotation',
        title_tc: '自動標註振假名',
        description: 'Automatically generate Furigana for complex Kanji and toggle entire passages between Hiragana, Katakana, and Romaji.',
        description_tc: '利用的語法分析技術，一鍵為日文漢字標上正確的讀音，支援多種顯示模式。',
        color: 'orange',
    },
    {
        title: 'Study',
        title_tc: '',
        description: 'Comprehensive study materials for all levels',
        description_tc: '',
        color: 'orange',
    },
    {
        title: 'Vocabulary',
        title_tc: '',
        description: 'Build your vocabulary with smart learning',
        description_tc: '',
        color: 'orange',
    },
    {
        title: 'Flashcards',
        title_tc: '',
        description: 'Practice with interactive flashcards',
        description_tc: '',
        color: 'amber',
    }
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    },
};

export default function FeaturesGrid() {

    const features = mockData.map((feature) => (
        <motion.div key={feature.title} variants={itemVariants}>
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
        </motion.div>
    ));

    return (
        <>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt={50}>
                    {features}
                </SimpleGrid>
            </motion.div >
        </>
    )
}