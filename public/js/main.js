
document.addEventListener("DOMContentLoaded", () => {
  const rand = Math.ceil(Math.random() * 4);
  document.getElementById("imageContainer").innerHTML = `<img src=/images/hyrax${rand}.jpg>`;

  console.log('heyo')
});