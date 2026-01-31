function goCountry(country) {
    localStorage.setItem("country", country);
    window.location.href = `${country}.html`;
  }
  
  function goBack() {
    window.location.href = "index.html";
  }
  