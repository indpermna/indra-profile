(() => {
  const body = document.body;
  const canvas = document.getElementById("matrix-canvas");
  const ctx = canvas?.getContext("2d");

  const fontSize = 14;
  const frameDelay = 70;

  const characters =
    "01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>//:;{}[]+-*\\";

  let columns = 0;
  let drops = [];
  let animationId = null;
  let lastFrame = 0;

  const translations = {
    id: {
      networks: "Networks & Socials",
      certifications: "Verified Certifications",
      hobbies: "Hobbies",
      currentVibe: "Current Vibe",
      collaboration: "Open for Tech Collaboration",
      bio: "IT Security & Network Engineer • Cyber Security"
    },

    en: {
      networks: "Networks & Socials",
      certifications: "Verified Certifications",
      hobbies: "Hobbies",
      currentVibe: "Current Vibe",
      collaboration: "Open for Tech Collaboration",
      bio: "IT Security & Network Engineer • Cyber Security"
    },

    jw: {
      networks: "Jaringan & Sosial",
      certifications: "Sertifikasi Terverifikasi",
      hobbies: "Hobi",
      currentVibe: "Suasana Saiki",
      collaboration: "Monggo Kolaborasi Teknologi",
      bio: "Teknisi Keamanan IT & Jaringan • Keamanan Siber"
    }
  };

  function applySavedSettings() {
    const theme =
      localStorage.getItem("user_theme") || "dark";

    const language =
      localStorage.getItem("user_lang") || "id";

    body.classList.remove(
      "dark-theme",
      "light-theme"
    );

    body.classList.add(`${theme}-theme`);

    applyLanguage(language);
  }

  function applyLanguage(language) {
    const selected =
      translations[language] || translations.id;

    document
      .querySelectorAll("[data-i18n]")
      .forEach((element) => {
        const key = element.dataset.i18n;

        if (key === "bio") {
          const parts = selected.bio.split(" • ");

          element.innerHTML =
            `${parts[0]} <span class="divider">•</span> ${parts[1]}`;
        } else if (selected[key]) {
          element.textContent = selected[key];
        }
      });

    document
      .querySelectorAll(".lang-btn")
