var data = new FormData();
data.append('username', '');
data.append('password', '');
data.append('full_name', '');
data.append('email', '');
data.append('phone', '');
data.append('passport_image', '');

function register() {
    console.log(data);
    return fetch('http://147.182.137.98:8000/api/v1/auth/users/', {
        method: 'POST',
        credentials: 'include',
        body: data,
    })
        .then((res) => {
            res.json().then((res) => console.log(res))
            if (res.status === 201) {
                const respData = res.json();
                respData.then((res) => console.log(res))
                return  window.location.replace("otp.html");
            }
        });
}

if (document.getElementById('signUpForm1')){
    const signUpForm1 = document.getElementById('signUpForm1');
    
    signUpForm1.addEventListener('submit', getFormValue1);
    async function getFormValue1(event) {
        event.preventDefault();
        username = signUpForm1.querySelector('[name="username"]').value; //получаем поле name
        password = signUpForm1.querySelector('[name="password"]').value; //получаем поле name
        full_name = signUpForm1.querySelector('[name="full_name"]').value; //получаем поле name
        var url = 'personal-identity.html?username=' + username + '&password=' + password + '&full_name=' + full_name;

        return window.location.href = url;
        
    }

}
if (document.getElementById('signUpForm2')) {
    const signUpForm2 = document.getElementById('signUpForm2');
    signUpForm2.addEventListener('submit', getFormValue2);

    async function getFormValue2(event) {
        var urlSearchParams = new URLSearchParams(window.location.search);
        event.preventDefault();
        username = urlSearchParams.get("username");
        password = urlSearchParams.get("password");
        full_name = urlSearchParams.get("full_name");
        email = signUpForm2.querySelector('[name="email"]').value; //получаем поле name
        phone = signUpForm2.querySelector('[name="phone"]').value; //получаем поле name
        var url = 'confirm-identity.html?username=' + username + '&password=' + password + '&full_name=' + full_name + '&email=' + email + '&phone=' + phone;

        return window.location.href = url;
    }
}
if (document.getElementById('signUpForm3')) {
    const signUpForm3 = document.getElementById('signUpForm3');
    signUpForm3.addEventListener('submit', getFormValue3);

    async function getFormValue3(event) {
        var urlSearchParams = new URLSearchParams(window.location.search);
        event.preventDefault();
        data.set('username', urlSearchParams.get("username"));
        data.set('password', urlSearchParams.get("password"));
        data.set('full_name', urlSearchParams.get("full_name"));
        data.set('email', urlSearchParams.get("email"));
        data.set('phone', urlSearchParams.get("phone"));
        var image = signUpForm3.querySelector('[name="image"]').files[0];
        console.log(image)
        data.set('passport_image', image)

        return register();
    }
}
