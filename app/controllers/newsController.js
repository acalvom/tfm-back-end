const httpCode = require("../resources/httpCodes");
const connection = require('../database/database');
const newsController = {};

let sql;

newsController.createNews = (req, res) => {
    let news = req.body;
    if (Object.keys(news).length === 0)
        res.status(httpCode.codes.BADREQUEST).json('No news sent');
    else {
        // console.log(news)
        sql = 'INSERT INTO news SET ?';
        connection.query(sql, [news], function (err, resultDB) {
            if (!err) {
                news.id = resultDB.insertId;
                res.status(httpCode.codes.CREATED).json(news);
            } else
                res.status(httpCode.codes.CONFLICT).json('News ' + news.code + ' already exists');
        });
    }
}

newsController.getLastNews = (req, res) => {
    sql = 'SELECT * FROM news ORDER BY id DESC LIMIT 3';
    connection.query(sql, function (err, lastNews) {
        if (!err && lastNews.length > 0) {
            // console.log(lastNews)
            res.status(httpCode.codes.OK).json(lastNews);
        } else
            res.status(httpCode.codes.NOTFOUND).json('News not found');
    });
}

newsController.deleteNews = (req, res) => {
    let code = req.params.code;
    sql = 'DELETE FROM news WHERE code = ?';
    connection.query(sql, [code], function (err, result) {
        // console.log(code)
        if (!err && result.affectedRows > 0)
            res.status(httpCode.codes.NOCONTENT).json(['News ' + code + ' deleted successfully']);
        else
            res.status(httpCode.codes.NOTFOUND).json(['News ' + code + ' is not found']);
    });
}

module.exports = newsController;
