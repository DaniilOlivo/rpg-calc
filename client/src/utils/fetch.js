import { useEffect, useState } from "react"

async function getFetch(url) {
    let response = await fetch(url) 

    if (response.ok) {
        let dataUser = await response.json()
        return dataUser
    } else {
        throw new Error(`Fail fetch url ${url}. Error: ${response.statusText}`)
    }
}

function useFetch(url="") {
    const [content, setContent] = useState("")
  
    useEffect(() => {
      async function getData() {
        const data = await getFetch(url)
        setContent(data)
      }
      getData()
    }, [url])

    return [content, setContent]
}

export default useFetch
