var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');

//connection
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'dbals0467@',
  database: 'pwa_curd'
});
connection.connect(function(err) {
  if(err) {
    console.error('mysql connection error');
    console.error(err);
    throw err;
  }
});

router.post('/Login', function (req, res) {
  const user = {
    'userid': req.body.user.userid,
    'password': req.body.user.password
  };
  connection.query('SELECT userid FROM users WHERE userid = ?',user.userid, function (err, row) {
    if (err) {
      res.json({ // 매칭되는 아이디 없을 경우
        success: false,
        message: 'Login failed please check your id or password!'
      })
    }
    if (row[0] !== undefined && row[0].userid === user.userid) {
      bcrypt.compare(user.password, row[0].password, function (err, res2) {
        if (res2) {
          res.json({ // 로그인 성공 
            success: true,
            message: 'Login successful!'
          })
        }
        else {
          res.json({ // 매칭되는 아이디는 있으나, 비밀번호가 틀린 경우 success: false,
            message: 'Login failed please check your id or password!'
          })
        }
      })
    }
  })
});

module.exports = router;
