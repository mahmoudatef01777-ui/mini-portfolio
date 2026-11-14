/**
 * A named event to Microsoft Clarity, the recordings tool.
 *
 * `window.clarity` is a stub from the first paint (see index.html), so an
 * event sent before the tag has loaded is queued and delivered with it. On
 * localhost and on previews there is no tag at all, and this does nothing.
 */
export function track(name: string) {
  (window as unknown as { clarity?: (...args: unknown[]) => void }).clarity?.('event', name);
}
