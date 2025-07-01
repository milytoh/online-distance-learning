exports.getIndex = (req, res, next) => {
    console.log('jjj')
    
    res.render('onlinecourse/index', {
        title: 'Home' 
    })

}

exports.getAllCoures = (req, res, next) => {
    res.render('onlinecourse/course-list', {
        
    })
}