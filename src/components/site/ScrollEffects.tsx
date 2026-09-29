"use client";

import { useEffect } from "react";

/**
 * Page-wide scroll behaviour, attached once:
 * - elements marked `data-reveal` pop in the first time they enter view
 *   (children of a `data-reveal-group` get a staggered delay);
 * - the header hides while scrolling down and returns when scrolling up;
 * - the nav link for the section in view gets `aria-current`;
 * - the mobile order bar shows once the hero has scrolled away.
 */
export function ScrollEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        (child as HTMLElement).style.setProperty("--reveal-delay", `${i * 90}ms`);
      });
    });

    const revealTargets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          revealObserver.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
    cleanups.push(() => revealObserver.disconnect());

    const header = document.getElementById("site-header");
    if (header) {
      let lastY = window.scrollY;
      let frame = 0;
      const onScroll = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const y = window.scrollY;
          const menuOpen = document.body.hasAttribute("data-menu-open");
          if (!menuOpen && Math.abs(y - lastY) > 8) {
            header.toggleAttribute("data-hidden", y > lastY && y > 400);
            lastY = y;
          }
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      header.addEventListener("focusin", () => header.removeAttribute("data-hidden"));
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("[data-section-link]")
    );
    const sections = navLinks
      .map((a) => document.querySelector<HTMLElement>(a.hash))
      .filter((s): s is HTMLElement => Boolean(s));
    if (sections.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            for (const a of navLinks) {
              if (a.hash === `#${entry.target.id}`) a.setAttribute("aria-current", "true");
              else a.removeAttribute("aria-current");
            }
          }
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach((s) => spy.observe(s));
      cleanups.push(() => spy.disconnect());
    }

    const hero = document.getElementById("top");
    const orderBar = document.getElementById("order-bar");
    if (hero && orderBar) {
      const barObserver = new IntersectionObserver(([entry]) => {
        orderBar.toggleAttribute("data-visible", !entry.isIntersecting);
      });
      barObserver.observe(hero);
      cleanups.push(() => barObserver.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
