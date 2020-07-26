const notebook = {
    "version": 2,
    "sheet": {
        "id": "cc381040-ce3b-11ea-b5f6-afabb4b56228",
        "language": "javascript",
        "cells": [
            {
                "id": "7fe9f4a0-ce3c-11ea-b5f6-afabb4b56228",
                "cellType": "markdown",
                "code": "# MiniQL example notebook\r\n\r\nMiniQL is a tiny JSON-based query language inspired by GraphQL.\r\n\r\nThis notebook shows how to use [miniql](https://www.npmjs.com/package/miniql) and [@miniql/csv](https://www.npmjs.com/package/@miniql/csv) to run queries against a set of CSV files.\r\n\r\nTo learn more about MiniQL please see the [code repo on GitHub](https://github.com/miniql/miniql).",
                "lastEvaluationDate": "2020-07-25T16:24:26.934+10:00",
                "output": [],
                "errors": [],
                "height": 173
            },
            {
                "id": "ea8d2660-ce3c-11ea-b5f6-afabb4b56228",
                "cellType": "markdown",
                "code": "## The example data set\r\n\r\nThe example data used in this notebook is [Star Wars universe data is courtesy of Kaggle](https://www.kaggle.com/jsphyg/star-wars/data).\r\n\r\nHere's a preview of the data from `species.csv`:",
                "lastEvaluationDate": "2020-07-25T16:24:26.934+10:00",
                "output": [],
                "errors": [],
                "height": 129
            },
            {
                "id": "122e1bc0-ce3d-11ea-b5f6-afabb4b56228",
                "cellType": "code",
                "cellScope": "global",
                "code": "import { readCsv } from \"datakit\";\r\n\r\nconst speciesData = await readCsv(\"./data/species.csv\");    // Load \"species.csv\".\r\ndisplay.table(speciesData.slice(0, 5));                     // Preview first 5 rows.",
                "lastEvaluationDate": "2020-07-25T16:19:28.399+10:00",
                "output": [
                    {
                        "value": {
                            "displayType": "table",
                            "data": {
                                "rows": [
                                    {
                                        "name": "Hutt",
                                        "classification": "gastropod",
                                        "designation": "sentient",
                                        "average_height": 300,
                                        "skin_colors": "green, brown, tan",
                                        "hair_colors": "NA",
                                        "eye_colors": "yellow, red",
                                        "average_lifespan": 1000,
                                        "language": "Huttese",
                                        "homeworld": "Nal Hutta"
                                    },
                                    {
                                        "name": "Yoda's species",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 66,
                                        "skin_colors": "green, yellow",
                                        "hair_colors": "brown, white",
                                        "eye_colors": "brown, green, yellow",
                                        "average_lifespan": 900,
                                        "language": "Galactic basic",
                                        "homeworld": "NA"
                                    },
                                    {
                                        "name": "Trandoshan",
                                        "classification": "reptile",
                                        "designation": "sentient",
                                        "average_height": 200,
                                        "skin_colors": "brown, green",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow, orange",
                                        "average_lifespan": "NA",
                                        "language": "Dosh",
                                        "homeworld": "Trandosha"
                                    },
                                    {
                                        "name": "Mon Calamari",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 160,
                                        "skin_colors": "red, blue, brown, magenta",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": "NA",
                                        "language": "Mon Calamarian",
                                        "homeworld": "Mon Cala"
                                    },
                                    {
                                        "name": "Ewok",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 100,
                                        "skin_colors": "brown",
                                        "hair_colors": "white, brown, black",
                                        "eye_colors": "orange, brown",
                                        "average_lifespan": "NA",
                                        "language": "Ewokese",
                                        "homeworld": "Endor"
                                    }
                                ],
                                "columnNames": [
                                    "name",
                                    "classification",
                                    "designation",
                                    "average_height",
                                    "skin_colors",
                                    "hair_colors",
                                    "eye_colors",
                                    "average_lifespan",
                                    "language",
                                    "homeworld"
                                ]
                            }
                        },
                        "height": 224
                    }
                ],
                "errors": [],
                "height": 118
            },
            {
                "id": "41a12c30-ce3d-11ea-b5f6-afabb4b56228",
                "cellType": "markdown",
                "code": "## Configure MiniQL/csv\r\n\r\nBefore we can query our data set we need to load it.\r\n\r\nWe are using [@miniql/csv](https://www.npmjs.com/package/@miniql/csv) to load our CSV files and create a query resolver for MiniQL:",
                "lastEvaluationDate": "2020-07-25T16:24:26.934+10:00",
                "output": [],
                "errors": [],
                "height": 131
            },
            {
                "id": "cc381041-ce3b-11ea-b5f6-afabb4b56228",
                "cellType": "code",
                "cellScope": "global",
                "code": "//\r\n// Configures CSV files to be loaded and how they relate to each other.\r\n//\r\nconst csvFilesConfig = {\r\n    species: {\r\n        primaryKey: \"name\",\r\n        csvFilePath: \"./data/species.csv\",\r\n        nested: {\r\n            homeworld: {\r\n                parentKey: \"homeworld\",\r\n                from: \"planet\",\r\n            },\r\n        },\r\n    },\r\n    planet: {\r\n        primaryKey: \"name\",\r\n        csvFilePath: \"./data/planets.csv\",\r\n        nested: {\r\n            species: {\r\n                foreignKey: \"homeworld\",\r\n            },\r\n        },\r\n    },\r\n};\r\n\r\nconst { createQueryResolver } = require(\"@miniql/csv\");\r\n\r\n// \r\n// Loads CSV files and creates a MiniQL query resolver.\r\n//\r\nconst queryResolver = await createQueryResolver(csvFilesConfig);",
                "lastEvaluationDate": "2020-07-25T16:19:30.993+10:00",
                "output": [],
                "errors": [],
                "height": 631
            },
            {
                "id": "9fa10bc0-ce3d-11ea-b5f6-afabb4b56228",
                "cellType": "markdown",
                "code": "## Run queries\r\n\r\nNow we can run queries against our data set.",
                "lastEvaluationDate": "2020-07-25T16:24:26.935+10:00",
                "output": [],
                "errors": [],
                "height": 102
            },
            {
                "id": "aff30e10-ce3d-11ea-b5f6-afabb4b56228",
                "cellType": "markdown",
                "code": "### Get all species\r\n\r\nFirst we'll query for all species in the Star Wars universe and preview the result.\r\n\r\nThis query simply pulls all the data from `species.csv`.",
                "lastEvaluationDate": "2020-07-25T16:24:26.935+10:00",
                "output": [],
                "errors": [],
                "height": 129
            },
            {
                "id": "c2ef6fe0-ce3d-11ea-b5f6-afabb4b56228",
                "cellType": "code",
                "cellScope": "local",
                "code": "const query = {\r\n    get: {\r\n        species: { // Query for \"species\" entity.\r\n            // No arguments gets all entities.\r\n        },\r\n    },\r\n};\r\n\r\nconst { miniql } = require(\"miniql\");\r\n\r\n// Execute the query against the data.\r\nconst result = await miniql(query, queryResolver, {});\r\n\r\n// Displays the query result.\r\ndisplay(result);",
                "lastEvaluationDate": "2020-07-25T16:19:30.994+10:00",
                "output": [
                    {
                        "value": {
                            "displayType": "object",
                            "data": {
                                "species": [
                                    {
                                        "name": "Hutt",
                                        "classification": "gastropod",
                                        "designation": "sentient",
                                        "average_height": 300,
                                        "skin_colors": "green, brown, tan",
                                        "hair_colors": "NA",
                                        "eye_colors": "yellow, red",
                                        "average_lifespan": 1000,
                                        "language": "Huttese",
                                        "homeworld": "Nal Hutta"
                                    },
                                    {
                                        "name": "Yoda's species",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 66,
                                        "skin_colors": "green, yellow",
                                        "hair_colors": "brown, white",
                                        "eye_colors": "brown, green, yellow",
                                        "average_lifespan": 900,
                                        "language": "Galactic basic",
                                        "homeworld": "NA"
                                    },
                                    {
                                        "name": "Trandoshan",
                                        "classification": "reptile",
                                        "designation": "sentient",
                                        "average_height": 200,
                                        "skin_colors": "brown, green",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow, orange",
                                        "average_lifespan": "NA",
                                        "language": "Dosh",
                                        "homeworld": "Trandosha"
                                    },
                                    {
                                        "name": "Mon Calamari",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 160,
                                        "skin_colors": "red, blue, brown, magenta",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": "NA",
                                        "language": "Mon Calamarian",
                                        "homeworld": "Mon Cala"
                                    },
                                    {
                                        "name": "Ewok",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 100,
                                        "skin_colors": "brown",
                                        "hair_colors": "white, brown, black",
                                        "eye_colors": "orange, brown",
                                        "average_lifespan": "NA",
                                        "language": "Ewokese",
                                        "homeworld": "Endor"
                                    },
                                    {
                                        "name": "Sullustan",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "pale",
                                        "hair_colors": "none",
                                        "eye_colors": "black",
                                        "average_lifespan": "NA",
                                        "language": "Sullutese",
                                        "homeworld": "Sullust"
                                    },
                                    {
                                        "name": "Neimodian",
                                        "classification": "NA",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "grey, green",
                                        "hair_colors": "none",
                                        "eye_colors": "red, pink",
                                        "average_lifespan": "NA",
                                        "language": "Neimoidia",
                                        "homeworld": "Cato Neimoidia"
                                    },
                                    {
                                        "name": "Gungan",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 190,
                                        "skin_colors": "brown, green",
                                        "hair_colors": "none",
                                        "eye_colors": "orange",
                                        "average_lifespan": "NA",
                                        "language": "Gungan basic",
                                        "homeworld": "Naboo"
                                    },
                                    {
                                        "name": "Toydarian",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 120,
                                        "skin_colors": "blue, green, grey",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": 91,
                                        "language": "Toydarian",
                                        "homeworld": "Toydaria"
                                    },
                                    {
                                        "name": "Dug",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 100,
                                        "skin_colors": "brown, purple, grey, red",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow, blue",
                                        "average_lifespan": "NA",
                                        "language": "Dugese",
                                        "homeworld": "Malastare"
                                    },
                                    {
                                        "name": "Twi'lek",
                                        "classification": "mammals",
                                        "designation": "sentient",
                                        "average_height": 200,
                                        "skin_colors": "orange, yellow, blue, green, pink, purple, tan",
                                        "hair_colors": "none",
                                        "eye_colors": "blue, brown, orange, pink",
                                        "average_lifespan": "NA",
                                        "language": "Twi'leki",
                                        "homeworld": "Ryloth"
                                    },
                                    {
                                        "name": "Aleena",
                                        "classification": "reptile",
                                        "designation": "sentient",
                                        "average_height": 80,
                                        "skin_colors": "blue, gray",
                                        "hair_colors": "none",
                                        "eye_colors": "NA",
                                        "average_lifespan": 79,
                                        "language": "Aleena",
                                        "homeworld": "Aleen Minor"
                                    },
                                    {
                                        "name": "Vulptereen",
                                        "classification": "NA",
                                        "designation": "sentient",
                                        "average_height": 100,
                                        "skin_colors": "grey",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": "NA",
                                        "language": "vulpterish",
                                        "homeworld": "Vulpter"
                                    },
                                    {
                                        "name": "Xexto",
                                        "classification": "NA",
                                        "designation": "sentient",
                                        "average_height": 125,
                                        "skin_colors": "grey, yellow, purple",
                                        "hair_colors": "none",
                                        "eye_colors": "black",
                                        "average_lifespan": "NA",
                                        "language": "Xextese",
                                        "homeworld": "Troiken"
                                    },
                                    {
                                        "name": "Toong",
                                        "classification": "NA",
                                        "designation": "sentient",
                                        "average_height": 200,
                                        "skin_colors": "grey, green, yellow",
                                        "hair_colors": "none",
                                        "eye_colors": "orange",
                                        "average_lifespan": "NA",
                                        "language": "Tundan",
                                        "homeworld": "Tund"
                                    },
                                    {
                                        "name": "Cerean",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 200,
                                        "skin_colors": "pale pink",
                                        "hair_colors": "red, blond, black, white",
                                        "eye_colors": "hazel",
                                        "average_lifespan": "NA",
                                        "language": "Cerean",
                                        "homeworld": "Cerea"
                                    },
                                    {
                                        "name": "Nautolan",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "green, blue, brown, red",
                                        "hair_colors": "none",
                                        "eye_colors": "black",
                                        "average_lifespan": 70,
                                        "language": "Nautila",
                                        "homeworld": "Glee Anselm"
                                    },
                                    {
                                        "name": "Zabrak",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "pale, brown, red, orange, yellow",
                                        "hair_colors": "black",
                                        "eye_colors": "brown, orange",
                                        "average_lifespan": "NA",
                                        "language": "Zabraki",
                                        "homeworld": "Iridonia"
                                    },
                                    {
                                        "name": "Tholothian",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": "NA",
                                        "skin_colors": "dark",
                                        "hair_colors": "NA",
                                        "eye_colors": "blue, indigo",
                                        "average_lifespan": "NA",
                                        "language": "NA",
                                        "homeworld": "Tholoth"
                                    },
                                    {
                                        "name": "Iktotchi",
                                        "classification": "NA",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "pink",
                                        "hair_colors": "none",
                                        "eye_colors": "orange",
                                        "average_lifespan": "NA",
                                        "language": "Iktotchese",
                                        "homeworld": "Iktotch"
                                    },
                                    {
                                        "name": "Quermian",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 240,
                                        "skin_colors": "white",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": 86,
                                        "language": "Quermian",
                                        "homeworld": "Quermia"
                                    },
                                    {
                                        "name": "Kel Dor",
                                        "classification": "NA",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "peach, orange, red",
                                        "hair_colors": "none",
                                        "eye_colors": "black, silver",
                                        "average_lifespan": 70,
                                        "language": "Kel Dor",
                                        "homeworld": "Dorin"
                                    },
                                    {
                                        "name": "Chagrian",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 190,
                                        "skin_colors": "blue",
                                        "hair_colors": "none",
                                        "eye_colors": "blue",
                                        "average_lifespan": "NA",
                                        "language": "Chagria",
                                        "homeworld": "Champala"
                                    },
                                    {
                                        "name": "Geonosian",
                                        "classification": "insectoid",
                                        "designation": "sentient",
                                        "average_height": 178,
                                        "skin_colors": "green, brown",
                                        "hair_colors": "none",
                                        "eye_colors": "green, hazel",
                                        "average_lifespan": "NA",
                                        "language": "Geonosian",
                                        "homeworld": "Geonosis"
                                    },
                                    {
                                        "name": "Mirialan",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "yellow, green",
                                        "hair_colors": "black, brown",
                                        "eye_colors": "blue, green, red, yellow, brown, orange",
                                        "average_lifespan": "NA",
                                        "language": "Mirialan",
                                        "homeworld": "Mirial"
                                    },
                                    {
                                        "name": "Clawdite",
                                        "classification": "reptilian",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "green, yellow",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": 70,
                                        "language": "Clawdite",
                                        "homeworld": "Zolan"
                                    },
                                    {
                                        "name": "Besalisk",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 178,
                                        "skin_colors": "brown",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": 75,
                                        "language": "besalisk",
                                        "homeworld": "Ojom"
                                    },
                                    {
                                        "name": "Kaminoan",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 220,
                                        "skin_colors": "grey, blue",
                                        "hair_colors": "none",
                                        "eye_colors": "black",
                                        "average_lifespan": 80,
                                        "language": "Kaminoan",
                                        "homeworld": "Kamino"
                                    },
                                    {
                                        "name": "Skakoan",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": "NA",
                                        "skin_colors": "grey, green",
                                        "hair_colors": "none",
                                        "eye_colors": "NA",
                                        "average_lifespan": "NA",
                                        "language": "Skakoan",
                                        "homeworld": "Skako"
                                    },
                                    {
                                        "name": "Muun",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 190,
                                        "skin_colors": "grey, white",
                                        "hair_colors": "none",
                                        "eye_colors": "black",
                                        "average_lifespan": 100,
                                        "language": "Muun",
                                        "homeworld": "Muunilinst"
                                    },
                                    {
                                        "name": "Togruta",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "red, white, orange, yellow, green, blue",
                                        "hair_colors": "none",
                                        "eye_colors": "red, orange, yellow, green, blue, black",
                                        "average_lifespan": 94,
                                        "language": "Togruti",
                                        "homeworld": "Shili"
                                    },
                                    {
                                        "name": "Kaleesh",
                                        "classification": "reptile",
                                        "designation": "sentient",
                                        "average_height": 170,
                                        "skin_colors": "brown, orange, tan",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": 80,
                                        "language": "Kaleesh",
                                        "homeworld": "Kalee"
                                    },
                                    {
                                        "name": "Pau'an",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 190,
                                        "skin_colors": "grey",
                                        "hair_colors": "none",
                                        "eye_colors": "black",
                                        "average_lifespan": 700,
                                        "language": "Utapese",
                                        "homeworld": "Utapau"
                                    },
                                    {
                                        "name": "Wookiee",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 210,
                                        "skin_colors": "gray",
                                        "hair_colors": "black, brown",
                                        "eye_colors": "blue, green, yellow, brown, golden, red",
                                        "average_lifespan": 400,
                                        "language": "Shyriiwook",
                                        "homeworld": "Kashyyyk"
                                    },
                                    {
                                        "name": "Droid",
                                        "classification": "artificial",
                                        "designation": "sentient",
                                        "average_height": "NA",
                                        "skin_colors": "NA",
                                        "hair_colors": "NA",
                                        "eye_colors": "NA",
                                        "average_lifespan": "indefinite",
                                        "language": "NA",
                                        "homeworld": "NA"
                                    },
                                    {
                                        "name": "Human",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "caucasian, black, asian, hispanic",
                                        "hair_colors": "blonde, brown, black, red",
                                        "eye_colors": "brown, blue, green, hazel, grey, amber",
                                        "average_lifespan": 120,
                                        "language": "Galactic Basic",
                                        "homeworld": "Coruscant"
                                    },
                                    {
                                        "name": "Rodian",
                                        "classification": "sentient",
                                        "designation": "reptilian",
                                        "average_height": 170,
                                        "skin_colors": "green, blue",
                                        "hair_colors": "NA",
                                        "eye_colors": "black",
                                        "average_lifespan": "NA",
                                        "language": "Galactic Basic",
                                        "homeworld": "Rodia"
                                    }
                                ]
                            }
                        }
                    }
                ],
                "errors": [],
                "height": 536
            },
            {
                "id": "0e0cde40-ce3e-11ea-b5f6-afabb4b56228",
                "cellType": "markdown",
                "code": "### Get one species\r\n\r\nNext we'll query for one single species with the name \"Hutt\".\r\n\r\nThis query searches `species.csv` for the particular species we want to find.",
                "lastEvaluationDate": "2020-07-25T16:24:26.935+10:00",
                "output": [],
                "errors": [],
                "height": 129
            },
            {
                "id": "0f5d2c00-ce3e-11ea-b5f6-afabb4b56228",
                "cellType": "code",
                "cellScope": "global",
                "code": "const query = {\r\n    get: {\r\n        species: { // Query for \"species\" entity.\r\n            args: {\r\n                name: \"Hutt\", // Gets the one species that matches this name.\r\n            },\r\n        },\r\n    },\r\n};\r\n\r\nconst { miniql } = require(\"miniql\");\r\n\r\n// Execute the query against the data.\r\nconst result = await miniql(query, queryResolver, {});\r\n\r\n// Displays the query result.\r\ndisplay(result);",
                "lastEvaluationDate": "2020-07-25T16:19:31.821+10:00",
                "output": [
                    {
                        "value": {
                            "displayType": "object",
                            "data": {
                                "species": {
                                    "name": "Hutt",
                                    "classification": "gastropod",
                                    "designation": "sentient",
                                    "average_height": 300,
                                    "skin_colors": "green, brown, tan",
                                    "hair_colors": "NA",
                                    "eye_colors": "yellow, red",
                                    "average_lifespan": 1000,
                                    "language": "Huttese",
                                    "homeworld": "Nal Hutta"
                                }
                            }
                        }
                    }
                ],
                "errors": [],
                "height": 365
            },
            {
                "id": "619b3fc0-ce3e-11ea-b5f6-afabb4b56228",
                "cellType": "markdown",
                "code": "### Get one species and its homeworld\r\n\r\nWe can drill deeper and resolve nested entities.\r\n\r\nWe'll query for the Hutt species and resolve it's homeworld.\r\n\r\nThis query combines data from `species.csv` and `planets.csv`.",
                "lastEvaluationDate": "2020-07-25T16:24:26.935+10:00",
                "output": [],
                "errors": [],
                "height": 167
            },
            {
                "id": "7ca27fe0-ce3e-11ea-b5f6-afabb4b56228",
                "cellType": "code",
                "cellScope": "global",
                "code": "const query = {\r\n    get: {\r\n        species: { // Query for \"species\" entity.\r\n            args: {\r\n                name: \"Hutt\", // Gets the one species that matches this name.\r\n            },\r\n            resolve: {\r\n                homeworld: { // Resolves the homeworld of the species as a nested lookup.\r\n                },\r\n            },\r\n        },\r\n    },\r\n};\r\n\r\nconst { miniql } = require(\"miniql\");\r\n\r\n// Execute the query against the data.\r\nconst result = await miniql(query, queryResolver, {});\r\n\r\n// Displays the query result.\r\ndisplay(result);",
                "lastEvaluationDate": "2020-07-25T16:19:31.902+10:00",
                "output": [
                    {
                        "value": {
                            "displayType": "object",
                            "data": {
                                "species": {
                                    "name": "Hutt",
                                    "classification": "gastropod",
                                    "designation": "sentient",
                                    "average_height": 300,
                                    "skin_colors": "green, brown, tan",
                                    "hair_colors": "NA",
                                    "eye_colors": "yellow, red",
                                    "average_lifespan": 1000,
                                    "language": "Huttese",
                                    "homeworld": {
                                        "name": "Nal Hutta",
                                        "rotation_period": 87,
                                        "orbital_period": 413,
                                        "diameter": 12150,
                                        "climate": "temperate",
                                        "gravity": "1 standard",
                                        "terrain": "urban, oceans, swamps, bogs",
                                        "surface_water": "NA",
                                        "population": 7000000000
                                    }
                                }
                            }
                        }
                    }
                ],
                "errors": [],
                "height": 441
            },
            {
                "id": "89082cd0-ce3e-11ea-b5f6-afabb4b56228",
                "cellType": "markdown",
                "code": "### Get all species and their homeworlds\r\n\r\nThis time we'll query for all species and resolve the homeworld for each one.\r\n\r\nThis query combines data from `species.csv` and `planets.csv`.",
                "lastEvaluationDate": "2020-07-25T16:24:26.935+10:00",
                "output": [],
                "errors": [],
                "height": 123
            },
            {
                "id": "9f3c12f0-ce3e-11ea-b5f6-afabb4b56228",
                "cellType": "code",
                "cellScope": "global",
                "code": "const query = {\r\n    get: {\r\n        species: { // Query for \"species\" entity.\r\n\r\n            // No arguments gets all entities.\r\n\r\n            resolve: {\r\n                homeworld: { // Resolves the homeworld of each species as a nested lookup.\r\n                },\r\n            },\r\n        },\r\n    },\r\n};\r\n\r\nconst { miniql } = require(\"miniql\");\r\n\r\n// Execute the query against the data.\r\nconst result = await miniql(query, queryResolver, {});\r\n\r\n// Displays the query result.\r\ndisplay(result);",
                "lastEvaluationDate": "2020-07-25T16:19:31.961+10:00",
                "output": [
                    {
                        "value": {
                            "displayType": "object",
                            "data": {
                                "species": [
                                    {
                                        "name": "Hutt",
                                        "classification": "gastropod",
                                        "designation": "sentient",
                                        "average_height": 300,
                                        "skin_colors": "green, brown, tan",
                                        "hair_colors": "NA",
                                        "eye_colors": "yellow, red",
                                        "average_lifespan": 1000,
                                        "language": "Huttese",
                                        "homeworld": {
                                            "name": "Nal Hutta",
                                            "rotation_period": 87,
                                            "orbital_period": 413,
                                            "diameter": 12150,
                                            "climate": "temperate",
                                            "gravity": "1 standard",
                                            "terrain": "urban, oceans, swamps, bogs",
                                            "surface_water": "NA",
                                            "population": 7000000000
                                        }
                                    },
                                    {
                                        "name": "Yoda's species",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 66,
                                        "skin_colors": "green, yellow",
                                        "hair_colors": "brown, white",
                                        "eye_colors": "brown, green, yellow",
                                        "average_lifespan": 900,
                                        "language": "Galactic basic",
                                        "homeworld": {
                                            "name": "NA",
                                            "rotation_period": 0,
                                            "orbital_period": 0,
                                            "diameter": 0,
                                            "climate": "NA",
                                            "gravity": "NA",
                                            "terrain": "NA",
                                            "surface_water": "NA",
                                            "population": "NA"
                                        }
                                    },
                                    {
                                        "name": "Trandoshan",
                                        "classification": "reptile",
                                        "designation": "sentient",
                                        "average_height": 200,
                                        "skin_colors": "brown, green",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow, orange",
                                        "average_lifespan": "NA",
                                        "language": "Dosh",
                                        "homeworld": {
                                            "name": "Trandosha",
                                            "rotation_period": 25,
                                            "orbital_period": 371,
                                            "diameter": 0,
                                            "climate": "arid",
                                            "gravity": "0.62 standard",
                                            "terrain": "mountains, seas, grasslands, deserts",
                                            "surface_water": "NA",
                                            "population": 42000000
                                        }
                                    },
                                    {
                                        "name": "Mon Calamari",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 160,
                                        "skin_colors": "red, blue, brown, magenta",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": "NA",
                                        "language": "Mon Calamarian",
                                        "homeworld": {
                                            "name": "Mon Cala",
                                            "rotation_period": 21,
                                            "orbital_period": 398,
                                            "diameter": 11030,
                                            "climate": "temperate",
                                            "gravity": 1,
                                            "terrain": "oceans, reefs, islands",
                                            "surface_water": 100,
                                            "population": 27000000000
                                        }
                                    },
                                    {
                                        "name": "Ewok",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 100,
                                        "skin_colors": "brown",
                                        "hair_colors": "white, brown, black",
                                        "eye_colors": "orange, brown",
                                        "average_lifespan": "NA",
                                        "language": "Ewokese",
                                        "homeworld": {
                                            "name": "Endor",
                                            "rotation_period": 18,
                                            "orbital_period": 402,
                                            "diameter": 4900,
                                            "climate": "temperate",
                                            "gravity": "0.85 standard",
                                            "terrain": "forests, mountains, lakes",
                                            "surface_water": 8,
                                            "population": 30000000
                                        }
                                    },
                                    {
                                        "name": "Sullustan",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "pale",
                                        "hair_colors": "none",
                                        "eye_colors": "black",
                                        "average_lifespan": "NA",
                                        "language": "Sullutese",
                                        "homeworld": {
                                            "name": "Sullust",
                                            "rotation_period": 20,
                                            "orbital_period": 263,
                                            "diameter": 12780,
                                            "climate": "superheated",
                                            "gravity": 1,
                                            "terrain": "mountains, volcanoes, rocky deserts",
                                            "surface_water": 5,
                                            "population": 18500000000
                                        }
                                    },
                                    {
                                        "name": "Neimodian",
                                        "classification": "NA",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "grey, green",
                                        "hair_colors": "none",
                                        "eye_colors": "red, pink",
                                        "average_lifespan": "NA",
                                        "language": "Neimoidia",
                                        "homeworld": {
                                            "name": "Cato Neimoidia",
                                            "rotation_period": 25,
                                            "orbital_period": 278,
                                            "diameter": 0,
                                            "climate": "temperate, moist",
                                            "gravity": "1 standard",
                                            "terrain": "mountains, fields, forests, rock arches",
                                            "surface_water": "NA",
                                            "population": 10000000
                                        }
                                    },
                                    {
                                        "name": "Gungan",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 190,
                                        "skin_colors": "brown, green",
                                        "hair_colors": "none",
                                        "eye_colors": "orange",
                                        "average_lifespan": "NA",
                                        "language": "Gungan basic",
                                        "homeworld": {
                                            "name": "Naboo",
                                            "rotation_period": 26,
                                            "orbital_period": 312,
                                            "diameter": 12120,
                                            "climate": "temperate",
                                            "gravity": "1 standard",
                                            "terrain": "grassy hills, swamps, forests, mountains",
                                            "surface_water": 12,
                                            "population": 4500000000
                                        }
                                    },
                                    {
                                        "name": "Toydarian",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 120,
                                        "skin_colors": "blue, green, grey",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": 91,
                                        "language": "Toydarian",
                                        "homeworld": {
                                            "name": "Toydaria",
                                            "rotation_period": 21,
                                            "orbital_period": 184,
                                            "diameter": 7900,
                                            "climate": "temperate",
                                            "gravity": 1,
                                            "terrain": "swamps, lakes",
                                            "surface_water": "NA",
                                            "population": 11000000
                                        }
                                    },
                                    {
                                        "name": "Dug",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 100,
                                        "skin_colors": "brown, purple, grey, red",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow, blue",
                                        "average_lifespan": "NA",
                                        "language": "Dugese",
                                        "homeworld": {
                                            "name": "Malastare",
                                            "rotation_period": 26,
                                            "orbital_period": 201,
                                            "diameter": 18880,
                                            "climate": "arid, temperate, tropical",
                                            "gravity": 1.56,
                                            "terrain": "swamps, deserts, jungles, mountains",
                                            "surface_water": "NA",
                                            "population": 2000000000
                                        }
                                    },
                                    {
                                        "name": "Twi'lek",
                                        "classification": "mammals",
                                        "designation": "sentient",
                                        "average_height": 200,
                                        "skin_colors": "orange, yellow, blue, green, pink, purple, tan",
                                        "hair_colors": "none",
                                        "eye_colors": "blue, brown, orange, pink",
                                        "average_lifespan": "NA",
                                        "language": "Twi'leki",
                                        "homeworld": {
                                            "name": "Ryloth",
                                            "rotation_period": 30,
                                            "orbital_period": 305,
                                            "diameter": 10600,
                                            "climate": "temperate, arid, subartic",
                                            "gravity": 1,
                                            "terrain": "mountains, valleys, deserts, tundra",
                                            "surface_water": 5,
                                            "population": 1500000000
                                        }
                                    },
                                    {
                                        "name": "Aleena",
                                        "classification": "reptile",
                                        "designation": "sentient",
                                        "average_height": 80,
                                        "skin_colors": "blue, gray",
                                        "hair_colors": "none",
                                        "eye_colors": "NA",
                                        "average_lifespan": 79,
                                        "language": "Aleena",
                                        "homeworld": {
                                            "name": "Aleen Minor",
                                            "rotation_period": "NA",
                                            "orbital_period": "NA",
                                            "diameter": "NA",
                                            "climate": "NA",
                                            "gravity": "NA",
                                            "terrain": "NA",
                                            "surface_water": "NA",
                                            "population": "NA"
                                        }
                                    },
                                    {
                                        "name": "Vulptereen",
                                        "classification": "NA",
                                        "designation": "sentient",
                                        "average_height": 100,
                                        "skin_colors": "grey",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": "NA",
                                        "language": "vulpterish",
                                        "homeworld": {
                                            "name": "Vulpter",
                                            "rotation_period": 22,
                                            "orbital_period": 391,
                                            "diameter": 14900,
                                            "climate": "temperate, artic",
                                            "gravity": 1,
                                            "terrain": "urban, barren",
                                            "surface_water": "NA",
                                            "population": 421000000
                                        }
                                    },
                                    {
                                        "name": "Xexto",
                                        "classification": "NA",
                                        "designation": "sentient",
                                        "average_height": 125,
                                        "skin_colors": "grey, yellow, purple",
                                        "hair_colors": "none",
                                        "eye_colors": "black",
                                        "average_lifespan": "NA",
                                        "language": "Xextese",
                                        "homeworld": {
                                            "name": "Troiken",
                                            "rotation_period": "NA",
                                            "orbital_period": "NA",
                                            "diameter": "NA",
                                            "climate": "NA",
                                            "gravity": "NA",
                                            "terrain": "desert, tundra, rainforests, mountains",
                                            "surface_water": "NA",
                                            "population": "NA"
                                        }
                                    },
                                    {
                                        "name": "Toong",
                                        "classification": "NA",
                                        "designation": "sentient",
                                        "average_height": 200,
                                        "skin_colors": "grey, green, yellow",
                                        "hair_colors": "none",
                                        "eye_colors": "orange",
                                        "average_lifespan": "NA",
                                        "language": "Tundan",
                                        "homeworld": {
                                            "name": "Tund",
                                            "rotation_period": 48,
                                            "orbital_period": 1770,
                                            "diameter": 12190,
                                            "climate": "NA",
                                            "gravity": "NA",
                                            "terrain": "barren, ash",
                                            "surface_water": "NA",
                                            "population": 0
                                        }
                                    },
                                    {
                                        "name": "Cerean",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 200,
                                        "skin_colors": "pale pink",
                                        "hair_colors": "red, blond, black, white",
                                        "eye_colors": "hazel",
                                        "average_lifespan": "NA",
                                        "language": "Cerean",
                                        "homeworld": {
                                            "name": "Cerea",
                                            "rotation_period": 27,
                                            "orbital_period": 386,
                                            "diameter": "NA",
                                            "climate": "temperate",
                                            "gravity": 1,
                                            "terrain": "verdant",
                                            "surface_water": 20,
                                            "population": 450000000
                                        }
                                    },
                                    {
                                        "name": "Nautolan",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "green, blue, brown, red",
                                        "hair_colors": "none",
                                        "eye_colors": "black",
                                        "average_lifespan": 70,
                                        "language": "Nautila",
                                        "homeworld": {
                                            "name": "Glee Anselm",
                                            "rotation_period": 33,
                                            "orbital_period": 206,
                                            "diameter": 15600,
                                            "climate": "tropical, temperate",
                                            "gravity": 1,
                                            "terrain": "lakes, islands, swamps, seas",
                                            "surface_water": 80,
                                            "population": 500000000
                                        }
                                    },
                                    {
                                        "name": "Zabrak",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "pale, brown, red, orange, yellow",
                                        "hair_colors": "black",
                                        "eye_colors": "brown, orange",
                                        "average_lifespan": "NA",
                                        "language": "Zabraki",
                                        "homeworld": {
                                            "name": "Iridonia",
                                            "rotation_period": 29,
                                            "orbital_period": 413,
                                            "diameter": "NA",
                                            "climate": "NA",
                                            "gravity": "NA",
                                            "terrain": "rocky canyons, acid pools",
                                            "surface_water": "NA",
                                            "population": "NA"
                                        }
                                    },
                                    {
                                        "name": "Tholothian",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": "NA",
                                        "skin_colors": "dark",
                                        "hair_colors": "NA",
                                        "eye_colors": "blue, indigo",
                                        "average_lifespan": "NA",
                                        "language": "NA",
                                        "homeworld": {
                                            "name": "Tholoth",
                                            "rotation_period": "NA",
                                            "orbital_period": "NA",
                                            "diameter": "NA",
                                            "climate": "NA",
                                            "gravity": "NA",
                                            "terrain": "NA",
                                            "surface_water": "NA",
                                            "population": "NA"
                                        }
                                    },
                                    {
                                        "name": "Iktotchi",
                                        "classification": "NA",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "pink",
                                        "hair_colors": "none",
                                        "eye_colors": "orange",
                                        "average_lifespan": "NA",
                                        "language": "Iktotchese",
                                        "homeworld": {
                                            "name": "Iktotch",
                                            "rotation_period": 22,
                                            "orbital_period": 481,
                                            "diameter": "NA",
                                            "climate": "arid, rocky, windy",
                                            "gravity": 1,
                                            "terrain": "rocky",
                                            "surface_water": "NA",
                                            "population": "NA"
                                        }
                                    },
                                    {
                                        "name": "Quermian",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 240,
                                        "skin_colors": "white",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": 86,
                                        "language": "Quermian",
                                        "homeworld": {
                                            "name": "Quermia",
                                            "rotation_period": "NA",
                                            "orbital_period": "NA",
                                            "diameter": "NA",
                                            "climate": "NA",
                                            "gravity": "NA",
                                            "terrain": "NA",
                                            "surface_water": "NA",
                                            "population": "NA"
                                        }
                                    },
                                    {
                                        "name": "Kel Dor",
                                        "classification": "NA",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "peach, orange, red",
                                        "hair_colors": "none",
                                        "eye_colors": "black, silver",
                                        "average_lifespan": 70,
                                        "language": "Kel Dor",
                                        "homeworld": {
                                            "name": "Dorin",
                                            "rotation_period": 22,
                                            "orbital_period": 409,
                                            "diameter": 13400,
                                            "climate": "temperate",
                                            "gravity": 1,
                                            "terrain": "NA",
                                            "surface_water": "NA",
                                            "population": "NA"
                                        }
                                    },
                                    {
                                        "name": "Chagrian",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 190,
                                        "skin_colors": "blue",
                                        "hair_colors": "none",
                                        "eye_colors": "blue",
                                        "average_lifespan": "NA",
                                        "language": "Chagria",
                                        "homeworld": {
                                            "name": "Champala",
                                            "rotation_period": 27,
                                            "orbital_period": 318,
                                            "diameter": "NA",
                                            "climate": "temperate",
                                            "gravity": 1,
                                            "terrain": "oceans, rainforests, plateaus",
                                            "surface_water": "NA",
                                            "population": 3500000000
                                        }
                                    },
                                    {
                                        "name": "Geonosian",
                                        "classification": "insectoid",
                                        "designation": "sentient",
                                        "average_height": 178,
                                        "skin_colors": "green, brown",
                                        "hair_colors": "none",
                                        "eye_colors": "green, hazel",
                                        "average_lifespan": "NA",
                                        "language": "Geonosian",
                                        "homeworld": {
                                            "name": "Geonosis",
                                            "rotation_period": 30,
                                            "orbital_period": 256,
                                            "diameter": 11370,
                                            "climate": "temperate, arid",
                                            "gravity": "0.9 standard",
                                            "terrain": "rock, desert, mountain, barren",
                                            "surface_water": 5,
                                            "population": 100000000000
                                        }
                                    },
                                    {
                                        "name": "Mirialan",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "yellow, green",
                                        "hair_colors": "black, brown",
                                        "eye_colors": "blue, green, red, yellow, brown, orange",
                                        "average_lifespan": "NA",
                                        "language": "Mirialan",
                                        "homeworld": {
                                            "name": "Mirial",
                                            "rotation_period": "NA",
                                            "orbital_period": "NA",
                                            "diameter": "NA",
                                            "climate": "NA",
                                            "gravity": "NA",
                                            "terrain": "deserts",
                                            "surface_water": "NA",
                                            "population": "NA"
                                        }
                                    },
                                    {
                                        "name": "Clawdite",
                                        "classification": "reptilian",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "green, yellow",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": 70,
                                        "language": "Clawdite",
                                        "homeworld": {
                                            "name": "Zolan",
                                            "rotation_period": "NA",
                                            "orbital_period": "NA",
                                            "diameter": "NA",
                                            "climate": "NA",
                                            "gravity": "NA",
                                            "terrain": "NA",
                                            "surface_water": "NA",
                                            "population": "NA"
                                        }
                                    },
                                    {
                                        "name": "Besalisk",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 178,
                                        "skin_colors": "brown",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": 75,
                                        "language": "besalisk",
                                        "homeworld": {
                                            "name": "Ojom",
                                            "rotation_period": "NA",
                                            "orbital_period": "NA",
                                            "diameter": "NA",
                                            "climate": "frigid",
                                            "gravity": "NA",
                                            "terrain": "oceans, glaciers",
                                            "surface_water": 100,
                                            "population": 500000000
                                        }
                                    },
                                    {
                                        "name": "Kaminoan",
                                        "classification": "amphibian",
                                        "designation": "sentient",
                                        "average_height": 220,
                                        "skin_colors": "grey, blue",
                                        "hair_colors": "none",
                                        "eye_colors": "black",
                                        "average_lifespan": 80,
                                        "language": "Kaminoan",
                                        "homeworld": {
                                            "name": "Kamino",
                                            "rotation_period": 27,
                                            "orbital_period": 463,
                                            "diameter": 19720,
                                            "climate": "temperate",
                                            "gravity": "1 standard",
                                            "terrain": "ocean",
                                            "surface_water": 100,
                                            "population": 1000000000
                                        }
                                    },
                                    {
                                        "name": "Skakoan",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": "NA",
                                        "skin_colors": "grey, green",
                                        "hair_colors": "none",
                                        "eye_colors": "NA",
                                        "average_lifespan": "NA",
                                        "language": "Skakoan",
                                        "homeworld": {
                                            "name": "Skako",
                                            "rotation_period": 27,
                                            "orbital_period": 384,
                                            "diameter": "NA",
                                            "climate": "temperate",
                                            "gravity": 1,
                                            "terrain": "urban, vines",
                                            "surface_water": "NA",
                                            "population": 500000000000
                                        }
                                    },
                                    {
                                        "name": "Muun",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 190,
                                        "skin_colors": "grey, white",
                                        "hair_colors": "none",
                                        "eye_colors": "black",
                                        "average_lifespan": 100,
                                        "language": "Muun",
                                        "homeworld": {
                                            "name": "Muunilinst",
                                            "rotation_period": 28,
                                            "orbital_period": 412,
                                            "diameter": 13800,
                                            "climate": "temperate",
                                            "gravity": 1,
                                            "terrain": "plains, forests, hills, mountains",
                                            "surface_water": 25,
                                            "population": 5000000000
                                        }
                                    },
                                    {
                                        "name": "Togruta",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "red, white, orange, yellow, green, blue",
                                        "hair_colors": "none",
                                        "eye_colors": "red, orange, yellow, green, blue, black",
                                        "average_lifespan": 94,
                                        "language": "Togruti",
                                        "homeworld": {
                                            "name": "Shili",
                                            "rotation_period": "NA",
                                            "orbital_period": "NA",
                                            "diameter": "NA",
                                            "climate": "temperate",
                                            "gravity": 1,
                                            "terrain": "cities, savannahs, seas, plains",
                                            "surface_water": "NA",
                                            "population": "NA"
                                        }
                                    },
                                    {
                                        "name": "Kaleesh",
                                        "classification": "reptile",
                                        "designation": "sentient",
                                        "average_height": 170,
                                        "skin_colors": "brown, orange, tan",
                                        "hair_colors": "none",
                                        "eye_colors": "yellow",
                                        "average_lifespan": 80,
                                        "language": "Kaleesh",
                                        "homeworld": {
                                            "name": "Kalee",
                                            "rotation_period": 23,
                                            "orbital_period": 378,
                                            "diameter": 13850,
                                            "climate": "arid, temperate, tropical",
                                            "gravity": 1,
                                            "terrain": "rainforests, cliffs, canyons, seas",
                                            "surface_water": "NA",
                                            "population": 4000000000
                                        }
                                    },
                                    {
                                        "name": "Pau'an",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 190,
                                        "skin_colors": "grey",
                                        "hair_colors": "none",
                                        "eye_colors": "black",
                                        "average_lifespan": 700,
                                        "language": "Utapese",
                                        "homeworld": {
                                            "name": "Utapau",
                                            "rotation_period": 27,
                                            "orbital_period": 351,
                                            "diameter": 12900,
                                            "climate": "temperate, arid, windy",
                                            "gravity": "1 standard",
                                            "terrain": "scrublands, savanna, canyons, sinkholes",
                                            "surface_water": 0.9,
                                            "population": 95000000
                                        }
                                    },
                                    {
                                        "name": "Wookiee",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 210,
                                        "skin_colors": "gray",
                                        "hair_colors": "black, brown",
                                        "eye_colors": "blue, green, yellow, brown, golden, red",
                                        "average_lifespan": 400,
                                        "language": "Shyriiwook",
                                        "homeworld": {
                                            "name": "Kashyyyk",
                                            "rotation_period": 26,
                                            "orbital_period": 381,
                                            "diameter": 12765,
                                            "climate": "tropical",
                                            "gravity": "1 standard",
                                            "terrain": "jungle, forests, lakes, rivers",
                                            "surface_water": 60,
                                            "population": 45000000
                                        }
                                    },
                                    {
                                        "name": "Droid",
                                        "classification": "artificial",
                                        "designation": "sentient",
                                        "average_height": "NA",
                                        "skin_colors": "NA",
                                        "hair_colors": "NA",
                                        "eye_colors": "NA",
                                        "average_lifespan": "indefinite",
                                        "language": "NA",
                                        "homeworld": {
                                            "name": "NA",
                                            "rotation_period": 0,
                                            "orbital_period": 0,
                                            "diameter": 0,
                                            "climate": "NA",
                                            "gravity": "NA",
                                            "terrain": "NA",
                                            "surface_water": "NA",
                                            "population": "NA"
                                        }
                                    },
                                    {
                                        "name": "Human",
                                        "classification": "mammal",
                                        "designation": "sentient",
                                        "average_height": 180,
                                        "skin_colors": "caucasian, black, asian, hispanic",
                                        "hair_colors": "blonde, brown, black, red",
                                        "eye_colors": "brown, blue, green, hazel, grey, amber",
                                        "average_lifespan": 120,
                                        "language": "Galactic Basic",
                                        "homeworld": {
                                            "name": "Coruscant",
                                            "rotation_period": 24,
                                            "orbital_period": 368,
                                            "diameter": 12240,
                                            "climate": "temperate",
                                            "gravity": "1 standard",
                                            "terrain": "cityscape, mountains",
                                            "surface_water": "NA",
                                            "population": 1000000000000
                                        }
                                    },
                                    {
                                        "name": "Rodian",
                                        "classification": "sentient",
                                        "designation": "reptilian",
                                        "average_height": 170,
                                        "skin_colors": "green, blue",
                                        "hair_colors": "NA",
                                        "eye_colors": "black",
                                        "average_lifespan": "NA",
                                        "language": "Galactic Basic",
                                        "homeworld": {
                                            "name": "Rodia",
                                            "rotation_period": 29,
                                            "orbital_period": 305,
                                            "diameter": 7549,
                                            "climate": "hot",
                                            "gravity": "1 standard",
                                            "terrain": "jungles, oceans, urban, swamps",
                                            "surface_water": 60,
                                            "population": 1300000000
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ],
                "errors": [],
                "height": 441
            },
            {
                "id": "2cf2e9c0-ce3f-11ea-b5f6-afabb4b56228",
                "cellType": "markdown",
                "code": "### Get all planets and their species\r\n\r\nThis query is in reverse to the last one.\r\n\r\nWe are finding all planets the resolving the species that orginate from each one.",
                "lastEvaluationDate": "2020-07-25T16:24:26.935+10:00",
                "output": [],
                "errors": [],
                "height": 123
            },
            {
                "id": "5693f4e0-ce3f-11ea-b5f6-afabb4b56228",
                "cellType": "code",
                "cellScope": "global",
                "code": "const query = {\r\n    get: {\r\n        planet: {  // Query for \"planet\" entity.\r\n\r\n            // No arguments gets all entities.\r\n\r\n            resolve: {\r\n                species: { // Gets all the species related to to each planet.\r\n                },\r\n            },\r\n        },\r\n    },\r\n};\r\n\r\nconst { miniql } = require(\"miniql\");\r\n\r\n// Execute the query against the data.\r\nconst result = await miniql(query, queryResolver, {});\r\n\r\n// Displays the query result.\r\ndisplay(result);",
                "lastEvaluationDate": "2020-07-25T16:24:26.935+10:00",
                "output": [],
                "errors": [],
                "height": 441
            },
            {
                "id": "621fe3a0-ce3f-11ea-b5f6-afabb4b56228",
                "cellType": "markdown",
                "code": "## Looking for more examples?\r\n\r\nVisit [the MiniQL code repo on GitHub](https://github.com/miniql/miniql) for links to more resources.",
                "lastEvaluationDate": "2020-07-25T16:24:26.935+10:00",
                "output": [],
                "errors": [],
                "height": 91
            }
        ]
    }
};