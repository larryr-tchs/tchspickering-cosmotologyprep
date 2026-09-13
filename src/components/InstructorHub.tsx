import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  ClipboardCheck,
  AlertTriangle,
  FileText,
  Printer,
  Sparkles,
  BookOpen,
  Award,
  Users,
} from 'lucide-react';
import { SUBJECTS } from '../data/subjects';
import { playSound } from '../utils/storage';
import { ClassroomGradebook } from './ClassroomGradebook';

export const InstructorHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gradebook' | 'blueprint' | 'schedule' | 'checklist' | 'prohibited'>('gradebook');

  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Instructor Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-rose-900/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-rose-300 border border-white/20">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Cosmetology Instructor Resource Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Instructor Teaching & Exam Readiness Toolkit
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Curriculum frameworks, official National-Interstate Council (NIC) domain weighting, student kit checklists, and study schedules to guide your cosmetology cohorts to 100% board pass rates.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-sm flex-shrink-0"
        >
          <Printer className="w-4 h-4 text-rose-600" />
          <span>Print Instructor Handout</span>
        </button>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => {
            playSound('click');
            setActiveTab('gradebook');
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'gradebook'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Live Class Gradebook</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTab('blueprint');
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'blueprint'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-rose-600" />
          <span>NIC Exam Blueprint</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTab('schedule');
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'schedule'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-rose-600" />
          <span>Study Plans (4-Wk & 2-Wk)</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTab('checklist');
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'checklist'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardCheck className="w-4 h-4 text-rose-600" />
          <span>Student Readiness Checklist</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTab('prohibited');
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'prohibited'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Banned Salon & Exam Items</span>
        </button>
      </div>

      {/* Tab 0: Live Classroom Gradebook */}
      {activeTab === 'gradebook' && <ClassroomGradebook />}

      {/* Tab 1: Blueprint */}
      {activeTab === 'blueprint' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              NIC (National-Interstate Council) Written Exam Domain Weights
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              The official standard tested across most US states (Pearson VUE, PSI, Prometric).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Domain 1 (~30%)
              </span>
              <h3 className="text-sm font-bold text-slate-900">Scientific Concepts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Infection Control (Sanitation/Disinfection), Microbiology, Anatomy, Chemistry, and Salon Electricity.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-1">
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                Domain 2 (~40%)
              </span>
              <h3 className="text-sm font-bold text-slate-900">Hair Care & Services</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trichology, Chemical Texturing (Perms/Relaxers), Hair Coloring & Bleaching, and Haircutting/Thermal Styling.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-fuchsia-200 bg-fuchsia-50/50 space-y-1">
              <span className="text-xs font-bold text-fuchsia-800 uppercase tracking-wider">
                Domain 3 (~15%)
              </span>
              <h3 className="text-sm font-bold text-slate-900">Skin Care & Esthetics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Epidermis Histology, Facial Massage Manipulations, Contraindications (Accutane), and Waxing Safety.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-1">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                Domain 4 (~15%)
              </span>
              <h3 className="text-sm font-bold text-slate-900">Nail Care & Licensing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Natural Nail Matrix, Diseases vs Disorders, Enhancements, and State Board Sanitation Laws & Ethics.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-xs text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-800 font-bold">
                <tr>
                  <th className="px-3.5 py-2.5">Subject Domain</th>
                  <th className="px-3.5 py-2.5">Category</th>
                  <th className="px-3.5 py-2.5">Approx. Exam %</th>
                  <th className="px-3.5 py-2.5">Primary Board Exam Failure Pitfall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {SUBJECTS.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80">
                    <td className="px-3.5 py-2.5 font-bold text-slate-900">{s.name}</td>
                    <td className="px-3.5 py-2.5 text-slate-600">{s.category}</td>
                    <td className="px-3.5 py-2.5 font-bold text-rose-700">{s.examWeightPercent}%</td>
                    <td className="px-3.5 py-2.5 text-slate-600">
                      {s.id === 'infection-control' && 'Confusing cleaning with disinfection; wrong order of blood spill steps.'}
                      {s.id === 'anatomy-physiology' && 'Massaging from origin to insertion instead of insertion to origin.'}
                      {s.id === 'chemistry-electricity' && 'Forgetting that pH is logarithmic (pH 9 is 100x more alkaline than 7, not 2x).'}
                      {s.id === 'trichology-scalp' && 'Confusing anagen (growing) and telogen (resting) hair cycles.'}
                      {s.id === 'chemical-texture' && 'Attempting to perm sodium hydroxide relaxed hair (catastrophic breakage).'}
                      {s.id === 'hair-coloring' && 'Omitting the 24-48 hour FDA patch test rule for aniline dyes.'}
                      {s.id === 'haircutting-styling' && 'Cutting with a razor on dry hair instead of damp hair.'}
                      {s.id === 'esthetics-skincare' && 'Waxing over skin treated with oral Accutane in the last 6 months.'}
                      {s.id === 'nail-technology' && 'Cutting the living eponychium tissue instead of dead cuticle.'}
                      {s.id === 'laws-ethics' && 'Using prohibited tools like credo blades or reusable styptic pencils.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Study Schedules */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Instructor-Curated Exam Study Schedules
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Assign these pacing schedules to students ahead of their scheduled test dates.
            </p>
          </div>

          <div className="space-y-6">
            {/* 4-Week Comprehensive Plan */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Standard 4-Week Class Curriculum Study Plan
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Recommended for Cohorts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-rose-700">Week 1: Scientific Concepts & Infection Control</div>
                  <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
                    <li>Study Guide: Infection Control & OSHA Standards</li>
                    <li>Master the 10-Step Blood Exposure Protocol Drill</li>
                    <li>Study Guide: Chemistry & the Logarithmic pH scale</li>
                    <li>Complete 3 domain quizzes on Infection Control (aim for 90%+)</li>
                  </ul>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-indigo-700">Week 2: Trichology & Chemical Texture</div>
                  <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
                    <li>Study Guide: Hair shaft anatomy (cuticle, cortex, medulla)</li>
                    <li>Alkaline (ATG) vs Acid (GMTG) perm chemistry</li>
                    <li>Hydroxide vs Thio relaxer incompatibility rules</li>
                    <li>Complete 2 domain quizzes on Chemical Texture</li>
                  </ul>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-violet-700">Week 3: Hair Coloring, Anatomy & Haircutting</div>
                  <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
                    <li>The Level System & Color Wheel Complementary Neutralizing</li>
                    <li>Predisposition (Patch) Test 24-48 hr FDA rule</li>
                    <li>Cranial bones & the Insertion-to-Origin massage law</li>
                    <li>Elevations (0°, 45°, 90°, 180°) and shear ergonomics</li>
                  </ul>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-teal-700">Week 4: Skin, Nails & Full Mock Exam Simulation</div>
                  <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
                    <li>Epidermis layers (Corneum to Basale) & 5 massage movements</li>
                    <li>Nail matrix anatomy and contagious Onychomycosis</li>
                    <li>Run 3 Full 45-minute timed Mock Exams on CosmoBoard</li>
                    <li>Review bookmarked & missed questions until achieving 85%+</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2-Week Cram Plan */}
            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-amber-950">
                  2-Week High-Intensity Cram Plan (For Retakers or Last-Minute Prep)
                </h3>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                • Days 1-4: Drill Infection Control, Safety Protocols, and pH Chemistry (over 40% of the exam).<br />
                • Days 5-8: Memorize Perm Solutions Comparison and Hair Color Developers & Patch Testing.<br />
                • Days 9-12: Run 2 timed Mock Exams daily; immediately review missed question explanations.<br />
                • Days 13-14: Flip through all 25+ Flashcards deck until 100% are marked "Mastered".
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Checklist */}
      {activeTab === 'checklist' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Student Written & Practical Exam Readiness Checklist
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify your students possess all mandatory documentation and supplies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-rose-600" />
                <span>Written Exam Day Requirements</span>
              </h3>
              <ul className="space-y-1.5 text-slate-700">
                <li>✓ Two forms of valid government-issued photo ID (matching registration name exactly)</li>
                <li>✓ State board testing admission letter / authorization to test confirmation</li>
                <li>✓ Arrive 30 minutes prior to scheduled testing window</li>
                <li>✓ Eyeglasses if needed (no smart glasses or recording wearables permitted)</li>
                <li>✓ Prohibited inside testing room: smartwatches, cell phones, coats, purses, notes</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                <span>Practical & Sanitation Kit Checklist</span>
              </h3>
              <ul className="space-y-1.5 text-slate-700">
                <li>✓ EPA-registered hospital disinfectant wipes / spray with original label</li>
                <li>✓ Hand sanitizer (minimum 60% alcohol, clearly labeled)</li>
                <li>✓ Separate containers labeled: "CLEAN IMPLEMENTS" and "SOILED IMPLEMENTS"</li>
                <li>✓ Blood Exposure Kit: adhesive bandages, antiseptic wipes, biohazard double-bags</li>
                <li>✓ Clean, sanitized towels in closed, labeled plastic bags</li>
                <li>✓ Mannequin head securely mounted with no loose hair or pre-sectioning markings</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Prohibited Items */}
      {activeTab === 'prohibited' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Universally Prohibited Salon Tools & Board Exam Violations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Found in salon inspections and on written board exam trap questions.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-1">
              <div className="font-bold text-sm text-rose-900 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>1. Credo Blades / Razor Callus Cutters</span>
              </div>
              <p className="text-xs text-rose-950 leading-relaxed">
                Razor-sharp blades designed to slice off calluses on feet. Banned in almost all states because they cut living dermal tissue, act as surgical medical tools, and cause deep infections.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-1">
              <div className="font-bold text-sm text-rose-900 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>2. Methyl Methacrylate (MMA) Acrylic Monomer Liquid</span>
              </div>
              <p className="text-xs text-rose-950 leading-relaxed">
                Industrial monomer banned by the FDA and state boards for salon nails. Causes severe allergic reactions, respiratory damage, and adheres so aggressively that nail removal tears the natural nail plate off the bed. Salons must use Ethyl Methacrylate (EMA).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-1">
              <div className="font-bold text-sm text-rose-900 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>3. Reusable Alum Styptic Pencils</span>
              </div>
              <p className="text-xs text-rose-950 leading-relaxed">
                Pencil sticks used to stop bleeding on cuts. Because the stick contacts blood directly and cannot be disinfected between clients, it spreads bloodborne pathogens (HIV, HBV). Only single-use disposable liquid or powder styptic is permitted.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-1">
              <div className="font-bold text-sm text-rose-900 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>4. Neck Dusters (Open Bristle Brushes)</span>
              </div>
              <p className="text-xs text-rose-950 leading-relaxed">
                Natural bristle neck dusters collect skin flakes, lice, and oils and cannot be completely disinfected between clients. Must be replaced with single-use neck strips or disposable paper towels.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
