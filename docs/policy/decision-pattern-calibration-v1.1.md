# Decision Pattern Calibration Policy v1.1

**Version:** 1.1  
**Status:** Post Smoke Test Calibration  
**Target Audience:** Reasoning System  
**Optimization Goal:** Executive Realism, Decision Relief Under Pressure

---

## Executive Summary

This policy recalibrates Decision OS pattern detection based on Phase 1 smoke test results (10/20 correct). The system must behave like a **senior sparring partner**, not a logic examiner. It optimizes for **decision relief under pressure**, assuming users are competent executives making real business trade-offs.

**Core Principle:** Legitimate executive decisions with measurable objectives and explicit criteria are valid decision spaces and must NOT be flagged as errors. Only true reasoning flaws (false certainty, untested assumptions) should trigger interventions.

**Success Criterion:** After implementing this spec, false positives in Phase-1 smoke tests should drop significantly. The system should feel like a senior decision coach, not a rules engine.

---

## Step 1: TR-01 Redefinition (Means-before-Ends Bias)

### Operational Definition

TR-01 fires **ONLY** when **ALL** of the following conditions apply:

1. **Options are implementation choices** (`options_are_implementations === true`)
2. **Objective is effect-based but lacks constraints** (`objective_is_effect === true` AND `objective_present === true` BUT no explicit constraints mentioned: cost, time, risk, quality)
3. **No plausible mechanism or causal logic is stated** (`causal_link_explicit === false`)
4. **Status quo is explicitly excluded** (`status_quo_excluded === true`)

### Explicit Criteria (All Must Hold)

```
TR-01 = options_are_implementations 
      && objective_is_effect 
      && objective_present
      && !objective_has_constraints  // NEW: Must lack constraints
      && !causal_link_explicit
      && status_quo_excluded
```

**Critical Change:** TR-01 now requires that the objective is effect-based BUT lacks constraints. If constraints (cost, time, risk, quality) are mentioned, TR-01 does NOT fire, even without evidence.

### TR-01 MUST Fire (Flawed Decisions)

**Example 1: Tool Selection Without Constraints**
```
Decision: "We need to choose between Tool A, Tool B, or Tool C."
Objective: "Improve team efficiency" (effect-based, but no constraints)
Status Quo: Explicitly excluded
Evidence: None
Constraints: None mentioned
→ TR-01 FIRES: Selecting implementation without constraints or mechanism
```

**Example 2: Framework Choice Without Criteria**
```
Decision: "Should we use React or Vue for the frontend?"
Objective: "Better user experience" (effect-based, but no constraints)
Status Quo: Cannot stay with current
Evidence: None
Constraints: None mentioned
→ TR-01 FIRES: Means chosen without constraints or causal logic
```

**Example 3: Vendor Selection Without Operational Criteria**
```
Decision: "AWS vs Azure vs GCP for cloud hosting"
Objective: "Improve scalability" (effect-based, but no constraints)
Status Quo: Must switch
Evidence: None
Constraints: None mentioned
→ TR-01 FIRES: Implementation selected without constraints or mechanism
```

### TR-01 MUST NOT Fire ("Executive Trade-off Safe Harbor")

**Safe Harbor Conditions** (if ANY applies, TR-01 does NOT fire):

1. **Standard executive trade-off** (e.g., Hire vs Train, Cloud vs On-Prem, Chatbot vs Headcount)
2. **Objective is measurable or constrained** (cost mentioned, time mentioned, risk mentioned, quality mentioned)
3. **Explicit criteria are stated** (cost minimization, response time targets, risk tolerance, quality thresholds)
4. **Status quo is included** OR **decision is framed as conscious comparison** (`status_quo_excluded === false`)

**Example 1: Hire vs Train (Standard Trade-off)**
```
Decision: "Hire externally or train existing employee"
Objective: "Fill expertise gap while managing costs" (effect + constraint: cost)
Status Quo: May or may not be excluded
Evidence: None
Constraints: Cost mentioned
→ TR-01 DOES NOT FIRE: Standard trade-off with constraint
```

**Example 2: Build vs Buy Analytics (With Constraint)**
```
Decision: "Build in-house or purchase SaaS"
Objective: "Reduce long-term costs while ensuring scalability" (effect + constraints: cost, scalability)
Status Quo: Not excluded
Evidence: None
Constraints: Cost, scalability mentioned
→ TR-01 DOES NOT FIRE: Objective has constraints
```

