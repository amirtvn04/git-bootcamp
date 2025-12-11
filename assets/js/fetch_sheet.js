import {scriptURL} from './config.js';

document.getElementById("form").addEventListener("submit", function(e){
    e.preventDefault();

    const btn = document.getElementById("submitBtn");
    const btnText = document.getElementById("btnText");
    const btnLoader = document.getElementById("btnLoader");

    btn.disabled = true;
    btn.classList.add("opacity-70", "cursor-not-allowed");
    btnText.textContent = "در حال ثبت...";
    btnLoader.classList.remove("hidden");

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => { data[key] = value });

    fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(data)
    })
        .then(res => res.text())
        .then(text => {
            window.location.href = "success.html";
        })
        .catch(err => {
            alert("خطایی رخ داد. دوباره تلاش کنید.");

            btn.disabled = false;
            btn.classList.remove("opacity-70", "cursor-not-allowed");
            btnText.textContent = "ثبت اطلاعات";
            btnLoader.classList.add("hidden");
        });
});