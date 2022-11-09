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
      value: '',
      showPaginationMovies: true,
      showPaginationMoviesRating: true,
      currentPage: 1
    }
  }

  componentDidMount() {
    if (this.props.searchText) {
      this.setState(() => {
        return { value: this.props.searchText, currentPage: 1 }
      })
      this.onStartSearch()
    }
  }

  onChange = (event) => {
    console.log('onChange tabsComponent')
    this.setState({
      value: event.target.value
    })
    this.onStartSearch()
  }

  onStartSearch = _debounce(() => {
    this.props.getAllMovies(this.state.value)
  }, 1500)

  onRefresh = (activeKey) => {
    if (activeKey === '2') {
      this.props.getRatingMovies()
    }
  }

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
      nextPageRating,
      getRatingMovies
    } = this.props

    if (total.length === 0) {
      this.setState(({
        showPaginationMovies: false
      }))
    }

    return (
      <Tabs defaultActiveKey='1' onTabClick={(activeKey) => this.onRefresh(activeKey)}>
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
              getGenresMovie={getGenresMovie}
              postMovieRating={postMovieRating}
            />
          </main>
          <footer className='layout__footer'>
            {
              this.state.showPaginationMovies && <PaginationComponent
                total={total}
                pages={pages}
                nextPage={nextPage}
                current={currentPage}
                defaultCurrent={currentPage}
              />
            }
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
              getRatingMovies={this.getRatingMovies}
            />
          </main>
          <footer className='layout__footer'>
            <PaginationComponent
              total={totalRating}
              pages={pagesRating}
              nextPage={nextPageRating}
              currentPage={currentPageRating}
              defaultCurrent={currentPageRating}
            />
          </footer>
        </TabPane>
      </Tabs>
    )
  }
}
