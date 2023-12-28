import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { WsAdapter } from "@nestjs/platform-ws";
import fastifyCookie from '@fastify/cookie';
import { AuthService } from "./auth/auth.service";
import { AppModule } from "./app.module";

async function bootstrap() : Promise<{ app: NestFastifyApplication, authToken: string }> {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({ trustProxy: true })
    );

    await app.register(fastifyCookie, {
        secret: 'my-secret'
    });

    app.useWebSocketAdapter(new WsAdapter(app));

    app.setGlobalPrefix("api")

    app.enableCors({
        allowedHeaders: "*",
        origin: "*",
    });

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1",
    });


    await app.listen(3001);
    return {
        app,
        authToken: app.get(AuthService).authToken
    };
}
export default bootstrap;
