import React from 'react';

// ContentSections component
// Displays a 3x2 grid with the most common problems of modern leaders and how Navaa solves them.
// The last card is a call-to-action (CTA) box. Below the grid, there is a step-by-step explanation section.
export default function ContentSections() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-0 bg-[#fcfdfe]">

      {/* Überschrift und Erklärungstext über den Boxen */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">navaa löst zentrale Herausforderungen von Führungskräften</h2>
      <p className="text-gray-700 text-center text-lg mb-8">Viele Führungskräfte treffen täglich komplexe Entscheidungen – ohne echtes Training.<br/>Diese 3 Herausforderungen sehen wir am häufigsten.</p>
      {/* 3x2 grid: 5 problem cards, 1 CTA card
          Each card represents a typical leadership problem and Navaa's solution.
          The design is intentionally minimal for clarity and consistency with the HeroBanner. */}
      <div className="w-full max-w-7xl mx-auto mb-12 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {/* Card 1 */}
          <div className="rounded-2xl p-6 flex flex-col h-full font-sans" style={{ background: 'linear-gradient(to top, #E9ECEF, #fcfdfe)' }}>  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Fehlendes <span className="bg-[#ffb347] text-gray-900 px-2 rounded font-bold">Feedback</span> auf Denk- und Entscheidungswege</h3>
  <p className="text-gray-800 text-center text-lg flex-grow">Führungskräfte treffen permanent Entscheidungen – oft in Unsicherheit. Doch sie bekommen selten echtes Feedback zur Qualität ihres Denkens.<br />
  <span className="inline-block mt-4" role="img" aria-label="Hinweis">👉</span> Ohne Feedback keine Verbesserung – nur Wiederholung von Mustern.</p>
  {/* Platzhalterbild */}
  <div className="flex justify-center mt-8 mb-2">
    <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center">
      <span className="text-gray-400 text-lg">Bild</span>
    </div>
  </div>
</div>
          {/* Card 2 */}
          <div className="rounded-2xl p-6 flex flex-col h-full font-sans" style={{ background: 'linear-gradient(to top, #E9ECEF, #fcfdfe)' }}>  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Fehlende <span className="bg-[#ffb347] text-gray-900 px-2 rounded font-bold">Orientierung</span> und klare Entwicklungsimpulse</h3>
  <p className="text-gray-800 text-center text-lg flex-grow">Viele Führungskräfte spüren, dass sie sich „weiterentwickeln sollten“ – aber wo genau ansetzen, was zuerst und wie messen?<br />
    <span className="inline-block mt-4" role="img" aria-label="Hinweis">👉</span> Strategische Entwicklung braucht Fokus, Struktur und gezielte Hebel.
  </p>
  {/* Platzhalterbild */}
  <div className="flex justify-center mt-8 mb-2">
    <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center">
      <span className="text-gray-400 text-lg">Bild</span>
    </div>
  </div>
</div>
          {/* Card 3 */}
          <div className="rounded-2xl p-6 flex flex-col h-full font-sans" style={{ background: 'linear-gradient(to top, #E9ECEF, #fcfdfe)' }}>  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Unbewusstes und unstrukturiertes <span className="bg-[#ffb347] text-gray-900 px-2 rounded font-bold">Denken</span></h3>
  <p className="text-gray-800 text-center text-lg flex-grow">Im Tagesgeschäft agieren viele intuitiv – was bei zunehmender Komplexität riskant ist.<br />
    <span className="inline-block mt-4" role="img" aria-label="Hinweis">👉</span> Strukturiertes Denken schafft bessere Entscheidungen, bessere Kommunikation – und stärkere Wirkung.
  </p>
  {/* Platzhalterbild */}
  <div className="flex justify-center mt-8 mb-2">
    <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center">
      <span className="text-gray-400 text-lg">Bild</span>
    </div>
  </div>
</div>
        </div>
      </div>
      {/* Für wen navaa Mehrwerte schafft */}
      <div className="w-full max-w-4xl mx-auto mb-12 bg-[#fcfdfe] mt-20">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">Für wen navaa Mehrwerte schafft</h3>
        <div className="bg-[#fcfdfe] rounded-2xl p-8 flex flex-col h-full font-sans">
          {/* Hier kann später der passende Text oder Inhalt eingefügt werden */}
          <div className="overflow-x-auto">
  <table className="min-w-full border border-gray-200 rounded-xl">
    <thead>
      <tr className="bg-gray-100">
        <th className="px-4 py-2 text-left font-semibold text-gray-800">Rolle</th>
        <th className="px-4 py-2 text-left font-semibold text-gray-800">Typischer Pain</th>
        <th className="px-4 py-2 text-left font-semibold text-gray-800">Navaa-Vorteil</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-t">
        <td className="px-4 py-2 align-top">Business Leader</td>
        <td className="px-4 py-2 align-top">Muss strategisch führen &amp; kommunizieren</td>
        <td className="px-4 py-2 align-top">Trainiert Struktur, Klarheit, Entscheidungskraft</td>
      </tr>
      <tr className="border-t">
        <td className="px-4 py-2 align-top">CFOs &amp; Controlling</td>
        <td className="px-4 py-2 align-top">Muss komplexe Zusammenhänge schnell durchdringen</td>
        <td className="px-4 py-2 align-top">Stärkt Urteilsvermögen &amp; Modellverständnis</td>
      </tr>
      <tr className="border-t">
        <td className="px-4 py-2 align-top">Customer Service Leads</td>
        <td className="px-4 py-2 align-top">Muss gut entscheiden – bei hoher Dynamik</td>
        <td className="px-4 py-2 align-top">Trainiert Reflexion &amp; Eskalationskompetenz</td>
      </tr>
      <tr className="border-t">
        <td className="px-4 py-2 align-top">Strategy / BizDev</td>
        <td className="px-4 py-2 align-top">Muss klare Konzepte und Wege entwickeln</td>
        <td className="px-4 py-2 align-top">Fördert Systematik &amp; Feedbackkultur</td>
      </tr>
    </tbody>
  </table>
</div>
        </div>
      </div>
      {/* Step-by-step section below the grid.
          Explains how users interact with Navaa in three simple steps. */}
      <div id="so-funktionierts" className="bg-[#fcfdfe] rounded-2xl p-10 mb-12">
        <h2 className="text-2xl font-bold mb-4">So funktioniert es</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Wähle einen Case aus, der zu deiner Situation passt und bearbeite .</li>
          <li>Bearbeite den Case Schritt für Schritt und erhalte individuelles Feedback.</li>
          <li>Reflektiere deine Entscheidungen und entwickle deine strategischen Fähigkeiten weiter.</li>
        </ol>
      </div>
    </section>
  );
}
