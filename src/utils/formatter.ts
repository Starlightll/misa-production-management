/**
 * Hàm định dạng số
 * @param {*} value 
 * @returns 
 * createdby: pdthien - 15.10.2025
 */
export const formatNumber = (value: any) => {
  if (value === null || value === undefined || value === '') return '-';
  const numericValue = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(numericValue)) {
    return String(value);
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(numericValue);
};

/**
 * Hàm định dạng ngày tháng
 * @param {*} value 
 * @returns 
 * createdby: pdthien - 15.10.2025
 */
export const formatDate = (value: any) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).padStart(4, '0');
  return `${day}/${month}/${year}`;
};

/**
 * Hàm định dạng giờ phút
 * @param {*} value
 * @returns
 * createdby: pdthien - 15.10.2025
 */
export const formatTime = (value: any) => {
  if (value === null || value === undefined || value === '') return '-';

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const timeMatch = trimmed.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
    if (timeMatch) {
      const hours = timeMatch[1].padStart(2, '0');
      const minutes = timeMatch[2].padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Hàm định dạng chuỗi
 * @param {*} value 
 * @returns 
 * createdby: pdthien - 15.10.2025
 */
export const formatText = (value: any) => {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
};
