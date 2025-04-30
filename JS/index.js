/* const btnLog = document.getElementById("btnLog");
btnLog.addEventListener('click', function() {
    window.location.href = "views/log_in.php";
});

const btnReg = document.getElementById("btnReg");
btnReg.addEventListener('click', function() {
    window.location.href = "views/register.php";
});
 */
/* Particulas */
particlesJS('particles-js', {
    particles: {
      number: { value: 100 },
      color: { value: '#ffffff' },
      shape: { type: 'circle' },
      opacity: { value: 0.5 },
      size: { value: 3 },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 2
      }
    },
    interactivity: {
      detect_on: "window",
      events: {
        onhover: {
          enable: true,
          mode: "repulse" // o "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        }
      },
      modes: {
        repulse: { distance: 100 },
        grab: { distance: 150, line_linked: { opacity: 1 } },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
  


$(document).ready(function () {
    $("#btnLog").click(function () {
        window.location.href = "views/login.php";
    });

    $("#btnReg").click(function () {
        window.location.href = "views/register.php";
    });
}); 


  

