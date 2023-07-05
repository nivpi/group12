const conn = require("../db/db");
const path = require('path');
const csv=require('csvtojson');


const registerUser = (req, res) => { // Create a new user function
    if (!req.body) {
        res.status(400).send({ message: "Input cannot be empty." });
        return;
    }
    const newUser = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name
    };
    const checkExistingUserQuery = "SELECT * FROM users WHERE username = ?";
    conn.query(checkExistingUserQuery, newUser.username, (err, result) => {
        if (err) {
            res.status(500).send({ message: "An error has occurred, please try again." });
            return;
        }
        if (result.length > 0) { // Check if the given username already exists in the system
            res.send(`<script> alert('Username is already in use, Please try a different email address.');
                    window.location.href = '/register';
                </script>
            `);
            return;
        }
        const createUserQuery = "INSERT INTO users SET ?";
        conn.query(createUserQuery, newUser, (err, sqlres) => {
            if (err) {
                console.log("Error creating new user:", err);
                res
                    .status(500)
                    .send({ message: "New user signup failed, please try again" });
                return;
            }
            console.log("Created new user");
            res.send(`<script> 
                        alert('Registered successfully, please log in.');
                        window.location.href = '/login';
                      </script>
            `);
        });
    });
};

const updatePassword = (req, res) => { // Update password function
    if (!req.body) {
        res.status(400).send({ message: "Input cannot be empty." });
        return;
    }
    const { username, oldPassword, newPassword } = req.body;

    const checkMatchingPassword = "SELECT * FROM users WHERE username = ? AND password = ?";
    conn.query(checkMatchingPassword, [username, oldPassword], (err, result) => {
        if (err) {
            res.status(401).send({ message: "Invalid old password was given, please try again." });
            return;
        }
        if (result.length === 0) { // Check if the given old password is matching to the one in the database
            res.send(`<script> alert('Invalid old password was given, please try again.');
                    window.location.href = '/myAccount';
                </script>
            `);
            return;
        }
        const updatePasswordQuery = "UPDATE users SET password = ? WHERE username = ? ";
        conn.query(updatePasswordQuery, [newPassword, username], (err, sqlres) => {
            if (err) {
                console.log("Error updating user's password:", err);
                res
                    .status(500)
                    .send({ message: "Password update failed, please try again" });
                return;
            }
            console.log("Updated user's password");
            res.send(`<script> 
                        alert("Updated user's password successfully.");
                        window.location.href = '/myAccount';
                      </script>
            `);
        });
    });
};

const loginUser = (req, res) => {  //function for users login
    const { username, password } = req.body;
    const q3 = "SELECT * FROM users WHERE username = ? AND password = ?";
    conn.query(q3, [username, password], (err, sqlres) => {
        if (err) {
            console.log("Error in query3:", err);
            res.status(401).send(`<script> alert('Login Failed! Please Try again'); //pop message for failed login
                    window.location.href = '/login';
                </script>
            `);
            return;
        }
        if (sqlres.length > 0) {
            const user = sqlres[0];
            // Save user cookies:
            res.cookie("username", username);
            res.cookie("password", password);
            res.cookie("name", user.name);
            res.send(`<script> window.location.href = '/index'; </script> `);
        } else {
            res.send(`<script> alert('Login Failed! Please Try again'); //pop message for failed login
                    window.location.href = '/login';
                </script>
            `);}
    });}


const insertUsers = (req, res)=>{
    const Q1 = "INSERT INTO users SET ?";
    const csvFilePath= path.join(__dirname, "../db/csv/users.csv");
    console.log("CSV File Path:", csvFilePath);
    csv().fromFile(csvFilePath)
        .then((jsonObj)=>{
            jsonObj.forEach(element => {
                conn.query(Q1, element, (err,mysqlres)=>{
                    if (err) {
                        const errorMessage = "Error in inserting a new user.";
                        console.log(errorMessage, err);
                        res.status(500).send(`<script> alert(errorMessage); // Pop up message for failed insertion
                                                window.location.href = '/index';
                                            </script>
                                        `);
                    }
                    console.log("Created a new user in the database.");
                });
            });
        })
    res.send("Inserted user data successfully")
};

const insertProducts = (req, res)=>{ // Function to insert the products to the database
    const Q5 = "INSERT INTO products SET ?";
    const csvFilePath= path.join(__dirname, "../db/csv/products.csv");
    console.log("CSV File Path:", csvFilePath);
    csv().fromFile(csvFilePath).then((jsonObj)=>{
            jsonObj.forEach(element => {
                conn.query(Q5, element, (err,mysqlres)=>{
                    if (err) {
                        const errorMessage = "An Error has occurred while inserting a new product.";
                        console.log(errorMessage, err);
                        res.status(500).send(`<script> alert(errorMessage); // Pop up message for failed insertion
                                                window.location.href = '/index';
                                            </script>
                                        `);
                    }
                    console.log("Created a new product in the database.");
                });
            });
        })
    res.send("Inserted products successfully.")
};

