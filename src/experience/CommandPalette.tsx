import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { navItems } from '../data/nav';
import { links } from '../data/links';
import { projects } from '../content/projects';

/** Dispatched by nav buttons to open the palette without prop drilling. */
export const OPEN_PALETTE_EVENT = 'signal:open-palette';

type Command = {
  id: string;
  label: string;
  detail?: string;
  group: string;
  keywords?: string;
  run: () => void;
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: 'start' });
}

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Ctrl/⌘+K command palette. Every command performs a real action — scroll to a
 * real section, open a real project link, or copy the real email. Uses a native
 * <dialog> for the focus trap, Escape handling and focus restoration.
 */
export function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [rawCursor, setRawCursor] = useState(0);
  const [copied, setCopied] = useState(false);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }, []);

  const commands = useMemo<Command[]>(() => {
    const sections: Command[] = navItems.map((item) => ({
      id: `go:${item.id}`,
      label: item.label,
      detail: 'Jump to section',
      group: 'Sections',
      keywords: `section jump go ${item.id}`,
      run: () => scrollToId(item.id),
    }));

    const projectCommands: Command[] = [];
    projects.forEach((project) => {
      const live = project.live;
      const repo = project.repo;
      if (live) {
        projectCommands.push({
          id: `live:${project.id}`,
          label: `${project.name} — live site`,
          detail: 'Opens in a new tab',
          group: 'Projects',
          keywords: `project open visit demo ${project.name}`,
          run: () => openExternal(live),
        });
      }
      if (repo) {
        projectCommands.push({
          id: `repo:${project.id}`,
          label: `${project.name} — source`,
          detail: 'Opens in a new tab',
          group: 'Projects',
          keywords: `project code github source ${project.name}`,
          run: () => openExternal(repo),
        });
      }
    });

    const contact: Command[] = [
      {
        id: 'copy:email',
        label: 'Copy email address',
        detail: links.emailAddress,
        group: 'Contact',
        keywords: 'email mail copy clipboard contact',
        run: () => {
          navigator.clipboard
            ?.writeText(links.emailAddress)
            .then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1800);
            })
            .catch(() => {
              /* clipboard unavailable — leave feedback unchanged */
            });
        },
      },
      {
        id: 'mail:email',
        label: 'Send email',
        detail: links.emailAddress,
        group: 'Contact',
        keywords: 'email mail compose write',
        run: () => {
          window.location.href = links.email;
        },
      },
      {
        id: 'link:github',
        label: 'GitHub profile',
        detail: 'Opens in a new tab',
        group: 'Contact',
        keywords: 'github code repositories',
        run: () => openExternal(links.github),
      },
      {
        id: 'link:linkedin',
        label: 'LinkedIn profile',
        detail: 'Opens in a new tab',
        group: 'Contact',
        keywords: 'linkedin profile connect',
        run: () => openExternal(links.linkedin),
      },
    ];

    return [...sections, ...projectCommands, ...contact];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.detail ?? ''} ${command.keywords ?? ''} ${command.group}`
        .toLowerCase()
        .includes(q),
    );
  }, [commands, query]);

  const activeIndex = Math.min(rawCursor, Math.max(0, filtered.length - 1));
  const activeCommand = filtered[activeIndex];

  // Global shortcut + custom open event from the nav buttons.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  // Keep the native dialog in sync with React state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuery('');
      setRawCursor(0);
      setCopied(false);
      dialog.showModal();
      document.documentElement.classList.add('has-palette');
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Sync state when the dialog closes itself (Escape, backdrop, close button).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpen(false);
      document.documentElement.classList.remove('has-palette');
    };
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  // Keep the active option in view as the cursor moves.
  useEffect(() => {
    if (!open || !activeCommand) return;
    document
      .getElementById(`palette-opt-${activeCommand.id}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [open, activeCommand]);

  const runCommand = useCallback(
    (command: Command | undefined) => {
      if (!command) return;
      command.run();
      if (command.id !== 'copy:email') close();
    },
    [close],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setRawCursor(Math.min(activeIndex + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setRawCursor(Math.max(activeIndex - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      runCommand(filtered[activeIndex]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="palette"
      aria-label="Command palette"
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <div className="palette__box">
        <div className="palette__search">
          <span className="palette__prompt" aria-hidden="true">
            /
          </span>
          <input
            ref={inputRef}
            className="palette__input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-activedescendant={
              activeCommand ? `palette-opt-${activeCommand.id}` : undefined
            }
            aria-label="Search commands"
            placeholder="Jump to a section, project or link…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setRawCursor(0);
            }}
            onKeyDown={onKeyDown}
          />
          <kbd className="palette__kbd">Esc</kbd>
        </div>

        <ul id="palette-list" className="palette__list" role="listbox" aria-label="Commands">
          {filtered.map((command, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={command.id}
                id={`palette-opt-${command.id}`}
                role="option"
                aria-selected={isActive}
                className="palette__item"
                data-active={isActive ? '' : undefined}
                onMouseMove={() => setRawCursor(index)}
                onClick={() => runCommand(command)}
              >
                <span className="palette__item-label">
                  {command.id === 'copy:email' && copied ? 'Copied to clipboard' : command.label}
                </span>
                <span className="palette__item-meta">
                  <span className="palette__item-group">{command.group}</span>
                  {command.detail ? (
                    <span className="palette__item-detail">{command.detail}</span>
                  ) : null}
                </span>
              </li>
            );
          })}
          {filtered.length === 0 ? (
            <li className="palette__empty">No matching commands.</li>
          ) : null}
        </ul>

        <div className="palette__footer" aria-hidden="true">
          <span>↑↓ move</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </dialog>
  );
}
