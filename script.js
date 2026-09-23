(() => {
  const body = document.body;

  const canvas = document.getElementById("matrix-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;

  const fontSize = 14;
  const frameDelay = 70;

  const characters =
    "01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>//:;{}[]+-*\\";

  let columns = 0;
  let drops = [];

  let animationId = null;
  let lastFrame = 0;

  function applySavedSettings() {
    const savedTheme = localStorage.getItem("user_theme") || "dark";
    const savedLanguage = localStorage.getItem("user_lang") || "id";

    body.classList.remove("dark-theme", "light-theme");
    body.classList.add(`${savedTheme}-theme`);

    document.querySelectorAll(".lang-btn").forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.lang === savedLanguage
      );
    });
  }

  window.toggleTheme = function () {
    const isLight = body.classList.toggle("light-theme");

    body.classList.toggle("dark-theme", !isLight);

    localStorage.setItem(
      "user_theme",
      isLight ? "light" : "dark"
    );
  };

  window.changeLanguage = function (language) {
    localStorage.setItem("user_lang", language);

    if (language === "id") {
      document.cookie =
        "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } else {
      document.cookie =
        `googtrans=/id/${language}; path=/; max-age=31536000`;
    }

    window.location.reload();
  };

  window.toggleSecretWindow = function () {
    const container = document.querySelector(".container");
    const restoreButton = document.getElementById(
      "secret-restore-btn"
    );

    const isHidden = container.classList.toggle("is-hidden");

    restoreButton.classList.toggle("reveal", isHidden);
  };

  window.openCertModal = function (
    title,
    issuer,
    description,
    skills,
    link
  ) {
    document.getElementById("modal-title-text").textContent = title;
    document.getElementById("modal-issuer-text").textContent = issuer;
    document.getElementById("modal-desc-text").textContent = description;
    document.getElementById("modal-verify-link").href = link;

    const skillsContainer = document.getElementById(
      "modal-skills-container"
    );

    skillsContainer.replaceChildren(
      ...skills.map((skill) => {
        const tag = document.createElement("span");

        tag.className = "skill-tag";
        tag.textContent = skill;

        return tag;
      })
    );

    document
      .getElementById("cert-modal")
      .classList.add("active");

    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  window.closeCertModal = function (event) {
    if (
      !event ||
      event.target.id === "cert-modal"
    ) {
      document
        .getElementById("cert-modal")
        .classList.remove("active");
    }
  };

  window.closeCertModalDirect = function () {
    document
      .getElementById("cert-modal")
      .classList.remove("active");
  };

  window.googleTranslateElementInit = function () {
    if (window.google && window.google.translate) {
      new google.translate.TranslateElement(
        {
          pageLanguage: "id",
          includedLanguages: "id,en,jw",
          autoDisplay: false
        },
        "google_translate_element"
      );
    }
  };

  function resizeCanvas() {
    if (!canvas || !ctx) return;

    const devicePixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    canvas.width = Math.floor(
      window.innerWidth * devicePixelRatio
    );

    canvas.height = Math.floor(
      window.innerHeight * devicePixelRatio
    );

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(
      devicePixelRatio,
      0,
      0,
      devicePixelRatio,
      0,
      0
    );

    columns = Math.floor(
      window.innerWidth / fontSize
    );

    drops = Array.from(
      { length: columns },
      () => Math.random() * -20
    );
  }

  function drawMatrix(timestamp = 0) {
    if (!canvas || !ctx) return;

    if (timestamp - lastFrame < frameDelay) {
      animationId = requestAnimationFrame(drawMatrix);
      return;
    }

    lastFrame = timestamp;

    const isLight = body.classList.contains(
      "light-theme"
    );

    ctx.fillStyle = isLight
      ? "rgba(241, 245, 249, 0.2)"
      : "rgba(11, 15, 25, 0.18)";

    ctx.fillRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    ctx.font = `${fontSize}px monospace`;

    for (let index = 0; index < drops.length; index++) {
      const randomCharacter =
        characters[
          Math.floor(
            Math.random() * characters.length
          )
        ];

      if (isLight) {
        ctx.fillStyle = "#065f46";
      } else {
        ctx.fillStyle =
          Math.random() > 0.9
            ? "#b7ffe2"
            : "#059669";
      }

      ctx.fillText(
        randomCharacter,
        index * fontSize,
        drops[index] * fontSize
      );

      if (
        drops[index] * fontSize > window.innerHeight &&
        Math.random() > 0.975
      ) {
        drops[index] = 0;
      }

      drops[index]++;
    }

    animationId = requestAnimationFrame(drawMatrix);
  }

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        lastFrame = 0;
        animationId = requestAnimationFrame(drawMatrix);
      }
    }
  );

  window.addEventListener("resize", resizeCanvas);

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      applySavedSettings();

      if (window.lucide) {
        window.lucide.createIcons();
      }

      resizeCanvas();

      animationId = requestAnimationFrame(drawMatrix);
    }
  );
})();
