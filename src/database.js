const moongose = require("mongoose");
const configObject = require("./config/env.config");
const winston = require("winston");

class DataBase {
  static #instance;
  constructor() {
    moongose.connect(configObject.server.mongo_url);
  }
  static getInstance() {
    try {
      if (this.#instance) return this.#instance;
      this.#instance = new DataBase();
      winston.info("mongoDB connected succesfully");
    } catch (error) {
      winston.error(error);
    }
  }
}

module.exports = DataBase.getInstance();