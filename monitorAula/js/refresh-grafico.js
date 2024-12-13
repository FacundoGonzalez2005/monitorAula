    const ctx = document.getElementById('myChart').getContext('2d');
    let myChart;

    // Función para actualizar el gráfico con los datos de la API
    const updateChart = (temperaturas, humedades, fechas) => {
        if (myChart) {
            // Invertir el orden de los datos para mostrar la información más reciente a la derecha
            myChart.data.labels = fechas.reverse(); // Invertir las etiquetas (fechas)
            myChart.data.datasets[0].data = temperaturas.reverse(); // Invertir las temperaturas
            myChart.data.datasets[1].data = humedades.reverse(); // Invertir las humedades
            myChart.update();
        } else {
            // Si el gráfico no existe, lo creamos
            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: fechas.reverse(), // Invertir las etiquetas (fechas)
                    datasets: [
                        {
                            label: 'Temperatura (°C)',
                            data: temperaturas.reverse(), // Invertir las temperaturas
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderWidth: 1,
                            fill: true
                        },
                        {
                            label: 'Humedad (%)',
                            data: humedades.reverse(), // Invertir las humedades
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderWidth: 1,
                            fill: true
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    };

    const ctx2 = document.getElementById('myChart2').getContext('2d');
    let myChart2;

    // Función para actualizar el gráfico con los datos de la API
    const updateChart2 = (temperaturas, humedades, fechas) => {
    if (myChart2) {
        // Invertir el orden de los datos en las series
        myChart2.data.labels = fechas.reverse(); // Invertir las fechas
        myChart2.data.datasets[0].data = temperaturas.reverse(); // Invertir las temperaturas
        myChart2.data.datasets[1].data = humedades.reverse(); // Invertir las humedades
        myChart2.update();
    } else {
        // Si el gráfico no existe, lo creamos
        myChart2 = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: fechas.reverse(), // Invertir las fechas
                datasets: [
                    {
                        label: 'Temperatura (°C)',
                        data: temperaturas.reverse(), // Invertir las temperaturas
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 1,
                        fill: true
                    },
                    {
                        label: 'Humedad (%)',
                        data: humedades.reverse(), // Invertir las humedades
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 1,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    x: {
                        reverse: true // Esto invierte las fechas en el eje X, mostrando lo más reciente a la derecha
                    }
                }
            }
        });
    }
};


    // Función para obtener los datos de la API y actualizar la tabla y gráfico
    const fetchData = async () => {
        try {
            // Obtener los datos de temperatura, humedad y los valores máximos y mínimos
            const response = await fetch('https://mattprofe.com.ar/alumno/6916/monitorAula/api/api.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('Datos obtenidos:', data);

            const tbody = document.getElementById('sensorData');
            tbody.innerHTML = ''; // Limpiar la tabla antes de cargar nuevos datos

            const temperaturas = [];
            const humedades = [];
            const fechas = [];

            // Mostrar solo los últimos 10 registros en la tabla
            const last10Data = data.slice(0, 10); // Obtener los primeros 10 elementos (los más recientes)

            if (last10Data.length > 0) {
                last10Data.forEach(item => {
                    const temperatura = parseFloat(item.temperatura);
                    const humedad = parseFloat(item.humedad);
                    const fecha = item.fecha;

                    // Verificar que los valores sean números válidos
                    const temperaturaFinal = isNaN(temperatura) ? 'N/A' : temperatura.toFixed(1);
                    const humedadFinal = isNaN(humedad) ? 'N/A' : humedad.toFixed(1);

                    const row = `
                        <tr>
                            <td>${temperaturaFinal}</td>
                            <td>${humedadFinal}</td>
                            <td>${fecha}</td>
                        </tr>
                    `;
                    tbody.innerHTML += row;

                    // Almacenar los datos para el gráfico
                    temperaturas.push(temperaturaFinal);
                    humedades.push(humedadFinal);
                    fechas.push(fecha);
                });

                // Actualizamos el gráfico con los datos obtenidos
                updateChart(temperaturas, humedades, fechas);
                updateChart2(temperaturas, humedades, fechas);
            } else {
                tbody.innerHTML = '<tr><td colspan="3">No hay datos disponibles</td></tr>';
            }

            // Mostrar los valores máximos y mínimos
            displayMaxMinValues(data);

        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    // Función para obtener los valores máximos y mínimos
    const displayMaxMinValues = (data) => {
        const maxTemp = Math.max(...data.map(item => parseFloat(item.temperatura)));
        const minTemp = Math.min(...data.map(item => parseFloat(item.temperatura)));
        const maxHum = Math.max(...data.map(item => parseFloat(item.humedad)));
        const minHum = Math.min(...data.map(item => parseFloat(item.humedad)));

        // Mostrar los valores máximos y mínimos en la tabla
        const maxMinTableBody = document.getElementById('maxMinValues');
        maxMinTableBody.innerHTML = `
            <tr>
                <td>${maxTemp.toFixed(1)}</td>
                <td>${minTemp.toFixed(1)}</td>
                <td>${maxHum.toFixed(1)}</td>
                <td>${minHum.toFixed(1)}</td>
            </tr>
        `;
    };

    // Llamar a fetchData para cargar los datos al inicio
    fetchData();

    // Llamar a fetchData cada 10 segundos para actualizar los datos
    setInterval(fetchData, 10000);