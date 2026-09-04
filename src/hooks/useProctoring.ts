import { useCallback, useEffect, useRef, useState } from 'react';
import { ProctorTracker, type ProctorEventType } from '../lib/proctor';

export interface BlockedAction {
  title: string;
  message: string;
}

const BLOCK_MESSAGES: Partial<Record<ProctorEventType, BlockedAction>> = {
  COPY_BLOCKED: {
    title: 'Copying is disabled',
    message:
      'Copying content is not allowed during the contest. This action has been recorded.',
  },
  CUT_BLOCKED: {
    title: 'Cutting is disabled',
    message:
      'Cutting content is not allowed during the contest. This action has been recorded.',
  },
  PASTE_BLOCKED: {
    title: 'Pasting is disabled',
    message:
      'Pasting content is not allowed during the contest. Type your solution in the editor.',
  },
  ESCAPE_PRESSED: {
    title: 'Escape is disabled',
    message:
      'The Escape key is disabled during the contest. Use the Finish button to end your attempt.',
  },
  CONTEXT_MENU_BLOCKED: {
    title: 'Right-click is disabled',
    message: 'The context menu is not available during the contest.',
  },
  DEVTOOLS_ATTEMPT: {
    title: 'Developer tools are disabled',
    message:
      'Opening developer tools is not allowed during the contest. This attempt has been recorded.',
  },
};

/**
 * Locks down the contest workspace: blocks copy/paste/context menu/devtools
 * shortcuts, keeps the page fullscreen, and reports every attempt in batches.
 */
export function useProctoring(
  contestId: string | undefined,
  active: boolean,
  problemId: () => string | undefined,
) {
  const trackerRef = useRef<ProctorTracker | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(
    () => !!document.fullscreenElement,
  );
  const [blocked, setBlocked] = useState<BlockedAction | null>(null);

  const report = useCallback(
    (type: ProctorEventType, metadata: Record<string, unknown> = {}) => {
      trackerRef.current?.track(type, metadata);
      const message = BLOCK_MESSAGES[type];
      if (message) setBlocked(message);
    },
    [],
  );

  useEffect(() => {
    if (!contestId || !active) return;

    const tracker = new ProctorTracker(contestId, problemId);
    trackerRef.current = tracker;

    const onKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (e.key === 'Escape') {
        e.preventDefault();
        report('ESCAPE_PRESSED');
        return;
      }
      if (ctrl && key === 'c') {
        e.preventDefault();
        report('COPY_BLOCKED', { source: 'keyboard' });
        return;
      }
      if (ctrl && key === 'x') {
        e.preventDefault();
        report('CUT_BLOCKED', { source: 'keyboard' });
        return;
      }
      if (ctrl && key === 'v') {
        e.preventDefault();
        report('PASTE_BLOCKED', { source: 'keyboard' });
        return;
      }

      const devtools =
        e.key === 'F12' ||
        (ctrl && e.shiftKey && ['i', 'j', 'c'].includes(key)) ||
        (ctrl && key === 'u');
      if (devtools) {
        e.preventDefault();
        report('DEVTOOLS_ATTEMPT', { key: e.key });
      }
    };

    const onClipboard = (type: ProctorEventType) => (e: Event) => {
      e.preventDefault();
      report(type, { source: 'clipboard-event' });
    };
    const onCopy = onClipboard('COPY_BLOCKED');
    const onCut = onClipboard('CUT_BLOCKED');
    const onPaste = onClipboard('PASTE_BLOCKED');

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      report('CONTEXT_MENU_BLOCKED');
    };

    const onVisibility = () => {
      // Silent tracking: no modal, since the candidate is not on this tab anyway.
      trackerRef.current?.track(document.hidden ? 'TAB_HIDDEN' : 'TAB_VISIBLE');
    };
    const onBlur = () => trackerRef.current?.track('WINDOW_BLUR');
    const onFocus = () => trackerRef.current?.track('WINDOW_FOCUS');

    const onFullscreenChange = () => {
      const now = !!document.fullscreenElement;
      setIsFullscreen(now);
      trackerRef.current?.track(
        now ? 'FULLSCREEN_ENTERED' : 'FULLSCREEN_EXITED',
      );
    };

    // Capture phase so the editor cannot swallow these first.
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('copy', onCopy, true);
    document.addEventListener('cut', onCut, true);
    document.addEventListener('paste', onPaste, true);
    document.addEventListener('contextmenu', onContextMenu, true);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('copy', onCopy, true);
      document.removeEventListener('cut', onCut, true);
      document.removeEventListener('paste', onPaste, true);
      document.removeEventListener('contextmenu', onContextMenu, true);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      tracker.dispose();
      trackerRef.current = null;
    };
  }, [contestId, active, problemId, report]);

  /** Must be called from a user gesture — browsers reject programmatic fullscreen otherwise. */
  const requestFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch {
      setIsFullscreen(!!document.fullscreenElement);
    }
  }, []);

  return {
    isFullscreen,
    requestFullscreen,
    blocked,
    dismissBlocked: () => setBlocked(null),
    report,
  };
}
