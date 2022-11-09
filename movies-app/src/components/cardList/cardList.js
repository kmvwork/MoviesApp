import CardListItem from '../cardListItem'
import ErrorIndicator from '../errorIndicator'

import { Alert} from 'antd'

import './cardList.css'
import { nanoid } from 'nanoid'
import Spinner from '../spinner'

function CardList({
                    movies,
                    loading,
                    error,
                    getGenresMovie,
                    maxIndex,
                    minIndex,
                    postMovieRating,
                    getRatingMovies
                  }) {
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

  const errorMessage = <ErrorIndicator />

  const showElements = elements.length && loading === false > 0  ? elements : null
  const showSpinner = loading && <Spinner/>
  const showError = error && errorMessage

  return (
    <div className='cardList'>
      {showElements}
      {showSpinner}
      {showError}
    </div>
  )
}

export default CardList