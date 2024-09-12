export class History {
    constructor(
        public plu: number,
        public action: string,
        public shopId?: number,
        public date?: Date,
    ) { }
}