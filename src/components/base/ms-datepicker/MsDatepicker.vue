<template>
  <div class="ms-datepicker" ref="rootRef" @focusout="handleBlur">
    <div class="ms-datepicker-wrapper" :class="{ 'has-error': error }" :title="error" @click="openPicker">
      <input type="text" class="ms-datepicker-input" :placeholder="resolvedPlaceholder" :value="displayValue" readonly
        @focus="openPicker" />

      <div class="ms-datepicker-wrapper__datepicker__button" @click.stop="togglePicker">
        <div class="icon" :class="resolvedIcon"></div>
      </div>
    </div>

    <div v-if="isOpen" class="ms-datepicker-panel">
      <div v-if="showCalendar" class="ms-datepicker-calendar">
        <div class="calendar-header">
          <button class="nav-btn" @click="changeMonth(-12)">
            <span class="icon mi-warehouse icon16 step-backward"></span>
          </button>
          <button class="nav-btn" @click="changeMonth(-1)">
            <span class="icon mi-warehouse icon16 angle-left"></span>
          </button>
          <div class="calendar-title">
            Thg {{ viewMonth + 1 }}
          </div>
          <div class="calendar-year">{{ viewYear }}</div>
          <button class="nav-btn" @click="changeMonth(1)">
            <span class="icon mi-warehouse icon16 angle-right"></span>
          </button>
          <button class="nav-btn" @click="changeMonth(12)">
            <span class="icon mi-warehouse icon16 step-forward"></span>
          </button>
        </div>

        <div class="calendar-weekdays">
          <div v-for="day in weekDays" :key="day" class="weekday">
            {{ day }}
          </div>
        </div>

        <div class="calendar-grid">
          <button v-for="cell in calendarCells" :key="cell.key" class="calendar-cell" :class="{
            'is-outside': cell.isOutside,
            'is-today': cell.isToday,
            'is-selected': cell.isSelected,
          }" @click="selectDate(cell.date)">
            {{ cell.label }}
          </button>
        </div>
      </div>

      <div v-if="showTimeList" class="ms-datepicker-time">
        <!-- <div class="time-list"> -->
        <button v-for="time in timeOptions" :key="time" class="time-item"
          :class="{ 'is-selected': time === selectedTime }" @click="selectTime(time)">
          {{ time }}
        </button>
        <!-- </div> -->
      </div>

      <div v-if="showCalendar" class="ms-datepicker-footer">
        <button class="today-btn" @click="selectToday">Hôm nay</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: "" },
  type: {
    type: String,
    default: "date", // Hoặc "month", "year" tùy nhu cầu
  },
  icon: String,
  error: String,
});

const emit = defineEmits(["update:modelValue", "blur"]);

const rootRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const viewMonth = ref(0);
const viewYear = ref(0);
const selectedTime = ref("");

const handleBlur = (event: FocusEvent) => {
  const container = event.currentTarget as HTMLElement;
  const nextTarget = event.relatedTarget as HTMLElement;
  if (!container.contains(nextTarget)) {
    console.log("Datepicker blurred");
    emit("blur", event);
  }
};

const resolvedType = computed(() => props.type);
const showCalendar = computed(
  () => resolvedType.value === "date" || resolvedType.value === "datetime"
);
const showTimeList = computed(
  () => resolvedType.value === "time" || resolvedType.value === "datetime"
);

const resolvedPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder;
  if (resolvedType.value === "time") return "HH:MM";
  if (resolvedType.value === "datetime") return "DD/MM/YYYY HH:MM";
  return "DD/MM/YYYY";
});

const resolvedIcon = computed(() => {
  if (props.icon) return props.icon;
  if (resolvedType.value === "time") return "mi-warehouse icon16 clock";
  return "mi-warehouse icon16 calendar";
});

const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hours = String(Math.floor(index / 2)).padStart(2, "0");
  const minutes = index % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

const parseDate = (value?: string) => {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  return new Date(year, month, day);
};

