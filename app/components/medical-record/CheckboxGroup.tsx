import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxGroupProps {
  options: readonly string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  label?: string;
  columns?: number;
}

export function CheckboxGroup({
  options,
  selectedValues,
  onToggle,
  label,
  columns = 2,
}: CheckboxGroupProps) {
  const gridClass = `grid grid-cols-1 md:grid-cols-${columns} gap-3`;

  return (
    <div className="space-y-3">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className={gridClass}>
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={selectedValues.includes(option)}
              onCheckedChange={() => onToggle(option)}
            />
            <label
              htmlFor={option}
              className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
