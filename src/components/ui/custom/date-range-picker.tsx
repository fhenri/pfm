"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  /**
   * The selected date range.
   * @default undefined
   * @type DateRange
   * @example { from: new Date(), to: new Date() }
   */
  dateRange?: DateRange

  /**
   * The number of days to display in the date range picker.
   * @default undefined
   * @type number
   * @example 7
   */
  dayCount?: number

  /**
   * The placeholder text of the calendar trigger button.
   * @default "Pick a date"
   * @type string | undefined
   */
  placeholder?: string

  /**
   * The variant of the calendar trigger button.
   * @default "outline"
   * @type "default" | "outline" | "secondary" | "ghost"
   */
  triggerVariant?: Exclude<ButtonProps["variant"], "destructive" | "link">

  /**
   * The size of the calendar trigger button.
   * @default "default"
   * @type "default" | "sm" | "lg"
   */
  triggerSize?: Exclude<ButtonProps["size"], "icon">

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  triggerClassName?: string

  column?: any
}

export function DateRangePicker({
  dateRange,
  placeholder = "Pick a date",
  triggerVariant = "outline",
  triggerSize = "default",
  triggerClassName,
  className,
  column,
  ...props
}: DateRangePickerProps) {
  
  const [date, setDate] = React.useState<DateRange | undefined>()

  const filterDate = (selected: DateRange) => {
    column?.setFilterValue(selected);
    setDate(selected);
  }

  const noFilterDate = (selected: DateRange) => {
    column?.setFilterValue(undefined);
    setDate({});
  }

  const buttonVariant = date ? "secondary" : "outline"
  
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={cn(
              "w-full justify-start truncate text-left font-normal",
              !date && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon className="mr-0 sm:mr-2 size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0", className)} {...props}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={filterDate}
            numberOfMonths={2} />
          <Button className="mb-2 mx-4 w-[calc(100%-2rem)]" variant={buttonVariant} onClick={noFilterDate}>Reset Date Filter</Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
