interface ProgressBarData {
  total_steps: number;
  current_step?: number;
}

interface ProgressBarProps {
  data: ProgressBarData;
}

export function ProgressBar({ data }: ProgressBarProps) {
  const { total_steps, current_step = 0 } = data;
  const progress = total_steps > 0 ? (current_step / total_steps) * 100 : 0;

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-navaa-gray-600 font-medium">
        Schritt {current_step} von {total_steps}
      </span>
      <div className="w-32 h-2 bg-navaa-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-navaa-accent transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
