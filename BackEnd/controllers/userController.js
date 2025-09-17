const db=require("../db/queries")
async function getUsers(req,res){
    const data= await db.getAllUserNames();
    if(!data){
        console.log("There is no data for now")
        res.status(400).send("There is no data for now");

    }
    console.log("Usernames: ", data);
    res.send("Usernames: " + data.map(user => user.username).join(", "));
}
function getNewUser(req,res){
    res.send(`
        <form action="/users/new" method="POST">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name">
            <button type="submit"> Add</button>
        </form>
        `)
}
async function createNewUser(req,res){
    const data=req.body;
    await db.insertUsername(data.name);
    res.redirect("/users");
}

async function getSearchedUser(req, res) {
    const sub = req.query.search;
    
    if (!sub) {
        return res.send(`
            <form action="/users/search" method="GET">
                <label for="search">Search:</label>
                <input type="text" id="search" name="search">
                <button type="submit">Search</button>
            </form>
        `);
    }

    const data = await db.searchUser(sub);
    
    const userList = data
        ? data.map(user => `<li>${user.username || user}</li>`).join('')
        : '<li>No users found</li>';

    res.send(`
        <form action="/users/search" method="GET">
            <label for="search">Search:</label>
            <input type="text" id="search" name="search" value="${sub || ''}">
            <button type="submit">Search</button>
        </form>
        <div>
            <h3>Search Results:</h3>
            <ul>${userList}</ul>
        </div>
    `);
}
// async function getAuthorById(req, res) {
//     const { authorId } = req.params;
  
//     try {
//       const author = await db.getAuthorById(Number(authorId));
  
//       if (!author) {
//         res.status(404).send("Author not found");
//         return;
//       }
  
//       res.send(`Author Name: ${author.name}`);
//     } catch (error) {
//       console.error("Error retrieving author:", error);
//       res.status(500).send("Internal Server Error");
  
//       // or we can call next(error) instead of sending a response here
//       // Using `next(error)` however will only render an error page in the express' default view and respond with the whole html to the client.
//       // So we will need to create a special type of middleware function if we want a different response and we will get to that... next.
//     }
//   };

// [
//     body("birthdate", "Must be a valid date.")
//       .optional({ values: "falsy" })
//       .isISO8601() // Enforce a YYYY-MM-DD format.
//   ];
// This example marks birthdate field as optional, but still enforces the ISO8601 date format on inputs. This is because { values: "falsy" } means values that aren’t undefined, null, false, 0 or empty strings "" will still be validated.
// [
//     body("name")
//       .trim()
//       .notEmpty()
//       .withMessage("Name can not be empty.")
//       .isAlpha()
//       .withMessage("Name must only contain alphabet letters."),  
//   ];


// const alphaErr = "must only contain letters.";
// const lengthErr = "must be between 1 and 10 characters.";

// const validateUser = [
//   body("firstName").trim()
//     .isAlpha().withMessage(`First name ${alphaErr}`)
//     .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
//   body("lastName").trim()
//     .isAlpha().withMessage(`Last name ${alphaErr}`)
//     .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
// ];


// exports.usersCreatePost = [
//   validateUser,
//   (req, res) => {

module.exports={
    getUsers,
    getNewUser,
    createNewUser,
    getSearchedUser,
}