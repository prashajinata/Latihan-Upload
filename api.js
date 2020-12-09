const mysql = require('mysql'); 
const express = require("express") 
const bodyParser = require("body-parser") 
const cors = require("cors") 
const app = express() 
const md5 = require("md5")
const moment = require("moment")
upload = require("express-fileupload")
const { response } = require('express')
const Cryptr = require("cryptr")
const crypt = new Cryptr("140533601726")  

app.use(upload())   
app.use(bodyParser.json())  
app.use(bodyParser.urlencoded({ extended: true }))  
app.use(cors())  

var db = mysql.createConnection({     
    host: 'localhost',     
    user: 'root',     
    password: '',     
    database: 'olshop' 
}); 

app.listen(8000, () => {     
    console.log("Server run on port 8000"); 
}); 

validateToken = () => {
    return (req, res, next) => {
        if (!req.get('Token')) {
            res.json({
                message: 'Access Forbidden'
            })
        } else {
            let token  = req.get('Token')
            let decryptToken = crypt.decrypt(token)
            let sql = 'SELECT * FROM admin WHERE ?'

            let param = { id_admin: decryptToken}

            db.query(sql, param, (error, result) => {
                if (error) throw error
                if (result.length > 0) {
                    next()
                } else {
                    res.json({
                        message: 'Invalid Token'
                    })
                }
            })
        }

    }
}

app.post('/admin/auth', (req, res) => {
    let param = [
        req.body.username, 
        md5(req.body.password) 
    ]
    let sql = 'SELECT * FROM admin WHERE username = ? and password = ?'

    db.query(sql, param, (error, result) => {
        if (error) throw error

        if (result.length > 0) {
            res.json({
                message: 'Logged',
                token: crypt.encrypt(result[0].id_admin),
                data: result
            })
        } else {
            res.json({
                message: 'Invalid username/password'
            })
        }
    })
})

app.post("/barang",validateToken(),(req,res) => {
    let kode = req.body.kode;
    let nama = req.body.nama;
    let harga = req.body.harga;
    let stok = req.body.stok;
    let deskripsi = req.body.deskripsi;
    if (req.files) {
        var file = req.files.image,
            image = file.name;
        file.mv("./image/" + image, function (err) {
            if (err) {
                console.log(err)
                res.send("error")
            } else {
                db.query('INSERT INTO barang (kode_barang,nama_barang,harga,stok,deskripsi,image)VALUES(?,?,?,?,?,?)'
                , [kode,nama,harga,stok,deskripsi,image],(error, result) => {
                    let response = null
                    if (error) {
                        response = {
                            message: error.message
                        }
                    } else {
                        response = {
                            message: result.affectedRows + " data inserted"
                        }
                    }
                    res.json(response) 
                })
            }
        })
    }
});

app.put("/barang",validateToken(),(req,res) => {
    let kode = req.body.kode;
    let nama = req.body.nama;
    let harga = req.body.harga;
    let stok = req.body.stok;
    let deskripsi = req.body.deskripsi;
    if (req.files) {
        var file = req.files.image,
            image = file.name;
        file.mv("./image/" + image, function (err) {
            if (err) {
                console.log(err)
                res.send("error")
            } else {
                db.query('UPDATE barang SET nama_barang=?,harga=?,stok=?,deskripsi=?,image=? where kode_barang=?'
                , [nama,harga,stok,deskripsi,image,kode],(error, result) => {
                    let response = null
                    if (error) {
                        response = {
                            message: error.message
                        }
                    } else {
                        response = {
                            message: result.affectedRows + " data edited"
                        }
                    }
                    res.json(response) 
                })
            }
        })
    }
});

