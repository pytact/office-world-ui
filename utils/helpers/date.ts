// Date Utility Functions
// Helper functions for date operations, especially for leave management

/**
 * Checks if a date is a weekend (Saturday or Sunday)
 * @param date - Date string in YYYY-MM-DD format or Date object
 * @returns true if the date is Saturday or Sunday, false otherwise
 */
export function isWeekend(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? new Date(date + "T00:00:00") : date;
  const day = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6;
}

/**
 * Gets the next working day (skips weekends)
 * @param date - Date string in YYYY-MM-DD format or Date object
 * @returns Date string in YYYY-MM-DD format for the next working day
 */
export function getNextWorkingDay(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date + "T00:00:00") : new Date(date);
  let nextDay = new Date(dateObj);
  
  // Move to next day
  nextDay.setDate(nextDay.getDate() + 1);
  
  // Skip weekends
  while (isWeekend(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  // Format as YYYY-MM-DD
  const year = nextDay.getFullYear();
  const month = String(nextDay.getMonth() + 1).padStart(2, "0");
  const day = String(nextDay.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
}

/**
 * Gets the previous working day (skips weekends)
 * @param date - Date string in YYYY-MM-DD format or Date object
 * @returns Date string in YYYY-MM-DD format for the previous working day
 */
export function getPreviousWorkingDay(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date + "T00:00:00") : new Date(date);
  let prevDay = new Date(dateObj);
  
  // Move to previous day
  prevDay.setDate(prevDay.getDate() - 1);
  
  // Skip weekends
  while (isWeekend(prevDay)) {
    prevDay.setDate(prevDay.getDate() - 1);
  }
  
  // Format as YYYY-MM-DD
  const year = prevDay.getFullYear();
  const month = String(prevDay.getMonth() + 1).padStart(2, "0");
  const day = String(prevDay.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
}

/**
 * Adjusts a date to the nearest working day (if it's a weekend, moves to next Monday)
 * @param date - Date string in YYYY-MM-DD format
 * @returns Date string in YYYY-MM-DD format for the nearest working day
 */
export function adjustToWorkingDay(date: string): string {
  if (!isWeekend(date)) {
    return date;
  }
  
  const dateObj = new Date(date + "T00:00:00");
  let adjustedDate = new Date(dateObj);
  
  // If Saturday, move to next Monday
  if (adjustedDate.getDay() === 6) {
    adjustedDate.setDate(adjustedDate.getDate() + 2);
  }
  // If Sunday, move to next Monday
  else if (adjustedDate.getDay() === 0) {
    adjustedDate.setDate(adjustedDate.getDate() + 1);
  }
  
  // Format as YYYY-MM-DD
  const year = adjustedDate.getFullYear();
  const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
  const day = String(adjustedDate.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
}

/**
 * Filters a date range to exclude weekends
 * Adjusts start_date to the next working day if it's a weekend
 * Adjusts end_date to the previous working day if it's a weekend
 * @param startDate - Start date string in YYYY-MM-DD format
 * @param endDate - End date string in YYYY-MM-DD format
 * @returns Object with adjusted start_date and end_date (both as working days)
 */
export function filterWeekendsFromDateRange(
  startDate: string,
  endDate: string
): { start_date: string; end_date: string } {
  // Adjust start date to working day (if weekend, move to next Monday)
  let adjustedStart = adjustToWorkingDay(startDate);
  
  // Adjust end date to working day (if weekend, move to previous Friday)
  let adjustedEnd = endDate;
  if (isWeekend(endDate)) {
    adjustedEnd = getPreviousWorkingDay(endDate);
  }
  
  // Ensure end_date is not before start_date after adjustments
  const startObj = new Date(adjustedStart + "T00:00:00");
  const endObj = new Date(adjustedEnd + "T00:00:00");
  
  if (endObj < startObj) {
    // If end date is before start date after adjustment, set end_date = start_date
    adjustedEnd = adjustedStart;
  }
  
  return {
    start_date: adjustedStart,
    end_date: adjustedEnd,
  };
}

