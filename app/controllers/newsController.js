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

module.exports = newsController;
