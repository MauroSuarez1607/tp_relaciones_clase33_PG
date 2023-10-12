const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment')
const { Op } = require("sequelize");
const { error } = require('console');

const moviesController = {
    list: (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id, {
            include : ['genre']
        })
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    new: (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    recomended: (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    add: function (req, res) {
        db.Genre.findAll({
            order : ['name']
        })
            .then(allGenres => {
                return res.render('moviesAdd', {
                    allGenres
                })
            })
            .catch(error => console.log(error))
        
    },
    create: function (req,res) {
        const { title, rating, awards, release_date, length, genre_id } = req.body
        db.Movie.create({
            title: title.trim(),
            rating,
            awards,
            release_date,
            length,
            genre_id
        })
            .then((movie) => {
                console.log(movie)
                return res.redirect('/movies')
            })
            .catch((error) => console.log(error))
    },
    edit: function(req,res) {
        const allGenres = db.Genre.findAll({
            order : ['name']
        })
        const movie = db.Movie.findByPk(req.params.id)
        Promise.all([movie, allGenres])
        .then(([movie, allGenres]) => {
            return res.render('moviesEdit', {
                Movie : movie,
                moment,
                allGenres
            })
        })
        .catch((error) => console.log(error))
    },
    update: function (req,res) {
        const { title, rating, awards, release_date, length, genre_id } = req.body

        db.Movie.update(
            {
                title: title.trim(),
                rating,
                awards,
                release_date,
                length,
                genre_id
            },
            {
                where : {
                    id: req.params.id
                }
            }
        )
            .then((response) => {
                console.log(response)
                return res.redirect('/movies/detail/' + req.params.id)
            })
            .catch((error => console.log(error)))
    },
    delete: function (req,res) {

    },
    destroy: function (req,res) {

    }
}

module.exports = moviesController;