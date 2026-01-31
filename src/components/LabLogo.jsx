export const LabLogo = ({ size = "md" }) => {
  const sizeMap = {
    sm: { img: "h-8", text: "text-lg", gap: "gap-2" },
    md: { img: "h-12", text: "text-2xl", gap: "gap-3" },
    lg: { img: "h-16", text: "text-4xl", gap: "gap-4" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center ${currentSize.gap}`}>
      <img 
        src="/assets/images/beaker_logo.png" 
        alt="Logo" 
        className={`${currentSize.img} w-auto object-contain mix-blend-multiply`}
      />
      <div className="flex flex-col leading-none">
        <span className={`font-display font-bold ${currentSize.text} text-[#1a5b8a] dark:text-[#23c4c4]`}>
          Virtual
        </span>
        <span className={`font-display font-bold ${currentSize.text} text-[#1a5b8a] dark:text-[#23c4c4]`}>
          Lab
        </span>
      </div>
    </div>
  );
};
