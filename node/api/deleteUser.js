const {deleteUserWithId} = require("../user/delete");
const deleteUser = async (req, res ) => {
    const id = req.params.id;
    try {
        await deleteUserWithId(id);
        res.status(200).json({deleted: id});
    } catch(e) {
        console.log(e);
        res.status(500).json({reason: e})
    }

}
module.exports = {
    deleteUser,
}
