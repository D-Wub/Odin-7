const hoverSign = document.getElementById("hover-sign");
const hoverLogin = document.getElementById("hover-login");
const hoverMember = document.getElementById("hover-member");
const hoverAdmin = document.getElementById("hover-admin");
const hoverLogout = document.getElementById("hover-logout")

if (hoverSign) {
    hoverSign.addEventListener("mouseenter", () => {
        hoverSign.textContent = "SigN uP";
    });

    hoverSign.addEventListener("mouseleave", () => {
        hoverSign.textContent = "Sign up";
    });
}

if (hoverLogin) {
    hoverLogin.addEventListener("mouseenter", () => {
        hoverLogin.textContent = "LoGin";
    });

    hoverLogin.addEventListener("mouseleave", () => {
        hoverLogin.textContent = "Login";
    });
}

if (hoverMember) {
    hoverMember.addEventListener("mouseenter", () => {
        hoverMember.textContent = "VIP";
    });

    hoverMember.addEventListener("mouseleave", () => {
        hoverMember.textContent = "vip";
    });
}

if (hoverAdmin) {
    hoverAdmin.addEventListener("mouseenter", () => {
        hoverAdmin.textContent = "oWn thE CluB";
    });

    hoverAdmin.addEventListener("mouseleave", () => {
        hoverAdmin.textContent = "own the club";
    });
}

if (hoverLogout) {
    hoverLogout.addEventListener("mouseenter", () => {
        hoverLogout.textContent = "goOdBYE";
    });

    hoverLogout.addEventListener("mouseleave", () => {
        hoverLogout.textContent = "Log Out";
    });
}