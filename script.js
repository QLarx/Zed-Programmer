// Находим элементы страницы, с которыми будем работать.
const searchInput = document.querySelector("#searchInput"); // Поле поиска в шапке.
const cards = [...document.querySelectorAll(".script-card")]; // Все карточки скриптов.
const filterButtons = [...document.querySelectorAll(".filter-chip")]; // Кнопки языковых фильтров.
const emptyState = document.querySelector("#emptyState"); // Сообщение, если совпадений нет.
const toast = document.querySelector("#toast"); // Всплывающее уведомление.
const themeToggle = document.querySelector("#themeToggle"); // Кнопка смены темы.
const menuToggle = document.querySelector("#menuToggle"); // Кнопка мобильного меню.
const mainNav = document.querySelector("#mainNav"); // Основная навигация.
let activeFilter = "all"; // Текущий фильтр: изначально показываем все языки.
let toastTimer; // Здесь сохраним таймер, чтобы уведомления не накладывались.

// Фильтрует карточки одновременно по языку и поисковому запросу.
function updateCards() {
  const query = searchInput.value.trim().toLowerCase(); // Убираем пробелы и приводим запрос к нижнему регистру.
  let visibleCount = 0; // Счётчик видимых карточек.

  cards.forEach((card) => { // Перебираем каждую карточку.
    const language = card.dataset.language; // Читаем язык из data-language в HTML.
    const searchableText = `${card.dataset.search} ${card.textContent}`.toLowerCase(); // Текст, в котором ищем запрос.
    const matchesFilter = activeFilter === "all" || language === activeFilter; // Подходит ли карточка выбранному языку.
    const matchesQuery = searchableText.includes(query); // Содержит ли карточка поисковую фразу.
    const shouldShow = matchesFilter && matchesQuery; // Карточка видна, только если подходят оба условия.
    card.hidden = !shouldShow; // Атрибут hidden скрывает неподходящую карточку.
    if (shouldShow) visibleCount += 1; // Считаем найденную карточку.
  });

  emptyState.hidden = visibleCount !== 0; // Показываем подсказку, если не найдено ни одной карточки.
}

// Запускаем поиск при каждом изменении текста в поле.
searchInput.addEventListener("input", updateCards);

// Переключаем фильтр по языку при нажатии на кнопку.
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter; // Сохраняем выбранный язык.
    filterButtons.forEach((item) => item.classList.toggle("selected", item === button)); // Подсвечиваем только активную кнопку.
    updateCards(); // Обновляем карточки.
  });
});

// Показывает короткое сообщение внизу экрана.
function showToast(message) {
  toast.textContent = message; // Подставляем текст уведомления безопасным способом.
  toast.classList.add("show"); // Добавляем класс, который делает уведомление видимым.
  window.clearTimeout(toastTimer); // Останавливаем предыдущое скрытие, если оно ещё запланировано.
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400); // Прячем уведомление через 2,4 секунды.
}

// Кнопки копирования берут пример из data-code и копируют его в буфер обмена.
document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const code = button.dataset.code; // Читаем код из атрибута data-code.
    try {
      await navigator.clipboard.writeText(code); // Современный браузер копирует код в буфер обмена.
      showToast("Код скопирован. Теперь вставь его в редактор."); // Подтверждаем успешное копирование.
    } catch (error) {
      showToast("Автокопирование недоступно. Открой сайт через HTTPS или localhost."); // Объясняем ограничение браузера.
    }
  });
});

// Меняем тему, сохраняя выбранное значение в памяти браузера.
themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme"); // Переключаем светлый класс и узнаём результат.
  themeToggle.textContent = isLight ? "☾" : "☼"; // Меняем значок кнопки.
  themeToggle.setAttribute("aria-label", isLight ? "Включить тёмную тему" : "Включить светлую тему"); // Обновляем подпись для доступности.
  try { localStorage.setItem("zp-theme", isLight ? "light" : "dark"); } catch (error) { /* Сайт продолжит работать, даже если хранилище запрещено. */ }
});

// При открытии страницы восстанавливаем тему, выбранную ранее.
try {
  if (localStorage.getItem("zp-theme") === "light") {
    document.body.classList.add("light-theme"); // Применяем светлую тему.
    themeToggle.textContent = "☾"; // Показываем знак возврата к тёмной теме.
    themeToggle.setAttribute("aria-label", "Включить тёмную тему"); // Правильная подпись кнопки.
  }
} catch (error) { /* Игнорируем недоступность localStorage. */ }

// На узком экране открываем и закрываем выпадающее меню.
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open"); // Переключаем видимость меню через CSS-класс.
  menuToggle.setAttribute("aria-expanded", String(isOpen)); // Обновляем состояние для вспомогательных технологий.
});

// На мобильном устройстве закрываем меню после перехода по пункту.
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open"); // Сворачиваем меню.
    menuToggle.setAttribute("aria-expanded", "false"); // Сообщаем, что меню закрыто.
  });
});

// Автоматически показываем текущий год в подвале.
document.querySelector("#currentYear").textContent = new Date().getFullYear();

// Выполняем фильтрацию при первой загрузке страницы.
updateCards();
