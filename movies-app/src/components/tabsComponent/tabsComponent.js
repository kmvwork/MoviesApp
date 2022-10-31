import { Input, Tabs } from 'antd'

import { Component } from 'react'
import _debounce from 'lodash/debounce'

import CardList from '../cardList'
import PaginationComponent from '../paginationComponent'

import './tabsComponent.css'


export default class TabsComponent extends Component {
  constructor() {
    super()
    this.state = {
      value: ''
    }
  }

  componentDidMount() {
    if (this.props.searchText) {
      this.setState(() => {
        return { value: this.props.searchText }
      })
    }
    this.props.getRatingMovies()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.value !== this.state.value) {
      this.onStartSearch()
    }
  }

  onChange = (event) => {
    this.setState({
      value: event.target.value
    })
  }

  onStartSearch = _debounce(() => {
    this.props.getAllMovies(this.state.value)
  }, 1000)


  render() {
    const { TabPane } = Tabs
    const { value } = this.state

    const {
      movies,
      loading,
      error,
      maxIndex,
      minIndex,
      searchTextEmptyWarning,
      getGenresMovie,
      postMovieRating,
      moviesRatingFilm,
      total,
      pages,
      nextPage,
      currentPage,
      pagesRating,
      totalRating,
      currentPageRating,
      nextPageRating
    } = this.props

    return (
      <Tabs defaultActiveKey='1' destroyInactiveTabPane>
        <TabPane tab='Search' key='1'>
          <header className='layout__header'>
            <Input
              value={value}
              placeholder='Type to search'
              onChange={this.onChange}
              className='mb-20'
            />
          </header>
          <main className='layout__content'>
            <CardList
              movies={movies}
              loading={loading}
              error={error}
              maxIndex={maxIndex}
              minIndex={minIndex}
              searchTextEmptyWarning={searchTextEmptyWarning}
              getGenresMovie={getGenresMovie}
              postMovieRating={postMovieRating}
            />
          </main>
          <footer className='layout__footer'>
            <PaginationComponent
              total={total}
              pages={pages}
              nextPage={nextPage}
              currentPage={currentPage}
            />
          </footer>
        </TabPane>
        <TabPane tab='Rated' key='2'>
          <main className='layout__content'>
            <CardList
              movies={moviesRatingFilm}
              loading={loading}
              error={error}
              maxIndex={maxIndex}
              minIndex={minIndex}
              searchTextEmptyWarning={searchTextEmptyWarning}
              getGenresMovie={getGenresMovie}
              postMovieRating={postMovieRating}
            />
          </main>
          <footer className='layout__footer'>
            <PaginationComponent
              total={totalRating}
              pages={pagesRating}
              nextPage={nextPageRating}
              currentPage={currentPageRating}
            />
          </footer>
        </TabPane>
      </Tabs>
    )
  }


}
