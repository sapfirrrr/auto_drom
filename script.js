/* =====================================================
   АВТО DROM
   JAVASCRIPT
===================================================== */


/* ================= MOBILE MENU ================= */

const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

burger.addEventListener("click", () => {
    nav.classList.toggle("active");
    burger.classList.toggle("active");
});

document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
        burger.classList.remove("active");
    });
});


/* ================= BOOKING MODAL ================= */

const bookingModal = document.getElementById("bookingModal");
const successModal = document.getElementById("successModal");

function openBooking() {
    bookingModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeBooking() {
    bookingModal.classList.remove("active");
    document.body.style.overflow = "";
}


/* ================= SERVICE SELECTION ================= */

function selectService(serviceName) {
    openBooking();
    setTimeout(() => {
        const serviceSelect = document.getElementById("service");
        let found = false;
        for (let option of serviceSelect.options) {
            if (option.textContent.trim().toLowerCase() === serviceName.trim().toLowerCase()) {
                serviceSelect.value = option.value;
                found = true;
                break;
            }
        }
        if (!found) {
            serviceSelect.value = "Другое";
            document.getElementById("comment").value = "Интересует услуга: " + serviceName;
        }
    }, 100);
}


/* ================= DATE ================= */

const dateInput = document.getElementById("date");
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
dateInput.min = `${year}-${month}-${day}`;


/* ================= PHONE MASK ================= */

const phoneInput = document.getElementById("phone");
phoneInput.addEventListener("input", function(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("8")) {
        value = "7" + value.substring(1);
    }
    if (!value.startsWith("7")) {
        value = "7" + value;
    }
    value = value.substring(0, 11);
    let result = "+7";
    if (value.length > 1) {
        result += " (" + value.substring(1, 4);
    }
    if (value.length >= 4) {
        result += ") ";
    }
    if (value.length > 4) {
        result += value.substring(4, 7);
    }
    if (value.length > 7) {
        result += "-" + value.substring(7, 9);
    }
    if (value.length > 9) {
        result += "-" + value.substring(9, 11);
    }
    e.target.value = result;
});


/* ================= FORM SUBMIT (FIXED) ================= */

const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", function(e) {
    e.preventDefault(); // отключаем стандартную отправку

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !phone) {
        showToast("Заполните имя и телефон");
        return;
    }

    // Собираем данные в FormData (включает все поля с name)
    const formData = new FormData(bookingForm);

    // Отправляем на FormSubmit через fetch
    fetch("https://formsubmit.co/fisa-zim@mail.ru", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Сохраняем заявку в localStorage
            const application = {
                name: name,
                phone: phone,
                car: document.getElementById("car").value.trim(),
                service: document.getElementById("service").value,
                date: document.getElementById("date").value,
                time: document.getElementById("time").value,
                comment: document.getElementById("comment").value.trim(),
                createdAt: new Date().toISOString()
            };
            let applications = JSON.parse(localStorage.getItem("avtodromApplications")) || [];
            applications.push(application);
            localStorage.setItem("avtodromApplications", JSON.stringify(applications));

            // Закрыть модалку, сбросить форму, показать успех
            closeBooking();
            bookingForm.reset();
            successModal.classList.add("active");
        } else {
            showToast("Ошибка отправки. Попробуйте ещё раз.");
        }
    })
    .catch(() => {
        showToast("Ошибка сети. Проверьте подключение.");
    });
});


/* ================= SUCCESS ================= */

function closeSuccess() {
    successModal.classList.remove("active");
}


/* ================= TOAST ================= */

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* ================= ESCAPE ================= */

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        closeBooking();
        closeSuccess();
    }
});


/* ================= MODAL CLICK ================= */

bookingModal.addEventListener("click", function(e) {
    if (e.target === bookingModal) {
        closeBooking();
    }
});


/* ================= HEADER SCROLL ================= */

window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 30) {
        header.style.background = "rgba(5,5,6,0.97)";
    } else {
        header.style.background = "rgba(7,7,8,0.92)";
    }
});
