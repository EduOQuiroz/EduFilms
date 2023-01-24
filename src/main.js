//data
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    mode: 'cors',
    headers: {
        'content-type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': APIKey,
        "language": navigator.language || "es-ES"
    },
});
function likedMoviesList(){
    const item =  JSON.parse(localStorage.getItem('liked_movies'))
    let movies;
    if(item){
        movies = item;
    } else {
        movies = {};
    }
    return movies
}
function likeMovie(movie){
    const likedMovies = likedMoviesList();
    console.log(likedMovies)
    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;
        console.log('eliminar pelicula a LS')
    }else{
        console.log('agregar pelicula a LS')
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('liked_movies',JSON.stringify(likedMovies))
}
//utils
const lazyLoader = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
        const url = entry.target.getAttribute('data-img')
        entry.target.setAttribute('src', url)
    }})
})
function createMovies(movies, container, {
    lazyLoad = false,
    clean = true
    } = {}){
        if(clean){
    container.innerHTML = ''
    }
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        const movieImg = document.createElement('img');
        movieImg.addEventListener('click', () => 
        location.hash = `#movie=${movie.id}`)
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path
        )
        movieImg.addEventListener('error', ()=>{
            movieImg.setAttribute(
            'src',
            'https://img.freepik.com/vector-gratis/ilustracion-concepto-fallo-conexion_114360-626.jpg?w=740&t=st=1674328677~exp=1674329277~hmac=32298257963c20dbf55983b23126aed930b3e6321e5b03e51e63893472f6779a')
        })
        const movieBtn = document.createElement('button')
        movieBtn.classList.add('movie-btn')
        if(likedMoviesList()[movie.id])
        movieBtn.classList.add('movie-btn--liked')
        movieBtn.addEventListener('click', ()=>{
            movieBtn.classList.toggle('movie-btn--liked')
            likeMovie(movie);
            getLikedMovies();
        })
        if(lazyLoad){
        lazyLoader.observe(movieImg);
        }
        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);
    });
}
function createCategories(categories, container){
    container.innerHTML = '';    
    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', ()=> 
        location.hash = `#category=${category.id}-${category.name}`)
        const categoryTitleText = document.createTextNode(category.name)
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    })    
}

