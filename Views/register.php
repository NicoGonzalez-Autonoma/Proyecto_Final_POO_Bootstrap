<?php
session_start();

$error = isset($_SESSION['error']) ? $_SESSION['error'] : '';
unset($_SESSION['error']);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrarse</title>
    <link rel="icon" type="image/png" href=".././assets/logo.png">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../CSS/register.css">
</head>

<body>
    <?php if (!empty($error)): ?>
        <p class="error"> <?= htmlspecialchars($error) ?> </p>
    <?php endif; ?>
    <div class="container  d-flex align-items-center">
        <div class="row justify-content-center">
            <div class="col-12">
                <div class="register-card">
                    <div class="contact-icon">
                        <i class="bi bi-person-lines-fill"></i>

                        <img src="data:image/png;base64,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" />
                    </div>
                    <h4 class="register-title">Registrarse</h4>

                    <form id="RegisterForm" action="../backend/register.php" method="POST">
                        <div class="mb-3">
                            <label for="name" class="form-label">Nombre:</label>
                            <input type="name" class="form-control" id="nombre" name="name"  placeholder="">
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email:</label>
                            <input type="email" class="form-control" id="email" name="email" placeholder="">
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password:</label>
                            <input type="password" class="form-control" id="password"  name="password" placeholder="">
                        </div>
                        <div class="div-button">
                            <button type="submit"  class="btn btn-primary mt-2">
                                <span>Registrar</span>
                                <span></span>
                            </button>
                        </div>
                    </form>

                    <div class="login-text">
                        <p class="mb-0">¿Ya tienes una cuenta? <a href="login.php" class="text-decoration-none">Inicia sesión aquí.</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>


</body>

</html>