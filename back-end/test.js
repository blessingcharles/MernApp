const login = (user,cb) =>{
    setTimeout(()=>{
        cb(user+'@gmail.com')},1000)
}
const getvideos = (userEmail,cb) =>{
    setTimeout(
        ()=>{
            cb(['video1','video2'])
        },1000)
}

const test = login('test',(userEmail)=>{
    getvideos(userEmail,(video)=>{
        console.log(video)
    })
})
