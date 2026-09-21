import { isDemoFailureMode } from '@/lib/demo-mode'

/**
 * DemoBanner
 * ----------
 * A server component that renders a visible, sticky banner across the app
 * when `DEMO_FAILURE_MODE` is enabled. Renders nothing when the flag is off,
 * so normal behavior is fully preserved.
 */
export function DemoBanner() {
  if (!isDemoFailureMode()) {
    return null
  }

  return (
    <div
      role="alert"
      className="sticky top-0 z-[100] w-full border-b border-yellow-500 bg-yellow-400 px-4 py-2 text-center text-sm font-semibold text-yellow-950 shadow-sm"
    >
      ⚠️ Demo Mode — writes are disabled. This is a read-only demonstration.
    </div>
  )
}
