import React from 'react';
import Panel from '@ui/Panel';
import { Heading, Text } from '@ui/Typography';

interface ContextPanelProps {
  title?: string;
  subtitle?: string;
}

const ContextPanel: React.FC<ContextPanelProps> = ({
  title = 'Kontext',
  subtitle = 'Was passiert in diesem Schritt?',
}) => {
  return (
    <Panel>
      <Heading variant="h2" className="mb-2">
        {title}
      </Heading>
      <Text variant="small" as="div" className="font-semibold text-gray-800 mb-3">
        {subtitle}
      </Text>
      <Text variant="body" as="p" className="text-gray-600 mb-4">
        Strategiearbeit ist ein wenig wie Sport, wo es auch um die perfekte Beherrschung bestimmter
        Techniken geht. Diese Techniken lassen sich fünf Schritten zuordnen:
      </Text>

      <ul className="space-y-2 text-lg">
        <li className="flex items-start">
          <span className="text-[#009e82] mr-2">•</span>
          <span>
            <strong>Verstehen</strong> – Problem & Ziel klären
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-[#009e82] mr-2">•</span>
          <span>
            <strong>Strukturieren</strong> – Hypothesen aufstellen
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-[#009e82] mr-2">•</span>
          <span>
            <strong>Analysieren</strong> – Fakten schaffen
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-[#009e82] mr-2">•</span>
          <span>
            <strong>Bewerten</strong> – Optionen verdichten
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-[#009e82] mr-2">•</span>
          <span>
            <strong>Empfehlen</strong> – Entscheidung auf den Punkt bringen
          </span>
        </li>
      </ul>

      <Text variant="body" as="p" className="text-gray-600 mt-4">
        Schritt für Schritt trainiert, sitzt diese Methodik im Blut – und macht dich schneller,
        klarer und überzeugender in jeder strategischen Situation.
      </Text>
    </Panel>
  );
};

export default ContextPanel;
