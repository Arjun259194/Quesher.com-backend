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
exports.AwaitReqBodyParser = void 0;
function AwaitReqBodyParser(schema, callback) {
    return (req, res) => __awaiter(this, void 0, void 0, function* () {
        const parsedBody = schema.safeParse(req.body);
        if (!parsedBody.success)
            return res.status(400).send(parsedBody.error.message);
        return yield callback(req, res);
    });
}
exports.AwaitReqBodyParser = AwaitReqBodyParser;
