let page = 1;
let infiniteScroll;
let maxPage;
window.addEventListener(/*tambien se puede usar 'load'*/'DOMContentLoaded', navigation, false);
window.addEventListener('hashchange', navigation, false);
window.addEventListener('scroll', infiniteScroll, {passive : false});
searchFormBtn.addEventListener('click', ()=> location.hash = '#search=' + searchFormInput.value);
trendingBtn.addEventListener('click', ()=> location.hash = '#trends');
arrowBtn.addEventListener('click', ()=> history.back()/*location.hash = '#home'*/);
function navigation(){
    if(infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive : false});
        infiniteScroll = undefined;
    }
    console.log(location);
    location.hash.startsWith('#trends')
    ?    trendsPage()    :
    location.hash.startsWith('#search=')
    ?   searchPage()    :
    location.hash.startsWith('#movie=')
    ?   moviesPage()    :
    location.hash.startsWith('#category=')
    ?   categoriesPage()    :
        homePage();
        window.scroll( 0, 0)
        if(infiniteScroll){
            window.addEventListener('scroll', infiniteScroll, {passive : false});
        }
};
function homePage(){
    console.log('home');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    headerCategoryTitle.classList.add('inactive');
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    favoriteMovieSection.classList.remove('inactive');
    getTrendindMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}
function trendsPage(){
    console.log('trends');
    headerSection.classList.remove('header-container--long');
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    headerCategoryTitle.innerText = 'Tendencias';
    categoriesPreviewSection.classList.add('inactive');
    favoriteMovieSection.classList.add('inactive');
    getTrendindMovies();
    infiniteScroll = getPaginatedTrendindMovies;
}
function moviesPage(){
    console.log('movies');
    headerSection.classList.add('header-container--long');
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerCategoryTitle.classList.add('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    categoriesPreviewSection.classList.add('inactive');
    favoriteMovieSection.classList.add('inactive');
    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
}
function categoriesPage(){
    console.log('categories');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    favoriteMovieSection.classList.add('inactive');
    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');
    headerCategoryTitle.innerText = decodeURI(categoryName);
    getMoviesByCategory(categoryId);
    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}
function searchPage(){
    console.log('search');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    favoriteMovieSection.classList.add('inactive');
    console.log(location.hash)
    const [_, query] = location.hash.split('=');
    getMoviesBySearch(decodeURI(query));
    infiniteScroll = getPaginatedMoviesBySearch(query);

}



