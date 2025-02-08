const controllerSearchable = new AbortController();
const details = document.querySelector("details") as HTMLDetailsElement;
const summary = document.querySelector("summary") as HTMLElement;
const input = document.querySelector("#dropdown__input") as HTMLInputElement;
const list = document.querySelector("[role=listbox]") as HTMLUListElement;
const clearSelectionBtn = document.querySelector("#clear") as HTMLButtonElement;
const radioOptions = document.querySelectorAll(
  "input[type=radio]"
) as NodeListOf<HTMLInputElement>;
const ogOptions = ["Nick", "Ali", "Laura", "James"];

//populate listbox
function createLiOption(data: string) {
  return `<li role="option" tabindex="-1" aria-selected="false" class="py-2 px-4 cursor-pointer hover:bg-black/10" data-value="${data}">${data}</li>`;
}
function populateRemoveEvent() {
  const allBtns = document.querySelectorAll(
    ".tag-btn"
  ) as NodeListOf<HTMLButtonElement>;
  allBtns.forEach((btn) => {
    btn.addEventListener("click", () => removeTag(btn));
  });
}
function createTag(data: string) {
  return `<div class="tag flex items-center bg-[#0b0b0b]/10 rounded-md p-2 overflow-clip gap-2" data-value="${data}"><span>${data}</span><button class="tag-btn leading-none align-middle">x</button></div>`;
}
ogOptions.forEach((option) => {
  list.insertAdjacentHTML("beforeend", createLiOption(option));
});

//set initial state (progressive enhancement)
const staleInputVal = input.value;

let selectedRadioOption: string | undefined;
let selectedListOption: HTMLLIElement | undefined;
let tagArray: string[] = [];

if (staleInputVal !== "") {
  selectedListOption = Array.from(list.children).find((child) => {
    return (child as HTMLLIElement).dataset.value === staleInputVal;
  }) as HTMLLIElement | undefined;
  if (selectedListOption) selectedListOption.ariaSelected = "true";
}

defineSelectedRadioOption();

function closeDropdown() {
  details.open = false;
  if (selectedRadioOption === "searchable") {
    if (
      ogOptions.some(
        (option) => option.toLowerCase() === input.value.toLowerCase()
      )
    ) {
      input.placeholder = input.value;
      input.value = "";
    } else {
      input.value = "";
    }
  }
  document.removeEventListener("click", handleOutsideClick);
  document.removeEventListener("keydown", handleEscKey);
}

function openDropdown() {
  if (selectedRadioOption === "searchable" || selectedRadioOption === "multi") {
    details.setAttribute("open", "");
  }
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleEscKey);
}

function toggleDropdown(e: MouseEvent) {
  if (selectedRadioOption === "searchable" || selectedRadioOption === "multi") {
    e.stopPropagation();
  }
  details.open ? closeDropdown() : openDropdown();
}

function handleOutsideClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!details.contains(target)) {
    closeDropdown();
  }
}

function handleEscKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    closeDropdown();
  }
}

function populateTags() {
  document.querySelectorAll(".tag").forEach((tag) => {
    tag.remove();
  });
  tagArray.forEach((tag) => {
    input.insertAdjacentHTML("beforebegin", createTag(tag));
  });
  populateRemoveEvent();
  const filteredOptions = ogOptions.filter(
    (option) => !tagArray.includes(option)
  );
  list.innerHTML = "";
  filteredOptions.forEach((option) => {
    list.insertAdjacentHTML("beforeend", createLiOption(option));
  });
  input.value = "";
}

function removeTag(el: HTMLButtonElement) {
  console.log(el);
  const target = el;
  const tagValue = target.parentElement?.dataset.value;
  tagArray = tagArray.filter((tag) => tag !== tagValue);
  populateTags();
}

function handleListOptionClick(e: MouseEvent) {
  const target = e.target as HTMLLIElement;
  if (target.matches("[role=option]")) {
    if (selectedRadioOption !== "multi") {
      input.value = target.textContent!;
      if (selectedListOption) selectedListOption.ariaSelected = "false";
      selectedListOption = target;
      selectedListOption.ariaSelected = "true";
    } else {
      if (!tagArray.includes(target.textContent!)) {
        tagArray.push(target.textContent!);
        populateTags();
      }
    }
    closeDropdown();
  }
}

function handleClearClick() {
  radioOptions.forEach((option) => {
    option.checked = false;
  });
  defineSelectedRadioOption();
}

function handleInputType() {
  if (!details.open) openDropdown();
  const { value } = input;
  const filteredOptions = ogOptions.filter((option) =>
    option.toLowerCase().includes(value.toLowerCase())
  );
  list.innerHTML = "";
  filteredOptions.forEach((option) => {
    list.insertAdjacentHTML("beforeend", createLiOption(option));
  });
}

function defineSelectedRadioOption() {
  selectedRadioOption = Array.from(radioOptions).find(
    (option) => option.checked
  )?.value;
  if (selectedRadioOption === "multi") transformToMulti();
  if (selectedRadioOption === "searchable") transformToSearchable();
  if (!selectedRadioOption) transformToNormal();
}

function transformToSearchable() {
  cleanup();
  input.classList.remove("multi");
  input.classList.add("searchable");
  input.style.pointerEvents = "auto";
  input.addEventListener("click", toggleDropdown);
  input.addEventListener("input", handleInputType);
}

function cleanup() {
  input.removeEventListener("click", toggleDropdown);
  input.removeEventListener("input", handleInputType);
  input.classList.remove("searchable", "multi");
  input.value = "";
  input.placeholder = "Select...";
  document.querySelectorAll(".tag").forEach((tag) => {
    tag.remove();
  });
  tagArray = [];
  list.innerHTML = "";
  ogOptions.forEach((option) => {
    list.insertAdjacentHTML("beforeend", createLiOption(option));
  });
}

function transformToMulti() {
  cleanup();
  input.classList.add("multi");
  input.style.pointerEvents = "auto";
  input.addEventListener("click", toggleDropdown);
  input.addEventListener("input", handleInputType);
}

function transformToNormal() {
  cleanup();
  input.style.pointerEvents = "";
}

list.addEventListener("click", handleListOptionClick);
list.addEventListener("blur", (e: FocusEvent) => {
  const { relatedTarget } = e;
  if (
    !relatedTarget ||
    !(relatedTarget as HTMLElement).matches("#dropdown__input")
  ) {
    closeDropdown();
  }
});
details.addEventListener("click", openDropdown);
clearSelectionBtn.addEventListener("click", handleClearClick);
radioOptions.forEach((option) =>
  option.addEventListener("change", defineSelectedRadioOption)
);
