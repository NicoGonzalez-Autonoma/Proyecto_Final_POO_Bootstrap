/* document.addEventListener("DOMContentLoaded", function () {
    const closeModalInfo = document.getElementById("close-modal-info");
    const modalInfo = document.getElementById("modal-info");

    if (closeModalInfo && modalInfo) {
        closeModalInfo.addEventListener("click", function () {
            modalInfo.classList.add("hide"); // Agrega la clase 'hide' para ocultar el modal
        });
    }
});
 */

$(document).ready(function() {
    // Abrir modal al hacer click en la imagen de desarrolladores
    $("#developers").click(function() {
        $("#modal-developers").removeClass("hide");
    });

    // Cerrar modal al hacer click en la X o en el botón de cerrar
    $("#close-modal-developers, #close-developers").click(function() {
        $("#modal-developers").addClass("hide");
    });

    // Cerrar modal si se hace clic fuera del contenido
    $(document).click(function(event) {
        if ($(event.target).is("#modal-developers")) {
            $("#modal-developers").addClass("hide");
        }
    });
});
