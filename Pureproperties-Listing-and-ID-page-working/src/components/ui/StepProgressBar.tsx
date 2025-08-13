import React from 'react';

type Step = {
  id: number;
  title: string;
  description: string;
  isComplete?: boolean;
};

interface StepProgressBarProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export default function StepProgressBar({ steps, currentStep, onStepClick }: StepProgressBarProps) {
  return (
    <div className="w-full py-6 px-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isClickable = (step.id >= 3 && step.id <= 6) || step.id === currentStep;
          
          return (
            <div 
              key={step.id} 
              className={`relative flex flex-col items-center ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              onClick={() => isClickable ? onStepClick(step.id) : null}
            >
              {/* Line */}
              {index !== 0 && (
                <div
                  className={`absolute left-0 right-0 top-5 h-0.5 -translate-x-1/2 w-full
                    ${step.isComplete ? 'bg-green-500' : 
                      currentStep > index ? 'bg-blue-600' : 'bg-gray-300'}`}
                />
              )}
              
              {/* Circle and Number */}
              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-full 
                  ${step.isComplete ? 'bg-green-500 text-white' :
                    currentStep > index
                      ? 'bg-blue-600 text-white'
                      : currentStep === index
                      ? 'border-2 border-blue-600 text-blue-600'
                      : 'border-2 border-gray-300 text-gray-300'}`}
              >
                {step.isComplete || currentStep > index ? (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              
              {/* Title and Description */}
              <div className="mt-3 text-center min-w-[100px] px-2">
                <div className="text-sm font-medium whitespace-nowrap">{step.title}</div>
                <div className="text-xs text-gray-500 whitespace-nowrap">{step.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}