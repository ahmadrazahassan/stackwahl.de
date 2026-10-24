"use client";

import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { Dialog, NavigationMenu } from "radix-ui";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ACTIVE_WORDMARK, Wordmark } from "@/components/brand/wordmark";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import { CommandPalette, type SearchEntry } from "./command-palette";
import type { NavLink } from "./navigation";

const navLink =
  "inline-flex min-h-11 items-center gap-1 rounded-control px-3 text-small font-medium text-ink transition-colors hover:bg-bg data-[active]:text-primary aria-[current=page]:text-primary";

/**
 * Header (docs/PLAN.md): wordmark, Kategorien mega menu, three routes, search and one primary
 * button. Mobile: full screen menu with search first.
 */
export function SiteHeader({
  categories,
  searchEntries,
  primary,
  cta,
}: {
  /** Only live categories (at least five published profiles). */
  categories: NavLink[];
  searchEntries: SearchEntry[];
  /** Only routes that exist (see buildNavigation). */
  primary: NavLink[];
  cta: NavLink | null;
}) {
  const pathname = usePathname();
  return (
    <header className="relative z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="flex min-h-16 items-center justify-between gap-4 rounded-card bg-surface py-2 pr-2 pl-5">
        <Link
          href={routes.home()}
          className="flex min-h-11 items-center"
          aria-label="Stackwahl, zur Startseite"
        >
          <Wordmark option={ACTIVE_WORDMARK} />
        </Link>

        <NavigationMenu.Root
          aria-label="Hauptnavigation"
          className="relative hidden lg:block"
          delayDuration={80}
        >
          <NavigationMenu.List className="flex items-center gap-1">
            {categories.length > 0 ? (
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className={cn(navLink, "group")}>
                  Kategorien
                  <ChevronDown
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-full left-0 mt-3 w-[min(42rem,calc(100vw-4rem))] rounded-card border border-line bg-surface p-3 shadow-float">
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {categories.map((category) => (
                      <li key={category.href}>
                        <NavigationMenu.Link asChild active={pathname === category.href}>
                          <Link
                            href={category.href}
                            className="group/item flex min-h-11 flex-col justify-center rounded-control px-4 py-3 transition-colors hover:bg-bg"
                          >
                            <span className="flex items-center justify-between text-small font-medium">
                              {category.label}
                              <ArrowRight
                                aria-hidden="true"
                                strokeWidth={1.5}
                                className="size-4 text-primary opacity-0 transition-opacity group-hover/item:opacity-100"
                              />
                            </span>
                            {category.description ? (
                              <span className="mt-1 text-small text-muted">
                                {category.description}
                              </span>
                            ) : null}
                          </Link>
                        </NavigationMenu.Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 border-t border-line px-4 pt-3 pb-1">
                    <NavigationMenu.Link asChild>
                      <Link
                        href={routes.categories()}
                        className="inline-flex min-h-11 items-center text-small font-medium underline-offset-4 hover:underline"
                      >
                        Alle Kategorien ansehen
                      </Link>
                    </NavigationMenu.Link>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            ) : null}
            {primary.map((item) => (
              <NavigationMenu.Item key={item.href}>
                <NavigationMenu.Link asChild active={pathname === item.href}>
                  <Link
                    href={item.href}
                    className={navLink}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <div className="flex items-center gap-2">
          {searchEntries.length > 0 ? (
            <>
              <CommandPalette entries={searchEntries} shortcut className="hidden xl:inline-flex" />
              <CommandPalette entries={searchEntries} compact className="xl:hidden" />
            </>
          ) : null}
          {cta ? (
            <ButtonLink href={cta.href} className="hidden sm:inline-flex">
              {cta.label}
            </ButtonLink>
          ) : null}
          <MobileMenu
            categories={categories}
            searchEntries={searchEntries}
            primary={primary}
            cta={cta}
          />
        </div>
      </div>
    </header>
  );
}

function MobileMenu({
  categories,
  searchEntries,
  primary,
  cta,
}: {
  categories: NavLink[];
  searchEntries: SearchEntry[];
  primary: NavLink[];
  cta: NavLink | null;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="inline-flex size-11 items-center justify-center rounded-control text-ink hover:bg-bg lg:hidden">
        <Menu aria-hidden="true" className="size-5" strokeWidth={1.5} />
        <span className="sr-only">Menü öffnen</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg p-3"
        >
          <div className="flex min-h-16 items-center justify-between rounded-card bg-surface py-2 pr-2 pl-5">
            <Dialog.Title className="sr-only">Menü</Dialog.Title>
            <Wordmark option={ACTIVE_WORDMARK} />
            <Dialog.Close className="inline-flex size-11 items-center justify-center rounded-control hover:bg-bg">
              <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
              <span className="sr-only">Menü schließen</span>
            </Dialog.Close>
          </div>
          <div className="mt-3 flex flex-col gap-8 rounded-card bg-surface p-5">
            {searchEntries.length > 0 ? (
              <CommandPalette entries={searchEntries} className="w-full" />
            ) : null}
            {categories.length > 0 ? (
              <nav aria-label="Kategorien">
                <p className="eyebrow text-muted">Kategorien</p>
                <ul className="mt-2">
                  {categories.map((c) => (
                    <li key={c.href} className="border-b border-line">
                      <Link
                        href={c.href}
                        onClick={close}
                        className="flex min-h-12 items-center justify-between text-body"
                      >
                        {c.label}
                        <ArrowRight
                          aria-hidden="true"
                          className="size-4 text-primary"
                          strokeWidth={1.5}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
            <nav aria-label="Werkzeuge und Wissen" hidden={primary.length === 0}>
              <ul>
                {primary.map((item) => (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      onClick={close}
                      className="flex min-h-12 items-center text-h3"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {cta ? (
              <ButtonLink href={cta.href} onClick={close} className="self-start">
                {cta.label}
              </ButtonLink>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
