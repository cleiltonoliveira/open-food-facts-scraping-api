export default class BadGatewayException extends Error {
    constructor(mensagem: any) {
        super(mensagem);
        this.name = 'BadGatewayException';
    }
}