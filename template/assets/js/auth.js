const api_url = "http://147.182.137.98:8000/api/v1";
function saveToken(token) {
    // console.log(token);
    sessionStorage.setItem('tokenData', token);
    console.log("ok");
}

function refreshToken(token) {
    return fetch('http://147.182.137.98:8000/api/v1/auth/jwt/refresh/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token,
        }),
    })
        .then((res) => {
            if (res.status === 200) {
                const tokenData = res.json();
                saveToken(JSON.stringify(tokenData)); // сохраняем полученный обновленный токен в sessionStorage, с помощью функции, заданной ранее
                return Promise.resolve();
            }
            return Promise.reject();
        });
}

function fetchWithAuth(url, options) {

    const loginUrl = 'signin.html'; // url страницы для авторизации
    let tokenData = null; // объявляем локальную переменную tokenData
    console.log(sessionStorage.getItem('tokenData'));
    if (sessionStorage.getItem('tokenData')) { // если в sessionStorage присутствует tokenData, то берем её
        tokenData = JSON.parse(sessionStorage.getItem('tokenData'));
    } else {
        console.log('no token');
        //    return window.location.replace(loginUrl); // если токен отсутствует, то перенаправляем пользователя на страницу авторизации
    }

    if (!options.headers) { // если в запросе отсутствует headers, то задаем их
        options.headers = {};
    }
    if (tokenData) {
        if (Date.now() >= tokenData.expires_on * 1000) { // проверяем не истек ли срок жизни токена
            try {
                const newToken = refreshToken(tokenData.refresh); // если истек, то обновляем токен с помощью refresh_token
                saveToken(newToken);
            }
            catch (error) { // если тут что-то пошло не так, то перенаправляем пользователя на страницу авторизации
                // return  window.location.replace(loginUrl);
                console.log(error)
            }
        }

        options.headers.Authorization = `JWT ${tokenData.access}`; // добавляем токен в headers запроса
    }
    console.log(options);
    try {
        return fetch(url, options); // возвращаем изначальную функцию, но уже с валидным токеном в headers
    }
    catch (error) { }
}

function do_login() {
    return fetchWithAuth(api_url + '/auth/users/me/', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((res) => {
        if (res.status === 200) {
            console.log(200)
            return window.location.replace("landing.html");
        }
        return Promise.reject();
    });
}
function getTokenData(username, password) {
    return fetch(api_url + '/auth/jwt/create/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
        }),
    })
        .then((res) => {
            if (res.status === 200) {
                const tokenData = res.json();
                tokenData.then(result => saveToken(JSON.stringify(result))); // сохраняем полученный токен в sessionStorage, с помощью функции, заданной ранее
                // сохраняем полученный токен в sessionStorage, с помощью функции, заданной ранее
                return Promise.resolve()
            }
            return Promise.reject();
        }).then(() => {
            do_login();
        });
}
async function getFormValue(event) {
    event.preventDefault();
    const username = signInForm.querySelector('[name="username"]'); //получаем поле name
    const password = signInForm.querySelector('[name="password"]'); //получаем поле name

    await getTokenData(username.value, password.value);
}

function showBalance(res) {
    console.log(res);
    console.log(1)
    try {
        document.getElementById("rdw_balance").innerHTML = res.balance_rdw;
        document.getElementById("usd_balance").innerHTML = res.balance_usd;
    } catch (error) { }
}

function getBalance() {

    return fetchWithAuth("http://147.182.137.98:8000/api/v1/auth/users/me/"
        , {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((res) => {
            if (res.status != 200) {
                return window.location.replace("signin.html");
            }
            else {
                res.json().then((res) => showBalance(res))
            }
        })

}


if (document.getElementById("rdw_balance")) {
    console.log(1)
    getBalance();
}
if (document.getElementById('signInForm')) {
    console.log(2)
    const signInForm = document.getElementById('signInForm');
    signInForm.addEventListener('submit', getFormValue);

}



if (document.querySelector('.crypto-form .form-group:nth-of-type(3) input:first-of-type') && document.querySelector('.crypto-form .form-group:last-of-type input')) {
    // получаем первый input-элемент
    const firstInput = document.querySelector('.crypto-form .form-group:nth-of-type(3) input:first-of-type');

    // получаем второй input-элемент
    const secondInput = document.querySelector('.crypto-form .form-group:last-of-type input');

    // добавляем обработчик события ввода текста в первый input-элемент
    firstInput.addEventListener('input', (event) => {
        // получаем введенное значение
        const inputValue = event.target.value;

        // проверяем, что введенное значение является числом и больше или равно нулю
        if (!isNaN(inputValue) && inputValue >= 0) {
            // вычисляем значение для второго input-элемента (transaction fee)
            const transactionFee = inputValue - inputValue * 0.009;

            // устанавливаем значение второго input-элемента
            secondInput.value = transactionFee;
        } else {
            // если введенное значение не является числом или меньше нуля, то очищаем второй input-элемент
            secondInput.value = '';
        }
    });
    const button = document.getElementById('maketransaction');
    button.addEventListener('click', make_transaction)
    function make_transaction() {
        const taiInput = document.querySelector('body > section > div > div > form > div:nth-child(3) > div > input');
        const withdrawInput = document.querySelector('#inputcode');

        const taiAddress = taiInput.value;
        const withdrawAddress = withdrawInput.value;
        console.log(taiAddress, withdrawAddress)
        fetchWithAuth('http://147.182.137.98:8000/api/v1/transaction/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rdw: taiAddress,
                wallet: withdrawAddress
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log(response)
                    throw new Error('Failed to make transaction');
                }
            })
            .then(data => {
                console.log(data);
                // do something with the response data
            })
            .catch(error => {
                console.error(error);
                // handle the error
            });
    }
}

