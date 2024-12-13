<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Datos de Sensores</title>
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <h1>Datos del Sensor</h1>

        <!-- Formulario para enviar datos
        <form action="procesar.php" method="POST">
            <label for="temperatura">Temperatura (°C):</label>
            <input type="number" id="temperatura" name="temperatura" step="0.1" required>
            <br><br>
            <label for="humedad">Humedad (%):</label>
            <input type="number" id="humedad" name="humedad" step="0.1" required>
            <br><br>
            <button type="submit">Enviar Datos</button>
        </form> -->
        

        <h2>Últimos Datos Registrados</h2>
        <table>
            <thead>
                <tr>
                    <th>Temperatura (°C)</th>
                    <th>Humedad (%)</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody id="sensorData">
                <!-- Aquí se cargarán los datos -->
            </tbody>
        </table>

        <!-- Mostrar los valores máximos y mínimos -->
        <h2>Valor Máximo y Mínimo Histórico</h2>
        <table>
            <thead>
                <tr>
                    <th>Temperatura Máxima (°C)</th>
                    <th>Temperatura Mínima (°C)</th>
                    <th>Humedad Máxima (%)</th>
                    <th>Humedad Mínima (%)</th>
                </tr>
            </thead>
            <tbody id="maxMinValues">
                <!-- Aquí se mostrarán los valores máximos y mínimos -->
            </tbody>
        </table>
        
        <h2>Gráfico de barras</h2>

        <div class="grafico">
            <canvas id="myChart2"></canvas>
        </div>

        <h2>Gráfico de línea</h2>

        <div class="grafico">
           <canvas id="myChart"></canvas>
        </div>
    </div>

<script src="js/refresh-grafico.js"> </script>

</body>
</html>
