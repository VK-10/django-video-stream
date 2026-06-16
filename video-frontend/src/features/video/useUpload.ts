/*upload logic*/
/*
TEST_STREAM_URL ???
*/ 

const useUpload = () => {
    const upload = async (file) => {
        const formData = new FormData()
        formData.append("video",file)

        return fetch("/api/upload/", {
            method: "POST",
            body: formData,
            credentials: "include"
        })
  }

  return {upload}
}

export default useUpload