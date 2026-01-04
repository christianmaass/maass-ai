# Decision Pattern Calibration Policy

**Version:** 2.0  
**Status:** Active  
**Target Audience:** Product + Reasoning System  
**Optimization Goal:** Executive Realism, YC-Level Scrutiny

---

## Executive Summary

This policy recalibrates Decision OS pattern detection to reduce false positives while maintaining reliable detection of true reasoning flaws. The system optimizes for decision relief under pressure, assuming users are competent executives making real business trade-offs, not academic ideal cases.

**Core Principle:** Legitimate business trade-offs (e.g., Hire vs Train, Cloud vs On-Prem) are valid decision spaces and must NOT be flagged as errors. Only true reasoning flaws should trigger interventions.

---

## Step 1: TR-01 Redefinition (Means-before-Ends Bias)

### When TR-01 MUST Fire

TR-01 fires when **ALL** of the following criteria hold true:

1. **Options are implementation choices** (`options_are_implementations === true`)
2. **No explicit evidence** linking options to objective (`causal_link_explicit === false`)
3. **Objective is vague, implicit, or non-operational** (`objective_is_effect === false` OR `objective_present === false`)
4. **Status quo is explicitly excluded** (`status_quo_excluded === true`)

**Critical:** TR-01 requires objective vagueness. If the objective is clear and operational (even without evidence), TR-01 does NOT fire.

### Explicit Criteria (All Must Hold)

```
TR-01 = options_are_implementations 
      && !causal_link_explicit 
      && (!objective_is_effect || !objective_present)
      && status_quo_excluded
```

### Clear Examples of Flawed Decisions (TR-01 SHOULD Fire)

**Example 1: Tool Selection Without Clear Goal**
```
Decision: "We need to choose between Tool A, Tool B, or Tool C."
Objective: "" (empty or "Tool auswählen")
Status Quo: Explicitly excluded
Evidence: None
→ TR-01 FIRES: Selecting implementation before validating relevance
```

**Example 2: Technology Choice Without Operational Objective**
```
Decision: "Should we use React or Vue for the frontend?"
Objective: "Framework auswählen" (thematic, not effect)
Status Quo: Cannot stay with current
Evidence: None
→ TR-01 FIRES: Means chosen before ends are clear
```

**Example 3: Vendor Selection Without Outcome Goal**
```
Decision: "AWS vs Azure vs GCP for cloud hosting"
Objective: "Cloud-Provider festlegen" (thematic)
Status Quo: Must switch
Evidence: None
→ TR-01 FIRES: Implementation selected before validating lever relevance
```

### When TR-01 MUST NOT Fire

**Standard Executive Trade-offs** (Valid Decision Spaces):

**Example 1: Hire vs Train**
```
Decision: "Hire externally or train existing employee"
Objective: "Fill expertise gap while managing costs" (operational)
Status Quo: May or may not be excluded
Evidence: None (but objective is clear)
→ TR-01 DOES NOT FIRE: Objective is operational; this is a valid trade-off
```

**Example 2: Cloud vs On-Prem**
```
Decision: "Upgrade on-prem infrastructure or migrate to cloud"
Objective: "Reduce downtime by 50%" (operational, measurable)
Status Quo: May be excluded
Evidence: None (but objective is clear)
→ TR-01 DOES NOT FIRE: Objective is operational; lever uncertainty is acceptable
```

**Example 3: Chatbot vs Headcount**
```
Decision: "Expand support team or implement chatbot"
Objective: "Keep response times under 2 hours and increase satisfaction"
Status Quo: Not excluded (both options are new)
Evidence: None
→ TR-01 DOES NOT FIRE: Objective is operational; implementation choice is the actual dilemma
```

**Situations Where Objectives Are Operational But Lever Is Uncertain:**

- **Resource allocation decisions** (headcount, budget allocation)
- **Operational efficiency choices** (process improvements, tool selection with clear metrics)
- **Risk vs speed trade-offs** (when objective is clear but path is uncertain)
- **Build vs buy** (when objective is operational, e.g., "reduce long-term costs")

### Decision Heuristic

**Before flagging TR-01, ask:**

> "Is the objective operational (measurable effect/outcome) AND is this a standard executive trade-off space?"

