
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoadingRedirect(str) {

  //console.log(str.str)
    const [count, setCount] = React.useState(2)
    const navigate = useNavigate()

    React.useEffect(()=>{
        const interval = setInterval(()=>{
            setCount((currentCount)=> --currentCount)
        }, 1000)

        count === 0 && navigate(str.str)
        return ()=> clearInterval(interval)
    },[count,navigate])// eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className='flex justify-center items-center w-screen h-screen'>
        {/* {str.str === "/login" && <h5 className='text-white'>You need to be logged in, redirecting you in {count} seconds</h5>} */}
       <h5 className='text-white'>Redirecting you in {count} seconds</h5>
        {/* {str.str === "/" && <h5 className='text-white'>Redirecting you in {count} seconds</h5>} */}
    </div>
  )
}
