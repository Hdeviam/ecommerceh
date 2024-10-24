import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const swaggerConfig = new DocumentBuilder()
    .setTitle('PI Cohorte 54')
    .setDescription("This is the final project from Henry")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

    const document = SwaggerModule.createDocument(app,swaggerConfig)
    SwaggerModule.setup('api', app, document);



    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true, // Para prohibir propiedades no permitidas
        transform: true, // Para transformar el objeto de entrada a la clase DTO
    }));
    await app.listen(3000);
}
bootstrap();
