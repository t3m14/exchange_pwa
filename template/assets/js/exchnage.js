// Получаем элементы из DOM
const rdwInput = document.getElementById("rdw_input");
const usdInput = document.getElementById("usd_input");
const rdwBalanceP = document.getElementById("rdw_balance");
const usdBalanceP = document.getElementById("usd_balance");
            
// Устанавливаем начальные значения балансов
let rdwBalance = 1000;
let usdBalance = 500;

// Функция для обновления балансов и вывода на страницу
function updateBalances() {
  // Вызываем функцию для обмена балансов
  const newBalances = exchangeBalance(rdwBalance, usdBalance);

  // Обновляем переменные с балансами
  rdwBalance = newBalances.rdwBalance;
  usdBalance = newBalances.usdBalance;

  // Выводим балансы на страницу
  rdwBalanceP.textContent = "Rdw balance: ${rdwBalance}";
  usdBalanceP.textContent = "Usd balance: ${usdBalance}";
}

// Обработчик изменения значения в инпуте usd_input
usdInput.addEventListener("input", () => {
  // Получаем новое значение из инпута и переводим его в число
  const usdValue = parseFloat(usdInput.value);

  // Проверяем, что значение является числом и больше нуля
  if (!isNaN(usdValue) && usdValue > 0) {
    // Вычисляем новое значение для rdw_input с учетом комиссии
    const rdwValue = usdValue * exchangeRate * (1 - commission);

    // Обновляем значение в инпуте rdw_input
    rdwInput.value = rdwValue.toFixed(2);

    // Вызываем функцию для обновления балансов и вывода на страницу
    updateBalances();
  }
});

// Выводим начальные балансы на страницу
updateBalances();