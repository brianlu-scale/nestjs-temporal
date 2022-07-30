"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientProviders = exports.buildClient = void 0;
const client_1 = require("@temporalio/client");
const utils_1 = require("./utils");
function buildClient(option) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('logging options here');
        console.log(option);
        const connection = yield client_1.Connection.connect(option.connection);
        console.log('connection options');
        console.log(option.connection);
        console.log('client options');
        console.log(Object.assign(Object.assign({}, option.workflowOptions), { connection }));
        const client = new client_1.WorkflowClient(Object.assign(Object.assign({}, option.workflowOptions), { connection }));
        connection.onApplicationShutdown = function () {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.close();
            });
        };
        console.log('client has been built');
        console.log(connection);
        console.log(client);
        console.log(yield connection.ensureConnected());
        return client;
    });
}
exports.buildClient = buildClient;
function createClientProviders(options) {
    return options.map((option) => ({
        provide: (0, utils_1.getQueueToken)(option && option.name ? option.name : undefined),
        useFactory: () => __awaiter(this, void 0, void 0, function* () {
            return yield buildClient(option || {});
        }),
    }));
}
exports.createClientProviders = createClientProviders;
