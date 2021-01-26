/*
# Copyright 2020 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#            http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/
"use strict";
const Dumper = require('dumper').dumper;
const CloudStorage = require('lib/cloud-storage.js');
const logger = require('lib/winston.js');

//const { LOGGING_TRACE_KEY } = require('@google-cloud/logging-winston/build/src/common');

module.exports = class AppConfig {
    CONFIG_FILENAME="config.json"

    /**
   * @param {{ [x: string]: any; accessToken?: any; projectId: any; locationId?: any; bucketName: any; }} options
   */
    constructor(options) {
        this.gcs = new CloudStorage(options);   
        logger.info(JSON.stringify(options))
    }

    async getConfig()
    {
        logger.info(`Getting ${this.CONFIG_FILENAME}`)
        if (await this.gcs.fileExists(this.CONFIG_FILENAME)) {
            logger.info("Found config")
            var data = await this.gcs.readDocument(this.CONFIG_FILENAME);
            try {
                var jsonData = JSON.parse(data)
            } catch (e) {
                // Dumper(jsonData)
                //logger.error(JSON.stringify(jsonData))
                logger.error("Parse error, cannot parse config file. getting default")
                console.log("Parse error, cannot parse config file. getting default")
                return this.defaultConfig
            }
            //Dumper(jsonData)
            logger.error(JSON.stringify(jsonData))
            return jsonData
        } else {
            console.log(`${this.CONFIG_FILENAME} not found, returning default config`)
            //logger.info("Not found, returning default config")
            return this.defaultConfig
        }
    }


    async saveConfig(configIn)
    {   
        function isString (obj) {return (Object.prototype.toString.call(obj) === '[object String]');}
        var config = configIn

        if (isString(configIn)) {
            config = JSON.parse(configIn)
        }

        //TODO: implement json validation! for now do it really dirty and nasty
        if (config.hasOwnProperty('menuItems'))
        {
            if (config.menuItems.length > 2)
            {
                if (config.menuItems[0].color &&
                    config.menuItems[0].text)
                {
                    return this.gcs.writeDocument(this.CONFIG_FILENAME,JSON.stringify(config))    
                }                
            }
        }

        //console.error("Invalid Config. ")
        logger.error("Invalid Config.")
        Dumper(config)
        throw new Error("Cannot Save. Invalid Config")        
    }    

    defaultConfig = {
        defaultModelName: "test_model_1",
        menuItems : [
            {
              text:"Problem",
              color: "#F2D7D5",
              wordLabelModelName: "problem_model_1",
              wordLabels: [
                {
                    text:"Problem Generic",
                    color: "orange"
                },
                {
                    text:"Problem Specific",
                    color: "green"
                }   
                ]
              },
            {
              text:"Cause",
              color: "#EBDEF0"
            },
            {
              text:"Remediation",
              color: "#D4E6F1"
            }      
        ]  
    }
}