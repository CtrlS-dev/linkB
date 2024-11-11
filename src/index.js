const urlErrorServer = document.querySelector("#url-error-server");
const arrowDown = document.querySelector("#arrow-down");
const app = document.querySelector("#app");
const instructions = document.querySelector("#instructions");
const arrowUp = document.querySelector("#arrow-up");
const urlForm = document.querySelector("#url-form");
const urlInput = document.querySelector("#url-input");
const urlResultSpan = document.querySelector("#url-result-span");
const divResult = document.querySelector("#url-result");
const copyBtn = document.querySelector("#copy-btn");
const urlShort = document.querySelector("#url-short");
const noti = document.querySelector("#notification");
const detailsBtn = document.querySelector("#details-btn");
const detallesClick = document.querySelector("#detalles-clicks");
const detalles = document.querySelector("#detalles");
const btnVolverDetalles = document.querySelector("#detalles-volver-btn");
const urlSubmit = document.querySelector("#url-submit");
const urlError = document.querySelector("#url-error");
const details = detalles.parentElement;
const REGEX_URL =
  /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)(:\d+)?(\?[^\s]*)?$/;
let shortId;

const preload = document.querySelector("#preload");
preload.classList.add("hidden");
preload.classList.remove("flex");

urlForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = urlInput.value;
  const isValid = REGEX_URL.test(url); // Verifica la URL al inicio

  // Mostrar error si la URL es inválida
  if (!isValid) {
    console.error("Invalid URL format");
    urlInput.classList.add("border-red-500");
    return;
  }

  try {
    // Muestra el preload mientras se procesa la solicitud
    preload.classList.remove("hidden");
    preload.classList.add("flex");
    // Envía la URL al servidor para obtener el shortId
    const response = await axios.post("https://lbreaker.vercel.app/", { url });
    shortId = response.data.id;

    // Cambiar animación y restablecer el formulario
    app.classList.remove("animate__fadeOut", "animate__slow");
    app.classList.add("animate__fadeIn", "animate__medium");
    urlForm.reset();
    urlSubmit.disabled = true;
    urlSubmit.classList.add("bg-gray-400");
    urlSubmit.classList.remove("bg-blue-500", "hover:bg-blue-700");

    // Mostrar resultados
    divResult.classList.remove("hidden");
    divResult.classList.add("flex", "flex-col");

    // Configura el enlace original
    const urlOriginal = document.querySelector("#url-original").children[1];
    urlOriginal.textContent = url;
    urlOriginal.href = url.startsWith("http") ? url : `https://${url}`;

    // Configura el enlace corto
    const linkShort = urlShort.children[1];
    linkShort.textContent = `http://localhost:3000/${shortId}`;
    linkShort.href = `http://localhost:3000/${shortId}`;
  } catch (error) {
    console.error("Error saving URL:", error.message);
    urlErrorServer.classList.remove("hidden");
    urlErrorServer.classList.add("flex");
    urlErrorServer.textContent = `Error saving URL: ${error.message}`;
  } finally {
    // Oculta el preload después de que se completa la solicitud
    preload.classList.add("hidden");
  }
});

urlInput.addEventListener("input", () => {
  const isValid = new RegExp(REGEX_URL).test(urlInput.value);
  if (isValid) {
    urlInput.classList.remove("border-red-500");
    urlInput.classList.add("border-green-500");
    urlSubmit.disabled = false;
  } else {
    urlInput.classList.remove("border-green-500");
    urlInput.classList.add("border-red-500");
    urlSubmit.disabled = true;
  }

  if (urlSubmit.disabled === true) {
    urlSubmit.classList.remove(
      "bg-blue-500",
      "hover:bg-blue-700",
      "cursor-pointer",
    );
    urlSubmit.classList.add("bg-gray-400", "cursor-not-allowed");
    urlError.classList.remove("hidden");
    urlError.classList.add("flex", "flex-col");
  } else if (urlSubmit.disabled === false) {
    urlSubmit.classList.add(
      "bg-blue-500",
      "hover:bg-blue-700",
      "cursor-pointer",
    );
    urlSubmit.classList.remove("bg-gray-400", "cursor-not-allowed");
    urlError.classList.add("hidden");
    urlError.classList.remove("flex", "flex-col");
  }
});

urlSubmit.addEventListener("mouseenter", () => {
  urlSubmit.innerHTML = `
  <svg
              xmlns="http://www.w3.org/2000/svg"
              x-bind:width="size"
              x-bind:height="size"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              x-bind:stroke-width="stroke"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="24"
              height="24"
              stroke-width="2"
            >
              <path d="M17 22v-2"></path>
              <path d="M9 15l6 -6"></path>
              <path
                d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"
              ></path>
              <path
                d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
              ></path>
              <path d="M20 17h2"></path>
              <path d="M2 7h2"></path>
              <path d="M7 2v2"></path>
            </svg>
  `;
});

urlSubmit.addEventListener("mouseleave", () => {
  urlSubmit.innerHTML = `
  <svg
              xmlns="http://www.w3.org/2000/svg"
              x-bind:width="size"
              x-bind:height="size"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              x-bind:stroke-width="stroke"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="24"
              height="24"
              stroke-width="2"
            >
              <path d="M9 15l6 -6"></path>
              <path
                d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"
              ></path>
              <path
                d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
              ></path>
            </svg>
  `;
});

detailsBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const response = await axios.get(
      `http://localhost:3000/url/analytics/${shortId}`,
    );
    details.classList.remove("hidden");
    details.classList.add("flex");
    detallesClick.textContent = response.data.totalClicks;
  } catch (error) {
    console.error("Error saving URL:", error.message);
  }
});

btnVolverDetalles.addEventListener("click", () => {
  // Añadir clases de animación para desvanecer
  details.classList.add("animate__animated", "animate__fadeOut");

  // Esperar a que la animación termine antes de ocultar el elemento
  details.addEventListener(
    "animationend",
    () => {
      details.classList.remove("flex", "animate__animated", "animate__fadeOut");
      details.classList.add("hidden");
    },
    { once: true },
  );
});

copyBtn.addEventListener("click", () => {
  const url = urlShort.children[1].textContent;
  navigator.clipboard
    .writeText(url)
    .then(() => {
      noti.classList.remove("hidden");
      noti.parentElement.classList.remove("hidden");
      noti.parentElement.classList.add("flex");
      setTimeout(() => {
        copyBtn.disabled = true;
        noti.classList.add("animate__fadeOutUp");
      }, 2000);
    })
    .then(() => {
      setTimeout(() => {
        noti.parentElement.classList.add("hidden");
        noti.parentElement.classList.remove("flex");
        noti.classList.add("hidden");
        noti.classList.remove("animate__fadeOutUp");
        copyBtn.disabled = false;
      }, 2500);
    });
});

arrowDown.addEventListener("click", () => {
  window.scrollTo({
    top: instructions.offsetTop,
    behavior: "smooth",
  });
});

arrowUp.addEventListener("click", () => {
  window.scrollTo({
    top: app.offsetTop,
    behavior: "smooth",
  });
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    arrowDown.classList.add("hidden");
    arrowUp.classList.remove("hidden");
  } else {
    arrowDown.classList.remove("hidden");
    arrowUp.classList.add("hidden");
  }
});
