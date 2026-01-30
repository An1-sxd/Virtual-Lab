import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Beaker, Calendar, ArrowRight } from "lucide-react";

// Mock data - replace with actual data source
const mockExperiments = [
  { id: "1", name: "Protein Synthesis Analysis", lastModified: "2024-01-28", status: "active" },
  { id: "2", name: "Cell Division Study", lastModified: "2024-01-25", status: "completed" },
  { id: "3", name: "Chemical Reaction Kinetics", lastModified: "2024-01-20", status: "paused" },
  { id: "4", name: "DNA Sequencing Project", lastModified: "2024-01-15", status: "active" },
];

const statusColors = {
  active: "bg-emerald-500",
  completed: "bg-primary",
  paused: "bg-amber-500",
};

export const ExperimentSelector = ({ onClose }) => {
  const [selectedExperiment, setSelectedExperiment] = useState("");
  const navigate = useNavigate();

  const handleLoadExperiment = () => {
    if (selectedExperiment) {
      navigate(`/experiment/${selectedExperiment}`);
    }
  };

  const selected = mockExperiments.find((e) => e.id === selectedExperiment);

  return (
    <div className="animate-scale-in lab-card p-6 w-full max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="lab-gradient rounded-lg p-2">
          <Beaker className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">Load Experiment</h3>
          <p className="text-sm text-muted-foreground">Select a project to continue</p>
        </div>
      </div>

      <Select value={selectedExperiment} onValueChange={setSelectedExperiment}>
        <SelectTrigger className="w-full h-12 text-base">
          <SelectValue placeholder="Choose an experiment..." />
        </SelectTrigger>
        <SelectContent className="bg-popover border border-border">
          {mockExperiments.map((experiment) => (
            <SelectItem
              key={experiment.id}
              value={experiment.id}
              className="cursor-pointer py-3"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${statusColors[experiment.status]}`} />
                <span>{experiment.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selected && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last modified: {selected.lastModified}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <div className={`w-2 h-2 rounded-full ${statusColors[selected.status]}`} />
            <span className="capitalize">{selected.status}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button
          variant="labPrimary"
          onClick={handleLoadExperiment}
          disabled={!selectedExperiment}
          className="flex-1"
        >
          Open <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
