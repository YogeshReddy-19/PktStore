import db from "../datab.js";
import bcrypt from "bcrypt";
import passport from "passport";
import {Strategy} from "passport-local";

const saltRounds = 10;

export const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    
    if (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Session save failed" });
      }

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,            
          username: user.username,
          address: user.address,
          mobilenumber: user.mobilenumber
        }
      });
    });

  })(req, res, next);
};
export const registeruser = async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const address = req.body.address;
    const mobilenumber = req.body.mobilenumber;
    try {
    const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (checkResult.rows.length > 0) {
      res.redirect("/");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (username, password, address, mobilenumber) VALUES ($1, $2, $3, $4) RETURNING *",
            [username, hash, address, mobilenumber]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            if (err) {
              return res.status(500).json({ success: false, message: "Login failed" });
            }
              return res.json({ success: true, message: "Registered successfully" });
            }
          );
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
}
passport.use(
  new Strategy(async function verify(username, password, cb) {
    console.log("Login attempt:", username, password);

    try {
      const result = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      console.log("DB Result:", result.rows);
      if (result.rows.length === 0) {
        console.log("User not found");
        return cb(null, false);
      }
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(password, storedHashedPassword, (err, valid) => {
        if (err) {
          console.error("Password compare error:", err);
          return cb(err);
        }
        console.log("Password match:", valid);
        if (valid) return cb(null, user);
        return cb(null, false);
      });
    } catch (err) {
      console.error(err);
      return cb(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});
