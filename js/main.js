const form = document.getElementById("gastoForm");
const tablaBody = document.querySelector("#tablaGastos tbody");
const resumenAnual = document.getElementById("resumenAnual");

let gastos = JSON.parse(localStorage.getItem("gastos2025")) || [];

function guardarDatos() {
  localStorage.setItem("gastos2025", JSON.stringify(gastos));
}

function renderTabla() {
  tablaBody.innerHTML = "";

  gastos.forEach((g) => {
    const fila = document.createElement("tr");
    const estadoColor = g.estado === "Pendiente" ? "red" : "green";

    fila.innerHTML = `
      <td>${g.fecha}</td>
      <td>$${parseFloat(g.monto).toFixed(2)}</td>
      <td style="color: ${estadoColor}; font-weight: bold;">${g.estado}</td>
      <td>${g.medio}</td>
      <td>${g.tipo}</td>
      <td>${g.descripcion}</td>
    `;

    tablaBody.appendChild(fila);
  });
}

function renderResumenAnual() {
  const resumen = Array(12).fill(0);
  gastos.forEach((g) => {
    const mes = new Date(g.fecha).getMonth();
    resumen[mes] += parseFloat(g.monto);
  });

  resumenAnual.innerHTML = "";
  resumen.forEach((monto, i) => {
    const li = document.createElement("li");
    li.textContent = `${new Date(0, i).toLocaleString("es", {
      month: "long",
    })}: $${monto.toFixed(2)}`;
    resumenAnual.appendChild(li);
  });
}
function calcularSaldoDisponible() {
  const sueldo = parseFloat(document.getElementById("sueldo").value) || 0;
  const totalGastos = gastos.reduce((acc, g) => acc + parseFloat(g.monto), 0);
  const saldo = sueldo - totalGastos;
  document.getElementById("saldoDisponible").textContent = saldo.toFixed(2);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevoGasto = {
    fecha: document.getElementById("fecha").value,
    monto: document.getElementById("monto").value,
    estado: document.getElementById("estado").value,
    medio: document.getElementById("medio").value,
    tipo: document.getElementById("tipo").value,
    descripcion: document.getElementById("descripcion").value,
  };
  gastos.push(nuevoGasto);
  guardarDatos();
  renderTabla();
  renderResumenAnual();
  calcularSaldoDisponible(); // ← actualiza saldo
  form.reset();
});

renderTabla();
renderResumenAnual();

document.getElementById("resetResumen").addEventListener("click", () => {
  if (
    confirm(
      "¿Estás seguro que querés eliminar todos los datos? Esta acción no se puede deshacer."
    )
  ) {
    gastos = [];
    localStorage.removeItem("gastos2025");
    renderTabla();
    renderResumenAnual();
  }
});

document
  .getElementById("sueldo")
  .addEventListener("input", calcularSaldoDisponible);

const textarea = document.getElementById("contenido");

// Al cargar la página, recuperamos el contenido del localStorage
window.addEventListener("load", () => {
  const guardado = localStorage.getItem("miContenido");
  if (guardado) {
    textarea.value = guardado;
  }
});

// Cada vez que el usuario escribe algo, lo guardamos en localStorage
textarea.addEventListener("input", () => {
  localStorage.setItem("miContenido", textarea.value);
});

// Botón para limpiar el contenido y localStorage
function limpiar() {
  localStorage.removeItem("miContenido");
  textarea.value = "";
}

