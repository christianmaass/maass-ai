import React from 'react';
import CourseCard from '../components/courses/CourseCard';
import { CourseWithEnrollment } from '../types/courses';

// Mock-Daten für Test
const mockCourses: CourseWithEnrollment[] = [
  {
    id: '1',
    slug: 'strategy-track',
    name: 'Strategy Track',
    description:
      'Entwickle strategisches Denken durch praxisnahe Business Cases aus der Beratungswelt.',
    difficulty_level: 7,
    estimated_duration_hours: 25,
    prerequisites: [],
    is_active: true,
    sort_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    user_enrolled: true,
    foundation_cases_count: 12,
    foundation_cases: [
      { case_id: '1', title: 'ConsumerBrand Pricing-Strategie', difficulty: 10, sequence_order: 1 },
      { case_id: '2', title: 'EnergyFuture Digitalisierung', difficulty: 9, sequence_order: 2 },
      { case_id: '3', title: 'FinanceFirst Wettbewerbsanalyse', difficulty: 5, sequence_order: 3 },
      {
        case_id: '4',
        title: 'Gewinnrückgang bei der TechCorp GmbH',
        difficulty: 1,
        sequence_order: 4,
      },
      { case_id: '5', title: 'GlobalBank Restrukturierung', difficulty: 12, sequence_order: 5 },
    ],
    user_progress: {
      progress_percentage: 35,
      completed_cases: 4,
      total_cases: 12,
      last_activity_at: '2024-01-15T10:30:00Z',
    },
  },
  {
    id: '2',
    slug: 'finance-track',
    name: 'Finance Track',
    description: 'Meistere komplexe Finanzanalysen und Bewertungsmodelle.',
    difficulty_level: 9,
    estimated_duration_hours: 30,
    prerequisites: ['strategy-track'],
    is_active: true,
    sort_order: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    user_enrolled: false,
    foundation_cases_count: 8,
    foundation_cases: [],
  },
];

const handleCourseClick = (course: CourseWithEnrollment) => {
  console.log('Course clicked:', course.slug);
  alert(`Navigiere zu Kurs: ${course.name}\nRoute: /course/${course.slug}`);
};

export default function TestCourseCard() {
  return (
    <div className="min-h-screen bg-navaa-page p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎨 CourseCard Komponenten-Test</h1>
          <p className="text-gray-600 mb-4">
            Test der neuen CourseCard-Komponente mit navaa Design-System
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Mock-Daten geladen</span>
            </div>
          </div>
        </div>

        {/* CourseCard Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📚 Verfügbare Kurse ({mockCourses.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleCourseClick(course)}
                showProgress={true}
              />
            ))}
          </div>

          {/* Design Variations */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎨 Design-Variationen</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Variation 1: Ohne Progress */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Ohne Progress-Anzeige:</h4>
                <CourseCard
                  course={mockCourses[0]}
                  onClick={() => handleCourseClick(mockCourses[0])}
                  showProgress={false}
                />
              </div>

              {/* Variation 2: Custom Styling */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Mit Custom-Styling:</h4>
                <CourseCard
                  course={mockCourses[0]}
                  onClick={() => handleCourseClick(mockCourses[0])}
                  className="border-2 border-navaa-primary/20"
                  showProgress={true}
                />
              </div>
            </div>
          </div>

          {/* Feature Showcase */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">✨ Feature-Showcase</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🎯 Interaktivität</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Hover-Effekte mit Scale & Shadow</li>
                  <li>• Shine-Animation beim Hover</li>
                  <li>• Keyboard-Navigation (Tab, Enter)</li>
                  <li>• Foundation Cases Preview</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🎨 Design-System</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• navaa-konforme Farben</li>
                  <li>• Responsive Grid-Layout</li>
                  <li>• Gradient-Overlays</li>
                  <li>• Difficulty-Farbkodierung</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">📊 Daten-Integration</h4>
                <ul className="text-purple-700 space-y-1">
                  <li>• Foundation Cases-Anzahl</li>
                  <li>• User-Progress-Tracking</li>
                  <li>• Enrollment-Status</li>
                  <li>• Dynamic CTAs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