**If YES → Do NOT fire TR-01**  
**If NO → Check if objective is vague/thematic → Fire TR-01**

**Preference:** Use clarifying questions over hard interventions when objective is partially clear but could be more operational.

**Example Clarifying Question:**
> "You're choosing between [options]. What specific outcome are you trying to achieve? (e.g., 'reduce costs by X%' rather than 'choose the best tool')"

---

## Step 2: Implementation Choice vs Reasoning Error

### Comparison Table

| Aspect | Implementation Choice | Means-before-Ends Bias |
|--------|----------------------|------------------------|
| **Nature** | Valid decision space | Reasoning flaw |
| **Objective** | Operational, measurable | Vague, implicit, or thematic |
| **Evidence** | Not required (trade-off is the decision) | Not required BUT objective must be clear |
| **Status Quo** | May or may not be excluded | Usually explicitly excluded |
| **Executive Context** | Common, legitimate dilemma | Premature solution selection |
| **Intervention** | None (valid decision) | Clarify objective first |
| **Examples** | Hire vs Train, Cloud vs On-Prem, Build vs Buy (with clear objective) | Tool selection without goal, Framework choice without outcome |

### Concrete Examples

#### Implementation Choice (Valid - No Trigger)

**Example 1: Hire vs Train**
```
Options: ["Hire senior developer externally", "Train existing employee"]
Objective: "Fill expertise gap while managing costs" (operational)
Evidence: None
Status Quo: Not excluded
→ NO TRIGGER: Valid trade-off between speed vs cost
```

**Example 2: Cloud vs On-Prem**
```
Options: ["Upgrade on-prem infrastructure", "Migrate to cloud"]
Objective: "Reduce downtime by 50%" (operational, measurable)
Evidence: None
Status Quo: Excluded
→ NO TRIGGER: Valid trade-off; objective is clear
```

**Example 3: Native App vs Web App**
```
Options: ["Native mobile app", "Web app"]
Objective: "Improve user experience" (operational, though qualitative)
Evidence: None
Status Quo: Not excluded
→ NO TRIGGER: Valid implementation choice; objective is operational
```

#### Means-before-Ends Bias (Reasoning Error - TR-01 Fires)

**Example 1: Tool Selection Without Goal**
```
Options: ["Tool A", "Tool B", "Tool C"]
Objective: "" or "Tool auswählen" (thematic)
Evidence: None
Status Quo: Excluded
→ TR-01 FIRES: Selecting implementation before validating relevance
```

**Example 2: Framework Choice Without Outcome**
```
Options: ["React", "Vue", "Svelte"]
Objective: "Framework auswählen" (thematic, not effect)
Evidence: None
Status Quo: Excluded
→ TR-01 FIRES: Means chosen before ends are clear
```

**Example 3: Vendor Selection Without Operational Objective**
```
Options: ["AWS", "Azure", "GCP"]
Objective: "Cloud-Provider festlegen" (thematic)
Evidence: None
Status Quo: Excluded
→ TR-01 FIRES: Implementation selected before validating lever relevance
```

---

## Step 3: TR-02 Reframing (Soft Pattern)

### Revised TR-02 Definition

**TR-02 is a SOFT PATTERN** that:
- Does NOT block decision evaluation
- Triggers a clarifying prompt, NOT a corrective intervention
- Never overrides more severe patterns (TR-01, TR-03)
- Only fires when NO other pattern is detected

**When TR-02 Fires:**
- Objective is missing (`objective_present === false`) OR
- Objective is thematic, not an effect (`objective_is_effect === false`)
- AND no other pattern (TR-01, TR-03) is detected

**Priority:** TR-02 has LOWEST priority. It only fires if TR-03 and TR-01 do not fire.

### User-Facing Clarifying Questions

**Question 1 (Missing Objective):**
> "What specific outcome are you trying to achieve with this decision? (e.g., 'reduce costs by 20%' or 'improve customer satisfaction')"

**Question 2 (Thematic Objective):**
> "You've stated your goal as '[objective]'. What measurable effect are you aiming for? (e.g., instead of 'choose a tool', consider 'reduce processing time by 50%')"

**Tone:** Supportive, clarifying, not corrective. Assume the user is competent and help them articulate what they already know.

