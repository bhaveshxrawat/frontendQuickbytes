if (
  !window.matchMedia("(hover: hover)").matches ||
  //@ts-ignore
  navigator.userAgentData?.mobile
) {
  function getWindowHeight() {
    return window.innerHeight;
  }
  function setVhHeight(el: HTMLElement, h: number) {
    el.style.setProperty("--vh", `${h}px`);
  }
  const doc = document.documentElement;
  setVhHeight(doc, getWindowHeight());
  screen.orientation.addEventListener("change", () => {
    setTimeout(() => {
      setVhHeight(doc, getWindowHeight());
    }, 100);
  });
}
