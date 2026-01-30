import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LabLogo } from "@/components/LabLogo";
import { MoleculeDecoration } from "@/components/MoleculeDecoration";
import { ExperimentSelector } from "@/components/ExperimentSelector";
import { Plus, FolderOpen, Sparkles } from "lucide-react";

const Index = () => {
  const [showSelector, setShowSelector] = useState(false);
  const navigate = useNavigate();

  const handleCreateExperiment = () => {
    navigate("/experiment/new");
  };

  return (
    <div className="min-h-screen bg-background lab-pattern relative overflow-hidden">
      <MoleculeDecoration />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 lab-grid opacity-30" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 md:p-8">
          <LabLogo size="md" />
        </header>

        {/* Hero section */}
        <main className="flex-1 flex items-center justify-center px-6 pb-20">
          <div className="text-center max-w-2xl animate-slide-up">
            {/* Greeting */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm text-secondary-foreground mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Welcome to your virtual laboratory</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Design, Run & Analyze
              <span className="block lab-gradient-text">Experiments</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
              A powerful platform to create virtual experiments, simulate outcomes, and discover insights through data-driven analysis.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="labPrimary"
                size="xl"
                onClick={handleCreateExperiment}
                className="w-full sm:w-auto min-w-[200px]"
              >
                <Plus className="h-5 w-5" />
                Create Experiment
              </Button>

              <Button
                variant="labSecondary"
                size="xl"
                onClick={() => setShowSelector(true)}
                className="w-full sm:w-auto min-w-[200px]"
              >
                <FolderOpen className="h-5 w-5" />
                Load Experiment
              </Button>
            </div>

            {/* Experiment Selector */}
            {showSelector && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
                <ExperimentSelector onClose={() => setShowSelector(false)} />
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-muted-foreground">
          <p>© 2024 VirtualLab. Built for scientific exploration.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
