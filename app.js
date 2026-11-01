const STORAGE_KEY = "tiny-habit:v1";

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateStreak(completedDates, today = new Date()) {
  const completed = new Set(completedDates);
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let streak = 0;
  while (completed.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function toggleDate(completedDates, dateKey) {
  return completedDates.includes(dateKey)
    ? completedDates.filter((item) => item !== dateKey)
    : [...completedDates, dateKey];
}

export function confirmHabitDeletion(name, confirmFn = globalThis.confirm) {
  return confirmFn(`“${name}” 습관을 삭제할까요?\n완료 기록도 함께 삭제됩니다.`);
}

function loadHabits() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []; }
  catch { return []; }
}

function saveHabits(habits) { localStorage.setItem(STORAGE_KEY, JSON.stringify(habits)); }
function createHabit(name) { return { id: crypto.randomUUID(), name, completedDates: [] }; }

function startApp() {
  const form = document.querySelector("#habit-form");
  const input = document.querySelector("#habit-name");
  const list = document.querySelector("#habit-list");
  const template = document.querySelector("#habit-template");
  const progress = document.querySelector("#progress");
  const emptyState = document.querySelector("#empty-state");
  const todayKey = localDateKey();
  let habits = loadHabits();

  document.querySelector("#today").textContent = new Intl.DateTimeFormat("ko-KR", { dateStyle: "full" }).format(new Date());

  function render() {
    list.replaceChildren();
    const completedCount = habits.filter((habit) => habit.completedDates.includes(todayKey)).length;
    progress.textContent = `${completedCount} / ${habits.length} 완료`;
    emptyState.hidden = habits.length > 0;

    habits.forEach((habit) => {
      const fragment = template.content.cloneNode(true);
      const card = fragment.querySelector(".habit-card");
      const checkButton = fragment.querySelector(".check-button");
      const isCompleted = habit.completedDates.includes(todayKey);
      const streak = calculateStreak(habit.completedDates);
      card.classList.toggle("completed", isCompleted);
      fragment.querySelector(".habit-name").textContent = habit.name;
      fragment.querySelector(".streak").textContent = streak ? `${streak}일 연속 달성 중` : "오늘부터 시작해 보세요";
      checkButton.setAttribute("aria-pressed", String(isCompleted));
      checkButton.addEventListener("click", () => {
        habit.completedDates = toggleDate(habit.completedDates, todayKey);
        saveHabits(habits);
        render();
      });
      fragment.querySelector(".delete-button").addEventListener("click", () => {
        if (!confirmHabitDeletion(habit.name)) return;
        habits = habits.filter((item) => item.id !== habit.id);
        saveHabits(habits);
        render();
      });
      list.append(fragment);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    habits.push(createHabit(name));
    saveHabits(habits);
    input.value = "";
    input.focus();
    render();
  });
  render();
}

if (typeof document !== "undefined") startApp();