//llamadas a la AP
async function getTrendindMoviesPreview(){
    const {data} = await api('/trending/movie/day');
    const movies = data.results;
    createMovies(movies, trendingMoviesPreviewList, {
        lazyLoad: true,
        clean: true,
    });
}
async function getTrendindMovies(){
    const {data} = await api('/trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage)
    createMovies(movies, genericSection, {
        clean: true,
        lazyLoad: true,
    });
    //const btnLoadMore = document.createElement('button')
    //btnLoadMore.innerText = 'cargar más'
    //btnLoadMore.addEventListener('click', getPaginatedTrendindMovies);
    //genericSection.appendChild(btnLoadMore);
}

async function getPaginatedTrendindMovies(){
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = scrollTop + clientHeight > scrollHeight - 1
    const pageIsNotMax = page < maxPage
    if(scrollIsBottom && pageIsNotMax){
        page++;
        console.log(page)
        const {data} = await api('/trending/movie/day', {
            params: {
                page,
            }
        });
        const movies = data.results;
        createMovies(movies, genericSection, {
            clean: false,
            lazyLoad: true,
        });  
    }
    
    //const btnLoadMore = document.createElement('button')
    //btnLoadMore.innerText = 'cargar más'
    //btnLoadMore.addEventListener('click', getPaginatedTrendindMovies);
    //genericSection.appendChild(btnLoadMore);
}
async function getCategoriesPreview(){
    const {data} = await api('/genre/movie/list');
    const categories = data.genres;
    createCategories(categories, categoriesPreviewList);
}
async function getMoviesByCategory(id){
    const {data} = await api('/discover/movie', {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;
    maxPage= data.total_pages;
    console.log(maxPage)
    createMovies(movies, genericSection, {
        clean: true,
        lazyLoad: true,
    });
}
function getPaginatedMoviesByCategory(id){
    return async () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = scrollTop + clientHeight > scrollHeight - 1
    const pageIsNotMax = page < maxPage
    if(scrollIsBottom && pageIsNotMax){
        page++;
        console.log(page)
        const {data} = await api('/discover/movie', {
            params: {
                with_genres: id,
                page,
            }
        });
        const movies = data.results;
        createMovies(movies, genericSection, {
            clean: false,
            lazyLoad: true
        });  
    }
    }
} 
async function getMoviesBySearch(query){
    const {data} = await api('/search/movie', {
        params: {
            query,
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage)
    createMovies(movies, genericSection, {
        lazyLoad: true
    } );
}
function getPaginatedMoviesBySearch(query){
    return async () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = scrollTop + clientHeight > scrollHeight - 1
    const pageIsNotMax = page < maxPage
    if(scrollIsBottom && pageIsNotMax){
        page++;
        console.log(page)
        const {data} = await api('/search/movie', {
            params: {
                page,
                query,
            }
        });
        const movies = data.results;
        createMovies(movies, genericSection, {
            clean: false,
            lazyLoad: true
        });  
    }
    }
}    
async function getMovieById(id){
    const {data: movie} = await api('/movie/'+ id);
    const movieImgURL = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `
    linear-gradient(
        180deg,
        rgba(0,0,0, 0.35) 19.27%,
        rgba(0,0,0,0) 29.17%
    ),
    url(${movieImgURL})`
    movieDetailTitle.innerText = movie.title;
    movieDetailDescription.innerText = movie.overview;
    movieDetailScore.innerText = movie.vote_average;
    createCategories(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesId(id);
}
async function getRelatedMoviesId(id){
    const {data} = await api(`/movie/${id}/recommendations`)
    const relatedMovies = data.results;
    createMovies(relatedMovies, relatedMoviesContainer);
}

function getLikedMovies(id){
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);
    console.log(likedMovies)
    console.log(moviesArray)
    createMovies(moviesArray, likedMoviesListArticle, {
        lazyLoad: true,
        clear: true,
    });
}
//      logica inicial con fetch
//const URLBase = 'https://api.themoviedb.org';
//async function getTrendindMoviesPreview(){
//    const res = await fetch(`${URLBase}/3/trending/movie/day?api_key=${APIKey}`);
//    const data = await res.json();
//    const movies = data.results;
//    movies.forEach(movie => {
//        const trendingPreviewMoviesContainer = document.querySelector
//        ('.trendingPreview-movieList');
//        const movieContainer = document.createElement('div');
//        movieContainer.classList.add('movie-container');
//        const movieImg = document.createElement('img');
//        movieImg.classList.add('movie-img');
//        movieImg.setAttribute('alt', movie.title);
//        movieImg.setAttribute(
//            'src', 
//            'https://image.tmdb.org/t/p/w300' + movie.poster_path
//        )
//        movieContainer.appendChild(movieImg);
//        trendingPreviewMoviesContainer.appendChild(movieContainer);
//    });
//}
//async function getCategoriesPreview(){
//    const res = await fetch(`${URLBase}/3/genre/movie/list?api_key=${APIKey}`);
//    const data = await res.json();
//    const categories = data.genres;
//    categories.forEach(category=> {
//        const categoryPreviewContainer = document.querySelector('.categoriesPreview-list');
//        const categoryContainer = document.createElement('div');
//        categoryContainer.classList.add('category-container');
//        const categoryTitle = document.createElement('h3');
//        categoryTitle.classList.add('category-title');
//        categoryTitle.setAttribute('id', 'id' + category.id);
//        const categoryTitleText = document.createTextNode(category.name)
//        categoryTitle.appendChild(categoryTitleText);
//        categoryContainer.appendChild(categoryTitle);
//        categoryPreviewContainer.appendChild(categoryContainer);
//    });
//
//}
//
//getTrendindMoviesPreview();
//getCategoriesPreview();