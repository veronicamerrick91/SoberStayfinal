import * as React from "react"
import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  disabled?: boolean
  "data-testid"?: string
  fromYear?: number
  toYear?: number
  disableFuture?: boolean
  disablePast?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  required,
  disabled,
  "data-testid": testId,
  fromYear = 1920,
  toYear = 2030,
  disableFuture,
  disablePast,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    const parsed = parse(value, "yyyy-MM-dd", new Date())
    return isNaN(parsed.getTime()) ? undefined : parsed
  }, [value])

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"))
      setOpen(false)
    }
  }

  const disabledDays = React.useMemo(() => {
    const disabled: Array<{ after?: Date; before?: Date }> = []
    if (disableFuture) disabled.push({ after: new Date() })
    if (disablePast) disabled.push({ before: new Date() })
    return disabled
  }, [disableFuture, disablePast])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          data-testid={testId}
          className={cn(
            "w-full justify-start text-left font-normal bg-background/50 border-border",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          captionLayout="dropdown"
          defaultMonth={selectedDate}
          startMonth={new Date(fromYear, 0)}
          endMonth={new Date(toYear, 11)}
          disabled={disabledDays.length > 0 ? disabledDays : undefined}
        />
      </PopoverContent>
    </Popover>
  )
}
