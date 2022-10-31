import { Alert } from 'antd';

import errorImg from '../../img/errorImage.jpg'

import './errorIndicator.css'

function ErrorIndicator() {
  return (
    <div className='error'>
      <img src={errorImg} alt='Error images' />
      <Alert
        message="OOPS!"
        description="OOPS SOMETHING WENT WRONG PLEASE TRY AGAIN!"
        type="error"
        showIcon
      />
    </div>
  )
}

export default ErrorIndicator