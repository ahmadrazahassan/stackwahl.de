"use client";

import { Command } from "cmdk";
import { Search } from "lucide-react";
import { Dialog } from "radix-ui";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { germanFilter } from "@/lib/search";

export type SearchEntry = { group: string; label: string; href: string; hint?: string };

const subscribeNoop = () => () => {};
const detectMac = () => /Mac|iPhone|iPad/.test(navigator.userAgent);

/** Search trigger plus command palette (`Strg K` / `⌘ K`), Section 13.6.14. */
export function CommandPalette({
  entries,
  className,
  compact = false,
  shortcut = false,
}: {
  entries: SearchEntry[];
  className?: string;
  compact?: boolean;
  /** Exactly one instance per page binds Strg K / ⌘ K. */
  shortcut?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isMac = useSyncExternalStore(subscribeNoop, detectMac, () => false);
  const router = useRouter();

  useEffect(() => {
    if (!shortcut) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);

  const groups = [...new Set(entries.map((e) => e.group))];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={cn(
          "inline-flex min-h-11 items-center gap-3 border border-line bg-surface text-small text-muted transition-colors hover:border-ink hover:text-ink",
          compact ? "w-11 justify-center" : "px-4",
          className,
        )}
      >
        <Search aria-hidden="true" className="size-4" strokeWidth={1.5} />
        {compact ? (
          <span className="sr-only">Suche öffnen</span>
        ) : (
          <>
            <span>Software suchen</span>
            <kbd className="ml-6 rounded-[0.375rem] border border-line px-1.5 py-0.5 font-body text-label text-muted">
              {isMac ? "⌘ K" : "Strg K"}
            </kbd>
          </>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-[12vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-card bg-surface shadow-float"
        >
          <Dialog.Title className="sr-only">Suche</Dialog.Title>
          <Command filter={germanFilter} label="Suche" loop>
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search aria-hidden="true" className="size-4 text-muted" strokeWidth={1.5} />
              <Command.Input
                placeholder="Software, Kategorie oder Thema suchen"
                className="min-h-14 w-full bg-transparent text-body text-ink outline-none placeholder:text-muted"
              />
            </div>
            <Command.List className="max-h-[50vh] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-6 text-small text-muted">
                Keine Treffer. Versuchen Sie einen anderen Begriff.
              </Command.Empty>
              {groups.map((group) => (
                <Command.Group
                  key={group}
                  heading={group}
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:eyebrow [&_[cmdk-group-heading]]:text-muted"
                >
                  {entries
                    .filter((e) => e.group === group)
                    .map((entry) => (
                      <Command.Item
                        key={entry.href}
                        value={`${entry.label} ${entry.href}`}
                        keywords={entry.hint ? [entry.hint] : undefined}
                        onSelect={() => {
                          setOpen(false);
                          router.push(entry.href);
                        }}
                        className="flex min-h-11 cursor-pointer items-center justify-between gap-4 px-3 text-body data-[selected=true]:bg-primary-tint"
                      >
                        <span>{entry.label}</span>
                        {entry.hint ? (
                          <span className="text-small text-muted">{entry.hint}</span>
                        ) : null}
                      </Command.Item>
                    ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
