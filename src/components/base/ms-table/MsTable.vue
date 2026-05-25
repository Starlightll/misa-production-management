<template lang="html">
  <div class="table">
    <div ref="titleScrollRef" class="table__title" @scroll="onTitleScroll">
      <table ref="titleTableRef" class="family-table">
        <colgroup>
          <!-- <col style="width: 50px" />
          <col style="width: 180px" />
          <col style="width: 180px" />
          <col style="width: 100px" />
          <col style="width: 150px" />
          <col style="width: 100px" /> -->
          <col v-for="(field, columnIndex) in props.fields" :key="`title-col-${columnIndex}`"
            :style="{ width: `${field.width}px` }" />
        </colgroup>
        <tbody>
          <tr>
            <!-- <th class="text-left w-100">
              <input
                v-model="isAllSelected"
                type="checkbox"
                class="w-4 h-4 flex self-center justify-self-center"
                @change="selectAllCheckbox"
              />
            </th>
            <th class="text-left!">Tên</th>
            <th class="text-left">Chủ hộ</th>
            <th class="text-center!">Số thành viên</th>
            <th class="text-center!">Ngày tạo</th>
            <th class="text-center!">Hành động</th> -->
            <th v-for="field in fields" :key="field.key" :style="field.style || {}" :class="[
              field.type === 'number' ? 'text-end!' : '',
              field.type === 'date' ? 'text-center!' : '',
            ]">
              <!-- Custom type with slot -->
              <template v-if="field.type === 'custom'">
                <slot :name="`title-${field.key}`" :field="field">
                  {{ field.label }}
                </slot>
              </template>

              <!-- Other types -->
              <template v-else>
                {{ field.label }}
              </template>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    <div ref="bodyScrollRef" class="table__body" @scroll="onBodyScroll">
      <table class="family-table">
        <colgroup>
          <col v-for="(columnWidth, columnIndex) in bodyColumnWidths" :key="`body-col-${columnIndex}`"
            :style="{ width: `${columnWidth}px` }" />
        </colgroup>

        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="relative group">
            <td v-for="field in fields" :key="field.key" :style="field.style || {}" :class="[
              field.type === 'number' ? 'text-end!' : '',
              field.type === 'date' ? 'text-center!' : '',
            ]">
              <!-- Custom type with slot -->
              <template v-if="field.type === 'custom'">
                <div v-if="field.displayOnHover" class="display-on-hover">
                  <slot :name="field.key" :row="row" :field="field" :value="row[field.key]">
                    {{ handleFormat(row[field.key], "text") }}
                  </slot>
                </div>
                <slot v-else :name="field.key" :row="row" :field="field" :value="row[field.key]">
                  {{ handleFormat(row[field.key], "text") }}
                </slot>
              </template>

              <!-- Other types -->
              <template v-else>
                {{ handleFormat(row[field.key], field.type || "text") }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  computed,
  watch,
} from "vue";
import { useResizeObserver, useElementSize } from "@vueuse/core";
import { formatNumber, formatDate, formatText } from "../../../utils/formatter";

const props = defineProps({
  fields: {
    type: Array as any,
    required: true,
    validator: (value: any) => {
      return value.every((field: any) => {
        const validTypes = ["text", "number", "date", "custom"];
        return (
          field.key && field.label && validTypes.includes(field.type || "text")
        );
      });
    },
  },
  rows: {
    type: Array as any,
    required: true,
  },
});

const emit = defineEmits(["edit", "delete"]);

const handleFormat = (value: any, type: string) => {
  switch (type) {
    case "number":
      return formatNumber(value);
    case "date":
      return formatDate(value);
    case "text":
      return formatText(value);
    default:
      return formatText(value);
  }
};

const isAllSelected = ref(false);

// #region Scroll Sync Logic
const titleScrollRef = ref<HTMLDivElement | null>(null);
const bodyScrollRef = ref<HTMLDivElement | null>(null);
const titleTableRef = ref<HTMLTableElement | null>(null);
const bodyScrollbarWidth = ref(0);

// Danh sach do rong cot tieu de theo index (0-based), tu dong dai theo so cot hien co.
const titleColumnWidths = ref<number[]>([]);
const defaultBodyColumnWidths = [50, 180, 180, 100, 150, 100];
const bodyColumnWidths = computed(() =>
  titleColumnWidths.value.length > 0
    ? titleColumnWidths.value
    : defaultBodyColumnWidths,
);

let isSyncingHorizontalScroll = false;
let bodyResizeObserver: ResizeObserver | null = null;