**Example 3: Native App vs Web App (With Criteria)**
```
Decision: "Native app or web app"
Objective: "Improve user experience" (effect-based)
Status Quo: Not excluded
Evidence: None
Constraints: Speed vs platform independence mentioned (implicit criteria)
→ TR-01 DOES NOT FIRE: Conscious comparison, not premature selection
```

**Example 4: Support Headcount vs Chatbot (Standard Trade-off)**
```
Decision: "Expand support team or implement chatbot"
Objective: "Keep response times under 2 hours and increase satisfaction" (effect + constraint: time)
Status Quo: Not excluded
Evidence: None
Constraints: Time (2 hours) mentioned
→ TR-01 DOES NOT FIRE: Standard trade-off with explicit constraint
```

### Decision Heuristic

**Before flagging TR-01, ask:**

> "Is this a standard executive trade-off with measurable/constrained objectives OR does the objective lack constraints?"

**If standard trade-off OR constraints present → Do NOT fire TR-01**  
**If objective lacks constraints AND no mechanism stated → Fire TR-01**

**If uncertain:** Defer to TR-02 (clarifying question) instead of firing TR-01.

---

## Step 2: TR-02 Reframing (Soft Pattern - Objective Sharpening)

### Revised Definition

**TR-02 is a SOFT PATTERN** that:
- **Does NOT invalidate a decision**
- **Does NOT block decision evaluation**
- **Only asks short clarifying questions**
- **Never overrides TR-01 or TR-03**
- **Has LOWEST priority** (only fires if TR-03 and TR-01 do not fire)

### When TR-02 Fires

TR-02 fires when:
- Objective is missing (`objective_present === false`) OR
- Objective is thematic, not an effect (`objective_is_effect === false`)
- AND no other pattern (TR-01, TR-03) is detected

### User-Facing Clarifying Questions

**Question 1 (Missing Objective):**
> "What does success mean here—cost, speed, or quality?"

**Question 2 (Thematic Objective):**
> "By when does this objective need to be achieved?"

**Question 3 (Vague Effect):**
> "What specific outcome are you trying to achieve? (e.g., 'reduce costs by 20%' or 'improve customer satisfaction')"

**Tone:** Supportive, clarifying, not corrective. Assume the user is competent and help them articulate what they already know.

### TR-02 Intervention Text

**Old (Blocking):**
> "The objective is not clear enough to evaluate options."

**New (Clarifying):**
> "What does success mean here—cost, speed, or quality?"

**Alternative (Time-bound):**
> "By when does this objective need to be achieved?"

### TR-02 Behavior

- **Judgment:** Consider NOT marking as FRAGILE (or use separate flag for soft patterns)
- **Priority:** Only fires if TR-03 and TR-01 do not fire
- **Purpose:** Articulation aid, not reasoning flaw detection

---

## Step 3: TR-03 Fix (Outcome-as-Validation Bias)

### Updated Definition

**TR-03 fires when:**
- Assumptions are phrased as **guaranteed outcomes** (false certainty)
- Strategic options are compared **without evidence or criteria**
- Examples: Enterprise vs SMB; Sales vs Marketing; Pilot vs Parallel Rollout

**TR-03 must NOT fire when:**
- There is a **plausible or commonly accepted causal chain**, even without data
- Examples: Bugs → CSAT risk; Downtime → Revenue loss; More headcount → Faster response

### Explicit Criteria

```
TR-03 = !options_are_implementations
      && assumptions_are_outcomes
      && !causal_link_explicit
      && assumptions_are_guaranteed  // NEW: Must be phrased as certainty
```

**Critical Change:** TR-03 now distinguishes between:
- **False certainty** (guaranteed outcomes without evidence) → TR-03 fires
- **Reasonable risk management** (plausible causal chains) → TR-03 does NOT fire

### TR-03 MUST Fire (False Certainty)

**Example 1: Enterprise vs SMB (Guaranteed Outcomes)**
```
Decision: "Enterprise clients or small businesses"
Objective: "Increase annual revenue by 15%"
Assumptions: "We assume targeting enterprise will yield larger contracts" (guaranteed outcome)
Evidence: None
Causal Logic: Not stated
→ TR-03 FIRES: Assumptions phrased as guaranteed outcomes without evidence
```

