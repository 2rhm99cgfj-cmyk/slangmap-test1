document.addEventListener("DOMContentLoaded", () => {

    const btnKorea = document.getElementById("btnKorea");
    const btnUSA = document.getElementById("btnUSA");
  
    if (btnKorea) {
      btnKorea.addEventListener("click", () => goCountry("korea"));
    }
  
    if (btnUSA) {
      btnUSA.addEventListener("click", () => goCountry("usa"));
    }
  
    function goCountry(country) {
      localStorage.setItem("country", country);
      localStorage.removeItem("generation");
      window.location.href = `${country}.html`;
    }
  
    // Theme toggle
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
      });
    }
  
    // Back
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }
  });
  