enum UserPreference {
  ALL = "all-cookies",
  NECESSARY = "necessary-cookies",
  NONE = "no-cookies ",
}

const popUpWrapper = document.querySelector(
  "#pop-up-wrapper"
) as HTMLDivElement;
const popUp = document.querySelector("#pop-up") as HTMLDivElement;
const prefSetterBtns = document.querySelectorAll(
  ".pref-setter[data-preference]"
);

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    popUpWrapper.hidden = false;
    document.documentElement.style.overflow = "hidden";
  }, 2300);
});

prefSetterBtns.forEach((btn) => {
  btn.addEventListener("click", handlePreferenceSetter);
});

function handlePreferenceSetter(e: Event) {
  const userCookiePref = (e.currentTarget as HTMLButtonElement).dataset
    .preference;
  popUpWrapper.classList.add("removing");
  setTimeout(() => {
    popUpWrapper.hidden = true;
    popUpWrapper.classList.remove("removing");
    document.documentElement.style.overflow = "";
  }, 500);
}
