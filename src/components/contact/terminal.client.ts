import { PERSON } from '@/content/shared/links';
import type { Feature } from '@/lib/motion/lazy';
import { getLenis } from '@/lib/motion/lenis';
import { createScope, listen, type Cleanup } from '@/lib/motion/lifecycle';
import type { MotionPrefs } from '@/lib/motion/prefers';
import { complete, runCommand, type Effect, type Line, type TerminalData } from '@/lib/terminal/commands';

const LINE_DELAY_MS = 260;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function renderLine(line: Line): HTMLElement {
  if ('help' in line) {
    const row = document.createElement('div');
    row.className = 'help-row';
    const cmd = document.createElement('span');
    cmd.textContent = line.help.cmd;
    const desc = document.createElement('span');
    desc.className = 'muted';
    desc.textContent = line.help.description;
    row.append(cmd, desc);
    return row;
  }
  const p = document.createElement('p');
  p.textContent = line.text;
  if (line.tone === 'error') p.className = 'is-error';
  else if (line.tone === 'ok') p.className = 'is-ok';
  else if (line.tone === 'muted') p.className = 'muted';
  else if (line.tone === 'accent') p.className = 'accent';
  return p;
}

async function applyEffect(effect: Effect, log: HTMLElement, copyFailed: string) {
  switch (effect.type) {
    case 'open':
      window.open(effect.url, '_blank', 'noopener');
      break;
    case 'navigate':
      window.location.href = effect.url;
      break;
    case 'copy':
      try {
        await navigator.clipboard.writeText(effect.text);
      } catch {
        // Replace the optimistic "copied" line.
        const last = log.lastElementChild;
        if (last) {
          last.className = 'muted';
          last.textContent = copyFailed;
        }
      }
      break;
    case 'scroll': {
      const target = document.querySelector<HTMLElement>(effect.target);
      if (!target) break;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(target, { offset: -64 });
      else target.scrollIntoView({ behavior: 'auto' });
      break;
    }
    case 'clear':
      log.replaceChildren();
      break;
  }
}

export function mount(section: HTMLElement, prefs: MotionPrefs): Cleanup {
  const figure = section.querySelector<HTMLElement>('[data-terminal]');
  const screen = section.querySelector<HTMLElement>('[data-terminal-screen]');
  const log = section.querySelector<HTMLElement>('[data-terminal-output]');
  const form = section.querySelector<HTMLFormElement>('[data-terminal-form]');
  const input = form?.querySelector<HTMLInputElement>('input');
  const staticPrompt = section.querySelector<HTMLElement>('[data-terminal-static-prompt]');
  const json = section.querySelector('[data-terminal-dict]')?.textContent;
  if (!figure || !screen || !log || !form || !input || !json) return () => {};

  const data = JSON.parse(json) as TerminalData;
  const person = { email: PERSON.email, github: PERSON.github, linkedin: PERSON.linkedin };
  const scope = createScope();
  const original = [...log.childNodes].map((n) => n.cloneNode(true));
  const history: string[] = [];
  let cursor = 0;
  let busy = false;

  // Live mode: announce new output politely, show the real input.
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');
  form.hidden = false;
  if (staticPrompt) staticPrompt.hidden = true;

  const scrollToEnd = () => {
    screen.scrollTop = screen.scrollHeight;
  };

  const print = async (lines: Line[], slow: boolean) => {
    for (const line of lines) {
      log.append(renderLine(line));
      scrollToEnd();
      if (slow && prefs.tier !== 'static') await wait(LINE_DELAY_MS);
    }
  };

  const onSubmit = async (event: Event) => {
    event.preventDefault();
    if (busy) return;
    const value = input.value;
    input.value = '';

    const echo = document.createElement('p');
    echo.className = 'terminal__cmd';
    const prompt = document.createElement('span');
    prompt.className = 'accent';
    prompt.textContent = data.prompt;
    echo.append(prompt, ` ${value}`);
    log.append(echo);

    if (value.trim()) history.push(value.trim());
    cursor = history.length;

    const result = runCommand(value, data, person, history);
    busy = true;
    await print(result.lines, result.slow === true);
    for (const effect of result.effects) await applyEffect(effect, log, data.copyFailed);
    busy = false;
    scrollToEnd();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' && history.length > 0) {
      event.preventDefault();
      cursor = Math.max(0, cursor - 1);
      input.value = history[cursor] ?? '';
    } else if (event.key === 'ArrowDown' && history.length > 0) {
      event.preventDefault();
      cursor = Math.min(history.length, cursor + 1);
      input.value = history[cursor] ?? '';
    } else if (event.key === 'Tab' && !event.shiftKey) {
      // Only hijack Tab when there is something to complete; otherwise keep keyboard navigation.
      const completion = complete(input.value);
      if (completion) {
        event.preventDefault();
        input.value = completion;
      }
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      log.replaceChildren();
    }
  };

  // Clicking anywhere in the screen focuses the prompt (unless selecting text).
  const onScreenClick = () => {
    if (window.getSelection()?.toString()) return;
    input.focus({ preventScroll: true });
  };

  scope.add(listen(form, 'submit', (e) => void onSubmit(e)));
  scope.add(listen(input, 'keydown', onKeyDown as EventListener));
  scope.add(listen(screen, 'click', onScreenClick));

  scope.add(() => {
    log.replaceChildren(...original);
    log.removeAttribute('role');
    log.removeAttribute('aria-live');
    form.hidden = true;
    if (staticPrompt) staticPrompt.hidden = false;
  });

  return () => scope.destroy();
}

export default { mount } satisfies Feature;
