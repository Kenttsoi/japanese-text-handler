import { useRef, useState } from 'react';

export function usePanScroll() {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!viewportRef.current) return;
        setIsDown(true);
        setStartX(e.pageX - viewportRef.current.offsetLeft);
        setScrollLeft(viewportRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        setIsDown(false);
    };

    const onMouseUp = () => {
        setIsDown(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDown || !viewportRef.current) return;
        e.preventDefault();
        const x = e.pageX - viewportRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        viewportRef.current.scrollLeft = scrollLeft - walk;
    };

    return {
        viewportRef,
        isDragging: isDown,
        panProps: {
            onMouseDown,
            onMouseLeave,
            onMouseUp,
            onMouseMove,
        }
    };
}