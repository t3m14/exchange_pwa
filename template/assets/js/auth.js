const api_url = "http://127.0.0.1:8000/api/v1";
function saveToken(token) {
    // console.log(token);
    sessionStorage.setItem('tokenData', token);
    console.log("ok");
}

function refreshToken(token) {
    return fetch('http://127.0.0.1:8000/api/v1/auth/jwt/refresh/', {
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
            catch (error)
            { // если тут что-то пошло не так, то перенаправляем пользователя на страницу авторизации
                return  window.location.replace(loginUrl);
                console.log(error)
            }
        }

        options.headers.Authorization = `JWT ${tokenData.access}`; // добавляем токен в headers запроса
    }
    console.log(options);
    return fetch(url, options); // возвращаем изначальную функцию, но уже с валидным токеном в headers
}

function do_login(){
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
            return  window.location.replace("landing.html");
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
function make_login(){
    const signInForm = document.getElementById('signInForm');
    signInForm.addEventListener('submit', getFormValue);
    async function getFormValue(event) {
        event.preventDefault();
        const username = signInForm.querySelector('[name="username"]'); //получаем поле name
        const password = signInForm.querySelector('[name="password"]'); //получаем поле name

        await getTokenData(username.value, password.value);
    }
}
function showBalance(res) {
    console.log(res);
    try {
    document.getElementById("rdw_balance").innerHTML = res.balance_rdw;
    document.getElementById("usd_balance").innerHTML = res.balance_usd;
    }catch (error) {}
}

function getBalance() {
    try{

        return fetchWithAuth("http://127.0.0.1:8000/api/v1/auth/users/me/"
        ,{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
           .then(res => res.json())
           .then(res => showBalance(res))
    }
    catch(error){}
}
try {
    make_login();

} catch (error) {
    console.log(error);
}
try {
    getBalance();
} catch (error) {
    console.log(error);
}