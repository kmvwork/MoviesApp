import errorInternetImg from '../../img/noInternet.png'

import './errorInternetConnection.css'

function ErrorInternetConnection() {
  return (
    <div className='errorInternetConnection'>
      <img src={errorInternetImg} alt='Slow or no internet connection.' />
    </div>
  )
}

export default ErrorInternetConnection