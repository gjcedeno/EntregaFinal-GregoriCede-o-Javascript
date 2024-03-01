// Construir la URL de la API con los géneros proporcionados
function buildApiUrl(apiKey, genres) {
  return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genres}&vote_average.gte=7&vote_average.lte=10&primary_release_date.gte=1995-01-01&language=es`;
}
// Realizar la solicitud a la API
function fetchData(url){
    return fetch(url)
    .then((response) => response.json());
}

//Manipular los datos de la respuesta y mostrar el título de una película aleatoria en el h2
function handleData(data) {
    if (data.results && data.results.length > 0) {
      // Obtener un índice aleatorio dentro del rango de resultados
      const randomIndex = Math.floor(Math.random() * data.results.length);

       // Obtener  los datos de la película aleatoria
    const randomMovie = data.results[randomIndex];
    const randomMovieTitle = randomMovie.original_title;
    const randomMoviePosterPath = randomMovie.poster_path;
    const randomMovieOverview = randomMovie.overview;
    const randomMovieReleaseDate = randomMovie.release_date;

    // Llamar al elemento h2, a la imagen y a los elementos para descripción y fecha de lanzamiento
    const titleElement = document.getElementById("movieTitle");
    const posterElement = document.getElementById("moviePoster");
    const overviewElement = document.getElementById("movieOverview");
    const releaseDateElement = document.getElementById("movieReleaseDate");

     // Actualizar el contenido del h2 con el título de la película aleatoria
     titleElement.textContent = randomMovieTitle;

     //URL completa del poster_path
    const posterUrl = `https://image.tmdb.org/t/p/w500${randomMoviePosterPath}`;

    //Mostrar la imagen de la película, la descripción y la fecha de lanzamiento.
    posterElement.src = posterUrl;
    posterElement.alt = `${randomMovieTitle} Poster`;
    overviewElement.textContent = `Descripción: ${randomMovieOverview}`;
    releaseDateElement.textContent = `Fecha de lanzamiento: ${randomMovieReleaseDate}`;

    //llamar a los botones
    const btnBack = document.getElementById("btnBack");
    const btnNext = document.getElementById("btnNext");
    const detailsMovie = document.getElementById("detailsMovie");
    const imgMovie = document.getElementById("moviePoster");

    //Mostrar los botones de next y back después de mostrar la recomendación de la película
      btnBack.style.display = 'inline-block';
      btnNext.style.display = 'inline-block';

    //mostrar el contenedor de detalles despues de la recomendacion de la pelicula
       detailsMovie.style.display = 'inline-block';

    //cambiar style de la imagen para mostrarla al obtener la recomendacion
       imgMovie.style.display = 'inline-block';

      //guardar recomendacion pelicula en local storage
      localStorage.setItem("recomendacionPelicula", randomMovieTitle);
    } else {
      console.error('No se encontraron resultados en la respuesta.');
    }
}

// Función principal que llama a las funciones anteriores
function fetchDataAndHandle(genres){
    // Llamar a la función para construir la URL
    const apiUrl = buildApiUrl("5172ce2ab41f5f53b33fa6274714a720", genres);

     // Llamar a la función para realizar la solicitud
     fetchData(apiUrl)
     .then((data) => {
        handleData(data);
        // Guardar la categoría seleccionada en el Local Storage
        localStorage.setItem("estadoAnimo", genres);
     })
     .catch((error) => console.log("error al obtener datos:", error));
}

// Agregar eventos de clic a los botones
const buttons = document.querySelectorAll(".button");
const h2Feelings = document.getElementById("feelings")

buttons.forEach((button) => {
    button.addEventListener("click", function(){
        // Obtener los géneros almacenados en el atributo data-genres
        const genres = button.getAttribute("data-genres");

        // Llamar a la función principal con los géneros correspondientes
        fetchDataAndHandle(genres);
        // Oculta los botones
    buttons.forEach((btn) => {
        btn.style.display = 'none';
      });
      h2Feelings.textContent = "Te recomendaria ver la Pelicula:";
    })
});

// Evento de clic para el botón "Atrás"
btnBack.addEventListener("click", function () {
  // Mostrar Sweet Alert para confirmar el regreso
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Volver atrás cancelará la recomendación actual.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, volver',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Restablecer la interfaz a su estado original
      buttons.forEach((btn) => {
        btn.style.display = 'inline-block';
      });

      // Restaurar el texto del h2
      h2Feelings.textContent = "¿Cómo te sientes hoy?";

      //Ocultar el título de la película
      const titleElement = document.getElementById("movieTitle");
      titleElement.textContent = "";

      // Ocultar los botones "Atrás" y "Siguiente Película"
      btnBack.style.display = 'none';
      btnNext.style.display = 'none';

      // Ocultar el contenedor de detalles
      detailsMovie.style.display = 'none';

      // Limpiar el almacenamiento local
      localStorage.removeItem("estadoAnimo");
      localStorage.removeItem("recomendacionPelicula");
      
      history.back();
    }
  });
});


// Agregar evento de clic al botón "Siguiente Película"
const btnNext = document.getElementById("btnNext");

btnNext.addEventListener("click", function () {
  // Obtener la categoría almacenada en el Local Storage
  const storedGenres = localStorage.getItem("estadoAnimo");

  storedGenres
    ? fetchDataAndHandle(storedGenres)
    : console.error("No se encontró una categoría almacenada en el Local Storage.");
});



