const pool=require("./pool")


async function getAllUserNames(){
    const {rows}=await pool.query("SELECT * FROM usernames");
    return rows;
}
async function insertUsername(username){
    await pool.query("INSERT INTO usernames (username) VALUES ($1)",[username])
}

async function searchUser(sub) {
    try {
        const { rows } = await pool.query("SELECT * FROM usernames WHERE username LIKE $1",[`%${sub}%`]);
        return rows;
    } catch (error) {
        console.error("Search error:", error);
        throw error;
    }
}

module.exports={
    getAllUserNames,
    insertUsername,
    searchUser
}