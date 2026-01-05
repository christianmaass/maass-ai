/**
 * Decision OS Type Definitions
 *
 * These types define the core data structures for Decision OS.
 * They are prepared for future implementation.
 */

/**
 * A decision that a user is making
 */
export interface Decision {
  id: string;
  userId: string;
  title: string;
  description?: string;
  goal: string;
  options: DecisionOption[]; // max 3
  criteria: DecisionCriterion[];
  assumptions: string[];
  uncertainty: string[];
  reversibility: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * An option being considered for a decision
 */
export interface DecisionOption {
  id: string;
  decisionId: string;
  title: string;
  description?: string;
  order: number; // 1, 2, or 3
}

/**
 * A criterion for evaluating decision options
 */
export interface DecisionCriterion {
  id: string;
  decisionId: string;
  name: string;
  weight: number; // 0-1, sum of all weights should be 1
}

/**
 * Decision Quality Score
 *
 * Evaluates decision quality across 5 dimensions, each scored 1-10
 */
export interface DecisionScore {
  id: string;
  decisionId: string;
  clarity: number; // 1-10: How clear are the goals?
  options: number; // 1-10: How well are options defined?
  assumptions: number; // 1-10: How well are assumptions identified?
  tradeoffs: number; // 1-10: How well are trade-offs understood?
  uncertainty: number; // 1-10: How well is uncertainty acknowledged?
  overall: number; // 1-10: Calculated overall score
  createdAt: Date;
}

/**
 * Decision Log Entry
 *
 * Immutable history of decisions
 */
export interface DecisionLogEntry {
  id: string;
  decisionId: string;
  userId: string;
  title: string;
  goal: string;
  score: DecisionScore;
  createdAt: Date;
  // Immutable - no updatedAt
}
