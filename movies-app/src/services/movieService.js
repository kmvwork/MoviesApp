export default class MovieService {
  _apiKey = '5b2126e9a8b486bc855c4ccfccd7285f'
  _apiBase = 'https://api.themoviedb.org/'

  getResource = async (url) => {
    let res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`)
    }
    return await res.json()
  }

  postResource = async (url, value) => {
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(value)
    })

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`)
    }
    return await res.json()
  }

  getAllMovies = (text) => {
    return this.getResource(`${this._apiBase}3/search/movie?api_key=${this._apiKey}&language=en-US&query=${text}&page=1&include_adult=false`)
  }

  getNextPage = (text, pageNumber) => {
    return this.getResource(`${this._apiBase}3/search/movie?api_key=${this._apiKey}&language=en-US&query=${text}&page=${pageNumber}&include_adult=false`)
  }

  getGenresList = () => {
    return this.getResource(`${this._apiBase}/3/genre/movie/list?api_key=${this._apiKey}&language=en-US`)
  }

  createGuestSession = () => {
    return this.getResource(`${this._apiBase}/3/authentication/guest_session/new?api_key=${this._apiKey}`)
  }

  createRequestToken = () => {
    return this.getResource(`${this._apiBase}3/authentication/token/new?api_key=${this._apiKey}`)
  }

  setRatingMovies = (guestSessionId, movieId, rating) => {
    let body = { 'value': rating }
    return this.postResource(`${this._apiBase}3/movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${guestSessionId}`, body)
  }

  getRatingMovies = (guestSessionId, page) => {
    return this.getResource(`${this._apiBase}3/guest_session/${guestSessionId}/rated/movies?api_key=${this._apiKey}&language=en-US&page=${page}&sort_by=created_at.desc`)
  }

}