// useTableDisplaySettings.ts
import { ref, watch, onMounted, nextTick, type Ref } from 'vue';
import { useDraggable } from 'vue-draggable-plus';

interface TableDisplaySettingsProps {
    fields: any[];
    defaultFields: any[];
}

interface UseTableDisplaySettingsOptions {
    props: TableDisplaySettingsProps;
    tableCompRef?: Ref<any>;
}

export function useTableDisplaySettings({ props, tableCompRef }: UseTableDisplaySettingsOptions) {
    // MẢNG MASTER: Lưu trữ toàn bộ trạng thái thực tế
    const allColumns = ref<any[]>([]);
    // MẢNG HIỂN THỊ: Kết quả lọc qua ô Tìm kiếm
    const localColumns = ref<any[]>([]);

    const editingColumnKey = ref<string | null>(null);
    const showInTableColumns = ref<string[]>([]);
    const searchTerm = ref('');
    const debounceTimeout = ref<number | null>(null);

    // Hàm lọc dữ liệu từ mảng Master ra mảng hiển thị dựa theo từ khóa tìm kiếm
    const filterColumns = () => {
        const term = searchTerm.value.trim().toLowerCase();
        if (term === '') {
            localColumns.value = [...allColumns.value];
        } else {
            localColumns.value = allColumns.value.filter(
                (col: any) => col.columnName.toLowerCase().includes(term) || col.columnDisplay.toLowerCase().includes(term)
            );
        }
        // Cập nhật mảng lưu các cột đang được tích chọn hiển thị trên table
        showInTableColumns.value = allColumns.value
            .filter((col: any) => col.columnVisible)
            .map((col: any) => col.columnKey);
    };

    // Hàm helper map dữ liệu thô từ props sang cấu trúc của Modal Settings
    const mapIncomingFields = (targetFields: any[]) => {
        console.log('Mapping incoming fields:', targetFields);
        const cols = targetFields.filter((col: any) => col.exportable);
        return cols.map((col: any) => ({
            columnIndex: col.index,
            columnVisible: col.showInTable,
            columnKey: col.key,
            columnName: col.label,
            columnDisplay: col.label,
            columnPinned: col.pinned,
            columnWidth: col.style?.width.replace('px', '') || 'auto',
        }));
    };

    // Hàm helper sắp xếp ưu tiên pinned lên đầu
    const sortPinnedFirst = (cols: any[]) => {
        console.log('Sorting columns with pinned first:', cols);
        return cols.sort((a: any, b: any) => {
            if (a.columnPinned && !b.columnPinned) return -1;
            if (!a.columnPinned && b.columnPinned) return 1;
            return a.columnIndex - b.columnIndex;
        });
    };

    // Khởi tạo dữ liệu từ props vào mảng Master ban đầu
    watch(() => props.fields, (newFields) => {
        if (newFields) {
            const mapped = mapIncomingFields(newFields);
            allColumns.value = sortPinnedFirst(mapped);
            filterColumns();
        }
    }, { immediate: true });

    // Xử lý debounce khi gõ tìm kiếm cột
    const handleDebounceSearch = () => {
        if (debounceTimeout.value) {
            clearTimeout(debounceTimeout.value);
        }
        debounceTimeout.value = window.setTimeout(() => {
            filterColumns();
        }, 300);
    };

    const handleQuickPinColumn = (field: any, pin: boolean) => {
        console.log('Quick pinning column:', field);
        const currentIndex = allColumns.value.findIndex(c => c.columnKey === field.key);
        if (currentIndex === -1) return;

        // 1. Rút phần tử hiện tại ra khỏi mảng Master
        allColumns.value.splice(currentIndex, 1);

        // Tạo lại object đại diện với trạng thái ghim mới
        const row = {
            columnIndex: field.index,
            columnVisible: field.showInTable !== false,
            columnKey: field.key,
            columnName: field.label,
            columnDisplay: field.displayLabel || field.label,
            columnPinned: pin,
            columnWidth: field.style?.width.replace('px', '') || 'auto',
        };

        if (pin) {
            // HÀNH VI GHIM (QUEUE): Tìm vị trí của cột ghim cuối cùng hiện tại
            let lastPinnedIndex = -1;
            for (let i = allColumns.value.length - 1; i >= 0; i--) {
                if (allColumns.value[i].columnPinned) {
                    lastPinnedIndex = i;
                    break;
                }
            }
            // Chèn vào ngay sau cột đã ghim cuối cùng
            const insertIndex = lastPinnedIndex !== -1 ? lastPinnedIndex + 1 : 0;
            allColumns.value.splice(insertIndex, 0, row);
        } else {
            // HÀNH VI BỎ GHIM: Tìm vị trí thích hợp trong vùng chưa ghim dựa vào columnIndex gốc tăng dần
            let lastPinnedIndex = -1;
            for (let i = allColumns.value.length - 1; i >= 0; i--) {
                if (allColumns.value[i].columnPinned) {
                    lastPinnedIndex = i;
                    break;
                }
            }
            const unpinnedStart = lastPinnedIndex + 1;

            let insertIndex = allColumns.value.length;
            for (let i = unpinnedStart; i < allColumns.value.length; i++) {
                if (allColumns.value[i].columnIndex > row.columnIndex) {
                    insertIndex = i;
                    break;
                }
            }
            allColumns.value.splice(insertIndex, 0, row);
        }

        // 2. QUAN TRỌNG VÀ BẮT BUỘC: Thực hiện Index Pooling tái phân bổ lại giá trị columnIndex chuẩn chỉnh
        const availableIndices = allColumns.value
            .map(c => c.columnIndex)
            .sort((a, b) => a - b);

        allColumns.value.forEach((col, index) => {
            col.columnIndex = availableIndices[index];
        });

        // 3. Cập nhật lại mảng hiển thị
        filterColumns();

        // 4. Trả mảng allColumns về nơi gọi (MsTableDefault) để emit ra ngoài màn hình cha
        return allColumns.value;
    };

    // XỬ LÝ GHIM CỘT DẠNG QUEUE (HÀNG ĐỢI)
    const handlePinColumn = (row: any) => {
        row.columnPinned = !row.columnPinned;

        const currentIndex = allColumns.value.findIndex(c => c.columnKey === row.columnKey);
        if (currentIndex === -1) return;

        allColumns.value.splice(currentIndex, 1);

        if (row.columnPinned) {
            let lastPinnedIndex = -1;
            for (let i = allColumns.value.length - 1; i >= 0; i--) {
                if (allColumns.value[i].columnPinned) {
                    lastPinnedIndex = i;
                    break;
                }
            }
            const insertIndex = lastPinnedIndex !== -1 ? lastPinnedIndex + 1 : 0;
            allColumns.value.splice(insertIndex, 0, row);
        } else {
            let lastPinnedIndex = -1;
            for (let i = allColumns.value.length - 1; i >= 0; i--) {
                if (allColumns.value[i].columnPinned) {
                    lastPinnedIndex = i;
                    break;
                }
            }
            const unpinnedStart = lastPinnedIndex + 1;

            let insertIndex = allColumns.value.length;
            for (let i = unpinnedStart; i < allColumns.value.length; i++) {
                if (allColumns.value[i].columnIndex > row.columnIndex) {
                    insertIndex = i;
                    break;
                }
            }
            allColumns.value.splice(insertIndex, 0, row);
        }

        filterColumns();
    };

    const handleSelectAll = () => {
        const isAllChecked = showInTableColumns.value.length === localColumns.value.length;
        localColumns.value.forEach((col: any) => {
            col.columnVisible = !isAllChecked;
        });
        filterColumns();
    };

    const handleSelectRow = (row: any) => {
        row.columnVisible = !row.columnVisible;
        filterColumns();
    };

    // Chốt lại dữ liệu cuối cùng chuẩn bị gửi ra ngoài (Thực hiện Index Pooling)
    const getAppliedColumns = () => {
        const availableIndices = allColumns.value
            .map(c => c.columnIndex)
            .sort((a, b) => a - b);
        allColumns.value.forEach((col, index) => {
            col.columnIndex = availableIndices[index];
        });
        return allColumns.value;
    };

    const resetToDefault = () => {
        const cols = props.defaultFields ? props.defaultFields.filter((col: any) => col.exportable) : [];
        const mapped = mapIncomingFields(cols);
        allColumns.value = sortPinnedFirst(mapped);
        searchTerm.value = '';
        filterColumns();
    };

    const resetToOriginalProps = () => {
        const mapped = mapIncomingFields(props.fields);
        allColumns.value = sortPinnedFirst(mapped);
        searchTerm.value = '';
        filterColumns();
    };

    const handleRowClick = (event: any, columnDisplayRef: Ref<HTMLElement | null>) => {
        const columnKey = event.row.columnKey;
        if (editingColumnKey.value !== columnKey) {
            editingColumnKey.value = columnKey;
        }
        columnDisplayRef.value?.click();
    };

    const handleInput = (event: any, row: any, maxLength: number, type: 'columnDisplay' | 'columnWidth') => {
        let text = (event.target as HTMLElement).innerText.trim();
        if (type === 'columnWidth') {
            const regex = /^\d*$/;
            if (!regex.test(text)) {
                text = text.replace(/\D/g, '');
                (event.target as HTMLElement).innerText = text;
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(event.target as HTMLElement);
                range.collapse(false);
                sel!.removeAllRanges();
                sel!.addRange(range);
            }
        }
        if (text.length > maxLength) {
            text = text.substring(0, maxLength);
            (event.target as HTMLElement).innerText = text;

            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(event.target as HTMLElement);
            range.collapse(false);
            sel!.removeAllRanges();
            sel!.addRange(range);
        }
    };

    const handleBlur = (event: any, row: any, propName: 'columnDisplay' | 'columnWidth', maxLength: number) => {
        const target = event.target as HTMLElement;
        let text = target.innerText.trim();

        if (text.length > maxLength) {
            text = text.substring(0, maxLength);
            target.innerText = text;
        }
        if (propName === 'columnDisplay') {
            row.columnDisplay = text.trim()
            target.innerText = row.columnDisplay;
        } else if (propName === 'columnWidth') {
            row.columnWidth = text.trim() || '0';
            target.innerText = row.columnWidth;
        }
    };


    // Khởi tạo tính năng kéo thả bám theo vòng đời Component cha
    onMounted(async () => {
        await nextTick();

        if (tableCompRef?.value && tableCompRef.value.tbodyRef) {
            useDraggable(tableCompRef.value.tbodyRef, localColumns, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'opacity-50',
                onMove: (evt) => {
                    if (evt.related && evt.related.querySelector('.pinned')) {
                        return false;
                    }
                },
                onEnd: () => {
                    if (searchTerm.value.trim() === '') {
                        allColumns.value = [...localColumns.value];
                    } else {
                        const currentFilteredKeys = localColumns.value.map(c => c.columnKey);
                        const unmanagedColumns = allColumns.value.filter(c => !currentFilteredKeys.includes(c.columnKey));

                        let lastPinnedIndex = -1;
                        for (let i = unmanagedColumns.length - 1; i >= 0; i--) {
                            if (unmanagedColumns[i].columnPinned) {
                                lastPinnedIndex = i;
                                break;
                            }
                        }
                        const insertIdx = lastPinnedIndex !== -1 ? lastPinnedIndex + 1 : 0;

                        allColumns.value = [
                            ...unmanagedColumns.slice(0, insertIdx),
                            ...localColumns.value,
                            ...unmanagedColumns.slice(insertIdx)
                        ];
                    }

                    const availableIndices = allColumns.value
                        .map(c => c.columnIndex)
                        .sort((a, b) => a - b);

                    allColumns.value.forEach((col, index) => {
                        col.columnIndex = availableIndices[index];
                    });

                    filterColumns();
                }
            });
        }
    });

    return {
        localColumns,
        searchTerm,
        showInTableColumns,
        editingColumnKey,
        handleDebounceSearch,
        handlePinColumn,
        handleQuickPinColumn,
        handleSelectAll,
        handleSelectRow,
        getAppliedColumns,
        resetToDefault,
        resetToOriginalProps,
        handleRowClick,
        handleInput,
        handleBlur
    };
}