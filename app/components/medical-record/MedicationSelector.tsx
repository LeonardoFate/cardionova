import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { COMMON_MEDICATIONS } from "@/app/lib/medical-constants";

interface MedicationSelectorProps {
  medications: string[];
  onAdd: (medication: string) => void;
  onRemove: (index: number) => void;
  label: string;
}

export function MedicationSelector({
  medications,
  onAdd,
  onRemove,
  label,
}: MedicationSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (medication: string) => {
    onAdd(medication);
    setInputValue("");
    setShowSuggestions(false);
  };

  const filteredSuggestions = COMMON_MEDICATIONS.filter((med) =>
    med.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {/* Input with suggestions */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Agregar medicamento..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />

            {/* Suggestions dropdown */}
            {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="p-2 text-xs text-gray-500 border-b">
                  Medicamentos comunes:
                </div>
                {filteredSuggestions.map((med) => (
                  <button
                    key={med}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => handleSelectSuggestion(med)}
                  >
                    {med}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={handleAdd}
            size="sm"
            variant="outline"
            className="text-[#1E3A8A]"
          >
            <Plus className="w-4 h-4 mr-1" /> Agregar
          </Button>
        </div>

        {/* Common medications quick add */}
        {!inputValue && (
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs text-gray-500 mr-2">Medicamentos comunes:</span>
            {COMMON_MEDICATIONS.slice(0, 5).map((med) => (
              <button
                key={med}
                type="button"
                onClick={() => handleSelectSuggestion(med)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              >
                {med}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected medications list */}
      {medications.length > 0 && (
        <div className="space-y-2">
          {medications.map((med, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
            >
              <span className="text-sm">{med}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
