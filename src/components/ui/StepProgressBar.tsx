import React from 'react';

interface Step {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
}

interface StepProgressBarProps {
  currentStep: number;
  steps: Step[];
  onStepClick: (stepId: number) => void;
}

const StepProgressBar = ({ currentStep, steps, onStepClick }: StepProgressBarProps) => {
  return (
    <div className="w-full px-8">
      {/* Steps Container */}
      <div className="relative flex justify-between max-w-6xl mx-auto">
        {/* Progress Line */}
        <div className="absolute top-1/2 transform -translate-y-1/2 h-0.5 bg-gray-200 w-full" />
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 h-0.5 bg-blue-500 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {steps.map((step) => (
          <div
            key={step.id}
            className="relative flex flex-col items-center group"
            onClick={() => onStepClick(step.id)}
          >
            {/* Step Circle */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                transition-all duration-300 cursor-pointer
                ${currentStep === step.id
                  ? 'bg-blue-500 border-2 border-blue-200 shadow-md'
                  : step.isComplete
                  ? 'bg-blue-500 border-2 border-blue-500'
                  : 'bg-white border-2 border-gray-300'
                }
                ${step.id < currentStep ? 'hover:scale-105' : ''}
              `}
            >
              {step.isComplete ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className={`text-xs font-semibold
                  ${currentStep === step.id ? 'text-white' : 'text-gray-500'}`}
                >
                  {step.id}
                </span>
              )}
            </div>

            {/* Step Title & Description - Adjusted spacing and width */}
            <div className="absolute -bottom-12 w-28 text-center">
              <p className={`text-xs font-medium mb-0.5
                ${currentStep === step.id ? 'text-blue-600' : 'text-gray-600'}`}
              >
                {step.title}
              </p>
              <p className={`text-[10px]
                ${currentStep === step.id ? 'text-blue-400' : 'text-gray-400'}`}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgressBar;