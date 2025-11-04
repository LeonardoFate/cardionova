import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                    ${
                      isCompleted
                        ? "bg-[#1E3A8A] border-[#1E3A8A] text-white"
                        : isCurrent
                        ? "border-[#1E3A8A] text-[#1E3A8A] bg-white"
                        : "border-gray-300 text-gray-400 bg-white"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-medium ${
                      isCurrent ? "text-[#1E3A8A]" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400 hidden md:block">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-all ${
                    isCompleted ? "bg-[#1E3A8A]" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
