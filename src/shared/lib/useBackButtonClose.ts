import { useEffect, useRef } from "react"

// Monotonic id stamped onto each pushed history entry so stacked overlays can
// tell their own entry apart from one another.
let nextEntryId = 0

interface OverlayHistoryState {
  overlayId?: number
}

/**
 * Ties an overlay's open state to a browser history entry so the mobile
 * back gesture (or the browser Back button) closes the overlay instead of
 * navigating away from the page.
 *
 * While `open` is true we push one tagged history entry; navigating away from
 * it (back gesture) runs `onClose`. If the overlay is instead closed through
 * the UI, we pop that entry ourselves so the history stays clean.
 *
 * Stacking-safe: closing a stacked overlay lands us back on the parent
 * overlay's own entry, which the parent recognises by id and ignores, so it
 * stays open.
 */
export function useBackButtonClose(open: boolean, onClose: () => void) {
  // Keep the latest callback without re-running the main effect when it changes.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Tracks whether the synthetic history entry is still on the stack.
  const hasPushedEntry = useRef(false)

  useEffect(() => {
    if (!open) return

    const entryId = ++nextEntryId
    window.history.pushState({ overlayId: entryId } satisfies OverlayHistoryState, "")
    hasPushedEntry.current = true

    const handlePopState = (event: PopStateEvent) => {
      // We landed back on our own entry (a stacked child above us closed) —
      // stay open and keep the entry.
      const state = event.state as OverlayHistoryState | null
      if (state?.overlayId === entryId) return

      hasPushedEntry.current = false
      onCloseRef.current()
    }
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
      // Closed via the UI: remove the entry we pushed so Back still works.
      if (hasPushedEntry.current) {
        hasPushedEntry.current = false
        window.history.back()
      }
    }
  }, [open])
}
