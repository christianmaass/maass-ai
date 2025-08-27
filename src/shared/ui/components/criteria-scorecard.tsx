interface Criterion {
  name: string;
  description: string;
}

interface CriteriaScorecardProps {
  title: string;
  text: string;
  criteria: Criterion[];
}

export function CriteriaScorecard({ title, text, criteria }: CriteriaScorecardProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-navaa-gray-900 mb-6">{title}</h2>

      <p className="text-lg text-navaa-gray-700 mb-12 max-w-3xl mx-auto">{text}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {criteria.map((criterion, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-navaa-accent/10 text-navaa-accent rounded-full mx-auto mb-4">
              <span className="text-lg font-bold">{index + 1}</span>
            </div>

            <h3 className="text-lg font-semibold text-navaa-gray-900 mb-3">{criterion.name}</h3>

            <p className="text-navaa-gray-600 text-sm">{criterion.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
