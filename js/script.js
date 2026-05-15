/* Mută utilizatorul lin în partea de sus a paginii */
function mergiSus() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* Mută utilizatorul lin în partea de jos a paginii */
function mergiJos() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
    });
}

/* Normalizează textul pentru căutare, astfel încât diacriticele și literele mari să nu încurce rezultatele */
function normalizeazaText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

/* Filtrează cardurile de remedii în funcție de textul introdus în căutare */
function cautaInPagina() {
    const camp = document.getElementById("campCautare");

    /* Dacă pagina curentă nu conține câmpul de căutare, funcția se oprește fără erori */
    if (!camp) {
        return;
    }

    const termen = normalizeazaText(camp.value.trim());
    const elemente = document.querySelectorAll(".element-cautabil");
    const mesajFaraRezultate = document.getElementById("mesajFaraRezultate");
    let rezultate = 0;

    /* Parcurge fiecare card și decide dacă trebuie afișat sau ascuns */
    elemente.forEach((element) => {
        const textElement = normalizeazaText(element.innerText);
        const esteVizibil = termen === "" || textElement.includes(termen);

        element.style.display = esteVizibil ? "" : "none";

        if (esteVizibil) {
            rezultate += 1;
        }
    });

    /* Afișează mesajul de lipsă rezultate doar când nu mai rămâne niciun card vizibil */
    if (mesajFaraRezultate) {
        mesajFaraRezultate.classList.toggle("d-none", rezultate !== 0);
    }
}

/* Marchează planta selectată și actualizează panoul de detalii cu informațiile cardului */
function selecteazaPlantaDetaliata(card) {
    if (!card || !card.dataset) {
        return;
    }

    /* Elimină starea activă de pe celelalte carduri înainte de a evidenția selecția curentă */
    document.querySelectorAll(".card-planta-detaliata").forEach((element) => {
        element.classList.remove("activa");
    });

    card.classList.add("activa");

    const panou = document.getElementById("panouDetaliiPlanta");

    if (!panou) {
        return;
    }

    /* Populează panoul de detalii cu informații utile, prezentate într-un format ușor de parcurs */
    panou.innerHTML = `
        <h5>${card.dataset.nume}</h5>
        <p><strong>Denumire latină:</strong> ${card.dataset.latin}</p>
        <p><strong>Forme de utilizare:</strong> ${card.dataset.utilizare}</p>
        <p><strong>Moment recomandat în rutină:</strong> ${card.dataset.moment}</p>
        <p><strong>Puncte forte:</strong> ${card.dataset.beneficii}</p>
        <p class="mb-0">${card.dataset.detalii}</p>
    `;
}

/* Filtrează cardurile de plante după categoria aleasă și actualizează automat sumarul afișat */
function filtreazaPlante(categorie, buton) {
    /* Resetează starea vizuală a tuturor filtrelor înainte de a marca filtrul nou selectat */
    document.querySelectorAll(".filtru-planta").forEach((element) => {
        element.classList.remove("activ");
    });

    if (buton) {
        buton.classList.add("activ");
    }

    const carduri = document.querySelectorAll(".element-filtrabil");
    const rezultat = document.getElementById("rezultatFiltruPlante");
    let primaPlantaVizibila = null;
    let numarVizibile = 0;

    /* Parcurge toate cardurile, afișează doar categoriile potrivite și reține prima plantă vizibilă */
    carduri.forEach((card) => {
        const categorii = (card.dataset.categorie || "").split(" ");
        const esteVizibil = categorie === "toate" || categorii.includes(categorie);

        card.classList.toggle("d-none", !esteVizibil);

        if (esteVizibil) {
            numarVizibile += 1;

            if (!primaPlantaVizibila) {
                primaPlantaVizibila = card.querySelector(".card-planta-detaliata");
            }
        }
    });

    /* Actualizează mesajul de feedback pentru utilizator în funcție de filtrul curent */
    if (rezultat) {
        rezultat.textContent = categorie === "toate"
            ? "Afișăm toate plantele disponibile."
            : `Categoria selectată: ${categorie}. Rezultate afișate: ${numarVizibile}.`;
    }

    /* Selectează automat prima plantă rămasă vizibilă pentru ca panoul de detalii să nu rămână gol */
    if (primaPlantaVizibila) {
        selecteazaPlantaDetaliata(primaPlantaVizibila);
    }
}

/* Filtrează produsele apicole și actualizează atât cardurile, cât și tabelul comparativ */
function filtreazaProduseApicole(categorie, buton) {
    document.querySelectorAll(".filtru-apicol").forEach((element) => {
        element.classList.remove("activ");
    });

    if (buton) {
        buton.classList.add("activ");
    }

    const carduri = document.querySelectorAll(".produs-apicol");
    const randuri = document.querySelectorAll(".rand-apicol");
    const mesaj = document.getElementById("rezultatFiltruApicol");
    let numarVizibile = 0;

    carduri.forEach((card) => {
        const tip = card.dataset.tip || "";
        const esteVizibil = categorie === "toate" || tip.includes(categorie);

        card.classList.toggle("d-none", !esteVizibil);

        if (esteVizibil) {
            numarVizibile += 1;
        }
    });

    randuri.forEach((rand) => {
        const tip = rand.dataset.tip || "";
        const esteVizibil = categorie === "toate" || tip.includes(categorie);

        rand.classList.toggle("d-none", !esteVizibil);
    });

    if (mesaj) {
        mesaj.textContent = categorie === "toate"
            ? "Afișăm toate produsele apicole disponibile."
            : `Categoria selectată: ${categorie}. Rezultate afișate: ${numarVizibile}.`;
    }
}