const updateTitleColumnWidths = (): void => {
  const headerCells = titleTableRef.value?.querySelectorAll("tbody tr th");

  if (!headerCells || headerCells.length === 0) {
    titleColumnWidths.value = [];
    return;
  }

  titleColumnWidths.value = Array.from(headerCells).map((cell) =>
    Math.round(cell.getBoundingClientRect().width),
  );
};

useResizeObserver(titleTableRef, () => {
  updateTitleColumnWidths();
});

const updateBodyScrollbarWidth = (): void => {
  const bodyElement = bodyScrollRef.value;

  if (!bodyElement) {
    bodyScrollbarWidth.value = 0;
    return;
  }

  bodyScrollbarWidth.value = Math.max(
    0,
    bodyElement.offsetWidth - bodyElement.clientWidth,
  );
};

const syncHorizontalScroll = (
  source: HTMLDivElement | null,
  target: HTMLDivElement | null,
): void => {
  if (!source || !target || isSyncingHorizontalScroll) {
    return;
  }

  isSyncingHorizontalScroll = true;
  const targetMaxScrollLeft = Math.max(
    0,
    target.scrollWidth - target.clientWidth,
  );
  target.scrollLeft = Math.min(source.scrollLeft, targetMaxScrollLeft);

  requestAnimationFrame(() => {
    isSyncingHorizontalScroll = false;
  });
};

const onTitleScroll = (): void => {
  syncHorizontalScroll(titleScrollRef.value, bodyScrollRef.value);
};

const onBodyScroll = (): void => {
  syncHorizontalScroll(bodyScrollRef.value, titleScrollRef.value);
};

const syncLayoutMetrics = (): void => {
  updateBodyScrollbarWidth();
  updateTitleColumnWidths();
  syncHorizontalScroll(bodyScrollRef.value, titleScrollRef.value);
};

onMounted(() => {
  nextTick(() => {
    syncLayoutMetrics();

    if (typeof ResizeObserver !== "undefined" && bodyScrollRef.value) {
      bodyResizeObserver = new ResizeObserver(syncLayoutMetrics);
      bodyResizeObserver.observe(bodyScrollRef.value);
    }

    window.addEventListener("resize", syncLayoutMetrics);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", syncLayoutMetrics);

  if (bodyResizeObserver) {
    bodyResizeObserver.disconnect();
    bodyResizeObserver = null;
  }
});

watch(
  () => props.fields,
  () => {
    nextTick(() => {
      syncLayoutMetrics();
    });
  },
  { deep: true },
);

// #region Utility Functions (Hàm tiện ích)
const selectedHoGiaDinhIds = ref<Set<number>>(new Set());
const selectAllCheckbox = () => { };

const toggleHoGiaDinhSelection = (id: number): void => {
  if (selectedHoGiaDinhIds.value.has(id)) {
    selectedHoGiaDinhIds.value.delete(id);
  } else {
    selectedHoGiaDinhIds.value.add(id);
  }
  checkIsAllSelected();
  console.log(
    "Selected Ho Gia Dinh IDs:",
    Array.from(selectedHoGiaDinhIds.value),
  );
};

const checkIsAllSelected = () => { };

const resetSelection = (): void => {
  selectedHoGiaDinhIds.value.clear();
  isAllSelected.value = false;
};
// #endregion
</script>

<style lang="css" scoped>
* {
  box-sizing: border-box;
  /* user-select: none; */
}

.item {
  padding: 5px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: move;
  /* Con trỏ hình di chuyển */
}

.tu-dien-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: var(--app-text);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  text-wrap: nowrap;
}

.header .header__title {
  /* font-size: 24px; */
}

/* Family Table */
.table {
  border: 1px solid var(--app-border);
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Family Table Header */
.table__header {
  height: 60px;
  background-color: var(--app-surface);
  display: flex;
  align-items: center;
  padding: 16px 16px;
}

/* Family Table Title */
.table__title {
  overflow-x: auto;
  overflow-y: hidden;
  font-size: 14px;
  background-color: var(--app-surface);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.table__title::-webkit-scrollbar {
  height: 0;
}

.table__title table {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
}

.table__title table tbody tr th {
  text-align: start;
  height: 48px !important;
  padding: 8px;
  background-color: rgb(249, 250, 251);
  text-wrap: nowrap;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-width: 1px 1px;
  border-style: solid solid;
  border-color: rgb(224, 230, 236) rgb(224, 230, 236);
  border-image: initial;
}

.table__title table tbody tr th:last-child {
  position: sticky;
  right: 0;
  z-index: 1;
  width: 0%;
  min-width: 120px;
}

/* Family Table Body */
.table__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
  background-color: var(--app-surface);
  scrollbar-color: var(--primary-color) transparent;
  scrollbar-width: thin;
}

.table__body tbody tr {
  cursor: pointer;
}

.table__body tbody tr:hover td {
  background-color: #e1eeff !important;
}

.table__body tbody tr:hover .display-on-hover {
  opacity: 1;
}

/* .table__body::-webkit-scrollbar {
  width: 10px;
  height: 10px;
} */

/* .table__body::-webkit-scrollbar-track {
  background: var(--app-scrollbar-track);
  border-radius: 999px;
}

.table__body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--p-primary-500) 0%, var(--p-primary-700) 100%);
  border-radius: 999px;
  border: 2px solid var(--app-scrollbar-track);
}

.table__body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--p-primary-400) 0%, var(--p-primary-600) 100%);
}

.table__body::-webkit-scrollbar-thumb:active {
  background: linear-gradient(180deg, var(--p-primary-500) 0%, var(--p-primary-800) 100%);
} */

.table__body table {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
}

.table__body table tbody tr td {
  text-align: start;
  text-wrap: nowrap;
  padding: 8px;
  max-height: 48px !important;
  height: 48px !important;
  font-size: 14px !important;
  border-bottom: 1px solid var(--app-border);
  overflow: hidden;
  text-overflow: ellipsis;
  align-content: center;
  max-width: 0px;
  background-color: rgb(255, 255, 255);
  /* border-left: 1px solid var(--app-border); */
  font-size: 14px !important;
  border-bottom: 1px solid rgb(224, 230, 236) !important;
}

/* .table__body table tbody tr td:last-child {
  position: sticky;
  right: 0;
  background-color: rgb(255, 255, 255);
  z-index: 1;
  justify-items: center;
  width: 0%;
  min-width: 120px;
} */
.table__body table tbody tr td:last-child .edit-icon {
  color: var(--primary-color);
  cursor: pointer;
}

.table__body table tbody tr .table-state-cell {
  text-align: center;
  color: var(--app-text-muted);
}

/* Family Table Footer */
.table__footer {
  height: 50px;
  background-color: rgb(249, 250, 251);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  font-size: 14px;
  white-space: nowrap;
}

.add__new__btn {
  background-color: var(--primary-color);
  color: var(--p-primary-contrast-color);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  text-wrap: nowrap;
  font-size: 14px !important;
  height: 36px;
}

.add__new__btn:hover {
  background-color: var(--primary-color-hover);
}

.search_input {
  position: relative;
}

.search_input input {
  height: 32px;
  border: 1px solid var(--app-border-strong);
  border-radius: 4px;
  padding: 8px;
  width: 350px;
  padding-left: 36px;
  outline: none;
  background-color: var(--app-surface);
  font-size: 14px;
}

.search_input input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color) 20%, transparent);
}

