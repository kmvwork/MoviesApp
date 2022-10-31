import { Component } from 'react'
import { Offline, Online } from 'react-detect-offline'
import TabsComponent from '../tabsComponent'
import MovieService from '../../services/movieService'
import ErrorInternetConnection from '../errorInternetConnection'

import './app.css'

export default class App extends Component {
  state = {
    movies: window.localStorage.getItem('films') ? JSON.parse(window.localStorage.getItem('films')) : [],
    moviesRatingFilm: [],
    moviesRating: [],
    genresList: [],
    loading: false,
    error: false,
    searchText: window.localStorage.getItem('searchText') ? JSON.parse(window.localStorage.getItem('searchText')) : '',
    searchTextEmptyWarning: false,
    totalResults: 0,
    totalResultsRating: 0,
    totalPages: 0,
    totalPagesRating: 0,
    currentPage: 1,
    currentPageRating: 1,
    minIndex: 0,
    maxIndex: 20,
    guestSessionId: window.localStorage.getItem('guestSessionId') ? window.localStorage.getItem('guestSessionId') : '',
    token: window.localStorage.getItem('token') ? window.localStorage.getItem('token') : ''
  }

  movieService = new MovieService()

  componentDidMount() {
    this.getGenresList()
    this.getRatingMovies()

    if (!this.state.guestSessionId && this.state.guestSessionId !== null && this.state.guestSessionId !== undefined) {
      this.movieService.createGuestSession().then(res => this.setSessionID(res))
    }
    if (this.state.token !== null) {
      this.movieService.createRequestToken().then(res => this.setToken(res))
    }
    localStorage.setItem('searchText', JSON.stringify(this.state.searchText))
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    localStorage.setItem('films', JSON.stringify(this.state.movies))
    localStorage.setItem('searchText', JSON.stringify(this.state.searchText))
  }

  getRatingMovies = () => {
    this.movieService.getRatingMovies(this.state.guestSessionId, this.state.currentPageRating).then(res => this.setRatingMovies(res.results, res.total_pages, res.total_results))
  }

  setRatingMovies = (movies, pages, results) => {
    this.setState(() => ({
      moviesRatingFilm: movies,
      totalPagesRating: pages,
      totalResultsRating: results
    }))
  }

  setSessionID = (value) => {
    window.localStorage.setItem('guestSessionId', value.guest_session_id)
    this.setState(({ guestSessionId: value.guest_session_id }))
  }

  addMoviesRatingLocal = (movieId, rating) => {
    localStorage.setItem(movieId, rating)
  }

  setToken = (value) => {
    window.localStorage.setItem('token', value.request_token)
    this.setState(({ token: value.request_token }))
  }

  postMovieRating = (movieId, rating) => {
    this.movieService.setRatingMovies(this.state.guestSessionId, movieId, rating)
      .then(res => res.success == true ? this.addMoviesRatingLocal(movieId, rating) : null)
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false
    })
  }

  getAllMovies = (text) => {
    if (text) {
      this.setState(() => {
        localStorage.setItem('searchText', JSON.stringify(text))
        return {
          loading: true
        }
      })
      this.movieService.getAllMovies(text)
        .then(res => this.setState(() => {
          return {
            movies: res.results,
            loading: false,
            error: false,
            searchText: text,
            searchTextEmptyWarning: false,
            totalResults: res.total_results,
            totalPages: res.total_pages
          }
        }))
        .catch(this.onError)
    } else {
      this.setState({
        movies: [],
        searchTextEmptyWarning: true
      })
      localStorage.setItem('searchText', JSON.stringify(''))
      localStorage.setItem('films', JSON.stringify(this.state.movies))
    }
  }

  nextPage = (pageNumber) => {
    this.movieService.getNextPage(this.state.searchText, pageNumber)
      .then(data => {
        this.setState({ movies: [...data.results], totalResults: data.total_results, currentPage: pageNumber })
      })
  }

  nextPageRating = (pageNumber) => {
    this.movieService.getRatingMovies(this.state.guestSessionId, pageNumber)
      .then(data => {
        this.setState({
          moviesRatingFilm: [...data.results],
          totalResultsRating: data.total_results,
          currentPageRating: pageNumber
        })
      })
  }

  getGenresMovie = (id) => {
    const genreName = this.state.genresList.filter(item => item.id === id)
    return genreName[0]?.name
  }

  getGenresList = () => {
    this.movieService.getGenresList()
      .then(res => this.setState(() => {
        return { genresList: res.genres }
      }))
  }

  render() {
    const {
      movies,
      loading,
      error,
      searchText,
      genresList,
      searchTextEmptyWarning,
      maxIndex,
      minIndex,
      moviesRatingFilm
    } = this.state

    let numberPages = Math.floor(this.state.totalResults / 20)
    let numberPagesRating = Math.floor(this.state.totalResultsRating / 20)

    return (
      <>
        {genresList ? (
          <>
            <Online>
              <section className='layout'>
                <TabsComponent
                  getAllMovies={this.getAllMovies}
                  searchText={searchText}
                  movies={movies}
                  loading={loading}
                  error={error}
                  maxIndex={maxIndex}
                  minIndex={minIndex}
                  searchTextEmptyWarning={searchTextEmptyWarning}
                  getGenresMovie={this.getGenresMovie}
                  postMovieRating={this.postMovieRating}
                  getRatingMovies={this.getRatingMovies}
                  moviesRatingFilm={moviesRatingFilm}
                  total={this.state.totalResults}
                  totalRating={this.state.totalResultsRating}
                  pages={numberPages}
                  pagesRating={numberPagesRating}
                  nextPage={this.nextPage}
                  nextPageRating={this.nextPageRating}
                  currentPage={this.state.currentPage}
                  currentPageRating={this.state.currentPageRating}
                />
              </section>
            </Online>
            <Offline>
              <div className='offline'>
                <ErrorInternetConnection />
              </div>
            </Offline>
          </>
        ) : <div>Загрузка...</div>}
      </>
    )
  }
}