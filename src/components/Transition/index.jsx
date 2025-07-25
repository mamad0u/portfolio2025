'use client'
import React, { useState } from 'react'

const index = (children) => {


    const [dispalaychildren, setDisplayChildren] = useState(children)
  return (
    <div>
        {dispalaychildren}
    </div>
  )
}

export default index