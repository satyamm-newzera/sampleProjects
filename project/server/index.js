const { ApolloServer, gql } = require('apollo-server');
var mysql = require('mysql2');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'userdb'
})

conn.connect();

const typeDefs = gql`

    type User {
        id: Int
        name: String
        designation: String
        website: String
        profileUri: String
    }

    type Query {
        getAllUsers: [User]
        getUserById(id: Int): User
    }

    type Mutation {
        changeProfilePic(id:Int, uri: String): User
    }
`;

// Sample data
// const users = [
//     {
//         id: 1,
//         name: 'Satyam',
//         designation: "SDE",
//         website: "www.satyam.com",
//         profileUri: ''
//     },
//     {
//         id: 2,
//         name: 'Rahul',
//         designation: "Quant",
//         website: "www.rahul.com",
//         profileUri: ''
//     },
// ];

async function allUsers() {
    const query = "select * from users";
    let result = await new Promise((resolve, reject) => {
        conn.query(query, function(err, res) {
            if (err) console.log(err);
            console.log(res);
            resolve(res);
        })
    })
    return result;
}

async function getuserbyid(id) {
    const query = "select * from users where id = " + id;
    let result = await new Promise((resolve, reject) => {
        conn.query(query, function(err, res) {
            if (err) console.log(err);
            console.log(res);
            resolve(res);
        })
    })
    console.log(result[0]);
    return result[0];
}

async function changeprofilepic(id, uri) {
    const query = `update users set profileUri='${uri}' where id = ${id}`;
    let result = await new Promise((resolve, reject) => {
        conn.query(query, function(err, res) {
            if (err) console.log(err);
            resolve(res);
        })
    })
    return getuserbyid(id);
}

const resolvers = {
    Query: {
        getAllUsers: () => users,
        getUserById(parent, args, context, info) {
            return getuserbyid(args.id);
        } 
    },
    Mutation: {
        changeProfilePic(parent, args, context, info) {
            return changeprofilepic(args.id, args.uri);
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
});

server.listen().then(({url}) => {
    console.log(` Server ready at ${url}`)
});