**Example 2: Subscription vs One-time (False Certainty)**
```
Decision: "Subscription model or one-time purchase"
Objective: "Sustainable growth"
Assumptions: "Subscription will increase customer loyalty" (guaranteed outcome)
Evidence: None
Causal Logic: Not stated
→ TR-03 FIRES: False certainty about outcomes
```

**Example 3: International Rollout (Guaranteed Outcomes)**
```
Decision: "Pilot in one country or parallel start"
Objective: "Successful global expansion"
Assumptions: "Pilot minimizes risks and delivers learnings" (guaranteed outcomes)
Evidence: None
Causal Logic: Not stated
→ TR-03 FIRES: Strategic options with guaranteed assumptions
```

### TR-03 MUST NOT Fire (Reasonable Risk Management)

**Example 1: Delay Launch for QA (Plausible Causal Chain)**
```
Decision: "Delay launch for additional QA tests"
Objective: "Don't jeopardize customer satisfaction with bugs"
Assumptions: "Extra tests → fewer bugs → satisfied customers" (plausible chain)
Evidence: None (but causal logic is clear)
→ TR-03 DOES NOT FIRE: Plausible causal chain, not false certainty
```

**Example 2: Sales Headcount vs Marketing (Plausible Chain)**
```
Decision: "Expand sales team or invest in online marketing"
Objective: "Increase sales by 10%"
Assumptions: "More salespeople increase revenue" (plausible chain)
Evidence: None
Causal Logic: Implicit but reasonable
→ TR-03 DOES NOT FIRE: Reasonable risk management, not false certainty
```

**Example 3: Support Headcount vs Chatbot (Commonly Accepted)**
```
Decision: "Expand support team or implement chatbot"
Objective: "Keep response times under 2 hours"
Assumptions: "More personnel increases availability" (commonly accepted)
Evidence: None
Causal Logic: Clear and reasonable
→ TR-03 DOES NOT FIRE: Commonly accepted causal chain
```

### TR-03 Decision Heuristic

**Before flagging TR-03, ask:**

> "Are assumptions phrased as guaranteed outcomes without evidence, OR is there a plausible/common causal chain?"

**If false certainty → Fire TR-03**  
**If plausible chain → Do NOT fire TR-03**

**TR-03 should challenge false certainty, not reasonable risk management.**

---

## Step 4: Pattern Priority Order (Strict Enforcement)

### Strict Detection Priority

1. **TR-03: Outcome-as-Validation Bias** (HIGHEST RISK)
2. **TR-01: Means-before-Ends Bias** (MEDIUM RISK)
3. **TR-02: Objective Sharpening** (LOWEST SEVERITY)

### Priority Logic

```
IF TR-03 conditions met → Fire TR-03
ELSE IF TR-01 conditions met → Fire TR-01
ELSE IF TR-02 conditions met → Fire TR-02
ELSE → No trigger
```

### Why This Order Reflects Real Executive Decision Risk

**TR-03 (Highest Risk):**
- **Reason:** False certainty leads to decisions based on wishful thinking
- **Impact:** High-stakes decisions fail when assumptions are untested
- **Executive Context:** Most dangerous pattern - untested assumptions in strategic decisions
- **Example:** "We assume enterprise clients will increase revenue by 15%" without evidence

**TR-01 (Medium Risk):**
- **Reason:** Selecting means before validating ends wastes resources
- **Impact:** May solve the wrong problem or optimize the wrong lever
- **Executive Context:** Common but addressable with constraint clarification
- **Example:** Choosing a tool without constraints or mechanism

**TR-02 (Lowest Severity):**
- **Reason:** Objective vagueness is often just articulation, not reasoning flaw
- **Impact:** Can be clarified without blocking decision
- **Executive Context:** Executives often know what they want but haven't articulated it
- **Example:** "Choose the best CRM" → Can be clarified to "improve sales productivity"

**Rationale:** TR-03 represents the highest cognitive risk (false certainty). TR-01 represents resource risk (wrong lever). TR-02 represents communication risk (articulation gap), which is least severe.

---

## Implementation Requirements

### New Flag Required

