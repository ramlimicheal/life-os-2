"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, FolderOpen, Brain, Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Welcome to Life 2.0",
    description:
      "Your AI-powered second brain that automatically organizes your knowledge, projects, and learning across every area of your life.",
    icon: Sparkles,
    color: "text-purple-400",
  },
  {
    title: "Capture Everything",
    description:
      "Create notes using natural language commands. Just describe what you want to save, and our AI will automatically categorize and organize it for you.",
    icon: Brain,
    color: "text-blue-400",
  },
  {
    title: "Organize by Projects",
    description:
      "Group related notes into projects. Whether it's business, academic, or personal - keep everything organized and accessible.",
    icon: FolderOpen,
    color: "text-green-400",
  },
  {
    title: "Knowledge Lab",
    description:
      "Explore your knowledge across disciplines. From social sciences to humanities, build connections between ideas and discover new insights.",
    icon: Sparkles,
    color: "text-yellow-400",
  },
];

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <Modal isOpen={isOpen} onClose={handleSkip} size="md">
      <div className="text-center py-4">
        <div className="flex justify-center mb-6">
          <div
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30"
            )}
          >
            <Icon className={cn("w-10 h-10", step.color)} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">{step.title}</h2>
        <p className="text-gray-400 leading-relaxed mb-8 max-w-sm mx-auto">
          {step.description}
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentStep
                  ? "w-8 bg-purple-500"
                  : index < currentStep
                  ? "bg-purple-500/50"
                  : "bg-gray-600"
              )}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            Skip tour
          </button>
          <Button variant="primary" onClick={handleNext}>
            {isLastStep ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