/* Verifică elementele importante din formularul de contact înainte de trimitere */
function valideazaFormularContact() {
    const nume = document.getElementById("nume");
    const email = document.getElementById("email");
    const telefon = document.getElementById("telefon");
    const mesaj = document.getElementById("mesaj");

    /* Dacă formularul nu există în pagina curentă, nu blocăm nimic */
    if (!nume || !email || !telefon || !mesaj) {
        return true;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cifreTelefon = telefon.value.replace(/\D/g, "");

    /* Validează numele, emailul, telefonul și lungimea minimă a mesajului */
    if (nume.value.trim().length < 3) {
        alert("Te rog să introduci un nume complet valid.");
        nume.focus();
        return false;
    }

    if (!emailValid.test(email.value.trim())) {
        alert("Te rog să introduci o adresă de email validă.");
        email.focus();
        return false;
    }

    if (cifreTelefon.length < 9) {
        alert("Te rog să introduci un număr de telefon valid.");
        telefon.focus();
        return false;
    }

    if (mesaj.value.trim().length < 10) {
        alert("Mesajul trebuie să conțină cel puțin 10 caractere.");
        mesaj.focus();
        return false;
    }

    return true;
}

/* La încărcarea paginii, selectează prima plantă disponibilă pentru a popula din start panoul de detalii */
document.addEventListener("DOMContentLoaded", () => {
    const primaPlanta = document.querySelector(".card-planta-detaliata");

    if (primaPlanta) {
        selecteazaPlantaDetaliata(primaPlanta);
    }
});

/* Selector interactiv pentru valorile HerbaVital */
document.addEventListener("DOMContentLoaded", () => {

    const carduri =
        document.querySelectorAll(".card-valoare");

    const panou =
        document.getElementById("panouValori");

    const titlu =
        document.getElementById("titluValoare");

    const text =
        document.getElementById("textValoare");

    if (!carduri.length || !panou) {
        return;
    }

    carduri.forEach((card, index) => {

        card.style.cursor = "pointer";
        card.style.transition = "0.3s ease";

        /* Primul card activ implicit */
        if (index === 0) {

            card.style.backgroundColor = "#2f5d3a";

            const iconita =
                card.querySelector(".iconita-card");

            const titluCard =
                card.querySelector("h5");

            const paragrafe =
                card.querySelectorAll("p");

            if (iconita) {
                iconita.style.color = "#ffffff";
            }

            if (titluCard) {
                titluCard.style.color = "#ffffff";
            }

            paragrafe.forEach((p) => {
                p.style.color = "#ffffff";
            });

        }

        card.addEventListener("click", () => {

            /* Reset */
            carduri.forEach((element) => {

                element.style.backgroundColor = "#ffffff";
                element.style.transform = "translateY(0)";

                const iconita =
                    element.querySelector(".iconita-card");

                const titluCard =
                    element.querySelector("h5");

                const paragrafe =
                    element.querySelectorAll("p");

                if (iconita) {
                    iconita.style.color = "#2f5d3a";
                }

                if (titluCard) {
                    titluCard.style.color = "#3d332b";
                }

                paragrafe.forEach((p) => {
                    p.style.color = "#3d332b";
                });

            });

            /* Activează cardul */
            card.style.backgroundColor = "#2f5d3a";
            card.style.transform = "translateY(-6px)";

            const iconita =
                card.querySelector(".iconita-card");

            const titluCard =
                card.querySelector("h5");

            const paragrafe =
                card.querySelectorAll("p");

            if (iconita) {
                iconita.style.color = "#ffffff";
            }

            if (titluCard) {
                titluCard.style.color = "#ffffff";
            }

            paragrafe.forEach((p) => {
                p.style.color = "#ffffff";
            });

            /* Actualizează panoul */
            titlu.textContent =
                card.dataset.titlu;

            text.textContent =
                card.dataset.text;

        });

    });

});

/* Activează animațiile discrete ale elementelor care trebuie să apară la scroll */
document.addEventListener("DOMContentLoaded", () => {
    const elemente = document.querySelectorAll(".element-reveal");

    if (!elemente.length) {
        return;
    }

    const observer = new IntersectionObserver((intrari, observator) => {
        intrari.forEach((intrare) => {
            if (intrare.isIntersecting) {
                intrare.target.classList.add("vizibil");
                observator.unobserve(intrare.target);
            }
        });
    }, {
        threshold: 0.2
    });

    elemente.forEach((element) => {
        observer.observe(element);
    });
});

