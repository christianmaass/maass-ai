// Textblock.tsx
// Displays a reusable text block, likely used for various informational sections.
//
// The layout is designed to be visually appealing and responsive, with a maximum width
// and horizontal margins set to ensure a comfortable reading experience on various devices.
// Textblock.tsx
// Displays a reusable text block, likely used for various informational sections.
// The layout is designed to be visually appealing and responsive, with a maximum width
// and horizontal margins set to ensure a comfortable reading experience on various devices.

import React from 'react';

export default function Textblock() {
  return (
    <section className="my-8 p-6 bg-blue-50 rounded shadow text-gray-800 max-w-2xl mx-auto">
      {/* 
        The heading is set to a larger font size and a bold weight to draw attention 
        and provide a clear visual hierarchy.
      */}
      <h2 className="text-2xl font-semibold mb-2 text-blue-700">Über dieses Projekt</h2>
      <p className="mb-2">
        Dies ist ein moderner React + Vite + Tailwind Starter. Du kannst diesen Baukasten nutzen, um
        schnell eigene Webanwendungen zu erstellen und zu erweitern.
      </p>
      <p>
        Passe diesen Textblock nach deinen Wünschen an. Hier kannst du z.B. Informationen über dich,
        dein Projekt oder Hinweise für Besucher einfügen.
      </p>
    </section>
  );
}
