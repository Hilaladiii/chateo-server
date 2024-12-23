import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { JwtGuard } from 'src/common/guards/jwt-guard/jwt-guard.guard';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { SaveContactDto } from './dtos/save-contact.dto';
import { Message } from 'src/common/decorators/message.decorator';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  @Message('Success get contact user')
  @UseGuards(JwtGuard)
  async getUserContact(@GetCurrentUserId() id: string) {
    return this.contactService.getUserContact(id);
  }

  @Get('/user')
  @Message('Success find contact user')
  async findUserContact(@Query('id') id: string) {
    return this.contactService.findContact(id);
  }

  @Put('/save')
  @Message('Success add contact')
  @UseGuards(JwtGuard)
  async saveUserCOntact(
    @GetCurrentUserId() id: string,
    @Body() saveContactDto: SaveContactDto,
  ) {
    await this.contactService.saveUserContact(id, saveContactDto.userSavedId);
  }
}
