import express from 'express';
import bodyParser from 'body-parser'
import jsonfile from 'jsonfile';

const PORT = process.env.PORT || 3001;
const DATABASE = './server/database/db.json';
let userdata = {};
const app = express();
app.use(bodyParser.json());

jsonfile.readFile(DATABASE, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    userdata = data;
    // test pass check
    // console.log(checkPass('sample01@email.com','password1234'));
  });

const writeUserData = ( ) => ( 
    jsonfile.writeFile(DATABASE, userdata, function (err) {
        if (err) console.error(err)
}) );

/* For testing the server */
app.get("/api", (req, res) => {
    res.json({ message: "Hello from Express!" });
});

const checkPass = ( username, password ) => {
    var login = false;
    var person = {};

    for ( var i in userdata["user"] ) {

        if ( (!login) && userdata["user"][i].email == username && userdata["user"][i].password == password ) {
            var usertype = userdata["user"][i].usertype;
            var firstname = userdata["user"][i].firstname;
            var lastname = userdata["user"][i].lastname;
            person = {firstname: firstname, lastname:lastname, usertype: usertype };
            login = true;
            break;
        }
    }

    
    return { login: login, person: person };
}

const checkExist = ( username, email, password ) => {

    var person = {};
    console.log(2);
    for ( var i in userdata["user"] ) {
        if ( userdata["user"][i].email == email) {
            return person;
        }
    }

    var name = username;
    var email = email;
    var password = password;

    person = {
        name: name,
        email: email,
        password: password,
        usertype: "User",
        Position: "n/a"
    }   
    
    console.log(3);
    userdata["user"].push(person);

    jsonfile.writeFileSync(DATABASE, userdata, function (err) {
        if (err) console.error(err)
    });

    console.log(4);
    return { person: person };
}

const checkExistStaff = ( username, email, password ) => {

    var person = {};

    for ( var i in userdata["user"] ) {
        if ( userdata["user"][i].email == email) {
            return person;
        }
    }

    var name = username;
    var email = email;
    var password = password;

    person = {
        name: name,
        email: email,
        password: password,
        usertype: "Admin",
        Position: "Staff"
    }   

    userdata["user"].push(person);
    jsonfile.writeFileSync(DATABASE, userdata, function (err) {
        if (err) console.error(err)
    });

    return { person: person };
}

const getStaff = () => {

    var staff = [];
    
    for ( var i in userdata["user"] ) {
        if (userdata["user"][i].usertype === "Admin" ) {
            staff.push(userdata["user"][i]);
        }
    }

    return staff;
}

const getJobOrders = () => {
    
    var orders = userdata["jobOrders"];
    return orders;
}

/* To handle authentication request */
app.post("/api/auth", (req, res) => {
    console.log ( "AUTH: Received data ..." );
    console.log ( req.body);  
    let {user, password} = req.body;
    res.json ( checkPass(String(user).trim(), String(password).trim()) ); 
});

// To see exisitng account once register
app.post("/api/reg", (req, res) => {
    console.log ( "AUTH: Received data ..." );
    console.log (req.body);  
    let {user, email, password} = req.body;
    console.log(1);
    res.json ( checkExist(String(user), String(email).trim(), String(password).trim()) ); 
});

app.post("/api/regStaff", (req, res) => {
    console.log ( "AUTH: Received data ..." );
    console.log (req.body);  
    let {user, email, password} = req.body;
    res.json ( checkExistStaff(String(user), String(email).trim(), String(password).trim()) ); 
});

app.post("/api/getStaff", (req, res) => {
    res.json ( getStaff() ); 
});

app.post("/api/getJobOrders", (req, res) => {
    res.json ( getJobOrders() ); 
});
  
app.listen ( PORT, () => {
    console.log(`http://localhost:${PORT}`);
    
});