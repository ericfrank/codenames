enum ColorScheme {
  Light = "light",
  Dark = "dark",
}

const darkModeClass = "dark-mode";
const watchMediaQuery = "(prefers-color-scheme: dark)";
const localStorageKey = "color-scheme";

const setColorScheme = () => {
  const isOsDarkMode = window.matchMedia?.(watchMediaQuery).matches;
  const localStorageScheme = localStorage.getItem(
    localStorageKey
  ) as ColorScheme;

  let scheme = isOsDarkMode ? ColorScheme.Dark : ColorScheme.Light;

  if (localStorageScheme) {
    scheme = localStorageScheme;
  }

  if (scheme === ColorScheme.Dark) {
    document.documentElement.classList.add(darkModeClass);
  } else {
    document.documentElement.classList.remove(darkModeClass);
  }
};

const watchColorScheme = () => {
  window
    .matchMedia?.(watchMediaQuery)
    ?.addEventListener("change", setColorScheme);
};

export const initColorScheme = () => {
  setColorScheme();
  watchColorScheme();
};

export const handleToggleColorScheme = () => {
  const newColorScheme = document.documentElement.classList.contains(
    darkModeClass
  )
    ? ColorScheme.Light
    : ColorScheme.Dark;

  localStorage.setItem(localStorageKey, newColorScheme);
  setColorScheme();
};
