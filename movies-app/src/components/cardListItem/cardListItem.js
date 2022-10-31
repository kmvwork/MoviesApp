import { Rate } from 'antd'

import { nanoid } from 'nanoid'

import noPoster from '../../img/noPoster.JPEG'
import './cardListItem.css'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

function CardListItem({ itemProps, getGenresMovie, postMovieRating }) {
  const { title, release_date, overview, poster_path, genre_ids, id } = itemProps

  const [classNames, setClassNames] = useState('')
  const [rate, setRate] = useState()

  let totalClassRate = 'card__rating ' + classNames

  useEffect(() => {
    if (rate <= 3) {
      setClassNames('card__rating-color3')
      return
    }
    if (rate <= 5) {
      setClassNames('card__rating-color5')
      return
    }
    if (rate <= 7) {
      setClassNames('card__rating-color7')
      return
    }
    if (rate <= 10) {
      setClassNames('card__rating-color10')
    }

  }, [rate])

  useEffect(() => {
    let localRate = localStorage.getItem(id)
    if (localRate) {
      setRate(localRate)
    } else {
      setRate()
    }
  }, [])

  function setCurrentRate(event) {
    console.log('value', event)
    postMovieRating(id, event)
    setRate(event)
  }

  const actions = genre_ids.map(item => {
    const actionName = getGenresMovie(item)
    return (
      <span key={nanoid()} className='card__description-genre-item'>{actionName}</span>
    )
  })

  const posterImg = poster_path ? <img src={`https://image.tmdb.org/t/p/original/${poster_path}`} alt={title} /> :
    <img src={noPoster} alt='No poster' />

  const releaseFormat = release_date ? format(Date.parse(release_date), 'MMMM e, y') :
    <p>The release date is unknown</p>

  const viewRate = rate ? <div className={totalClassRate}>{rate}</div> : null

  return (
    <>
      <div className='card' key={nanoid()}>
        <div className='card__img'>
          {posterImg}
        </div>
        <div className='card__info'>
          <div className='card__description'>
            <div className='card__description-title'>
              {title}
            </div>
            <div className='card__description-date'>
              {releaseFormat}
            </div>
            <div className='card__description-genre'>
              {actions}
            </div>
          </div>
          {viewRate}
        </div>
        <div className='card__text'>
          <p>{kitCut(overview, 250)}</p>
        </div>
        <div className='card__star'>
          <Rate className='ex' count={10} onChange={(event) => setCurrentRate(event)} value={rate} />
        </div>
      </div>
    </>
  )
}

export default CardListItem


function kitCut(text, limit) {
  let textNew = text.trim()
  if (textNew.length <= limit) return text
  textNew = text.slice(0, limit)
  let lastSpace = textNew.lastIndexOf(' ')
  if (lastSpace > 0) {
    text = text.substr(0, lastSpace)
  }
  return text + '...'
}