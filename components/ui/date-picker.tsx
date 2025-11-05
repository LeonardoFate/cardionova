"use client"

import * as React from "react"
import { format } from "date-fns"
import { es as esEC } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-between text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: esEC }) : <span>Selecciona una fecha</span>}
            </div>
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              setOpen(false);
            }}
            captionLayout="dropdown-nav"
            fromYear={currentYear - 100}
            toYear={currentYear + 10}
            locale={esEC}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
