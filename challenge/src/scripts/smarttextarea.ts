type CountStatusProps = "ok" | "near" | "exceeded";

const textarea = document.querySelector(
  "#smart-textarea-input"
) as HTMLDivElement;
const placeholder = document.querySelector("#placeholder") as HTMLSpanElement;
const count = document.querySelector(
  ".smart-textarea-count"
) as HTMLSpanElement;
const submitCTA = document.querySelector("button") as HTMLButtonElement;
const maxChar = parseInt(count.ariaValueMax!) ?? 280;

function changeVisibility(el: HTMLElement, hidden: boolean) {
  hidden ? el.setAttribute("hidden", "true") : el.removeAttribute("hidden");
}

function handleInput() {
  const textContent = textarea.textContent || "";
  const textContentLength = textContent.length;
  if (textContentLength <= 1) {
    changeVisibility(placeholder, textContentLength > 0);
    changeVisibility(count, textContentLength <= 0);
  }
  const offSetAmt = maxChar - textContentLength;
  count.setAttribute("aria-valuenow", `${textContentLength}`);
  count.setAttribute(
    "style",
    `
    --max: ${maxChar};
    --now: ${textContentLength};
    --diff: "${offSetAmt}";
    --countPercentage: ${((textContentLength / maxChar) * 100).toFixed(2)}%;
    `
  );
  submitCTA.disabled = textContentLength > maxChar || textContentLength < 1;
  const countStatus = (): CountStatusProps => {
    if (textContentLength > maxChar) return "exceeded";
    if (offSetAmt <= 15) return "near";
    return "ok";
  };
  count.dataset.status = countStatus();
  const existingLimitSpan = textarea.querySelector(
    ".limit-excess"
  ) as HTMLSpanElement;
  const existingOffsetSpan = textarea.querySelector(
    ".offset-excess"
  ) as HTMLSpanElement;

  //TODO Highlighting the excess characters

  // if (textContentLength > maxChar) {
  //   if (!existingOffsetSpan) {
  //     const offsetSpan = document.createElement("span");
  //     offsetSpan.className = "offset-excess";
  //     offsetSpan.setAttribute("tabindex", "0");
  //     textarea.appendChild(offsetSpan);
  //     offsetSpan.focus({ preventScroll: true });
  //   } else {
  //     const nonOffSetText = textContent.slice(0, maxChar);
  //     const extraContent = textContent.slice(offSetAmt);
  //     existingOffsetSpan.innerText = extraContent;
  //   }
  // } else if (existingOffsetSpan) {
  //   textarea.removeChild(existingOffsetSpan);
  // }
}

textarea.addEventListener("input", handleInput);
