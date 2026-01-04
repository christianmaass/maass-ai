# Internal Diagnosis Types for Decision OS

## Diagnosis Type Definitions

Diagnosis:
- label: FALSCH_GEWISSHEIT
  description: Strategische Optionen mit als Garantie formulierten Annahmen ohne explizite Evidenz
  status: HARD_CLARITY

Diagnosis:
- label: IMPLEMENTIERUNG_OHNE_ANCHOR
  description: Implementierungsentscheidungen ohne Constraints und ohne kausale Logik bei vorhandenem Ziel
  status: SOFT_CLARITY

Diagnosis:
- label: ZIEL_FEHLT
  description: Ziel ist komplett nicht vorhanden im Entscheidungstext
  status: SOFT_CLARITY

Diagnosis:
- label: ZIEL_THEMATISCH
  description: Ziel ist vorhanden aber nicht operational (thematisch statt effekt-basiert) ohne weitere strukturelle Probleme
  status: NO_INTERVENTION

Diagnosis:
- label: STRATEGISCHE_OPTIONEN_PLAUSIBEL
  description: Strategische Optionen mit plausiblen Annahmen oder expliziter kausaler Logik ohne falsche Gewissheit
  status: NO_INTERVENTION

Diagnosis:
- label: IMPLEMENTIERUNG_MIT_CONSTRAINTS
  description: Implementierungsentscheidungen mit Constraints oder kausaler Logik vorhanden
  status: NO_INTERVENTION

Diagnosis:
- label: VOLLSTAENDIG_STRUKTURIERT
  description: Entscheidung hat operationales Ziel mit Constraints oder kausaler Logik, keine strukturellen Probleme
  status: NO_INTERVENTION

Diagnosis:
- label: KEINE_VERGLEICHBAREN_OPTIONEN
  description: Entscheidung enthält keine vergleichbaren Optionen oder keine Entscheidungssituation
  status: NO_INTERVENTION

