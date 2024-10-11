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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
const axios_1 = __importDefault(require("axios"));
// Função para obter o token de acesso usando variáveis de ambiente
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const client_id = process.env.PLUGGTO_CLIENT_ID;
        const client_secret = process.env.PLUGGTO_CLIENT_SECRET;
        const username = process.env.PLUGGTO_USERNAME;
        const password = process.env.PLUGGTO_PASSWORD;
        const apiUrl = process.env.PLUGGTO_URL || 'https://api.plugg.to';
        const url = `${apiUrl}/oauth/token`;
        const data = new URLSearchParams({
            grant_type: 'password',
            client_id: client_id,
            client_secret: client_secret,
            username: username,
            password: password,
        });
        try {
            const response = yield axios_1.default.post(url, data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            return response.data.access_token; // Retorna o token de acesso
        }
        catch (error) {
            console.error('Erro ao obter token de acesso:', error);
            return null;
        }
    });
}
exports.getAccessToken = getAccessToken;
