"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const app_module_1 = require("./app.module");
const folderPath = path.join(process.cwd(), 'logs');
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
}
const logStream = fs.createWriteStream(path.join(folderPath, 'api.log'), {
    flags: 'a',
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(morgan('combined', { stream: logStream }));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map