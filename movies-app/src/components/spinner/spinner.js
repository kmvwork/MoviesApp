import './spinner.css'

import logo from '../../img/spinner.gif'

function Spinner() {
  return (
    <div className='spinner'>
      <img src={logo} alt='loading...' />
    </div>
  )
}

export default Spinner