const parseTime = (value?: string) => {
  if (!value) return "";
  const match = value.match(/T(\d{2}):(\d{2})$/);
  if (match) return `${match[1]}:${match[2]}`;
  const timeMatch = value.match(/^(\d{2}):(\d{2})$/);
  if (timeMatch) return `${timeMatch[1]}:${timeMatch[2]}`;
  return "";
};

const syncView = () => {
  const baseDate = parseDate(props.modelValue) ?? new Date();
  viewMonth.value = baseDate.getMonth();
  viewYear.value = baseDate.getFullYear();
  selectedTime.value = parseTime(props.modelValue) || selectedTime.value;
};

/**
 * Logic 1: Chuyển đổi từ yyyy-mm-dd sang dd/mm/yyyy để hiển thị
 */
const displayValue = computed(() => {
  if (!props.modelValue) return "";
  if (resolvedType.value === "time") return props.modelValue;
  if (resolvedType.value === "datetime") {
    const match = props.modelValue.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
    );
    if (!match) return props.modelValue;
    return `${match[3]}/${match[2]}/${match[1]} ${match[4]}:${match[5]}`;
  }
  const match = props.modelValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return props.modelValue;
  return `${match[3]}/${match[2]}/${match[1]}`;
});

const calendarCells = computed(() => {
  const startOfMonth = new Date(viewYear.value, viewMonth.value, 1);
  const endOfMonth = new Date(viewYear.value, viewMonth.value + 1, 0);
  const startWeekday = (startOfMonth.getDay() + 6) % 7;
  const totalDays = endOfMonth.getDate();
  const prevMonthEnd = new Date(viewYear.value, viewMonth.value, 0).getDate();
  const selectedDate = parseDate(props.modelValue);
  const today = new Date();

  const cells = [] as Array<{
    key: string;
    label: number;
    date: Date;
    isOutside: boolean;
    isToday: boolean;
    isSelected: boolean;
  }>;

  for (let i = 0; i < 42; i += 1) {
    const dayOffset = i - startWeekday + 1;
    let cellDate: Date;
    let label: number;
    let isOutside = false;

    if (dayOffset <= 0) {
      label = prevMonthEnd + dayOffset;
      cellDate = new Date(viewYear.value, viewMonth.value - 1, label);
      isOutside = true;
    } else if (dayOffset > totalDays) {
      label = dayOffset - totalDays;
      cellDate = new Date(viewYear.value, viewMonth.value + 1, label);
      isOutside = true;
    } else {
      label = dayOffset;
      cellDate = new Date(viewYear.value, viewMonth.value, label);
    }

    const isToday =
      cellDate.getFullYear() === today.getFullYear() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getDate() === today.getDate();

    const isSelected = selectedDate
      ? cellDate.getFullYear() === selectedDate.getFullYear() &&
      cellDate.getMonth() === selectedDate.getMonth() &&
      cellDate.getDate() === selectedDate.getDate()
      : false;

    cells.push({
      key: `${cellDate.getFullYear()}-${cellDate.getMonth()}-${label}`,
      label,
      date: cellDate,
      isOutside,
      isToday,
      isSelected,
    });
  }

  return cells;
});

const changeMonth = (delta: number) => {
  const next = new Date(viewYear.value, viewMonth.value + delta, 1);
  viewYear.value = next.getFullYear();
  viewMonth.value = next.getMonth();
};

const selectDate = (date: Date) => {
  const isoDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  if (resolvedType.value === "date") {
    emit("update:modelValue", isoDate);
    isOpen.value = false;
    return;
  }

  const timeValue = selectedTime.value || "00:00";
  emit("update:modelValue", `${isoDate}T${timeValue}`);
};

const selectTime = (time: string) => {
  selectedTime.value = time;
  if (resolvedType.value === "time") {
    emit("update:modelValue", time);
    isOpen.value = false;
    return;
  }

  const dateValue =
    parseDate(props.modelValue) ?? new Date();
  const isoDate = `${dateValue.getFullYear()}-${String(
    dateValue.getMonth() + 1
  ).padStart(2, "0")}-${String(dateValue.getDate()).padStart(2, "0")}`;
  emit("update:modelValue", `${isoDate}T${time}`);
};

