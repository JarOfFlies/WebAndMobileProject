const EXPRESS = require('express');
const SEARCHROUTER = EXPRESS.Router();
const DATABASE = require('../Bases/dbBase');

function getSearch(url){
    const searchParams = new URLSearchParams(url.substring(2));
    return searchParams.get("value");
};

SEARCHROUTER.get('/', async function(req, res){
    const results = await DATABASE.dbSearch(getSearch(req.url));
    var error = "";
    var isEmpty = false;
    if (results.length == 0) {
        error = "No results could be found, please try again.";
        isEmpty = true;
    }
    if(results.length == 1){
        const result = await DATABASE.dbSingleSearch(results[0].id);
        const oracleText = result.oracle_text.replace(/\\n/g, "\n\n");
        var powertoughness = "";
        if (result.power != null & result.toughness != null) {
            powertoughness = `${result.power} / ${result.toughness}`;
        }
        res.render('cardView', {
            title: 'Card',
            card: result,
            oracle: oracleText,
            powertoughness:powertoughness
        });
    }
    else{
        res.render('search',
        {
            title: 'Card Search',
            cards: results,
            errorText: error,
            isEmpty: isEmpty
        });
    }
});

SEARCHROUTER.get('/:id', async function(req,res){
    (
        async function query(){
        const result = await DATABASE.dbSingleSearch(req.params.id);
        const oracleText = result.oracle_text.replace(/\\n/g, "\n\n");
        var powertoughness = "";
        if (result.power != null & result.toughness != null) {
            powertoughness = `${result.power} / ${result.toughness}`;
        }
        res.render('cardView', {
            title: 'Card',
            card: result,
            oracle: oracleText,
            powertoughness:powertoughness
        });
    }())
});

module.exports = SEARCHROUTER;