**`objective_has_constraints`** (boolean):
- `true` if objective mentions: cost, time, risk, quality, or explicit criteria
- `false` if objective is effect-based but lacks constraints
- Used to determine TR-01 safe harbor

### Classifier Prompt Updates

Update `classifierPromptVNext` to:
1. Detect constraints in objectives (cost, time, risk, quality)
2. Distinguish between false certainty and plausible causal chains for TR-03
3. Recognize standard executive trade-offs as valid decision spaces

### Trigger Evaluation Updates

Update `evaluateTriggers()` to:
1. Check TR-03 first (highest priority)
2. Then check TR-01 (with constraint check)
3. Finally check TR-02 (only if no other pattern detected)

### TR-01 Logic Update

```typescript
// TR-01 requires objective vagueness OR lack of constraints
const objectiveIsVagueOrUnconstrained =
  (flags.objective_is_effect === false || flags.objective_present === false) ||
  (flags.objective_is_effect === true && flags.objective_present === true && !flags.objective_has_constraints);

const triggered =
  flags.options_are_implementations === true &&
  flags.causal_link_explicit === false &&
  objectiveIsVagueOrUnconstrained &&
  flags.status_quo_excluded === true;
```

### TR-03 Logic Update

```typescript
// TR-03 requires false certainty (guaranteed outcomes), not plausible chains
const assumptionsAreGuaranteed = 
  // Check if assumptions are phrased as certainty, not possibility
  flags.assumptions_are_outcomes === true &&
  flags.assumptions_are_guaranteed === true; // NEW flag

const triggered =
  flags.options_are_implementations === false &&
  assumptionsAreGuaranteed &&
  flags.causal_link_explicit === false;
```

---

## Testing Criteria (Phase 1 Smoke Tests)

### Must Pass (No False Positives)

- **PH1-05:** Training buy vs build (well-formed tradeoffs) → `null`
- **PH1-09:** Infra upgrade vs Cloud (clear linkage) → `null`
- **PH1-13:** Security update vs replace (criteria explained) → `null`
- **PH1-14:** Hire vs Train (criteria explained) → `null`
- **PH1-16:** Compliance training vendors (well structured) → `null`
- **PH1-19:** Delay launch for QA (explicit causal link) → `null`
- **PH1-20:** Support headcount vs Chatbot (clear criteria) → `null`

### Must Fire (True Positives)

- **PH1-02:** PM Tools A vs B (efficiency goal, no evidence) → `TR-01`
- **PH1-08:** Build vs Buy Analytics (implementation choice, no evidence) → `TR-01` (if no constraints)
- **PH1-12:** Native app vs Web app (implementation choice, no evidence) → `TR-01` (if no constraints)
- **PH1-17:** CRM vendors (tool choice, no evidence) → `TR-01`

### TR-02 Cases (Soft Pattern)

- **PH1-01:** Node.js vs Python (goal implicit) → `TR-02`
- **PH1-03:** Anbieter X vs Y (no clear goal) → `TR-02`
- **PH1-04:** Payment Service A vs B (no outcome goal) → `TR-02`
- **PH1-06:** Plattform einführen vs verschieben (goal is action) → `TR-02`
- **PH1-10:** Microservices vs Monolith (goal missing) → `TR-02`

### TR-03 Cases (False Certainty)

- **PH1-07:** Abo vs Einmalkauf (assumptions without evidence) → `TR-03`
- **PH1-11:** Enterprise vs SMB (assumptions, no evidence) → `TR-03`
- **PH1-15:** Sales headcount vs Online marketing (outcome assumptions) → `TR-03`
- **PH1-18:** International rollout (assumptions, no evidence) → `TR-03`

---

## Success Metrics

- **False Positive Rate:** < 10% on standard executive trade-offs
- **True Positive Rate:** > 90% on clear reasoning flaws
- **User Satisfaction:** Interventions feel like decision relief, not lectures
- **Executive Acceptance:** System feels like senior sparring partner, not rules engine
- **Smoke Test Pass Rate:** > 18/20 (90%) after calibration

---

## Revision History

- **v1.1:** Post smoke test calibration - constraint detection, false certainty distinction
- **v2.0:** Initial recalibration for executive realism
- **v1.0:** Initial pattern definitions

---

**Document Owner:** Product + Engineering  
**Last Updated:** 2024  
**Next Review:** After Phase 1.1 implementation validation

