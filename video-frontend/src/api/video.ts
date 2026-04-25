
const getVideo = async(id:string) => {
    return await fetch(`/api/video/${id}`)
    .then(response => response.json())
}

export default getVideo