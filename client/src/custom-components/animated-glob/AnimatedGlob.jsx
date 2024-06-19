import React from 'react'
import "../../styles/blobStyles.css"

const AnimatedGlob = ({text}) => {
    return (
        <div className='w-[50%] sm:w-full flex justify-center items-center relative min-w-max'>
            <h1 className=" logo-font absolute z-50  bg-[#3B3B3B] border-[2px] border-[white] text-[#DC5F00] sm:px-10 px-4 py-2 rounded-full bg-opacity-85 shadow-inner  ">{text}</h1>
            <div id='blob' class="bm-pl">
                <div class="bm-pl__blob bm-pl__blob--r"></div>
                <div class="bm-pl__blob bm-pl__blob--g"></div>
                <div class="bm-pl__blob bm-pl__blob--b"></div>
            </div>
        </div>
    )
}

export default AnimatedGlob