if (document.querySelector('.currency-transfer input[placeholder="First currency"]') && document.querySelector('.currency-transfer input[placeholder="Second currency"]')) {
    // получаем все элементы dropdown-menu
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    // перебираем каждый dropdown-menu
    dropdownMenus.forEach((dropdownMenu) => {
        // получаем все элементы dropdown-item в текущем dropdown-menu
        const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');

        // перебираем каждый dropdown-item
        dropdownItems.forEach((dropdownItem) => {
            // добавляем обработчик события клика на каждый dropdown-item
            dropdownItem.addEventListener('click', (event) => {
                // получаем текст выбранного элемента
                const selectedText = event.target.textContent.trim();;

                // находим родительский элемент dropdown и его input-поле
                const dropdown = event.target.closest('.dropdown');
                const input = dropdown.querySelector('.dropdown-toggle');

                // устанавливаем значение выбранного элемента в input-поле
                input.textContent = selectedText;
                // получаем первый инпут
                const sendInput = document.querySelector('.currency-transfer input[placeholder="First currency"]');

                // добавляем обработчик события ввода текста в первый инпут
                sendInput.addEventListener('input', (event) => {
                    // получаем введенный текст
                    const inputValue = event.target.value;

                    // проверяем, является ли введенный текст числом
                    if (!isNaN(inputValue)) {
                        // если является, то преобразуем его в число
                        const inputNumber = parseFloat(inputValue);

                        // проверяем, что число больше или равно нулю
                        if (inputNumber >= 0) {
                            // если число больше или равно нулю, то устанавливаем его значение в первый инпут
                            event.target.value = inputNumber;

                            // вычисляем значение для второго инпута
                            const receiveInputValue = (inputNumber - inputNumber * 0.009).toFixed(3);
                            document.getElementById("exchange").value = receiveInputValue;
                            // находим второй инпут и устанавливаем ему значение
                            const receiveInput = document.querySelector('.currency-transfer input[placeholder="Second currency"]');
                            receiveInput.value = Math.max(receiveInputValue, 0);
                        } else {
                            // если число меньше нуля, то очищаем значение первого инпута
                            event.target.value = '';
                        }
                    } else {
                        // если введенный текст не является числом, то очищаем значение первого инпута
                        event.target.value = '';
                    }
                });

                // получаем второй инпут
                const receiveInput = document.querySelector('.currency-transfer input[placeholder="Second currency"]');

                // добавляем обработчик события ввода текста во второй инпут
                receiveInput.addEventListener('input', (event) => {
                    // получаем введенный текст
                    const inputValue = event.target.value;

                    // проверяем, является ли введенный текст числом
                    if (!isNaN(inputValue)) {
                        // если является, то преобразуем его в число
                        const inputNumber = parseFloat(inputValue);

                        // проверяем, что число больше или равно нулю
                        if (inputNumber >= 0) {
                            // если число больше или равно нулю, то устанавливаем его значение во второй инпут
                            event.target.value = inputNumber;

                            // вычисляем значение для первого инпута
                            const sendInputValue = (inputNumber - inputNumber * 0.009).toFixed(3);
                            document.getElementById("exchange").value = sendInputValue;

                            // находим первый инпут и устанавливаем ему значение
                            const sendInput = document.querySelector('.currency-transfer input[placeholder="First currency"]');
                            sendInput.value = Math.max(sendInputValue, 0);
                        } else {
                            // если число меньше нуля, то очищаем значение второго инпута
                            event.target.value = '';
                        }
                    } else {
                        // если введенный текст не является числом, то очищаем значение второго инпута
                        event.target.value = '';
                    }
                });
            });
        });
    });
    document.getElementById("makeexchange").addEventListener('click', (event) => {
        const to_send = document.getElementById("exchange").value;
        fetchWithAuth('http://147.182.137.98:8000/api/v1/auth/users/me/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                balance_rdw: to_send,
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log(response)
                    throw new Error('Failed to make exchange');
                }
            })
            .then(data => {
                console.log(data);
                // do something with the response data
            })
            .catch(error => {
                console.error(error);
                // handle the error
            });
    });
}