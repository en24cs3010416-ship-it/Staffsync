import React, { useState, useEffect } from 'react';
import { useStaffSync } from '../../context/StaffSyncContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  CalendarCheck2, 
  GraduationCap, 
  Users, 
  Megaphone,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface Chapter {
  id: number;
  title: string;
  timeRange: string;
  startSec: number;
  endSec: number;
  targetRole: 'employee' | 'manager' | 'hr';
  targetTab: 'attendance' | 'leaves' | 'training' | 'employees' | 'announcements';
  narration: string;
  screenTitle: string;
  screenSubtitle: string;
  highlights: string[];
}

export const DemoVideoSimulator: React.FC = () => {
  const { setCurrentRole, setActiveTab, showToast } = useStaffSync();

  const chapters: Chapter[] = [
    {
      id: 1,
      title: '1. Employee Clock-In & Attendance',
      timeRange: '00:00 - 00:52',
      startSec: 0,
      endSec: 52,
      targetRole: 'employee',
      targetTab: 'attendance',
      narration: 'Elena starts her morning by opening the StaffSync portal. With a single click, she logs her In-Office attendance punch. The system automatically records the 09:02 AM timestamp and verifies location compliance.',
      screenTitle: 'Employee Daily Clock-In & Punch Workflow',
      screenSubtitle: 'One-click timestamped attendance with geofence & work-mode selection',
      highlights: [
        'Selects "In-Office" or "Remote" mode',
        'Real-time digital clock synchronization',
        'Automatic late arrival detection (after 09:15 AM)',
        'Logged to persistent MongoDB attendance table'
      ]
    },
    {
      id: 2,
      title: '2. Self-Service Leave Application',
      timeRange: '00:52 - 01:45',
      startSec: 52,
      endSec: 105,
      targetRole: 'employee',
      targetTab: 'leaves',
      narration: 'Elena needs 5 days for a design conference. She checks her available 12-day annual quota, selects the date range, and submits her request. The platform automatically computes business days and routes it to her manager, Marcus.',
      screenTitle: 'Leave Application & Quota Allocation',
      screenSubtitle: 'Automated business-day computation and quota validation',
      highlights: [
        'Live balance preview (Annual, Sick, Casual)',
        'Automatic weekend exclusion calculation',
        'Justification notes with coverage handover',
        'Dispatched to Marcus Vance’s review queue'
      ]
    },
    {
      id: 3,
      title: '3. Manager Review & HR Sign-Off',
      timeRange: '01:45 - 02:40',
      startSec: 105,
      endSec: 160,
      targetRole: 'manager',
      targetTab: 'leaves',
      narration: 'Marcus switches to his Manager view. He evaluates Elena’s conference leave request, confirms sprint coverage, and grants Tier-1 approval. Sarah Lin in HR then executes the final policy sign-off, which automatically deducts 5 days from Elena’s ledger.',
      screenTitle: 'Dual-Stage Approval Pipeline',
      screenSubtitle: 'Tier-1 Department Manager Review followed by Tier-2 HR Policy Sign-off',
      highlights: [
        'Manager checks team bandwidth and sprint delivery',
        'Input evaluation remarks and conditional approval',
        'HR final policy compliance and quota deduction',
        'Instant employee notification toast'
      ]
    },
    {
      id: 4,
      title: '4. Manager L&D Program Creation',
      timeRange: '02:40 - 03:35',
      startSec: 160,
      endSec: 215,
      targetRole: 'manager',
      targetTab: 'training',
      narration: 'To level up the engineering team, Marcus creates a 6-week training course on Microservices and Docker. He enrolls team members Devon and Tariq, tracks module completion percentages, and reviews competency certifications.',
      screenTitle: 'Manager Learning & Development (L&D)',
      screenSubtitle: 'Curating upskilling courses, cohort rosters, and skill progression',
      highlights: [
        'Course syllabus, duration, and module configuration',
        'Direct cohort enrollment for team reports',
        'Live milestone percentage progress bars',
        'Automated competency certificate generation'
      ]
    },
    {
      id: 5,
      title: '5. HR Onboarding & Company Bulletins',
      timeRange: '03:35 - 04:30',
      startSec: 215,
      endSec: 270,
      targetRole: 'hr',
      targetTab: 'announcements',
      narration: 'Finally, Sarah Lin in HR broadcasts an urgent company announcement regarding open benefits enrollment. Employees receive immediate notifications and can record their formal reading acknowledgement.',
      screenTitle: 'HR Workforce Operations & Bulletins',
      screenSubtitle: 'Staff directory onboarding, salary governance, and company broadcasts',
      highlights: [
        'New employee onboarding with role provisioning',
        'Company bulletin authoring with urgency tags',
        'Targeted department dissemination',
        'Read counters & signed employee acknowledgements'
      ]
    }
  ];

  const totalDuration = 270; // 4:30 in seconds
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSeconds, setCurrentSeconds] = useState(25);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);

  // Active chapter based on currentSeconds
  const activeChapter = chapters.find(
    c => currentSeconds >= c.startSec && currentSeconds < c.endSec
  ) || chapters[0];

  // Playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSeconds(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalDuration]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSeconds(Number(e.target.value));
  };

  const jumpToLiveWorkflow = (chapter: Chapter) => {
    setCurrentRole(chapter.targetRole);
    setActiveTab(chapter.targetTab);
    showToast(`Navigated to ${chapter.targetTab.toUpperCase()} module as ${chapter.targetRole.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            <span>StaffSync Demonstrations</span>
            <span className="mx-1.5" aria-hidden="true">/</span>
            <span>Video & Guided Workflow Tour</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            StaffSync Interactive Guided Demo Walkthrough
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Full-featured animated video simulator highlighting real-world HR, Manager, and Employee workflows.
          </p>
        </div>

        <button
          type="button"
          onClick={() => jumpToLiveWorkflow(activeChapter)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <ExternalLink className="w-4 h-4" />
          Try This Live in Workspace
        </button>
      </div>

      {/* Video Player Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
        {/* Top Video Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-semibold text-white">StaffSync Product Walkthrough Video (HD 1080p)</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 font-mono">MERN Stack Architecture Demo</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
              Role: {activeChapter.targetRole.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Video Viewport / Animated Simulation Canvas */}
        <div className="relative aspect-video max-h-[500px] w-full bg-slate-900 flex flex-col justify-between p-6 sm:p-8 text-white overflow-hidden">
          {/* Subtle grid pattern background */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
              backgroundSize: '24px 24px' 
            }} 
          />

          {/* Top of Canvas: Current Chapter Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-white">{activeChapter.title}</span>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Live Walkthrough · Chapter {activeChapter.id} of 5
            </div>
          </div>

          {/* Center of Canvas: Interactive Visual Showcase */}
          <div className="relative z-10 max-w-2xl mx-auto my-auto text-center space-y-4">
            <div className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-2">
              {activeChapter.id === 1 && <Clock className="w-10 h-10 text-emerald-400 mx-auto" />}
              {activeChapter.id === 2 && <CalendarCheck2 className="w-10 h-10 text-indigo-400 mx-auto" />}
              {activeChapter.id === 3 && <CheckCircle2 className="w-10 h-10 text-blue-400 mx-auto" />}
              {activeChapter.id === 4 && <GraduationCap className="w-10 h-10 text-amber-400 mx-auto" />}
              {activeChapter.id === 5 && <Megaphone className="w-10 h-10 text-purple-400 mx-auto" />}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {activeChapter.screenTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              {activeChapter.screenSubtitle}
            </p>

            {/* Key feature pills */}
            <div className="grid grid-cols-2 gap-2 text-left max-w-lg mx-auto pt-2">
              {activeChapter.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom of Canvas: Narrator Subtitles */}
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-0.5">
                Narrator Commentary & Audio Transcript
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                "{activeChapter.narration}"
              </p>
            </div>
            <button
              type="button"
              onClick={() => jumpToLiveWorkflow(activeChapter)}
              className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors shrink-0 hidden sm:flex items-center gap-1.5"
            >
              <span>Test Live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Video Player Controls Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
          {/* Progress Timeline Scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {formatTime(currentSeconds)}
            </span>
            <input
              type="range"
              min={0}
              max={totalDuration}
              value={currentSeconds}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {formatTime(totalDuration)}
            </span>
          </div>

          {/* Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-xs"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-slate-900" /> : <Play className="w-4 h-4 fill-slate-900 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => setCurrentSeconds(0)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Restart Walkthrough"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Chapter Jump Shortcuts */}
            <div className="hidden lg:flex items-center gap-1.5">
              {chapters.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCurrentSeconds(c.startSec);
                    setIsPlaying(true);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    activeChapter.id === c.id
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Ch {c.id}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Speed:</span>
              <div className="flex items-center p-0.5 bg-slate-800 rounded-lg text-xs font-mono">
                {[1, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded ${
                      playbackSpeed === speed ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Selection Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Video Chapter Index & Interactive Workflow Shortcuts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {chapters.map(chap => (
            <div
              key={chap.id}
              className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                activeChapter.id === chap.id
                  ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{chap.title}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 block mb-2">
                  {chap.timeRange}
                </span>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {chap.narration}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentSeconds(chap.startSec);
                    setIsPlaying(true);
                  }}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline"
                >
                  Play Chapter
                </button>
                <button
                  type="button"
                  onClick={() => jumpToLiveWorkflow(chap)}
                  className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-0.5"
                >
                  <span>Live</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
