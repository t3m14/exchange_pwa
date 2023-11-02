import {fetchWithAuth} from "./auth.js";

function showBalance(res) {
    document.getElementById("balance_rdw").innerHTML = res.balance_rdw;
    document.getElementById("balance_usd").innerHTML = res.balance_usd;
}

function getBalance() {
    return fetchWithAuth("/api/balance")
       .then(res => res.json())
       .then(res => showBalance(res))
}
getBalance();