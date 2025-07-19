document.addEventListener("DOMContentLoaded", function () {
  const targets = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px",
      threshold: 0.1,
    }
  );

  targets.forEach((target) => {
    observer.observe(target);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // --- Inisialisasi Elemen ---
  const orderForm = document.getElementById("order-form");
  const paketButtons = document.querySelectorAll(".btn-pilih-paket");
  const discordTagInput = document.getElementById("discord-tag");
  const tagError = document.getElementById("tag-error");
  const modal = document.getElementById("order-modal");
  const modalCloseBtn = document.getElementById("modal-close");
  const confirmWhatsappBtn = document.getElementById("confirm-whatsapp");

  let currentOrder = {};

  // --- Fungsi Notifikasi Toast ---
  function showToast(message) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // --- Logika Kartu Harga Interaktif ---
  paketButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      // Hapus seleksi dari semua kartu
      document
        .querySelectorAll(".kartu-harga")
        .forEach((card) => card.classList.remove("selected"));

      // Tambah seleksi ke kartu yang diklik
      button.closest(".kartu-harga").classList.add("selected");

      // Isi form otomatis
      const selectedPaket = button.getAttribute("data-paket");
      document.getElementById("paket").value = selectedPaket;

      // Scroll ke form
      orderForm.scrollIntoView({ behavior: "smooth", block: "center" });

      showToast(`${selectedPaket} dipilih!`);
    });
  });

  // --- Logika Validasi Real-time Discord Tag ---
  discordTagInput.addEventListener("input", () => {
    const tagValue = discordTagInput.value;
    const tagRegex = /.+?#\d{4}$/; // Regex untuk format username#1234
    if (tagValue && !tagRegex.test(tagValue)) {
      tagError.innerText = 'Format harus "username#1234".';
      tagError.style.display = "block";
    } else {
      tagError.style.display = "none";
    }
  });

  // --- Logika Saat Form di-Submit (Membuka Modal) ---
  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const tagValue = discordTagInput.value;
    const tagRegex = /.+?#\d{4}$/;
    if (!tagRegex.test(tagValue)) {
      tagError.innerText = "Format Discord Tag salah.";
      tagError.style.display = "block";
      discordTagInput.focus();
      return;
    }

    // Simpan data pesanan sementara
    currentOrder = {
      paket: document.getElementById("paket").value,
      tag: tagValue,
      email: document.getElementById("email").value,
      harga: document
        .querySelector(
          `[data-paket="${document.getElementById("paket").value}"]`
        )
        .getAttribute("data-harga"),
    };

    // Isi dan tampilkan modal
    document.getElementById("summary-paket").innerText = currentOrder.paket;
    document.getElementById("summary-tag").innerText = currentOrder.tag;
    document.getElementById("summary-email").innerText = currentOrder.email;
    document.getElementById("summary-harga").innerText = `Rp ${parseInt(
      currentOrder.harga
    ).toLocaleString("id-ID")}`;

    modal.style.display = "flex";
  });

  // --- Logika Tombol Konfirmasi di Modal (Mengirim ke WhatsApp) ---
  confirmWhatsappBtn.addEventListener("click", () => {
    const nomorAdmin = "6282245527018"; // Ganti dengan nomor Anda

    const pesan = `Halo Simsans, saya mau pesan:

- *Paket:* ${currentOrder.paket}
- *Discord Tag:* ${currentOrder.tag}
- *Email:* ${currentOrder.email}
- *Total:* Rp ${parseInt(currentOrder.harga).toLocaleString("id-ID")}

Mohon info lanjut untuk pembayarannya. Terima kasih!`;

    const linkWhatsApp = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(
      pesan
    )}`;

    modal.style.display = "none";
    showToast("Membuka WhatsApp...");
    window.open(linkWhatsApp, "_blank");
  });

  // --- Logika Menutup Modal ---
  function closeModal() {
    modal.style.display = "none";
  }
  modalCloseBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
});

const themeToggle = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

// Cek tema yang tersimpan di localStorage saat halaman dimuat
if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (currentTheme === "light") {
    themeToggle.checked = true;
  }
}

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}
themeToggle.addEventListener("change", switchTheme, false);

// --- Logika Countdown Timer ---
const promoEndDate = new Date("2025-07-20T23:59:59").getTime();

const countdownFunction = setInterval(function () {
  const now = new Date().getTime();
  const distance = promoEndDate - now;

  // Perhitungan waktu
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Tampilkan di elemen
  document.getElementById("days").innerText = days.toString().padStart(2, "0");
  document.getElementById("hours").innerText = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("minutes").innerText = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds").innerText = seconds
    .toString()
    .padStart(2, "0");

  // Jika waktu habis
  if (distance < 0) {
    clearInterval(countdownFunction);
    document.getElementById("countdown-timer").innerHTML =
      "<h4>Promo Telah Berakhir!</h4>";
  }
}, 1000);

// --- Logika Tombol "Back to Top" ---
const backToTopButton = document.getElementById("back-to-top");

window.onscroll = function () {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
};

backToTopButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