const selectToday = () => {
  const today = new Date();
  viewYear.value = today.getFullYear();
  viewMonth.value = today.getMonth();
  selectDate(today);
};

const openPicker = () => {
  if (isOpen.value) return;
  syncView();
  isOpen.value = true;
};

const togglePicker = () => {
  if (!isOpen.value) {
    openPicker();
    return;
  }
  isOpen.value = false;
};

const handleOutsideClick = (event: MouseEvent) => {
  if (!rootRef.value) return;
  if (!rootRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  syncView();
  document.addEventListener("mousedown", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleOutsideClick);
});

watch(
  () => props.modelValue,
  () => {
    if (!isOpen.value) syncView();
  }
);
</script>
<style lang="css" scoped>
.ms-datepicker-wrapper {
  display: flex;
  border: 1px solid #dddde4;
  border-radius: 8px;
}

.ms-datepicker-wrapper:hover {
  border: 1px solid var(--border-dark) !important;
}

.ms-datepicker-wrapper:focus-within {
  border: 1px solid var(--color-primary) !important;
}

.ms-datepicker-wrapper input {
  border: none;
}

.ms-datepicker-wrapper__datepicker__button {
  width: 28px;
  height: 28px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border-left: 1px solid #dddde4; */
  padding: 8px;
  overflow: hidden;
  cursor: pointer;
}

.ms-datepicker-wrapper__datepicker__button .icon {
  background-color: #6b6b6b;
  pointer-events: none;
}

.ms-datepicker {
  position: relative;
  width: 100%;
}

input {
  outline: none;
  width: 100%;
  padding: 2px 16px;
}

input:hover {
  border: 1px solid var(--border-dark);
}

input:focus {
  border: 1px solid var(--color-primary);
}

.ms-datepicker-wrapper {
  display: flex;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  border: 1px solid #dddde4;
  height: 28px;
}

.ms-datepicker-wrapper:focus-within {
  border: 1px solid var(--color-primary);
}

.ms-datepicker-wrapper:hover {
  border: 1px solid var(--border);
}

.ms-datepicker-wrapper input {
  padding-left: 16px;
  border: none !important;
}

.ms-datepicker-wrapper.has-error {
  border: 2px solid #f44336 !important;
}

.ms-datepicker-wrapper.has-error .icon {
  background-color: #f44336 !important;
}

.ms-datepicker-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  z-index: 20;
  /* padding: 12px; */
  min-width: 120px;
  max-width: 280px;
}

.ms-datepicker-calendar {
  width: 100%;
  padding: 12px;
}

.calendar-header {
  display: grid;
  grid-template-columns: 28px 28px 1fr auto 28px 28px;
  align-items: center;
  column-gap: 6px;
  margin-bottom: 8px;
}

.calendar-title {
  font-weight: 600;
  text-align: center;
}

.calendar-year {
  font-weight: 600;
  text-align: center;
}

.nav-btn {
  border: none;
  background: transparent;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
  color: #6b7280;
  font-size: 12px;
  text-align: center;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-cell {
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.calendar-cell.is-outside {
  color: #d1d5db;
}

.calendar-cell.is-today {
  color: #16a34a;
  font-weight: 600;
}

.calendar-cell.is-selected {
  background: #e8f5e9;
  color: #16a34a;
  font-weight: 600;
}

.ms-datepicker-time {
  /* margin-top: 8px; */
  max-height: 200px;
  overflow-y: auto;
  display: grid;
  gap: 4px;
  scrollbar-width: thin;
  padding: 12px;
}

.time-list {
  display: grid;
  gap: 4px;
}

.time-item {
  border: none;
  background: transparent;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: #f3f4f6;
  }
}

.time-item.is-selected {
  background: var(--primary-soft-light);
  color: var(--color-primary);
  font-weight: 600;
}

.ms-datepicker-footer {
  margin-top: 8px;
  border-top: 1px solid #e5e7eb;
  padding-top: 8px;
  display: flex;
  justify-content: center;
}

.today-btn {
  border: none;
  background: transparent;
  color: #16a34a;
  font-weight: 600;
  cursor: pointer;
}
</style>
