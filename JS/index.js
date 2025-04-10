/* const btnLog = document.getElementById("btnLog");
btnLog.addEventListener('click', function() {
    window.location.href = "views/log_in.php";
});

const btnReg = document.getElementById("btnReg");
btnReg.addEventListener('click', function() {
    window.location.href = "views/register.php";
});
 */
$(document).ready(function () {
    $("#btnLog").click(function () {
        window.location.href = "views/login.php";
    });

    $("#btnReg").click(function () {
        window.location.href = "views/register.php";
    });
}); 
