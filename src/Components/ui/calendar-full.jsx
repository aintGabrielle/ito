import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  isSameDay,
  subMonths,
} from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function CalendarFull({ onDateSelect, className, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const isMobile = useIsMobile();

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const startingDayOfWeek = getDay(firstDayOfMonth);

  const today = new Date();

  const days = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    days.push(date);
  }

  return (
    <div className={cn("mx-auto w-full max-w-3xl", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={day}
            className="py-2 font-medium text-center text-muted-foreground"
          >
            {isMobile ? day.charAt(0) : day}
          </div>
        ))}

        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="p-1 aspect-square" />;
          }

          const isToday = isSameDay(date, today);
          const isSelected = selectedDate
            ? isSameDay(date, selectedDate)
            : false;

          return (
            <div
              key={date.toString()}
              className={cn(
                "aspect-square p-1 border border-border rounded-md",
                "hover:bg-accent hover:text-accent-foreground transition-colors",
                "cursor-pointer",
                isToday && "bg-primary/10 border-primary",
                isSelected && "bg-primary text-primary-foreground"
              )}
              onClick={() => onDateSelect?.(date)}
            >
              <div className="flex flex-col h-full">
                <div
                  className={cn(
                    "text-xs md:text-sm text-right p-1",
                    isToday && !isSelected && "font-bold text-primary",
                    isSelected && "font-bold"
                  )}
                >
                  {date.getDate()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
