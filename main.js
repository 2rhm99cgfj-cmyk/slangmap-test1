document.addEventListener("DOMContentLoaded", () => {

    // Country selection
    document.querySelectorAll(".country-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const userType = document.getElementById("userType").value;
        if (!userType) return alert("Select user type");
  
        localStorage.setItem("userType", userType);
        localStorage.setItem("country", btn.dataset.country);
        window.location.href = `${btn.dataset.country}.html`;
      });
    });
  
    // Theme
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
  