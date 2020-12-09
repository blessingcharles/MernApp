class httpError extends Error{
    constructor(errormsg,code){
        super(errormsg)
        this.code = code 
    }
    
}

module.exports = httpError ;