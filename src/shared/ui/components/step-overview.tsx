import Link from 'next/link';
import Image from 'next/image';

/**
 * Represents a single step in the onboarding process
 * @typedef {Object} Step
 * @property {string} id - Unique identifier for the step
 * @property {number} number - Step number in the sequence (1-based)
 * @property {string} title - Display title of the step
 * @property {string} description - Brief description of what the step covers
 * @property {string} url - Navigation URL for the step
 * @property {string} image_url - Path to the step's visual image
 */
interface Step {
  id: string;
  number: number;
  title: string;
  description: string;
  url: string;
  image_url: string;
}

/**
 * Props for the StepOverview component
 * @typedef {Object} StepOverviewProps
 * @property {string} title - Main heading for the step overview section
 * @property {Step[]} steps - Array of step objects to display
 */
interface StepOverviewProps {
  title: string;
  steps: Step[];
}

/**
 * StepOverview component displays a grid of interactive step cards for onboarding processes.
 * Each card shows an image, step number, title, and description with hover effects.
 *
 * Features:
 * - Responsive grid layout (1 column on mobile, 5 columns on desktop)
 * - Interactive cards with hover animations (scale and shadow effects)
 * - Next.js Image optimization with object-cover for consistent image display
 * - Accessible navigation with proper link semantics
 * - Step numbers highlighted in brand accent color
 * - Equal height cards using flexbox
 *
 * @param {StepOverviewProps} props - Component props
 * @param {string} props.title - Section heading text
 * @param {Step[]} props.steps - Array of step data objects
 * @returns {JSX.Element} Grid of step cards with navigation
 *
 * @example
 * ```tsx
 * <StepOverview
 *   title="Die 5 Schritte der Fallbearbeitung"
 *   steps={STRATEGY_ONBOARDING_STEPS}
 * />
 * ```
 */
export function StepOverview({ title, steps }: StepOverviewProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-navaa-gray-900 mb-12">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {steps.map((step) => (
          <Link key={step.id} href={step.url} className="group block">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105 overflow-hidden flex flex-col">
              {/* Step Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={step.image_url}
                  alt={`${step.title} visual`}
                  fill={true}
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 text-center flex-1 flex flex-col justify-center">
                {/* Step Title with Number */}
                <h3 className="text-xl font-semibold text-navaa-gray-900 mb-2">
                  <span className="text-navaa-accent font-bold">{step.number}.</span> {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-navaa-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
