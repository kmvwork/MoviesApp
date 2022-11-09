import { Rate } from 'antd'

import { nanoid } from 'nanoid'

import noPoster from '../../img/noPoster.JPEG'
import './cardListItem.css'
import { format } from 'date-fns'
import {useLayoutEffect, useMemo, useState } from 'react'
import Spinner from '../spinner'

function CardListItem({ itemProps, getGenresMovie, postMovieRating }) {
  const { title, release_date, overview, poster_path, genre_ids, id, vote_average } = itemProps

  const [classNames, setClassNames] = useState('')
  const [rate, setRate] = useState()
  const [loadingImg, setLoadingImg] = useState()
  const [url, setUrl] = useState()

  let totalClassRate = 'card__rating ' + classNames

  useLayoutEffect(() => {
    if (vote_average <= 3) {
      setClassNames('card__rating-color3')
      return
    }
    if (vote_average <= 5) {
      setClassNames('card__rating-color5')
      return
    }
    if (vote_average <= 7) {
      setClassNames('card__rating-color7')
      return
    }
    if (vote_average <= 10) {
      setClassNames('card__rating-color10')
    }

  }, [vote_average])

  useMemo(() => {
    let localRate = localStorage.getItem(id)
    if (localRate) {
      setRate(localRate)
    } else {
      setRate()
    }
  }, [])

  const fetchImage = async (poster_path) => {
    setLoadingImg(true)
    if (poster_path === null) {
      setUrl('../../img/noPoster.JPEG')
      return
    }
    const res = await fetch(`https://image.tmdb.org/t/p/original/${poster_path}`);
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setLoadingImg(false)
    setUrl(imageObjectURL)
  };

  useMemo(() => {
    if (poster_path === null) {
      setUrl('../../img/noPoster.JPEG')
      return
    }
    fetchImage(poster_path)
  }, [poster_path])

  function setCurrentRate(event) {
    postMovieRating(id, event)
    setRate(event)
  }

  const actions = genre_ids.map(item => {
    const actionName = getGenresMovie(item)
    return (
      <span key={nanoid()} className='card__description-genre-item'>{actionName}</span>
    )
  })

  const posterImg = poster_path ? <img src={url} alt={title} /> : <img src={noPoster} alt='No poster' />


  const releaseFormat = release_date ? format(Date.parse(release_date), 'MMMM e, y') :
    <p>The release date is unknown</p>

  return (
    <>
      <div className='card' key={nanoid()}>
        <div className='card__img'>
          {
            loadingImg ? <Spinner /> : posterImg
          }
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
              {actions.length !== 0 ? actions : null}
            </div>
          </div>
          <div className={totalClassRate}>{vote_average.toFixed(0)}</div>
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