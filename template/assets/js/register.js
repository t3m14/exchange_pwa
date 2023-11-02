var data = {
    username : '',
    password : '',
    full_name : '',
    email : '',
    phone : ''
}
function register() {
    console.log(data);
    return fetch('http://127.0.0.1:8000/api/v1/auth/users/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: data,
    })
        .then((res) => {
            if (res.status === 200) {
                const respData = res.json();
                console.log(respData)
            }
        });
}

const signUpForm1 = document.getElementById('signUpForm1');
const signUpForm2 = document.getElementById('signUpForm2');

signUpForm1.addEventListener('submit', getFormValue1);
async function getFormValue1(event) {
    event.preventDefault();
    data.username = signUpForm1.querySelector('[name="username"]'); //получаем поле name
    data.password = signUpForm1.querySelector('[name="password"]'); //получаем поле name
    data.full_name = signUpForm1.querySelector('[name="full_name"]'); //получаем поле name
    return  window.location.replace("personal-identity.html");

}
signUpForm2.addEventListener('submit', getFormValue2);

async function getFormValue2(event) {
    event.preventDefault();
    data.email = signUpForm2.querySelector('[name="email"]'); //получаем поле name
    data.phone = signUpForm2.querySelector('[name="phone"]'); //получаем поле name
    register();
}