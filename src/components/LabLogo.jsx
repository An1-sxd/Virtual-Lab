import { FlaskConical } from "lucide-react";

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

const textSizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

export const LabLogo = ({ size = "md" }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="lab-gradient rounded-xl p-2.5 lab-glow">
        <FlaskConical className={`${sizeClasses[size]} text-primary-foreground`} />
      </div>
      <div className="flex flex-col">
        <span className={`font-display font-bold ${textSizes[size]} lab-gradient-text`}>
          VirtualLab
        </span>
        <span className="text-xs text-muted-foreground tracking-wider uppercase">
          Experiment Platform
        </span>
      </div>
    </div>
  );
};
