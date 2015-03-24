// @routePrefix('/prefix')
// @routePrefix('/secondPrefix')
module.exports = {

    // @route('/user')
    getAllUser: function(){
        return 'getUsers';
    },

    // @route('/user/{id}')
    getUser: function(){
        return 'getUser';
    },
};
