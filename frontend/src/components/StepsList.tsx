import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-4 border-b border-slate-700/50">
        <h2 className="text-base font-bold text-white">Build Steps</h2>
        <p className="text-xs text-slate-400 mt-1">{steps.length} steps</p>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {steps.map((step, index) => (
          <div
            key={`${step.id}-${index}`}
            className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              currentStep === step.id
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 shadow-lg'
                : 'bg-slate-700/20 hover:bg-slate-700/40 border border-transparent hover:border-slate-600/50'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {step.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : step.status === 'in-progress' ? (
                  <Clock className="w-5 h-5 text-blue-400 animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-blue-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}