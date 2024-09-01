import { Controller, Get } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { Describe, DESCRIBE_KEY } from 'src/_decorator/describe';
import { ControllerInfo } from './dto/meta.dto';

let allControllerInfo: ControllerInfo[] | undefined;

/**
 * 权限管理
 */
@Controller('meta')
@Describe('权限管理')
export class MetaController {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * 获取所有权限信息
   * @returns 权限信息
   */
  @Get()
  @Describe('所有权限信息')
  allMetaData(): ControllerInfo[] {
    if (allControllerInfo) return allControllerInfo;
    const controllers = this.discoveryService.getControllers();
    const result: ControllerInfo[] = [];

    controllers.forEach((controller) => {
      const name = controller.name;
      const describe = this.reflector.get(DESCRIBE_KEY, controller.metatype);
      if (!describe) return;
      const methods = Object.getOwnPropertyNames(controller.metatype.prototype);
      const resMethods = methods
        .map((method) => {
          if (method !== 'constructor') {
            const methodDescribe = Reflect.getMetadata(
              DESCRIBE_KEY,
              controller.metatype.prototype[method],
            );
            if (methodDescribe)
              return {
                name: method,
                describe: methodDescribe,
                context: `${name}/${method}`,
              };
          }
        })
        .filter(Boolean) as ControllerInfo['methods'];
      result.push({ name, describe, methods: resMethods, context: name });
    });

    allControllerInfo = result;

    return result;
  }
}
