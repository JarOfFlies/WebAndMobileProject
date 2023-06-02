const SQL = require("mssql");
const DEBUG = require("debug") ("app");

const config = {
    user: "jw",
    password: "TestServerPassword1",
    server: "unitestlibrary.database.windows.net",
    database: "LibraryProject",

    options: {
        encrypt: true
    }
};

async function dbConnect() {
    await SQL.connect(config).catch((err) => DEBUG(err));
};

async function dbSearch(search)  {
    await dbConnect();
    var param = "";
    var value = "";
    var valueEmpty = true;
    if (search.includes(":")) {
        const split = search.split(":");
        if (split[1] != "") {
            param = split[0];
            value = split[1];
            valueEmpty = false;
        }
    }
    else{
        value = search;
        valueEmpty = false;
    }
    var query = "";
    if (!valueEmpty) {
        query = "SELECT id, name, image FROM Cards WHERE ";
        switch(param.toLocaleLowerCase()){
            case "keyword":
                query = `SELECT Cards.id, Cards.name, Cards.image FROM Keywords JOIN CardKeywords ON Keywords.id = CardKeywords.KeywordId JOIN Cards ON Cards.id = CardKeywords.cardId WHERE Keywords.keyword = '${value}' `;
                break;
            case "set":
                query = `SELECT Cards.id, Cards.name, Cards.image FROM Sets JOIN Cards ON Cards.set_id = Sets.id WHERE Sets.set_code = '${value}' `;
                break;
            case "colour":
                query = `SELECT Cards.id, Cards.name, Cards.image FROM Colours JOIN CardColours ON Colours.id = CardColours.colourId JOIN Cards ON Cards.id = CardColours.cardId WHERE Colours.colour = '${value}' `;
                break;
            case "type":
                query = query.concat(`type_line LIKE '%${value}%'`);
                break;
            case "power":
                valueInt = parseInt(value)
                if (Number.isInteger(valueInt)) {
                    query = query.concat("power = ", parseInt(value));
                }
                else{
                    query = "";
                }
                break;
            case "cmc":
                valueInt = parseInt(value)
                if (Number.isInteger(valueInt)) {
                    query = query.concat("cmc = ", parseInt(value))
                }
                else{
                    query = "";
                }
                break;
            default:
                query = query.concat("name LIKE '%", value, "%'");
        }
    }
    var result = [];
    if (query != "") {
        query = query.concat(" ORDER BY Cards.name")
        const request = new SQL.Request();
        const response = await request.query(query).catch((err) => DEBUG(err));
        DEBUG(response);
        result = response.recordset;
    }
    return result;
}

async function dbSingleSearch(id){
    await dbConnect();
    const request = new SQL.Request();
    const result = await request.input("id", SQL.Int, id).query("SELECT * FROM Cards WHERE id = @id");
    DEBUG(result)
    return result.recordset[0];
}

exports.dbConnect = dbConnect;
exports.dbSearch = dbSearch;
exports.dbSingleSearch = dbSingleSearch;