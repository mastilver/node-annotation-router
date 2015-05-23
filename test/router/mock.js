
// @IsLogIn()
module.exports = {

    // @route('/company{companyId}/user')
    // @route('/user')
    getAll: function(){
        return 'getUsers';
    },

    // @route('/user/{id}')
    getUser: function(){
        return 'getUser';
    },

    // @route('/user')
    postUser: function(){
        return 'addUser';
    },


    // @isAdmin()
    // @httpPut()
    // @route('/user/{id}')
    functionToEditTheUser: function(){
        return 'updateUser';
    },

    internal: function(){

    },
};
