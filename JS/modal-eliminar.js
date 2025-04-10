/* const eliminarAbrir = document.getElementById('mostrar-eliminar');
const eliminar = document.getElementById('eliminar');
const cerrarEliminar = document.getElementById('cerrar-eliminar');


eliminarAbrir.addEventListener('click', function () {
    eliminar.classList.toggle('hide');
})

cerrarEliminar.addEventListener('click', function () {
    eliminar.classList.add('hide');
}) */

$(document).ready(function () {
    $("#mostrar-eliminar").click(function () {
        $("#eliminar").toggleClass("hide"); // Muestra u oculta el modal
    });

    $("#cerrar-eliminar").click(function () {
        $("#eliminar").addClass("hide"); // Oculta el modal
    });
});
