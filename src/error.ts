import Koa from 'koa';

export function bodyParserError(err: any, ctx: Koa.Context) {
    console.error(err.message || err);
    ctx.throw(422, err.message || err)
}

export async function error(error: Error, ctx: Koa.Context) {
    console.error(`Server error on ${ctx.req.method} ${ctx.req.url}: ${error.message}`);
}