import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBMIClassification } from "@/app/lib/medical-constants";

interface BMICalculatorProps {
  age: number;
  weight: number;
  height: number;
  bmi?: number;
  onAgeChange: (age: number) => void;
  onWeightChange: (weight: number) => void;
  onHeightChange: (height: number) => void;
}

export function BMICalculator({
  age,
  weight,
  height,
  bmi,
  onAgeChange,
  onWeightChange,
  onHeightChange,
}: BMICalculatorProps) {
  const classification = bmi && bmi > 0 ? getBMIClassification(bmi) : "--";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="age">
          Edad <span className="text-red-500">*</span>
        </Label>
        <Input
          id="age"
          type="number"
          value={age || ""}
          onChange={(e) => onAgeChange(Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="weight">
          Peso (kg) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          value={weight || ""}
          onChange={(e) => onWeightChange(Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="height">
          Estatura (cm) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="height"
          type="number"
          step="0.1"
          value={height || ""}
          onChange={(e) => onHeightChange(Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>IMC (Calculado)</Label>
        <div className="text-2xl font-bold text-[#1E3A8A]">
          {bmi && bmi > 0 ? bmi.toFixed(2) : "--"}
        </div>
        <div className="text-sm text-gray-600">{classification}</div>
      </div>
    </div>
  );
}
