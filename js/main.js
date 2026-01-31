function enterCountry(country) {
  localStorage.setItem("country", country);
  localStorage.removeItem("generation");
  window.location.href = country + ".html";
}

function goBack() {
  window.location.href = "index.html";
}

function selectGeneration(gen) {
  localStorage.setItem("generation", gen);
  const info = document.getElementById("generationInfo");
  if (info) {
      info.innerText = `Selected generation: ${gen}`;
  }
}
