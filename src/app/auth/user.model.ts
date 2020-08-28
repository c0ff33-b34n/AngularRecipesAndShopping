export class User {
    constructor(
        public email: string,
        public id: string,
        private Token: string,
        private TokenExpirationDate: Date) {}

    get token() {
        if (!this.TokenExpirationDate || new Date() > this.TokenExpirationDate) {
            return null;
        }
        return this.Token;
    }
}
