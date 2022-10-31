import CardListItem from '../cardListItem'
import ErrorIndicator from '../errorIndicator'

import { Alert, Space, Spin } from 'antd'

import './cardList.css'
import { nanoid } from 'nanoid'

function CardList({ movies, loading, error, getGenresMovie, searchTextEmptyWarning, maxIndex, minIndex, postMovieRating }) {
  let elements = <Alert message='Loading...' type='info' />
  if (movies.length > 0) {
    // eslint-disable-next-line array-callback-return
    elements = movies.map((item, index) => {
        if (index >= minIndex && index < maxIndex) {
          return (
            <CardListItem
              itemProps={item}
              getGenresMovie={getGenresMovie}
              postMovieRating={postMovieRating}
              key={nanoid()}
            />
          )
        }
      }
    )
  }

  const spinner = <Space size='middle'><Spin size='large' tip='Loading...' /> </Space>

  const noElements = <Alert message='No Movies' type='info' />

  const showSearchWarning = <Alert message='Enter the search text above ↑' type='info' />

  const errorMessage = <ErrorIndicator />

  const showElements = elements.length > 0 && loading === false ? elements : noElements
  const showSpinner = loading && spinner
  const showError = error && errorMessage
  const searchTextEmptyWarningShow = searchTextEmptyWarning && showSearchWarning

  return (
    <div className='cardList'>
      {searchTextEmptyWarningShow}
      {showElements}
      {showSpinner}
      {showError}
    </div>
  )
}

export default CardList