"use client";

import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { Dialog, NavigationMenu } from "radix-ui";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import { CommandPalette, type SearchEntry } from "./command-palette";
import type { NavLink } from "./navigation";

export type HeaderNav = { left: NavLink[]; knowledge: NavLink[]; contact: NavLink };

// Light grey pills on the frosted bar. The current page is mango yellow with an ink dot, so it
// reads as selected at a glance; hover and open menus only darken the grey.
const pill =
  "group inline-flex h-10 items-center gap-2 rounded-pill bg-bg px-4 text-[0.8125rem] text-ink transition-colors hover:bg-line data-[state=open]:bg-line data-[current=true]:bg-mango data-[current=true]:font-medium";

function isCurrent(pathname: string, href: string) {
  return href === routes.home() ? pathname === href : pathname.startsWith(href);
}

/**
 * Always in the DOM and only shown on the current item (data-current on the parent pill).
 * Inserting it on navigation made React fail when a browser translation had wrapped the
 * label text in its own elements.
 */
function CurrentDot() {
  return (
    <span
      aria-hidden="true"
      className="hidden size-1.5 rounded-pill bg-ink group-data-[current=true]:block"
    />
  );
}

/** True once the page has scrolled, so the floating bar gets its shadow. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return scrolled;
}

/**
 * Header: page links as pills on the left, the wordmark in the centre, Kategorien and Wissen
 * as dropdowns, search and Kontakt on the right. Below lg the wordmark moves left and
 * everything else goes into a full screen menu.
 */
export function SiteHeader({
  categories,
  searchEntries,
  nav,
}: {
  /** Only live categories (at least five published profiles). */
  categories: NavLink[];
  searchEntries: SearchEntry[];
  /** Only routes that exist (see buildNavigation). */
  nav: HeaderNav;
}) {
  const pathname = usePathname();
  const scrolled = useScrolled();
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={cn(
          "relative flex min-h-16 items-center justify-between gap-4 rounded-card border border-surface bg-frost py-3 pr-3 pl-5 backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-300 lg:px-3",
          scrolled && "shadow-float",
        )}
      >
        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-1.5">
            {nav.left.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={pill}
                    data-current={current}
                    aria-current={current ? "page" : undefined}
                  >
                    <CurrentDot />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href={routes.home()}
          className="flex min-h-11 items-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-1/2"
          aria-label="Stackwahl, zur Startseite"
        >
          <Wordmark />
        </Link>

        <div className="flex items-center gap-1.5">
          <NavigationMenu.Root
            aria-label="Kategorien und Wissen"
            className="hidden lg:block"
            delayDuration={80}
          >
            <NavigationMenu.List className="flex items-center gap-1.5">
              {categories.length > 0 ? (
                <Dropdown
                  label="Kategorien"
                  links={categories}
                  pathname={pathname}
                  wide
                  footer={{ label: "Alle Kategorien ansehen", href: routes.categories() }}
                />
              ) : null}
              {nav.knowledge.length > 0 ? (
                <Dropdown label="Wissen" links={nav.knowledge} pathname={pathname} />
              ) : null}
            </NavigationMenu.List>
          </NavigationMenu.Root>
          {searchEntries.length > 0 ? (
            <CommandPalette
              entries={searchEntries}
              compact
              shortcut
              className="hidden size-10 min-h-10 w-10 rounded-pill border-0 bg-bg text-ink hover:bg-line sm:inline-flex"
            />
          ) : null}
          <Link
            href={nav.contact.href}
            aria-current={isCurrent(pathname, nav.contact.href) ? "page" : undefined}
            data-current={isCurrent(pathname, nav.contact.href)}
            className="group hidden h-10 items-center gap-2 rounded-pill border border-line bg-surface px-5 text-[0.8125rem] font-medium text-ink transition-colors hover:border-ink data-[current=true]:border-mango data-[current=true]:bg-mango lg:inline-flex"
          >
            <CurrentDot />
            {nav.contact.label}
          </Link>
          <MobileMenu categories={categories} searchEntries={searchEntries} nav={nav} />
        </div>
      </div>
    </header>
  );
}

function Dropdown({
  label,
  links,
  pathname,
  wide = false,
  footer,
}: {
  label: string;
  links: NavLink[];
  pathname: string;
  wide?: boolean;
  footer?: NavLink;
}) {
  const current = links.some((l) => isCurrent(pathname, l.href));
  return (
    <NavigationMenu.Item className="relative">
      <NavigationMenu.Trigger className={pill} data-current={current}>
        <CurrentDot />
        {label}
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.5}
          className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content
        className={cn(
          "absolute top-full right-0 mt-3 rounded-card border border-line bg-surface p-3 shadow-float",
          wide ? "w-[min(42rem,calc(100vw-4rem))]" : "w-80",
        )}
      >
        <ul className={cn("grid gap-1", wide && "sm:grid-cols-2")}>
          {links.map((link) => (
            <li key={link.href}>
              <NavigationMenu.Link asChild active={isCurrent(pathname, link.href)}>
                <Link
                  href={link.href}
                  className="group/item flex min-h-11 flex-col justify-center rounded-[0.75rem] px-4 py-3 transition-colors hover:bg-bg"
                >
                  <span className="flex items-center justify-between text-small font-medium">
                    {link.label}
                    <ArrowRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-4 text-primary opacity-0 transition-opacity group-hover/item:opacity-100"
                    />
                  </span>
                  {link.description ? (
                    <span className="mt-1 text-small text-muted">{link.description}</span>
                  ) : null}
                </Link>
              </NavigationMenu.Link>
            </li>
          ))}
        </ul>
        {footer ? (
          <div className="mt-2 border-t border-line px-4 pt-3 pb-1">
            <NavigationMenu.Link asChild>
              <Link
                href={footer.href}
                className="inline-flex min-h-11 items-center text-small font-medium underline-offset-4 hover:underline"
              >
                {footer.label}
              </Link>
            </NavigationMenu.Link>
          </div>
        ) : null}
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}

function MobileMenu({
  categories,
  searchEntries,
  nav,
}: {
  categories: NavLink[];
  searchEntries: SearchEntry[];
  nav: HeaderNav;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const pages = [...nav.left.slice(1), ...nav.knowledge, nav.contact];
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="inline-flex size-10 items-center justify-center rounded-pill bg-bg text-ink hover:bg-line lg:hidden">
        <Menu aria-hidden="true" className="size-5" strokeWidth={1.5} />
        <span className="sr-only">Menü öffnen</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg p-3"
        >
          <div className="flex min-h-16 items-center justify-between rounded-card bg-surface py-3 pr-3 pl-5">
            <Dialog.Title className="sr-only">Menü</Dialog.Title>
            <Wordmark />
            <Dialog.Close className="inline-flex size-10 items-center justify-center rounded-pill bg-bg hover:bg-line">
              <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
              <span className="sr-only">Menü schließen</span>
            </Dialog.Close>
          </div>
          <div className="mt-3 flex flex-col gap-8 rounded-card bg-surface p-5">
            {searchEntries.length > 0 ? (
              <CommandPalette entries={searchEntries} className="w-full rounded-pill" />
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
            <nav aria-label="Werkzeuge und Wissen">
              <ul>
                {pages.map((item) => (
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
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
