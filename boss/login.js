const login = async (req, res) => {
    try {
        let { password } = req.body;
        if(password== "password"){
            res.status(200).json({message: 'Successful'});
        }
        res.status(300).json({error: "wrong password"})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    login
}