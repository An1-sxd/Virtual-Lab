import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LabLogo } from "@/components/LabLogo";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Download,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useExperimentState } from "@/hooks/useExperimentState";
import { AcidBaseSetup } from "@/components/experiment/AcidBaseSetup";
import { ReactionEquations } from "@/components/experiment/ReactionEquations";
import { GraphsVisualization } from "@/components/experiment/GraphsVisualization";
import { Save } from "lucide-react";
import ChatBox from "../components/ChatBox";

const Experiment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewExperiment = id === "new";

  const {
    state,
    calculated,
    pHCurveData,
    titratedVolume,
    setTitratedVolume,
    setAcid,
    setBase,
    runSimulation,
    pauseSimulation,
    resetSimulation,
    addReagent,
    removeReagent,
  } = useExperimentState();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <ChatBox />
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <LabLogo size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Experiment Title */}
          <div className="mb-6">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              {isNewExperiment ? "Acid-Base Titration" : `Experiment #${id}`}
            </h1>
            <p className="text-muted-foreground">
              {isNewExperiment 
                ? "Simulate acid-base titration reactions and visualize pH changes"
                : "Continue working on your experiment"
              }
            </p>
          </div>

          {/* Tabs for Experiment Structure */}
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="setup">Acid & Base Setup / Reaction & Equations</TabsTrigger>
              <TabsTrigger value="graphs">Graphs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Box 1: Acid & Base Setup */}
                <AcidBaseSetup
                  state={state}
                  calculated={calculated}
                  titratedVolume={titratedVolume}
                  onAcidChange={setAcid}
                  onBaseChange={setBase}
                  onReset={resetSimulation}
                  onVolumeChange={setTitratedVolume}
                  maxVolume={calculated.equivalencePoint > 0 ? calculated.equivalencePoint * 2 : 50}
                  runSimulation={runSimulation}
                  pauseSimulation={pauseSimulation}
                  resetSimulation={resetSimulation}
                />

                {/* Box 2: Reaction & Equations */}
                <ReactionEquations
                  state={state}
                  calculated={calculated}
                  titratedVolume={titratedVolume}
                />
              </div>
            </TabsContent>

            <TabsContent value="graphs">
              {/* Box 3: Graphs & Visualization */}
              <GraphsVisualization
                state={state}
                calculated={calculated}
                pHCurveData={pHCurveData}
                titratedVolume={titratedVolume}
              />
            </TabsContent>
          </Tabs>

          {/* Simulation Controls - Moved to Bottom */}
          {/* <div className="lab-card p-4 mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="labPrimary" 
                size="lg" 
                className="gap-2"
                onClick={runSimulation}
                disabled={state.isRunning && !state.isPaused}
              >
                <Play className="h-5 w-5" />
                {state.isRunning && !state.isPaused ? 'Running...' : 'Run Simulation'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2"
                onClick={pauseSimulation}
                disabled={!state.isRunning || state.isPaused}
              >
                <Pause className="h-5 w-5" />
                Pause
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2"
                onClick={resetSimulation}
              >
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default Experiment;