/* Change search icon color on focus */
.search__icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--app-text-muted);
}

/* Add Form Modal */
.add__form__modal__bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--app-overlay);
  z-index: 999;
}

.add__form__modal__form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--app-surface);
  border: 1px solid var(--app-border);
  padding: 24px;
  border-radius: 8px;
  z-index: 1000;
  width: 80%;
}

.form__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.form__header h2 {
  font-size: 20px;
}

.form__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.cancel__btn {
  background-color: var(--app-surface-muted);
  color: var(--app-text);
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid var(--app-border-strong);
  cursor: pointer;
  text-wrap: nowrap;
  font-size: 14px !important;
  height: 36px;
}

.hidden {
  display: none;
}

.copy-right {
  position: absolute;
  bottom: 3px;
  font-size: 9px;
  /* user-select: none; */
  white-space: nowrap;
}

.manage-family-overlay {
  position: absolute;
  inset: 0;
  /* background: linear-gradient(
    30deg,
    rgb(from var(--primary-color) r g b / 0.8) 30%,
    rgb(from var(--secondary-color) r g b / 0.8) 90%
  ); */
  background-color: rgba(from var(--primary-color) r g b / 0.8);
  color: white;
  opacity: 0;
  display: flex;
  justify-content: start;
  align-items: center;
  z-index: 0;
  cursor: pointer;
  padding: 0 14px;
  border: 5px solid var(--primary-color);
  width: calc(v-bind(width + "px") - 170px);
  text-overflow: ellipsis;
  text-wrap: nowrap;
  left: 50px;
}

.manage-family-overlay .overlay-content {
  text-align: center;
  color: var(--app-text);
  font-size: 14px;
}

.table__body table tbody tr:hover .manage-family-overlay {
  opacity: 1;
}

.display-on-hover {
  opacity: 0;
}
</style>