const insertOrders = (req, res)=>{ // Function to insert the orders to the database
    const Q1 = "INSERT INTO orders SET ?";
    const csvFilePath= path.join(__dirname, "../db/csv/orders.csv");
    console.log("CSV File Path:", csvFilePath);
    csv().fromFile(csvFilePath)
        .then((jsonObj)=>{
            jsonObj.forEach(element => {
                conn.query(Q1, element, (err,mysqlres)=>{
                    if (err) {
                        const errorMessage = "An Error has occurred while inserting the orders.";
                        console.log(errorMessage, err);
                        res.status(500).send(`<script> alert(errorMessage); // Pop up message for failed insertion
                                                window.location.href = '/index';
                                            </script>
                                        `);
                    }
                    console.log("Created a new order in the database.");
                });
            });
        })
    res.send("Inserted orders successfully.")
};

const insertOrder = (req, res) => { // Function to insert an order to the database
    const username = req.cookies.username;
    // const calculateTotalPriceQuery = `SELECT SUM(p.price * c.quantity) AS total FROM cart c JOIN products p ON c.productId = p.productId WHERE c.username = ?`;
    // console.log('Before executing calculateTotalPriceQuery');
    // conn.query(calculateTotalPriceQuery, [username], (err, result) => {
    //     if (err) {
    //         console.error('Error calculating total price:', err);
    //         res.status(500).send('Error calculating total price');
    //         return;
    //     }

    const totalPrice = 0; // TODO: Calculate the total price from cookies.
    console.log('Total Price:', totalPrice);
    const insertOrderQuery = `INSERT INTO orders (date, totalPrice, username) VALUES (CURDATETIME(), ?, ?)`;
    console.log('Before executing insertOrderQuery');
    conn.query(insertOrderQuery, [totalPrice, username], (err, result) => {
        if (err) {
            console.error('Error adding order:', err);
            res.status(500).send('Error adding a new order');
            return;
        }
        // const clearCartQuery = `DELETE FROM cart WHERE username = ? `;
        // conn.query(clearCartQuery, [username], (err, result) => {
        //     if (err) {
        //         console.error('Error clearing cart:', err);
        //         res.status(500).send('Error clearing cart');
        //     }
        // });
        // TODO: Delete cart from cookies
        console.log('Order added successfully');
        res.redirect('/myOrders');
    });
};

const supplierProducts = (req, res) => { // Function to search products from the database, by supplier id
    const supplierSearch = req.query.supplier; // Get the search query from the URL parameter
    if (!supplierSearch) {
        console.error('Error, expected a supplier id in the query.');
        res.status(500).send('An error has occurred, expected a supplier id in the query.');
    }
    else {
        res.cookie('searchQuery', supplierSearch, {maxAge: 86400000}); // Cookie expires after 24 hours
        const query = `SELECT * FROM products WHERE supplier = '${supplierSearch}'`;
        console.log('Executing search query:', query);
        conn.query(query, (err, results) => {
            if (err) {
                console.error('Error retrieving products:', err);
                res.status(500).send('An error occurred while retrieving products');
                return;
            }
            res.render('products', {products: results});
        });
    }
};

const getAllProducts = (req, res) => { // Function to get all products from the database
    const query = "SELECT * FROM products ";
    conn.query(query, (err, results) => {
        if (err) {
            console.log("Error: Cannot get all products.", err);
            res.status(400).send({ message: "Error: Cannot get all products." });
            return; }
        res.render('shop', { products: results });
    });
};

const getOrders = (req, res) => {
    const username = req.cookies.username;
    const query = 'SELECT * FROM orders WHERE username = ?';
    conn.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error retrieving orders:', err);
            res.status(500).send('An error has occurred while retrieving orders');
            return;
        }
        res.render('/myOrders', { orders: results });
    });
}

// const displayCart = (req,res) =>{
//     // const query = ' SELECT c.cartId , c.productId ,p.productId ,c.quantity, p.name, p.image1, p.image1, p.price\n' +
//     //     '    FROM cart c\n' +
//     //     '    JOIN products p ON c.productId = p.productId ';
//     //
//     // conn.query(query, (err, results) => {
//     //     if (err) {
//     //         console.error('Error retrieving cart:', err);
//     //         res.status(500).send('An error occurred while retrieving myCart');
//     //         return;
//     //     }
//     // });
//     // TODO: Make sure the myCart page is loading correctly with the products from the cookies
//     res.render('/myCart');
// }

const getUsers = (req, res) => {
    const query = 'SELECT * FROM users';
    conn.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving users:', err);
            res.status(500).send('An error occurred while retrieving users');
            return;
        }
        res.render('/users', { users: results });
    });
}


module.exports = { registerUser, loginUser, updatePassword, insertUsers, getUsers,
    insertProducts, insertOrders, getOrders, supplierProducts, getAllProducts, insertOrder };

