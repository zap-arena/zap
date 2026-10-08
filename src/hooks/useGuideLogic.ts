import { useEffect } from "react";

function setupFocusMode() {
  const contentEl = document.querySelector(".content");
  const questionEls = Array.from(
    document.querySelectorAll<HTMLElement>(".question"),
  );
  if (!contentEl || questionEls.length === 0) return null;

  contentEl.classList.add("focus-mode");
  const questionIds = questionEls.map((el) => el.id);

  const updateNav = (idx: number) => {
    const prevBtn = document.getElementById(
      "prevQuestionBtn",
    ) as HTMLButtonElement | null;
    const nextBtn = document.getElementById(
      "nextQuestionBtn",
    ) as HTMLButtonElement | null;
    const progress = document.getElementById("questionProgress");
    if (prevBtn) prevBtn.disabled = idx <= 0;
    if (nextBtn) nextBtn.disabled = idx === -1 || idx >= questionIds.length - 1;
    if (progress) {
      progress.textContent =
        idx >= 0 ? `${idx + 1} / ${questionIds.length}` : "";
    }
  };

  const setActiveById = (id: string) => {
    questionEls.forEach((el) => {
      el.classList.toggle("active-question", el.id === id);
    });
    document.querySelectorAll(".side-link").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
    updateNav(questionIds.indexOf(id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = (delta: number) => {
    const activeEl = document.querySelector(".question.active-question");
    const currentIdx = activeEl ? questionIds.indexOf(activeEl.id) : 0;
    const nextIdx = Math.min(
      questionIds.length - 1,
      Math.max(0, currentIdx + delta),
    );
    setActiveById(questionIds[nextIdx]);
  };

  const initialId =
    window.location.hash && questionIds.includes(window.location.hash.slice(1))
      ? window.location.hash.slice(1)
      : questionIds[0];
  setActiveById(initialId);

  return { setActiveById, navigate, questionIds };
}

export function useGuideLogic() {
  useEffect(() => {
    const focusMode = setupFocusMode();

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Question sidebar navigation (focus mode — show one question at a time)
      const sideLink = target.closest<HTMLAnchorElement>(
        ".side-link[href^='#']",
      );
      if (sideLink && focusMode) {
        const id = sideLink.getAttribute("href")?.slice(1);
        if (id && focusMode.questionIds.includes(id)) {
          e.preventDefault();
          focusMode.setActiveById(id);
        }
      }

      // Next / Previous question controls
      if (target.closest("#prevQuestionBtn") && focusMode) {
        focusMode.navigate(-1);
      }
      if (target.closest("#nextQuestionBtn") && focusMode) {
        focusMode.navigate(1);
      }

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
