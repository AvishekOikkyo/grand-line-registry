/********************************************************************************
* WEB322 - Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Avishek Roy
* Student ID: 166395236
* Date: March 2026
*
********************************************************************************/
const express = require('express')
const app = express()
const path = require("path");

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//starter data

const crewMembers = [
  {
    id: 1,
    name: "Monkey D. Luffy",
    role: "Captain",
    bounty: 3000000000,
    devilFruit: "Hito Hito no Mi, Model: Nika",
    status: "active",
  },
  {
    id: 2,
    name: "Roronoa Zoro",
    role: "Swordsman",
    bounty: 1111000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 3,
    name: "Nami",
    role: "Navigator",
    bounty: 366000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 4,
    name: "Usopp",
    role: "Sniper",
    bounty: 500000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 5,
    name: "Vinsmoke Sanji",
    role: "Cook",
    bounty: 1032000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 6,
    name: "Tony Tony Chopper",
    role: "Doctor",
    bounty: 1000,
    devilFruit: "Hito Hito no Mi",
    status: "inactive",
  },
  {
    id: 7,
    name: "Nico Robin",
    role: "Archaeologist",
    bounty: 930000000,
    devilFruit: "Hana Hana no Mi",
    status: "active",
  },
  {
    id: 8,
    name: "Franky",
    role: "Shipwright",
    bounty: 394000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 9,
    name: "Brook",
    role: "Musician",
    bounty: 383000000,
    devilFruit: "Yomi Yomi no Mi",
    status: "active",
  },
  {
    id: 10,
    name: "Jinbe",
    role: "Helmsman",
    bounty: 1100000000,
    devilFruit: "None",
    status: "active",
  },
];

//logger middleware

app.use((req, res, next) => {
    const logString = `Request from: ${req.headers["user-agent"]} at ${new Date()}`
    console.log(logString);
    req.log = logString;
    next();
})

// routes

app.get("/", (req, res) => {
  res.render("index", {
    crew: crewMembers
  });
});


app.get("/crew", (req, res) => {
  res.render("crew", {
    crew: crewMembers
  });
});

app.get("/recruit", (req, res) => {
  res.render("recruit", { errors: [] });
});

app.post("/recruit", (req, res) => {

  const { applicantName, skill, role, message, sea, agreeTerms } = req.body;

  let errors = [];

  if (!applicantName || applicantName.trim() === "") {
    errors.push("Name is required");
  }

  if (!skill || skill.trim() === "") {
    errors.push("Skill is required");
  }

  if (!role || role === "Select a role") {
    errors.push("Role must be selected");
  }

  if (!message || message.trim() === "") {
    errors.push("Message is required");
  }

  if (!sea) {
    errors.push("You must select a sea");
  }

  if (!agreeTerms) {
    errors.push("You must agree to the terms");
  }

  // If validation fails
  if (errors.length > 0) {
    return res.render("recruit", { errors });
  }

  // Create new recruit
  const newRecruit = {
    id: crewMembers.length + 1,
    name: applicantName,
    role: role,
    devilFruit: skill,
    bounty: 0,
    status: "pending"
  };

 crewMembers.push(newRecruit);

res.render("recruit", { errors: [] });

});

app.get("/log-pose", verifyBounty, (req, res) => {

  res.render("logPose", {
    crew: crewMembers,
    log: req.log
  });

});

app.get("/error-test", (req, res) => {
  throw new Error("Engine malfunction!");
});


// route-restricting middleware

function verifyBounty(req, res, next) {
    const random = Math.floor(Math.random() * 2);
    if (random === 1) {
        next();
    } else {
        res.status(403).send("403 - The Marines have blocked your path. Turn back.");
    }
}

// handler

app.use((req, res) => {

  res.status(404).render("404", {
    message: "404 - We couldn't find what you're looking for on the Grand Line."
  });

});

// error handling middleware

app.use((err, req, res, next) => {
  res.status(500).send(
    `500 - Something went wrong on the Thousand Sunny: ${err.message}`
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});