app.delete('/barang/:kode',validateToken(),(req, res) => {
    mysqlConnection.query('DELETE FROM barang where kode_barang = ?', [req.params.kode], (error, result) => {
        let response = null
        if (error) {
            response = {
                message: err.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    });
});

app.get("/barang",validateToken(), (req, res) => {
    let sql = "SELECT * FROM barang"
    db.query(sql, (error, result) => {
        if (error) throw error
        res.json({
            data: result,
            count: result.length
        })
    })
})

//ep users

app.post("/users",validateToken(),(req,res) => {
    let id = req.body.id;
    let nama = req.body.nama;
    let alamat = req.body.alamat;
    let username = req.body.username;
    let password = md5(req.body.password);
    if (req.files) {
        var file = req.files.foto,
            foto = file.name;
        file.mv("./foto/" + foto, function (err) {
            if (err) {
                console.log(err)
                res.send("error")
            } else {
                db.query('INSERT INTO users (id_users,nama_users,alamat,foto,username,password)VALUES(?,?,?,?,?,?)'
                , [id,nama,alamat,foto,username,password],(error, result) => {
                    let response = null
                    if (error) {
                        response = {
                            message: error.message
                        }
                    } else {
                        response = {
                            message: result.affectedRows + " data inserted"
                        }
                    }
                    res.json(response) 
                })
            }
        })
    }
});

app.put("/users",validateToken(),(req,res) => {
    let id = req.body.id;
    let nama = req.body.nama;
    let alamat = req.body.alamat;
    let username = req.body.username;
    let password = md5(req.body.password);
    if (req.files) {
        var file = req.files.foto,
            foto = file.name;
        file.mv("./foto/" + foto, function (err) {
            if (err) {
                console.log(err)
                res.send("error")
            } else {
                db.query('UPDATE users SET nama_users=?,alamat=?,foto=?,username=?,password=? where id_users=?'
                , [nama,alamat,foto,username,password,id],(error, result) => {
                    let response = null
                    if (error) {
                        response = {
                            message: error.message
                        }
                    } else {
                        response = {
                            message: result.affectedRows + " data edited"
                        }
                    }
                    res.json(response) 
                })
            }
        })
    }
});

app.delete('/users/:id',validateToken(),(req, res) => {
    mysqlConnection.query('DELETE FROM users where id_users = ?', [req.params.id], (error, result) => {
        let response = null
        if (error) {
            response = {
                message: err.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    });
});

app.get("/users",validateToken(), (req, res) => {
    let sql = "SELECT * FROM users"
    db.query(sql, (error, result) => {
        if (error) throw error
        res.json({
            data: result,
            count: result.length
        })
    })
})

// ep admin

app.post("/admin",validateToken(),(req,res)=>{
    let data = {
        id_admin: req.body.id_admin,
        nama_admin: req.body.nama_admin,
        username: req.body.username,
        password: md5(req.body.password)
    }

    let sql = "INSERT INTO admin SET ?"

    db.query(sql,data,(error,result)=>{
        let response = null
        if(error){
            response = {
            message: error.message
            }
        }
        else{
        response = {
            message: result.affectedRows + " data inserted"
        }
    }
        res.json(response)
    })
})

app.put("/admin",validateToken(),(req,res)=>{
    let data = [
        {
            nama_admin: req.body.nama_admin,
            username: req.body.username,
            password: md5(req.body.password)
        },

        {
            id_admin: req.body.id_admin
        }    
    ]
    
    let sql = "UPDATE admin SET ? WHERE ?"

    db.query(sql,data,(error,result)=>{
        let response = null
        if(error){
            response = {
            message: error.message
            }
        }
        else{
        response = {
            message: result.affectedRows + " data update"
        }
        res.json(response)
    }
    })
})

app.delete("/admin/:id",validateToken(),(req,res)=>{
    let data = {
        id_admin: req.params.id
    }

    let sql = "DELETE FROM admin WHERE ?"

    db.query(sql,data,(error,result)=>{
        let response = null
        if(error){
            response = {
            message: error.message
            }
        }
        else{
        response = {
            message: result.affectedRows + " data deleted"
        }
        res.json(response)
    }
    })
})

app.get("/admin",validateToken(), (req, res) => {
    let sql = "SELECT * FROM admin"
    db.query(sql, (error, result) => {
        if (error) throw error
        res.json({
            data: result,
            count: result.length
        })
    })
})

//ep transaksi
app.post('/transaksi',validateToken(), (req,res) => {
    let data = {
        kode_transaksi: req.body.kode_transaksi,
        id_users : req.body.id_users,
        tgl_transaksi : moment().format('YYYY-MM-DD HH:mm:ss')
    }
    let sql = "INSERT INTO transaksi SET ?"

    db.query(sql, data,  (error, rows) =>{
    let response = null
    if (error) {
        response = {
            message: error.message 
        }
    } else {
        response = {
            message: rows.affectedRows + " data inserted"
        }
    }
    res.json(response)
})
})

app.get('/transaksi',validateToken(),(req,res)=>{
    db.query('SELECT * FROM transaksi ORDER BY kode_transaksi', (err, rows) => {
        let response = null
        if (err) {
            response = {
                message: err.message
            }
        } else {
            response = {
                count: rows.length,
                admin: rows
            }
        }
        res.json(response)
    })
})

app.delete('/transaksi/:kode',validateToken(), (req, res) => {
    db.query('DELETE FROM transaksi where kode_transaksi = ?', [req.params.kode], (err, rows) => {
        let response = null
        if (err) {
            response = {
                message: err.message
            }
        } else {
            response = {
                message: rows.affectedRows + " data dihapus"
            }
        }
        res.json(response)
    });
})

app.put('/transaksi',validateToken(), (req,res) => {
    let param = {kode_transaksi : req.body.kode_transaksi}
    let data = {
        kode_transaksi: req.body.kode_transaksi,
        id_users : req.body.id_users,
        tgl_transaksi : moment(req.body.tgl_transaksi)
    }
    let sql = "UPDATE transaksi SET ? where ?"

    db.query(sql, [data,param],  (error, rows) =>{
    let response = null
    if (error) {
        response = {
            message: error.message 
        }
    } else {
        response = {
            message: rows.affectedRows + " Berhasil diedit"
        }
    }
    res.json(response)
})
})

//ep detail transaksi
app.post('/detail_transaksi',validateToken(), (req,res) => {
    var jumlah = req.body.jumlah
    let kode_barang = {
        kode_barang:req.body.kode_barang
    }
    let m = "SELECT harga, stok FROM barang WHERE ?"
    db.query(m, kode_barang,(error, result) =>{
        var string=JSON.stringify(result);
        var json =  JSON.parse(string);
        let total = json[0].harga*jumlah
        let b = json[0].stok-jumlah  
        let kode_barang = req.body.kode_barang

    let data = {
        kode_transaksi: req.body.kode_transaksi,
        kode_barang : req.body.kode_barang,
        jumlah : req.body.jumlah,
        harga_beli : total
    }  
    db.query("UPDATE barang SET stok = ? WHERE kode_barang=?",[b,kode_barang],(err, rows) => {
    if (err) {
        res.json({message: error.message})
    }else { 
        let sql = "INSERT INTO detail_transaksi SET ?"
        db.query(sql, data,(error, rows) =>{
        if (error) {
            res.json({message: error.message})
        } else {
            res.json({message: "Data has been inserted"})
            }
        })
    }
    })
})
})

app.delete('/detail_transaksi/:kode',validateToken(), (req, res) => {
    db.query('DELETE FROM detail_transaksi where kode_transaksi = ?', [req.params.kode], (err, rows) => {
        let response = null
        if (err) {
            response = {
                message: err.message
            }
        } else {
            response = {
                message: rows.affectedRows + " data dihapus"
            }
        }
        res.json(response)
    });
})

app.get("/detail_transaksi",validateToken(), (req, res) => {
    let data = []
    let sqlPembeli = "SELECT t.kode_transaksi,t.tgl_transaksi,u.nama_users,u.alamat FROM users u JOIN transaksi t ON u.id_users = t.id_users"
    db.query(sqlPembeli, (error,result)=>{
        if(error){
            res.json({
                alert: "Error di pembeli",
                message: error.message
            })
        }else{
            data.push(result)
            let sqlBarang = "SELECT b.nama_barang, d.jumlah, d.harga_beli FROM barang b JOIN detail_transaksi d ON b.kode_barang = d.kode_barang"
            db.query(sqlBarang,(error,result)=>{
                if(error){
                    res.json({
                        alert: "Error di barang",
                        message: error.message
                    })
                }else{
                    data.push(result)
                    var barangLength = result.length
                    var string = JSON.stringify(result)
                    var json = JSON.parse(string)
                    var totalHarga = 0
                    for (let index = 0; index<barangLength;index++){
                        totalHarga += json[index].harga_beli
                    }
                    data.push({
                        TOTAL: totalHarga
                    })
                    res.json(data)
                }
            })
        }
    })
})