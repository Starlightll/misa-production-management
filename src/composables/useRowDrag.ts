import { ref, type Ref } from 'vue';

export function useRowDrag<T>(items: Ref<T[]>, onReorder?: (newItems: T[]) => void) {
    const draggedIndex = ref<number | null>(null);
    const dragOverIndex = ref<number | null>(null);

    const onDragStart = (index: number) => {
        draggedIndex.value = index;
    };

    const onDragOver = (e: DragEvent, index: number) => {
        e.preventDefault(); // Bắt buộc để drop hoạt động
        dragOverIndex.value = index;
    };

    const onDrop = (index: number) => {
        if (draggedIndex.value === null || draggedIndex.value === index) {
            draggedIndex.value = null;
            dragOverIndex.value = null;
            return;
        }

        const newItems = [...items.value];
        const [moved] = newItems.splice(draggedIndex.value, 1);
        newItems.splice(index, 0, moved);
        items.value = newItems;

        onReorder?.(newItems);

        draggedIndex.value = null;
        dragOverIndex.value = null;
    };

    const onDragEnd = () => {
        draggedIndex.value = null;
        dragOverIndex.value = null;
    };

    return {
        draggedIndex,
        dragOverIndex,
        onDragStart,
        onDragOver,
        onDrop,
        onDragEnd,
    };
}