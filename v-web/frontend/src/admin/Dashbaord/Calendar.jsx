import React, { useState } from "react";
import { X } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isBefore,
  isAfter,
  isWithinInterval,
} from "date-fns";
import { useDashboard } from "../../../Context/DashboardContext";

const Calendar = ({ onClose }) => {
  const { dateRange, setDateRange } = useDashboard();
  const [currentMonth, setCurrentMonth] = React.useState(
    dateRange.startDate || new Date()
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = monthStart.getDay();
  const endDay = monthEnd.getDay();
  const daysToShow = [];

  for (let i = 0; i < startDay; i++) {
    const prevDate = new Date(monthStart);
    prevDate.setDate(prevDate.getDate() - (startDay - i));
    daysToShow.push(prevDate);
  }

  daysToShow.push(...monthDays);

  const remainingDays = 42 - daysToShow.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(monthEnd);
    nextDate.setDate(nextDate.getDate() + i);
    daysToShow.push(nextDate);
  }

  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const handleDateClick = (date) => {
    if (!isSameMonth(date, currentMonth)) return;

    if (
      dateRange.startDate &&
      !dateRange.endDate &&
      isSameDay(date, dateRange.startDate)
    ) {
      setDateRange({
        startDate: null,
        endDate: null,
      });
      return;
    }

    if (
      dateRange.startDate &&
      dateRange.endDate &&
      (isSameDay(date, dateRange.startDate) ||
        isSameDay(date, dateRange.endDate))
    ) {
      setDateRange({
        startDate: null,
        endDate: null,
      });
      return;
    }

    if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
      setDateRange({
        startDate: date,
        endDate: null,
      });
    } else {
      let newStartDate = dateRange.startDate;
      let newEndDate = date;

      if (isBefore(newEndDate, newStartDate)) {
        [newStartDate, newEndDate] = [newEndDate, newStartDate];
      }

      setDateRange({
        startDate: newStartDate,
        endDate: newEndDate,
      });

      if (onClose) onClose();
    }
  };

  const isDateSelected = (date) => {
    if (dateRange.startDate && isSameDay(date, dateRange.startDate))
      return true;
    if (dateRange.endDate && isSameDay(date, dateRange.endDate)) return true;
    return false;
  };

  const isDateInRange = (date) => {
    if (!dateRange.startDate || !dateRange.endDate) return false;
    return isWithinInterval(date, {
      start: dateRange.startDate,
      end: dateRange.endDate,
    });
  };

  const handlePrevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="w-full mx-auto bg-white p-2 sm:p-4 rounded-3xl shadow-lg relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-gray-100 rounded-full">
            <svg
              fill="none"
              viewBox="0 0 24 25"
              xmlns="http://www.w3.org/2000/svg"
              className="size-6"
            >
              <path
                d="M7 4.866v-1.5m10 1.5v-1.5"
                stroke="#000"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
              <path
                d="M9 15.366l1.5-1.5v4"
                stroke="#000"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
              <path
                d="M21.5 9.866H10.75m-8.75 0h3.875m7.125 7v-2a1 1 0 012 0v2a1 1 0 01-2 0z"
                stroke="#000"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
              <path
                d="M14 22.866h-4c-3.771 0-5.657 0-6.828-1.172C2.001 20.522 2 18.637 2 14.866v-2c0-3.77 0-5.657 1.172-6.828C4.344 4.868 6.229 4.866 10 4.866h4c3.771 0 5.657 0 6.828 1.172C21.999 7.21 22 9.095 22 12.866v2c0 3.771 0 5.657-1.172 6.828-.653.654-1.528.943-2.828 1.07"
                stroke="#000"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Calendar</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <span className="text-[10px] sm:text-xs font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 sm:gap-0 text-center text-xs font-semibold text-gray-500 mb-2">
        {days.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysToShow.map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            className={`w-7 sm:w-10 h-7 sm:h-10 flex items-center justify-center rounded-full text-[10px] sm:text-xs font-medium ${
              !isSameMonth(date, currentMonth) ? "text-gray-400" : ""
            } ${
              isDateSelected(date)
                ? "!bg-lime-500 text-white"
                : isDateInRange(date)
                ? "bg-lime-100"
                : ""
            }`}
          >
            {format(date, "d")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
