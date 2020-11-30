const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

// TODO: replace with moment.js
// Funcion que me da la fecha
function addZero(i) {
  if (i < 10) {
    i = `0${i}`;
  }
  return i;
}

// TODO: replace with moment.js
function today() {
  const hoy = new Date();
  let dd = hoy.getDate();
  let mm = hoy.getMonth() + 1;
  const yyyy = hoy.getFullYear();

  dd = addZero(dd);
  mm = addZero(mm);

  return `${yyyy}/${mm}/${dd}`;
}
// aca termina la funcion que me da la fecha

module.exports = {
  capitalizeFirstLetter,
  today,
};
