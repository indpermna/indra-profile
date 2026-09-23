document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  const themeToggleBtn =
    document.getElementById("theme-toggle");

  const bodyElement =
    document.body;

  const savedTheme =
    localStorage.getItem("user_theme");

  if (savedTheme) {
    bodyElement.className = savedTheme;
  } else {
    bodyElement.className = "dark-theme";
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener(
      "click",
      () => {
        if (
          bodyElement.classList.contains("dark-theme")
        ) {
          bodyElement.classList.remove("dark-theme");
          bodyElement.classList.add("light-theme");

          localStorage.setItem(
            "user_theme",
            "light-theme"
          );
        } else {
          bodyElement.classList.remove("light-theme");
          bodyElement.classList.add("dark-theme");

          localStorage.setItem(
            "user_theme",
            "dark-theme"
          );
        }

        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }
      }
    );
  }
});
