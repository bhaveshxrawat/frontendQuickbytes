type Suggestion = {
  id: number;
  name: string;
};

const searchInputEl = document.getElementById("search-input");
const searchWrapperEl = document.querySelector<HTMLElement>("search");

let suggestionList: Suggestion[] = [];

async function fetchSuggestions(value: string) {
  //checks for entry
  if (value.trim().length === 0) {
    suggestionList = [];
    removeListEl();
    return;
  }
  const res = await fetch(
    `https://dummyjson.com/recipes/search?q=${value}&select=id,name&limit=9`
  );
  const data = await res.json();
  suggestionList = data.recipes;
}

function populateListEl() {
  const list = `<ul role="listbox" class="suggestion-list absolute mt-1 w-full rounded-md overflow-clip"></ul>`;
  searchWrapperEl?.insertAdjacentHTML("beforeend", list);
}
function removeListEl() {
  const suggestionListEl =
    document.querySelector<HTMLUListElement>(".suggestion-list");
  suggestionListEl?.remove();
}
function createListItemEl(suggestion: string) {
  const liItem = `<li role="option" class="sl-item"><button class="p-2 w-full bg-white/70 text-left hover:bg-white/50">${suggestion}</button></li>`;
  const suggestionListEl =
    document.querySelector<HTMLUListElement>(".suggestion-list");
  suggestionListEl?.insertAdjacentHTML("beforeend", liItem);
}
function populateSuggestions() {
  const listWrapper =
    document.querySelector<HTMLUListElement>(".suggestion-list");
  if (listWrapper) listWrapper.innerHTML = "";
  for (const suggestion of suggestionList) {
    createListItemEl(suggestion.name);
  }
}
function fetchThenPopulateSugg(val: string) {
  fetchSuggestions(val).then(() => {
    if (suggestionList.length > 0 && !(val.trim().length === 0)) {
      if (
        !searchWrapperEl?.contains(
          document.querySelector<HTMLUListElement>(".suggestion-list")
        )
      ) {
        populateListEl();
      }
      populateSuggestions();
    }
  });
}
const debouncedFetchSuggestions = debounce(
  (val: string) => fetchThenPopulateSugg(val),
  300
);
searchInputEl?.addEventListener("input", async (e) => {
  const { value } = e.target as HTMLInputElement;
  debouncedFetchSuggestions(value);
});

searchInputEl?.addEventListener("blur", () => {
  const suggestionListEl =
    document.querySelector<HTMLUListElement>(".suggestion-list");
  suggestionListEl?.setAttribute("hidden", "true");
});

searchInputEl?.addEventListener("focus", () => {
  const suggestionListEl =
    document.querySelector<HTMLUListElement>(".suggestion-list");
  if (suggestionListEl?.hidden) {
    suggestionListEl?.removeAttribute("hidden");
  }
});

// TODO: Implement debounce

function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
  let timeout: number;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}
