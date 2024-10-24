import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express'; // Cambiado aquí

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private readonly MAX_SIZE = 200 * 1024; // 200 KB
  private readonly ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  transform(file: Express.Multer.File) { // Cambiado aquí
    if (file.size > this.MAX_SIZE) {
      throw new BadRequestException('El tamaño de la imagen no debe exceder los 200 KB.');
    }

    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de imagen no permitido. Solo se permiten JPEG, PNG y GIF.');
    }

    return file; // Si pasa la validación, se devuelve el archivo
  }
}
