"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationError_1 = __importDefault(require("../../errors/ConfigurationError"));
const index_1 = __importDefault(require("../../index"));
const runnerUtils_1 = require("../../utils/runnerUtils");
const execs_1 = __importDefault(require("./execs"));
class PostgresRunner {
    constructor(config) {
        this.setup = async () => {
            const composeFile = index_1.default.config.dockest.dockerComposeFilePath;
            const containerId = await this.postgresExec.start(this.config, composeFile);
            this.containerId = containerId;
            await this.postgresExec.checkHealth(containerId, this.config);
        };
        this.teardown = async () => this.postgresExec.teardown(this.containerId);
        this.getHelpers = async () => ({
            clear: () => true,
            loadData: () => true,
        });
        this.validatePostgresConfig = (config) => {
            const { service, host, db, port, password, username } = config;
            const requiredProps = { service, host, db, port, password, username };
            runnerUtils_1.validateInputFields('postgres', requiredProps);
            if (!config) {
                throw new ConfigurationError_1.default('Missing configuration for Postgres runner');
            }
        };
        this.validatePostgresConfig(config);
        this.config = config;
        this.postgresExec = new execs_1.default();
    }
}
exports.PostgresRunner = PostgresRunner;
exports.default = PostgresRunner;
