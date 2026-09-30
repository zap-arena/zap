import { useEffect } from "react";

export function useGuideLogic() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Approach tabs
      const tabBtn = target.closest(".tab-btn[data-target]");
      if (tabBtn) {
        const group = tabBtn.closest(".approach-tabs");
        if (group) {
          group
            .querySelectorAll(".tab-btn")
            .forEach((b) => b.classList.remove("active"));
          tabBtn.classList.add("active");

          const targetId = tabBtn.getAttribute("data-target");
          let sibling = group.nextElementSibling;
          while (sibling) {
            if (sibling.classList.contains("approach-panel")) {
              if (sibling.id === targetId) {
                sibling.classList.add("active");
              } else {
                sibling.classList.remove("active");
              }
            }
            sibling = sibling.nextElementSibling;
          }
        }
      }

      // Language tabs
      const langBtn = target.closest("[data-lang]");
      if (langBtn) {
        const lang = langBtn.getAttribute("data-lang");
        document
          .querySelectorAll("[data-lang]")
          .forEach((b) => b.classList.remove("active"));
        document
          .querySelectorAll(`[data-lang="${lang}"]`)
          .forEach((b) => b.classList.add("active"));

        if (lang === "both") {
          document.body.removeAttribute("data-lang");
        } else {
          document.body.setAttribute("data-lang", lang || "both");
        }
      }

      // TOC active state
      if (target.closest(".toc a")) {
        document
          .querySelectorAll(".toc a")
          .forEach((a) => a.classList.remove("active"));
        target.closest("a")?.classList.add("active");
      }
    };

    document.addEventListener("click", handleClick);

    // Intersection Observer for TOC highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document
              .querySelectorAll(".toc a")
              .forEach((l) => l.classList.remove("active"));
            const match = document.querySelector(
              `.toc a[href="#${entry.target.id}"]`,
            );
            if (match) match.classList.add("active");
          }
        });
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );

    setTimeout(() => {
      document
        .querySelectorAll("h2[id], h3[id], .approach-wrapper[id]")
        .forEach((s) => observer.observe(s));
    }, 500);

    return () => {
      document.removeEventListener("click", handleClick);
      observer.disconnect();
    };
  }, []);
}
