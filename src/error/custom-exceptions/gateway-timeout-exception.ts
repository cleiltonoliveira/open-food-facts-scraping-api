export default class GatewayTimeoutException extends Error {
    constructor(mensagem: any) {
        super(mensagem);
        this.name = 'GatewayTimeoutException';
    }
}