### TR-02 Intervention Text

**Old (Corrective):**
> "The objective is not clear enough to evaluate options."

**New (Clarifying):**
> "What specific outcome are you trying to achieve? This will help evaluate which option best serves your goal."

---

## Step 4: Pattern Priority Order

### Strict Priority Order

1. **TR-03: Outcome-as-Validation Bias** (Highest Priority)
2. **TR-01: Means-before-Ends Bias** (Medium Priority)
3. **TR-02: Objective Vagueness** (Lowest Priority)

### Priority Logic

```
IF TR-03 conditions met → Fire TR-03
ELSE IF TR-01 conditions met → Fire TR-01
ELSE IF TR-02 conditions met → Fire TR-02
ELSE → No trigger
```

### Why This Order Reflects Real-World Decision Risk

**TR-03 (Highest Risk):**
- **Reason:** Assuming outcomes without evidence is the most dangerous pattern
- **Impact:** Leads to decisions based on wishful thinking, not reality
- **Executive Context:** High-stakes decisions fail when assumptions are untested
- **Example:** "We assume targeting enterprise clients will increase revenue by 15%" without evidence

**TR-01 (Medium Risk):**
- **Reason:** Selecting means before validating ends wastes resources
- **Impact:** May solve the wrong problem or optimize the wrong lever
- **Executive Context:** Common but addressable with objective clarification
- **Example:** Choosing a tool before defining what success looks like

**TR-02 (Lowest Risk):**
- **Reason:** Objective vagueness is often just articulation, not reasoning flaw
- **Impact:** Can be clarified without blocking decision
- **Executive Context:** Executives often know what they want but haven't articulated it
- **Example:** "Choose the best CRM" → Can be clarified to "improve sales productivity"

**Rationale:** TR-03 represents the highest cognitive risk (untested assumptions). TR-01 represents resource risk (wrong lever). TR-02 represents communication risk (articulation gap), which is least severe.

---

## Implementation Notes

### Flag Updates Required

**For TR-01:**
- Add check: `objective_is_effect === false` OR `objective_present === false`
- Current logic fires on ANY implementation choice without evidence
- New logic requires BOTH: implementation choice AND vague objective

**For TR-02:**
- Change priority: Only fire if TR-03 and TR-01 do not fire
- Change intervention: From corrective to clarifying
- Change judgment: Consider NOT marking as FRAGILE (or use separate flag)

**For TR-03:**
- No changes to detection logic
- Ensure it fires BEFORE TR-01 and TR-02

### Classifier Prompt Updates

Update `classifierPromptVNext` to distinguish:
- **Operational objectives** (effects/outcomes) → `objective_is_effect === true`
- **Thematic objectives** (topics/actions) → `objective_is_effect === false`

Ensure classifier recognizes standard executive trade-offs as valid decision spaces.

### Trigger Evaluation Updates

Update `evaluateTriggers()` to:
1. Check TR-03 first
2. Then check TR-01 (with new objective vagueness requirement)
3. Finally check TR-02 (only if no other pattern detected)

---

## Testing Criteria

### Must Pass (No False Positives)

- Hire vs Train (with operational objective)
- Cloud vs On-Prem (with operational objective)
- Chatbot vs Headcount (with operational objective)
- Build vs Buy (with operational objective)
- Native App vs Web App (with operational objective)

### Must Fire (True Positives)

- Tool selection without clear goal
- Framework choice without outcome
- Vendor selection without operational objective
- Any implementation choice with thematic objective

### Edge Cases

- Objective partially clear → Use clarifying question, not hard intervention
- Objective operational but evidence missing → No trigger (valid trade-off)
- Multiple patterns possible → Fire highest priority only

---

## Success Metrics

- **False Positive Rate:** < 5% on standard executive trade-offs
- **True Positive Rate:** > 90% on clear reasoning flaws
- **User Satisfaction:** Interventions reduce cognitive load, not increase it
- **Executive Acceptance:** System feels helpful, not pedantic

---

## Revision History

- **v2.0:** Recalibration for executive realism, reduced false positives
- **v1.0:** Initial pattern definitions

---

**Document Owner:** Product + Engineering  
**Last Updated:** 2024  
**Next Review:** After Phase 1 stabilization validation

